import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const systemPrompt = `Você é a assistente virtual da MegaUtil, uma loja especializada em câmeras de segurança e tecnologia para residências e empresas.

SOBRE A MEGAUTIL:
- Vendemos Kit 3 Câmeras Wi-Fi Full HD com tecnologia avançada
- Preço: R$ 99,00 à vista no PIX (64% de desconto)
- Preço original: R$ 279,80
- Parcelamento: até 12x de R$ 8,25 sem juros
- Frete grátis para todo Brasil
- Garantia de 12 meses
- Troca grátis em 30 dias

ESPECIFICAÇÕES DAS CÂMERAS:
- Resolução: Full HD 1080P
- Lentes: Dupla (3,6mm + 6mm) para imagens superiores
- Visão Noturna: Colorida até 15 metros
- Proteção: IP66 (à prova d'água e poeira)
- Áudio: Bidirecional (fale e ouça pelo app)
- Conectividade: Wi-Fi 2.4GHz
- Armazenamento: Cartão SD até 128GB ou nuvem
- App: iCSee (iOS e Android)
- Alimentação: 5V/2A DC
- Rastreamento humano inteligente
- Alertas em tempo real no celular

CONTEÚDO DO KIT:
- 3x Câmeras Wi-Fi Full HD 1080P
- 3x Suportes de parede com parafusos
- 3x Cabos USB de alimentação (2m)
- 3x Fontes de energia 5V/2A
- 1x Manual de instalação em português
- 1x Adesivo de aviso de vigilância

POLÍTICAS:
- Prazo de entrega: 3-12 dias úteis dependendo da região
- Trocas: até 30 dias após recebimento
- Reembolso: até 7 dias após recebimento (Código de Defesa do Consumidor)
- Pagamento: PIX com desconto especial

INSTRUÇÕES:
1. Seja sempre educada, simpática e prestativa
2. Responda de forma concisa e direta
3. Use emojis ocasionalmente para ser mais amigável
4. Se não souber algo específico, oriente o cliente a entrar em contato pelo WhatsApp
5. Sempre incentive a compra de forma natural, destacando os benefícios de segurança
6. Responda SEMPRE em português do Brasil
7. Mantenha respostas curtas (máximo 3-4 frases)
8. Destaque a qualidade da visão noturna colorida e o app de monitoramento remoto`;

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
