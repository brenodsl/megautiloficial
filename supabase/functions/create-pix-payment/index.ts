import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  colorId: string;
  colorName: string;
  size: number;
  quantity: number;
  price: number;
}

interface PaymentRequest {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
    address: {
      zipCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    };
  };
  totalAmount: number;
}

interface GatewaySettings {
  gateway_name: string;
  api_token: string;
  product_id: string;
  is_active: boolean;
}

// Validation helpers
function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

function validateDocument(doc: string): boolean {
  const digits = doc.replace(/\D/g, '');
  return digits.length === 11 || digits.length === 14;
}

function validateCEP(cep: string): boolean {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8;
}

function sanitizeString(str: string, maxLength: number): string {
  return str.trim().substring(0, maxLength);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client to fetch gateway settings
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch active gateway settings from database
    console.log('Fetching active gateway settings from database...');
    const { data: gatewayData, error: gatewayError } = await supabase
      .from('gateway_settings')
      .select('*')
      .eq('is_active', true)
      .single();

    if (gatewayError || !gatewayData) {
      console.error('Error fetching gateway settings:', gatewayError);
      return new Response(
        JSON.stringify({ error: 'Nenhum gateway de pagamento ativo configurado' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const gateway: GatewaySettings = gatewayData;
    console.log(`Using gateway: ${gateway.gateway_name}`);
    console.log(`Product ID: ${gateway.product_id}`);

    if (!gateway.api_token || !gateway.product_id) {
      console.error('Gateway credentials incomplete');
      return new Response(
        JSON.stringify({ error: 'Credenciais do gateway incompletas. Configure o API Token e ID do Produto.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine API URL based on gateway
    let API_URL: string;
    if (gateway.gateway_name === 'sigmapay') {
      API_URL = `https://api.sigmapay.com.br/api/public/v1/transactions?api_token=${gateway.api_token}`;
    } else if (gateway.gateway_name === 'goatpay') {
      API_URL = `https://api.goatpayments.com.br/api/public/v1/transactions?api_token=${gateway.api_token}`;
    } else if (gateway.gateway_name === 'visionpay') {
      API_URL = `https://api.visionpayments.com.br/api/public/v1/transactions?api_token=${gateway.api_token}`;
    } else {
      console.error('Unknown gateway:', gateway.gateway_name);
      return new Response(
        JSON.stringify({ error: 'Gateway de pagamento desconhecido' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let body: PaymentRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Received payment request:", JSON.stringify(body));

    const { items, customer, totalAmount } = body;

    // Validate items
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return new Response(
        JSON.stringify({ error: "Nenhum item no carrinho" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate customer
    if (!customer || typeof customer !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Dados do cliente são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!customer.name || !customer.email || !customer.document || !customer.phone) {
      return new Response(
        JSON.stringify({ error: "Dados do cliente incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!validateEmail(customer.email)) {
      return new Response(
        JSON.stringify({ error: 'E-mail inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePhone(customer.phone)) {
      return new Response(
        JSON.stringify({ error: 'Telefone inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateDocument(customer.document)) {
      return new Response(
        JSON.stringify({ error: 'CPF/CNPJ inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const address = customer.address;
    if (!address || !validateCEP(address.zipCode)) {
      return new Response(
        JSON.stringify({ error: 'CEP inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!address.street || !address.number || !address.neighborhood || !address.city || !address.state) {
      return new Response(
        JSON.stringify({ error: 'Endereço incompleto' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build cart items using product_id from gateway settings
    const cartItems = items.map(item => ({
      product_hash: gateway.product_id,
      title: `Tênis Carbon 3.0 - ${item.colorName} - Tam ${item.size}`,
      price: Math.round(item.price * 100),
      quantity: item.quantity,
      operation_type: 1,
      tangible: true,
      cover: null
    }));

    // Build payload according to API structure
    const payload = {
      amount: Math.round(totalAmount * 100), // Convert to cents
      offer_hash: gateway.product_id,
      payment_method: 'pix',
      installments: 1,
      customer: {
        name: sanitizeString(customer.name, 100),
        email: sanitizeString(customer.email, 255),
        phone_number: customer.phone.replace(/\D/g, ''),
        document: customer.document.replace(/\D/g, ''),
        street_name: sanitizeString(address.street, 200),
        number: sanitizeString(address.number, 20),
        complement: sanitizeString(address.complement || '', 100),
        neighborhood: sanitizeString(address.neighborhood, 100),
        city: sanitizeString(address.city, 100),
        state: sanitizeString(address.state, 2).toUpperCase(),
        zip_code: address.zipCode.replace(/\D/g, '')
      },
      cart: cartItems,
      expire_in_days: 1,
      transaction_origin: 'api'
    };

    console.log(`Payload enviado para ${gateway.gateway_name}:`, JSON.stringify(payload, null, 2));

    // Call Gateway API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log(`Resposta CRUA do ${gateway.gateway_name}:`, responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error(`Invalid JSON response from ${gateway.gateway_name}:`, responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Resposta inválida do gateway de pagamento' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`${gateway.gateway_name} response status:`, response.status);
    console.log(`${gateway.gateway_name} response data:`, responseData);

    if (!response.ok) {
      console.error(`${gateway.gateway_name} API error:`, responseData);
      return new Response(
        JSON.stringify({ 
          error: responseData.message || responseData.error || 'Não foi possível processar o pagamento. Tente novamente.' 
        }),
        { status: response.status || 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract data from response
    const gatewayResponseData = responseData.data || responseData;
    
    // Extract PIX data from nested pix object
    const pixInfo = gatewayResponseData.pix || {};
    
    const pixCode = pixInfo.pix_qr_code || gatewayResponseData.pix_code || null;
    const qrCodeImage = pixInfo.qr_code_base64 || gatewayResponseData.qr_code || null;
    
    const formattedResponse = {
      success: true,
      transactionId: gatewayResponseData.hash || gatewayResponseData.id,
      qrCode: qrCodeImage,
      qrCodeText: pixCode,
      pixUrl: pixInfo.pix_url || null,
      expiresAt: gatewayResponseData.expires_at,
      status: gatewayResponseData.status || gatewayResponseData.payment_status,
      gateway: gateway.gateway_name
    };
    
    console.log('Resposta PIX formatada:', JSON.stringify(formattedResponse, null, 2));
    console.log('PIX info from response:', JSON.stringify(pixInfo, null, 2));
    
    return new Response(
      JSON.stringify(formattedResponse),
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
