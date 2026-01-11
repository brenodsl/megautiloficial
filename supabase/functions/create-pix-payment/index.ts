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
  shippingFee: number;
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
    const SIGMA_API_KEY = Deno.env.get("SIGMAPAY_API_TOKEN");
    
    if (!SIGMA_API_KEY) {
      console.error("SIGMAPAY_API_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const { items, customer, totalAmount, shippingFee } = body;

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

    if (!customer.name || !customer.email || !customer.document) {
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

    // Calculate product total (excluding shipping)
    const productTotal = totalAmount - (shippingFee || 0);

    // Build SigmaPay payload
    const sigmaPayload = {
      amount: Math.round(totalAmount * 100), // Convert to cents
      offer_hash: 'ztkbuzwssc', // Your offer hash from SigmaPay
      payment_method: 'pix',
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
      cart: [
        {
          product_hash: 'ztkbuzwssc', // Your product hash from SigmaPay
          title: `Tênis Chunta Carbon 3.0 (${items.length} ${items.length === 1 ? 'item' : 'itens'})`,
          price: Math.round(productTotal * 100),
          quantity: 1,
          operation_type: 1,
          tangible: true,
          cover: null
        }
      ],
      installments: 1,
      expire_in_days: 1
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

    // Extract data from response
    const sigmaData = responseData.data || responseData;
    
    // Format response for PIX payment
    const formattedResponse = {
      success: true,
      transaction: {
        id: sigmaData.hash,
        status: sigmaData.status,
        secureId: sigmaData.hash,
        secureUrl: sigmaData.qr_code,
        pix: {
          qrCode: sigmaData.qr_code,
          qrCodeText: sigmaData.pix_code,
          expiresAt: sigmaData.expires_at,
          ...(sigmaData.copy_paste_code && { copyPasteCode: sigmaData.copy_paste_code }),
          ...(sigmaData.pix_payload && { payload: sigmaData.pix_payload })
        }
      }
    };
    
    console.log('Resposta PIX formatada:', JSON.stringify(formattedResponse, null, 2));
    
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
