import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Termos de Uso</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar nosso site, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Uso do Site</h2>
            <p>Você concorda em usar nosso site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja seu uso do site.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Conta do Usuário</h2>
            <p>Você é responsável por manter a confidencialidade de suas informações de conta e por todas as atividades que ocorram sob sua conta.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Propriedade Intelectual</h2>
            <p>Todo o conteúdo do site, incluindo textos, imagens, logos e marcas, são de propriedade da Max Runner ou licenciados para nós. É proibida a reprodução sem autorização prévia.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Preços e Pagamentos</h2>
            <p>Os preços exibidos estão sujeitos a alterações sem aviso prévio. Nos reservamos o direito de corrigir erros de preço e cancelar pedidos afetados por tais erros.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Limitação de Responsabilidade</h2>
            <p>Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso do site ou produtos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Modificações</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação no site.</p>
          </section>

          <p className="text-xs text-muted-foreground mt-8">Última atualização: Janeiro de 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
