import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "A câmera funciona com Wi-Fi 5G?",
    answer: "Este modelo é compatível com conexões Wi-Fi de 2.4GHz, que possui um alcance de sinal maior, ideal para atravessar paredes e garantir que a câmera não perca a conexão na área externa."
  },
  {
    question: "Preciso de um técnico para instalar?",
    answer: "Não! O sistema é Plug & Play. Você mesmo consegue configurar em menos de 5 minutos através do aplicativo (compatível com Android e iOS). O suporte para fixação já está incluso no pacote."
  },
  {
    question: "Ela grava sem cartão de memória?",
    answer: "A câmera permite a visualização em tempo real sem cartão. No entanto, para armazenar as gravações e consultar o histórico, recomendamos o uso de um cartão Micro SD (até 128GB) ou a assinatura do serviço de gravação em nuvem direto no aplicativo."
  },
  {
    question: "Ela resiste bem a chuva e sol forte?",
    answer: "Sim, ela possui certificação IP66, o que garante total vedação contra chuva, poeira e jatos de água, além de ser construída com material ABS de alta resistência contra raios UV."
  },
  {
    question: "Consigo ver as imagens pelo meu celular de qualquer lugar?",
    answer: "Sim! Desde que o seu celular tenha internet (4G/5G ou Wi-Fi), você consegue acessar a imagem ao vivo, rotacionar a câmera em 360° e ouvir o áudio de onde quer que você esteja no mundo."
  },
  {
    question: "Como funciona o sistema de alerta no celular?",
    answer: "A câmera possui Detecção Humana Inteligente. Assim que ela detecta um movimento suspeito, ela envia uma notificação instantânea para o seu celular e pode disparar um alarme sonoro e luminoso (LEDs) para espantar o invasor."
  }
];

const FAQ = () => {
  return (
    <section id="faq">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Dúvidas Frequentes</h2>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqItems.map((item, index) => (
          <AccordionItem 
            key={index} 
            value={`faq-${index}`} 
            className="border rounded-xl px-4 bg-secondary/20"
          >
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
