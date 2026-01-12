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
      console.error('Failed to parse JSON body');
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { transactionId } = body;

    if (!transactionId) {
      console.error('Transaction ID is missing');
      return new Response(
        JSON.stringify({ error: 'Transaction ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Checking payment status for transaction:", transactionId);

    // Check payment status on SigmaPay - Using the correct endpoint format
    // The SigmaPay API uses the transaction hash directly in the URL
    const SIGMA_CHECK_URL = `https://api.sigmapay.com.br/api/public/v1/transactions/${transactionId}?api_token=${SIGMA_API_KEY}`;

    console.log("Calling SigmaPay API:", SIGMA_CHECK_URL.replace(SIGMA_API_KEY, "***"));

    const response = await fetch(SIGMA_CHECK_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('SigmaPay raw response status:', response.status);
    console.log('SigmaPay raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Invalid JSON response from SigmaPay:', responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Resposta inválida do gateway de pagamento',
          isPaid: false,
          status: 'unknown'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!response.ok) {
      console.error('SigmaPay API error:', responseData);
      // Return a valid response even on error, so frontend can continue polling
      return new Response(
        JSON.stringify({ 
          error: responseData.message || 'Erro ao verificar status',
          isPaid: false,
          status: 'error',
          transactionId: transactionId
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // SigmaPay returns data in a 'data' object
    const sigmaData = responseData.data || responseData;
    
    // SigmaPay status values: pending, waiting_payment, paid, refused, refunded, chargedback, expired, failed
    const status = sigmaData.status || sigmaData.payment_status || 'unknown';
    const isPaid = status === 'paid' || status === 'approved' || status === 'completed';
    const isFailed = status === 'failed' || status === 'refused' || status === 'expired' || status === 'chargedback';
    
    console.log('Payment status:', status, 'isPaid:', isPaid, 'isFailed:', isFailed);
    console.log('Full SigmaPay data:', JSON.stringify(sigmaData, null, 2));

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // If paid, update the order in the database
    if (isPaid) {
      console.log('Payment confirmed! Updating order in database...');

      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('transaction_id', transactionId)
        .select();

      if (updateError) {
        console.error('Error updating order:', updateError);
      } else {
        console.log('Order updated successfully to paid status:', updateData);
      }
    }

    // If failed, update the order status to failed
    if (isFailed) {
      console.log('Payment failed! Updating order in database...');

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'failed'
        })
        .eq('transaction_id', transactionId);

      if (updateError) {
        console.error('Error updating order to failed:', updateError);
      } else {
        console.log('Order updated successfully to failed status');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transactionId,
        status: status,
        isPaid: isPaid,
        isFailed: isFailed,
        paidAt: isPaid ? (sigmaData.paid_at || new Date().toISOString()) : null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro interno:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno no servidor.',
        details: error instanceof Error ? error.message : 'Unknown error',
        isPaid: false,
        status: 'error'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
