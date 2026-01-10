import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Política de Envio</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Prazo de Envio</h2>
            <p>Após a confirmação do pagamento, seu pedido será despachado em até 2 dias úteis. O prazo de entrega varia de acordo com a região e a transportadora escolhida.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Frete Grátis</h2>
            <p>Oferecemos frete grátis para todo o Brasil em compras promocionais. O prazo médio de entrega com frete grátis é de 7 a 15 dias úteis, dependendo da localidade.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Rastreamento</h2>
            <p>Após o envio, você receberá um e-mail com o código de rastreamento para acompanhar seu pedido em tempo real através do site dos Correios ou da transportadora.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Endereço de Entrega</h2>
            <p>É responsabilidade do cliente fornecer um endereço de entrega correto e completo. Não nos responsabilizamos por entregas não realizadas devido a informações incorretas.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Tentativas de Entrega</h2>
            <p>Serão realizadas até 3 tentativas de entrega. Caso não haja sucesso, o pedido retornará ao nosso centro de distribuição e o cliente será contatado.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Atrasos</h2>
            <p>Em casos excepcionais (greves, condições climáticas adversas, etc.), os prazos de entrega podem sofrer alterações. Manteremos você informado sobre qualquer ocorrência.</p>
          </section>

          <p className="text-xs text-muted-foreground mt-8">Última atualização: Janeiro de 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
