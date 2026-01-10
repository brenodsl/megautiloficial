import { Shield, Lock, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-8">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Grid Sections */}
        <div className="grid grid-cols-1 gap-6 text-sm">
          {/* Institucional */}
          <div>
            <h4 className="font-bold text-white mb-3">Institucional</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-de-envio" className="hover:text-white transition-colors">Política de Envio</Link></li>
              <li><Link to="/politica-de-reembolso" className="hover:text-white transition-colors">Política de Reembolso</Link></li>
              <li><Link to="/trocas-e-devolucoes" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-bold text-white mb-3">Atendimento</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Fale Conosco</a></li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@lojatools.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Seg a Sex: 8h às 18h</span>
              </li>
            </ul>
          </div>

          {/* Segurança */}
          <div>
            <h4 className="font-bold text-white mb-3">Segurança</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Site 100% Seguro</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span>Conexão Criptografada (SSL)</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Ambiente Protegido</span>
              </li>
            </ul>
            <p className="text-xs text-gray-400 mt-3">
              Seus dados são protegidos com criptografia de ponta a ponta.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6" />

        {/* Brand Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img src={logo} alt="Max Runner" className="h-8 w-auto" />
            <span className="font-bold text-lg">Max Runner</span>
          </div>
          <p className="text-xs text-gray-400 max-w-xs mx-auto mb-4">
            Plataforma segura de compras online. Tênis de alta performance com garantia e procedência.
          </p>
          <p className="text-xs text-gray-500">
            © 2026 Max Runner. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
