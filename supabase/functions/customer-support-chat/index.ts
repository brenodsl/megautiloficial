import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `Você é o assistente virtual da Max Runner, uma loja especializada em tênis esportivos de alta performance.

SOBRE A MAX RUNNER:
- Vendemos tênis de corrida com tecnologia de placa de carbono
- Preço: R$ 219,90 (com desconto de R$ 329,90)
- Parcelamento: até 12x sem juros
- Frete grátis para todo Brasil
- Garantia de 90 dias
- Troca grátis

TAMANHOS DISPONÍVEIS:
- Masculino: 38, 39, 40, 41, 42, 43, 44
- Feminino: 34, 35, 36, 37, 38, 39

CORES DISPONÍVEIS:
- Verde Fluorescente
- Laranja
- Rosa
- Roxo
- Limão
- Verde Água
- Degradê
- Sunset
- Verde Menta
- Creme Laranja

CARACTERÍSTICAS DO TÊNIS:
- Placa de carbono para maior impulsão
- Solado em EVA super leve
- Cabedal em mesh respirável
- Palmilha removível anatômica
- Drop de 8mm ideal para corrida
- Peso aproximado: 250g

POLÍTICAS:
- Prazo de entrega: 3-12 dias úteis dependendo da região
- Trocas: até 30 dias após recebimento
- Reembolso: até 7 dias após recebimento (Código de Defesa do Consumidor)
- Pagamento: PIX com desconto especial

INSTRUÇÕES:
1. Seja sempre educado, simpático e prestativo
2. Responda de forma concisa e direta
3. Use emojis ocasionalmente para ser mais amigável
4. Se não souber algo específico, oriente o cliente a entrar em contato pelo WhatsApp
5. Sempre incentive a compra de forma natural, destacando os benefícios
6. Responda SEMPRE em português do Brasil
7. Mantenha respostas curtas (máximo 3-4 frases)`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();

    if (!message) {
      throw new Error('Mensagem é obrigatória');
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in customer-support-chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      reply: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, entre em contato pelo WhatsApp para atendimento imediato! 📱'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
