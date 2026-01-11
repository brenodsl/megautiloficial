import { Shield, Lock, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Grid Sections */}
        <div className="space-y-8 text-sm">
          {/* Institucional */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Institucional</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/politica-de-privacidade" className="hover:text-gray-900 transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-gray-900 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-de-envio" className="hover:text-gray-900 transition-colors">Política de Envio</Link></li>
              <li><Link to="/politica-de-reembolso" className="hover:text-gray-900 transition-colors">Política de Reembolso</Link></li>
              <li><Link to="/trocas-e-devolucoes" className="hover:text-gray-900 transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Atendimento</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Fale Conosco</a></li>
              <li>
                <span className="text-gray-500">E-mail:</span>
                <br />
                <span>contato@maxrunner.com.br</span>
              </li>
              <li>
                <span className="text-gray-500">Horário:</span>
                <br />
                <span>Seg a Sex: 8h às 18h</span>
              </li>
            </ul>
          </div>

          {/* Segurança */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Segurança</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span>Site 100% Seguro</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-gray-500" />
                <span>Conexão Criptografada (SSL)</span>
              </li>
            </ul>
            
            {/* Security Badge */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>Ambiente Protegido</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Seus dados são protegidos com criptografia de ponta a ponta.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2026 Max Runner. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;