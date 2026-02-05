import { Link } from "react-router-dom";

const CheckoutFooter = () => {
  return (
    <footer className="mt-8 py-8 px-4 bg-muted/30">
      <div className="max-w-md mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo-megautil.png" alt="MegaUtil" className="h-10 w-auto" />
        </div>

        {/* Company Info */}
        <div className="space-y-1 text-xs text-muted-foreground mb-4">
          <p className="font-medium text-foreground">MegaUtil Comércio de Eletrônicos LTDA</p>
          <p>CNPJ: 13.865.865/0001-62</p>
        </div>

        {/* Address */}
        <div className="space-y-0.5 text-xs text-muted-foreground mb-4">
          <p>Rua das Indústrias, 1500 - Galpão 12</p>
          <p>Distrito Industrial - São Paulo/SP</p>
          <p>CEP: 04567-890</p>
        </div>

        {/* Contact */}
        <div className="space-y-0.5 text-xs text-muted-foreground mb-6">
          <p>
            <a href="mailto:contato@megautil.com.br" className="hover:text-foreground transition-colors">
              contato@megautil.com.br
            </a>
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mb-4">
          <Link to="/politica-de-privacidade" className="text-muted-foreground hover:text-foreground underline transition-colors">
            Privacidade
          </Link>
          <Link to="/termos-de-uso" className="text-muted-foreground hover:text-foreground underline transition-colors">
            Termos
          </Link>
          <Link to="/trocas-e-devolucoes" className="text-muted-foreground hover:text-foreground underline transition-colors">
            Trocas
          </Link>
          <Link to="/politica-de-reembolso" className="text-muted-foreground hover:text-foreground underline transition-colors">
            Reembolso
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-muted-foreground/60">
          © {new Date().getFullYear()} MegaUtil. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default CheckoutFooter;
