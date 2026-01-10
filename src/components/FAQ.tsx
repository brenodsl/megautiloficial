import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O frete é grátis?",
    answer: "Sim! Oferecemos frete grátis para todo o Brasil. Seu pedido será enviado em até 24h após a confirmação do pagamento.",
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo de entrega varia de 5 a 15 dias úteis, dependendo da sua região. Você receberá o código de rastreamento por e-mail assim que o pedido for enviado.",
  },
  {
    question: "Posso trocar se não servir?",
    answer: "Claro! Oferecemos 30 dias para troca sem custos. Basta entrar em contato com nosso suporte e enviaremos outro par no tamanho correto.",
  },
  {
    question: "O tênis é original?",
    answer: "Sim! Todos os nossos produtos são originais e acompanham nota fiscal. Trabalhamos diretamente com os fabricantes para garantir qualidade e autenticidade.",
  },
  {
    question: "Quais formas de pagamento?",
    answer: "Aceitamos PIX (com desconto adicional), cartão de crédito em até 12x sem juros e boleto bancário.",
  },
  {
    question: "Como escolher o tamanho certo?",
    answer: "Recomendamos medir seu pé e comparar com nossa tabela de medidas. Se estiver em dúvida entre dois tamanhos, escolha o maior para mais conforto.",
  },
];

const FAQ = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        Perguntas Frequentes
      </h2>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-xl gradient-card border border-border px-4"
          >
            <AccordionTrigger className="text-left text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
