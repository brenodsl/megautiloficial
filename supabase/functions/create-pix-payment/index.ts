import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const SIGMA_API_KEY = "6AUXQgnpYrKrUvUQ2USezmv2hHi8HpyP41q9lznTgz3idUDtgU7uAMKYD2qt";
    const OFFER_HASH = "awayav3oag";
    const PRODUCT_HASH = "awayav3oag";

    const SIGMA_API_URL = `https://api.sigmapay.com.br/api/public/v1/transactions?api_token=${SIGMA_API_KEY}`;

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

    // Build cart items for SigmaPay
    const cartItems = items.map(item => ({
      product_hash: PRODUCT_HASH,
      title: `Tênis Carbon 3.0 - ${item.colorName} - Tam ${item.size}`,
      price: Math.round(item.price * 100),
      quantity: item.quantity,
      operation_type: 1,
      tangible: true,
      cover: null
    }));

    // Build SigmaPay payload according to official documentation
    const sigmaPayload = {
      amount: Math.round(totalAmount * 100), // Convert to cents
      offer_hash: OFFER_HASH,
      payment_method: 'pix',
      installments: 1, // Required field for SigmaPay
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

    console.log('Payload enviado para SigmaPay:', JSON.stringify(sigmaPayload, null, 2));

    // Call SigmaPay API
    const response = await fetch(SIGMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(sigmaPayload),
    });

    const responseText = await response.text();
    console.log('Resposta CRUA da SigmaPay:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      console.error('Invalid JSON response from SigmaPay:', responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Resposta inválida do gateway de pagamento' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('SigmaPay response status:', response.status);
    console.log('SigmaPay response data:', responseData);

    if (!response.ok) {
      console.error('SigmaPay API error:', responseData);
      return new Response(
        JSON.stringify({ 
          error: responseData.message || responseData.error || 'Não foi possível processar o pagamento. Tente novamente.' 
        }),
        { status: response.status || 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract data from response - SigmaPay returns pix data inside a 'pix' object
    const sigmaData = responseData.data || responseData;
    
    // Extract PIX data from nested pix object according to SigmaPay API structure
    const pixInfo = sigmaData.pix || {};
    
    // Format response for PIX payment
    // SigmaPay returns: 
    // - pix.qr_code_base64: base64 image (may be null)
    // - pix.pix_qr_code: the actual PIX code string (like "00020126580014BR.GOV.BCB.PIX...")
    // - pix.pix_url: URL for payment page (NOT the pix code)
    // Per documentation: qr_code is base64 image, pix_code is the text code
    
    // The pix_qr_code field IS the pix_code (EMV format), not an image
    const pixCode = pixInfo.pix_qr_code || sigmaData.pix_code || null;
    const qrCodeImage = pixInfo.qr_code_base64 || sigmaData.qr_code || null;
    
    const formattedResponse = {
      success: true,
      transactionId: sigmaData.hash || sigmaData.id,
      qrCode: qrCodeImage, // Base64 image if available
      qrCodeText: pixCode, // The actual PIX copia e cola code
      pixUrl: pixInfo.pix_url || null, // Payment URL (separate from pix code)
      expiresAt: sigmaData.expires_at,
      status: sigmaData.status || sigmaData.payment_status
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
