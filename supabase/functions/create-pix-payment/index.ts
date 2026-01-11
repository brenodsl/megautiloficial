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
  };
  totalAmount: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SIGMAPAY_API_TOKEN = Deno.env.get("SIGMAPAY_API_TOKEN");
    
    if (!SIGMAPAY_API_TOKEN) {
      console.error("SIGMAPAY_API_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PaymentRequest = await req.json();
    console.log("Received payment request:", JSON.stringify(body));

    const { items, customer, totalAmount } = body;

    // Validate input
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Nenhum item no carrinho" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!customer.name || !customer.email || !customer.document) {
      return new Response(
        JSON.stringify({ error: "Dados do cliente incompletos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format items for API
    const formattedItems = items.map(item => ({
      title: `Tênis Chunta Carbon 3.0 - ${item.colorName} - Tam ${item.size}`,
      unitPrice: Math.round(item.price * 100), // Convert to cents
      quantity: item.quantity,
    }));

    // Create PIX payment via Sigma Pay API
    const paymentPayload = {
      paymentMethod: "pix",
      amount: Math.round(totalAmount * 100), // Convert to cents
      pix: {
        expiresInDays: 1,
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        document: {
          type: customer.document.length > 11 ? "cnpj" : "cpf",
          number: customer.document.replace(/\D/g, ""),
        },
      },
      externalRef: `order-${Date.now()}`,
      postbackUrl: "https://your-webhook-url.com/webhook", // TODO: Configure webhook
      traceable: true,
      items: formattedItems,
      ip: req.headers.get("x-forwarded-for") || "0.0.0.0",
      metadata: JSON.stringify({ source: "lovable-checkout" }),
    };

    console.log("Sending to Sigma Pay:", JSON.stringify(paymentPayload));

    const response = await fetch("https://api.sigmapay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SIGMAPAY_API_TOKEN}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const responseText = await response.text();
    console.log("Sigma Pay response status:", response.status);
    console.log("Sigma Pay response:", responseText);

    if (!response.ok) {
      // Try to parse error response
      let errorMessage = "Erro ao criar pagamento PIX";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paymentData = JSON.parse(responseText);
    
    return new Response(
      JSON.stringify({
        success: true,
        transactionId: paymentData.id || paymentData.transactionId,
        qrCode: paymentData.pix?.qrcode || paymentData.qrCode || paymentData.qrcode,
        qrCodeText: paymentData.pix?.qrcodeText || paymentData.qrCodeText || paymentData.qrcodeText || paymentData.brCode,
        expiresAt: paymentData.pix?.expiresAt || paymentData.expiresAt,
        status: paymentData.status || "pending",
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error creating PIX payment:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar pagamento" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
