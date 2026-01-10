import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Política de Privacidade</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Informações que Coletamos</h2>
            <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail, endereço de entrega e dados de pagamento ao realizar uma compra.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para processar pedidos, enviar atualizações sobre sua compra, melhorar nossos serviços e personalizar sua experiência de compra.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Proteção de Dados</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Compartilhamento de Informações</h2>
            <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para fins de marketing. Compartilhamos dados apenas com parceiros necessários para processar seu pedido (transportadoras, processadores de pagamento).</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Cookies</h2>
            <p>Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através do seu navegador.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Seus Direitos</h2>
            <p>Você tem direito de acessar, corrigir ou excluir seus dados pessoais. Entre em contato conosco através do e-mail contato@lojatools.com.br para exercer seus direitos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Atualizações desta Política</h2>
            <p>Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente para se manter informado sobre nossas práticas de privacidade.</p>
          </section>

          <p className="text-xs text-muted-foreground mt-8">Última atualização: Janeiro de 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
