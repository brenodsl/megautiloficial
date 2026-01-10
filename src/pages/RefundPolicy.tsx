import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Política de Reembolso</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Direito de Arrependimento</h2>
            <p>Conforme o Código de Defesa do Consumidor, você tem até 7 dias após o recebimento do produto para solicitar o reembolso, sem necessidade de justificativa.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Condições para Reembolso</h2>
            <p>O produto deve estar em perfeitas condições, sem uso, com etiquetas e embalagem original. Produtos danificados ou com sinais de uso não serão aceitos para reembolso.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Como Solicitar</h2>
            <p>Entre em contato conosco através do e-mail contato@lojatools.com.br informando o número do pedido e o motivo da solicitação. Responderemos em até 48 horas úteis.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Processo de Devolução</h2>
            <p>Após a aprovação, enviaremos as instruções para devolução do produto. O frete de devolução será por nossa conta quando o motivo for arrependimento dentro dos 7 dias.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Prazo de Reembolso</h2>
            <p>O reembolso será processado em até 10 dias úteis após recebermos e verificarmos o produto devolvido. O valor será estornado na mesma forma de pagamento utilizada na compra.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Produtos com Defeito</h2>
            <p>Produtos com defeito de fabricação podem ser devolvidos para reembolso integral ou substituição em até 30 dias após o recebimento.</p>
          </section>

          <p className="text-xs text-muted-foreground mt-8">Última atualização: Janeiro de 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
