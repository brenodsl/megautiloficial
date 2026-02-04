import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GatewaySettings {
  gateway_name: string;
  api_token: string;
  product_id: string;
  is_active: boolean;
}

// Status mapping for all gateways
const PAID_STATUSES = ['paid', 'approved', 'completed', 'confirmed', 'aprovado', 'pago'];
const FAILED_STATUSES = ['failed', 'refused', 'expired', 'chargedback', 'cancelled', 'canceled', 'recusado', 'expirado', 'refused'];
const PENDING_STATUSES = ['waiting_payment', 'pending', 'processing', 'waiting', 'pendente', 'aguardando'];

function normalizeStatus(status: string): { isPaid: boolean; isFailed: boolean; isPending: boolean } {
  const statusLower = status.toLowerCase().trim();
  return {
    isPaid: PAID_STATUSES.includes(statusLower),
    isFailed: FAILED_STATUSES.includes(statusLower),
    isPending: PENDING_STATUSES.includes(statusLower)
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    console.log("=== Checking payment status ===");
    console.log("Transaction ID:", transactionId);

    // First, check order in database to get gateway_used
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('gateway_used, payment_status')
      .eq('transaction_id', transactionId)
      .maybeSingle();

    if (orderError) {
      console.error('Error fetching order:', orderError);
    }

    // If order is already paid, return immediately
    if (orderData?.payment_status === 'paid') {
      console.log('Order already marked as paid in database');
      return new Response(
        JSON.stringify({
          success: true,
          transactionId: transactionId,
          status: 'paid',
          isPaid: true,
          isFailed: false,
          gateway: orderData.gateway_used || 'unknown'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine which gateway to use: from order or from active settings
    let gatewayName = orderData?.gateway_used;
    let gateway: GatewaySettings | null = null;

    if (gatewayName) {
      console.log(`Order was created with gateway: ${gatewayName}`);
      const { data: gatewayData, error: gatewayError } = await supabase
        .from('gateway_settings')
        .select('*')
        .eq('gateway_name', gatewayName)
        .maybeSingle();

      if (!gatewayError && gatewayData) {
        gateway = gatewayData;
      }
    }

    // Fallback: use active gateway
    if (!gateway) {
      console.log('Fetching active gateway settings from database...');
      const { data: gatewayData, error: gatewayError } = await supabase
        .from('gateway_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (gatewayError || !gatewayData) {
        console.error('Error fetching gateway settings:', gatewayError);
        return new Response(
          JSON.stringify({ 
            error: 'Nenhum gateway de pagamento configurado',
            isPaid: false,
            status: 'error'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      gateway = gatewayData;
    }

    if (!gateway) {
      console.error('No gateway found');
      return new Response(
        JSON.stringify({ 
          error: 'Nenhum gateway de pagamento encontrado',
          isPaid: false,
          status: 'error'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Using gateway: ${gateway.gateway_name}`);

    if (!gateway.api_token) {
      console.error('Gateway API token not configured');
      return new Response(
        JSON.stringify({ 
          error: 'API Token do gateway não configurado',
          isPaid: false,
          status: 'error'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine API URL and auth headers based on gateway
    // Format: https://api.{gateway}.com.br/api/public/v1/transactions/{hash}?api_token=TOKEN
    let CHECK_URL: string;
    let requestHeaders: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (gateway.gateway_name === 'sigmapay') {
      CHECK_URL = `https://api.sigmapay.com.br/api/public/v1/transactions/${transactionId}?api_token=${gateway.api_token}`;
    } else if (gateway.gateway_name === 'goatpay') {
      CHECK_URL = `https://api.goatpayments.com.br/api/public/v1/transactions/${transactionId}?api_token=${gateway.api_token}`;
    } else if (gateway.gateway_name === 'visionpay') {
      CHECK_URL = `https://api.visionpayments.com.br/api/public/v1/transactions/${transactionId}?api_token=${gateway.api_token}`;
    } else if (gateway.gateway_name === 'payevo') {
      CHECK_URL = `https://apiv2.payevo.com.br/functions/v1/transactions/${transactionId}`;
      // Payevo uses Basic Auth with secret key encoded in base64
      const base64Credentials = btoa(`${gateway.api_token}:x`);
      requestHeaders = {
        ...requestHeaders,
        'Authorization': `Basic ${base64Credentials}`
      };
    } else {
      console.error('Unknown gateway:', gateway.gateway_name);
      return new Response(
        JSON.stringify({ 
          error: 'Gateway de pagamento desconhecido',
          isPaid: false,
          status: 'error'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calling ${gateway.gateway_name} API...`);
    console.log(`URL: ${CHECK_URL.replace(gateway.api_token, "***")}`);

    const response = await fetch(CHECK_URL, {
      method: 'GET',
      headers: requestHeaders
    });

    const responseText = await response.text();
    console.log(`${gateway.gateway_name} response status:`, response.status);
    console.log(`${gateway.gateway_name} raw response:`, responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error(`Invalid JSON response from ${gateway.gateway_name}:`, responseText);
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
      console.error(`${gateway.gateway_name} API error:`, responseData);
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

    // Extract data from response - handle both { data: {...} } and direct response formats
    const gatewayResponseData = responseData.data || responseData;
    
    console.log('Gateway response data:', JSON.stringify(gatewayResponseData, null, 2));

    // Get payment status - check multiple possible field names
    // Based on user's example: { "success": true, "data": { "status": "paid", ... } }
    // Also handle: { "payment_status": "paid", ... }
    let status = 'unknown';
    
    // Priority order for status field lookup
    if (gatewayResponseData.status) {
      status = gatewayResponseData.status;
    } else if (gatewayResponseData.payment_status) {
      status = gatewayResponseData.payment_status;
    } else if (responseData.status) {
      status = responseData.status;
    } else if (responseData.payment_status) {
      status = responseData.payment_status;
    }
    
    console.log('Extracted status:', status);

    const { isPaid, isFailed } = normalizeStatus(status);
    
    console.log('Payment analysis:', { status, isPaid, isFailed });

    // If paid, update the order in the database
    if (isPaid) {
      console.log('✅ Payment confirmed! Updating order in database...');

      const paidAt = gatewayResponseData.paid_at || new Date().toISOString();

      const { data: updateData, error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          paid_at: paidAt,
          gateway_used: gateway.gateway_name
        })
        .eq('transaction_id', transactionId)
        .select();

      if (updateError) {
        console.error('Error updating order:', updateError);
      } else {
        console.log('Order updated successfully:', updateData);
      }
    }

    // If failed, update the order status to failed
    if (isFailed) {
      console.log('❌ Payment failed! Updating order in database...');

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'failed',
          gateway_used: gateway.gateway_name
        })
        .eq('transaction_id', transactionId);

      if (updateError) {
        console.error('Error updating order to failed:', updateError);
      } else {
        console.log('Order updated to failed status');
      }
    }

    const result = {
      success: true,
      transactionId: transactionId,
      status: status,
      isPaid: isPaid,
      isFailed: isFailed,
      paidAt: isPaid ? (gatewayResponseData.paid_at || new Date().toISOString()) : null,
      gateway: gateway.gateway_name
    };

    console.log('=== Check complete ===', result);

    return new Response(
      JSON.stringify(result),
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
