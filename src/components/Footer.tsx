import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-8">
      {/* Main Footer - Blue */}
      <div className="bg-primary py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/logo-megautil.png" alt="MegaUtil" className="h-10 w-auto" />
          </div>
          <p className="text-sm text-white/60 mb-6">
            Tecnologia e segurança para sua casa
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-6">
            <Link to="/politica-de-privacidade" className="text-white/80 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos-de-uso" className="text-white/80 hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/politica-de-reembolso" className="text-white/80 hover:text-white transition-colors">
              Política de Reembolso
            </Link>
            <Link to="/politica-de-envio" className="text-white/80 hover:text-white transition-colors">
              Envio
            </Link>
            <Link to="/trocas-e-devolucoes" className="text-white/80 hover:text-white transition-colors">
              Trocas
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Darker Blue */}
      <div className="bg-primary/90 py-4 px-4 border-t border-white/10">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} MegaUtil. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/40 mt-1">
            CNPJ: 13.865.865/0001-62
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
