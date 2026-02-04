import { Link } from "react-router-dom";
import { Shield, Lock, Mail, Clock, MapPin, Phone, CheckCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 bg-gradient-to-b from-primary to-primary/95">
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top Section - Logo & Tagline */}
        <div className="text-center mb-10">
          <img src="/logo-megautil.png" alt="MegaUtil" className="h-12 w-auto mx-auto mb-3" />
          <p className="text-white/60 text-sm">Tecnologia e segurança para sua casa</p>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          {/* Column 1 - Institucional */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              Institucional
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/politica-de-privacidade" className="text-white/60 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-de-uso" className="text-white/60 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link to="/politica-de-envio" className="text-white/60 hover:text-white text-sm transition-colors">
                Política de Envio
              </Link>
              <Link to="/politica-de-reembolso" className="text-white/60 hover:text-white text-sm transition-colors">
                Política de Reembolso
              </Link>
              <Link to="/trocas-e-devolucoes" className="text-white/60 hover:text-white text-sm transition-colors">
                Trocas e Devoluções
              </Link>
            </nav>
          </div>

          {/* Column 2 - Atendimento */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              Atendimento
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:contato@megautil.com.br" className="text-white/60 hover:text-white text-sm transition-colors">
                  contato@megautil.com.br
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-white/60 text-sm">SAC: (11) 3456-7890</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-white/60 text-sm">Seg a Sex: 8h às 18h</span>
              </div>
            </div>

            {/* Security Badges Inline */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-full">
                  <Shield className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-white/70 text-[11px]">Site Seguro</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-full">
                  <Lock className="h-3.5 w-3.5 text-green-400" />
                  <span className="text-white/70 text-[11px]">SSL 256-bit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3 - Endereço */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
              Localização
            </h4>
            <div className="flex items-start justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div className="text-white/60 text-sm leading-relaxed">
                <p>Rua das Indústrias, 1500 - Galpão 12</p>
                <p>Distrito Industrial - São Paulo/SP</p>
                <p>CEP: 04567-890</p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                <span>Dados protegidos com criptografia</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/50 text-xs">
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 text-center">
          <p className="text-white/70 text-sm font-medium">
            MegaUtil Comércio de Eletrônicos LTDA
          </p>
          <p className="text-white/40 text-xs mt-1">
            CNPJ: 13.865.865/0001-62
          </p>
          <p className="text-white/30 text-xs mt-3">
            © {new Date().getFullYear()} MegaUtil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
