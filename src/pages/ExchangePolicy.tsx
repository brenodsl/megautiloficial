import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ExchangePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Trocas e Devoluções</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Prazo para Troca</h2>
            <p>Você pode solicitar a troca do produto em até 30 dias após o recebimento, desde que esteja em perfeitas condições, sem uso e com a embalagem original.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Motivos para Troca</h2>
            <p>Aceitamos trocas por tamanho, cor ou modelo diferente, sujeito à disponibilidade em estoque. Também aceitamos trocas por defeito de fabricação.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Como Solicitar a Troca</h2>
            <p>Entre em contato pelo e-mail contato@lojatools.com.br com o número do pedido, foto do produto e o motivo da troca. Nossa equipe responderá em até 48 horas.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Frete da Troca</h2>
            <p>Em caso de troca por defeito, o frete é por nossa conta. Para trocas por preferência (tamanho, cor), o cliente é responsável pelo frete de envio.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Primeira Troca Grátis</h2>
            <p>Oferecemos a primeira troca grátis para pedidos de tênis! Basta solicitar dentro do prazo de 30 dias e seguir as instruções enviadas por e-mail.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Produtos Não Aceitos para Troca</h2>
            <p>Não aceitamos trocas de produtos usados, danificados pelo cliente, sem etiqueta ou fora da embalagem original. Produtos em promoção podem ter condições especiais.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Prazo de Envio do Novo Produto</h2>
            <p>Após recebermos e aprovarmos o produto devolvido, o novo item será enviado em até 3 dias úteis. Você receberá um novo código de rastreamento.</p>
          </section>

          <p className="text-xs text-muted-foreground mt-8">Última atualização: Janeiro de 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExchangePolicy;
