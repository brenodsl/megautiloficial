import { Link } from "react-router-dom";
import { Shield, Lock, Mail, Clock, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-8">
      {/* Main Footer Content */}
      <div className="bg-primary py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo-megautil.png" alt="MegaUtil" className="h-12 w-auto" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Institucional */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                Institucional
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/politica-de-privacidade" className="text-white/70 hover:text-white text-sm transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/termos-de-uso" className="text-white/70 hover:text-white text-sm transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/politica-de-envio" className="text-white/70 hover:text-white text-sm transition-colors">
                    Política de Envio
                  </Link>
                </li>
                <li>
                  <Link to="/politica-de-reembolso" className="text-white/70 hover:text-white text-sm transition-colors">
                    Política de Reembolso
                  </Link>
                </li>
                <li>
                  <Link to="/trocas-e-devolucoes" className="text-white/70 hover:text-white text-sm transition-colors">
                    Trocas e Devoluções
                  </Link>
                </li>
              </ul>
            </div>

            {/* Atendimento */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                Atendimento
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm">
                  <Mail className="h-4 w-4 text-accent" />
                  <a href="mailto:contato@megautil.com.br" className="hover:text-white transition-colors">
                    contato@megautil.com.br
                  </a>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>Seg a Sex: 8h às 18h</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>SAC: (11) 3456-7890</span>
                </li>
              </ul>
            </div>

            {/* Segurança */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
                Segurança
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Site 100% Seguro</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm">
                  <Lock className="h-4 w-4 text-success" />
                  <span>Conexão Criptografada (SSL)</span>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-sm">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Ambiente Protegido</span>
                </li>
              </ul>
              <p className="text-white/50 text-xs mt-3 max-w-xs mx-auto md:mx-0">
                Seus dados são protegidos com criptografia de ponta a ponta.
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-start justify-center gap-2 text-white/60 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div className="text-center">
                <p>Rua das Indústrias, 1500 - Galpão 12</p>
                <p>Distrito Industrial - São Paulo/SP - CEP: 04567-890</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary/90 py-4 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-white/60">
            MegaUtil Comércio de Eletrônicos LTDA
          </p>
          <p className="text-xs text-white/50 mt-1">
            CNPJ: 13.865.865/0001-62
          </p>
          <p className="text-xs text-white/40 mt-2">
            © {new Date().getFullYear()} MegaUtil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
