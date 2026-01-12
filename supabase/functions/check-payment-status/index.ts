import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SIGMA_API_KEY = "6AUXQgnpYrKrUvUQ2USezmv2hHi8HpyP41q9lznTgz3idUDtgU7uAMKYD2qt";

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { transactionId } = body;

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Checking payment status for transaction:", transactionId);

    // Check payment status on SigmaPay
    const SIGMA_CHECK_URL = `https://api.sigmapay.com.br/api/public/v1/transactions/${transactionId}?api_token=${SIGMA_API_KEY}`;

    const response = await fetch(SIGMA_CHECK_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('SigmaPay status response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Invalid JSON response from SigmaPay:', responseText);
      return new Response(
        JSON.stringify({ error: 'Resposta inválida do gateway de pagamento' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      console.error('SigmaPay API error:', responseData);
      return new Response(
        JSON.stringify({ error: responseData.message || 'Erro ao verificar status' }),
        { status: response.status || 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sigmaData = responseData.data || responseData;
    
    // SigmaPay status values: pending, paid, refused, refunded, chargedback, expired, waiting_payment
    const status = sigmaData.status || sigmaData.payment_status;
    const isPaid = status === 'paid' || status === 'approved' || status === 'completed';
    
    console.log('Payment status:', status, 'isPaid:', isPaid);

    // If paid, update the order in the database
    if (isPaid) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionId);

      if (updateError) {
        console.error('Error updating order:', updateError);
      } else {
        console.log('Order updated successfully to paid status');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transactionId,
        status: status,
        isPaid: isPaid,
        paidAt: isPaid ? sigmaData.paid_at : null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro interno:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno no servidor.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
