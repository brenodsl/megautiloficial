import { Shield, Lock, Mail, Clock, Store } from "lucide-react";
import { Link } from "react-router-dom";
import fachadaLoja from "@/assets/fachada-loja.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Nossa História */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5 text-gray-700" />
            <h4 className="font-bold text-gray-900">Nossa História</h4>
          </div>
          <div className="rounded-xl overflow-hidden mb-4">
            <img 
              src={fachadaLoja} 
              alt="Fachada da loja Max Runner" 
              className="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-900">Desde 2015</span>, a Max Runner nasceu com um propósito: 
              apoiar os <span className="font-medium text-gray-800">corredores brasileiros</span> com produtos de qualidade 
              e os <span className="font-medium text-emerald-600">melhores preços do mercado</span>.
            </p>
            <p>
              São quase <span className="font-semibold text-gray-900">10 anos</span> de experiência, 
              milhares de clientes satisfeitos e o compromisso de levar o melhor para você, 
              direto da nossa loja no Brás, São Paulo, para todo o Brasil.
            </p>
          </div>
        </div>

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
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href="mailto:contato@maxrunner.com.br" className="hover:text-gray-900 transition-colors">contato@maxrunner.com.br</a>
              </li>
              <li className="flex items-center gap-2 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Respondemos em menos de 10 min!</span>
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

        {/* Company Info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-600 font-medium">
            Max Runner Comércio de Calçados LTDA
          </p>
          <p className="text-xs text-gray-500">
            CNPJ: 02.160.402/0001-89
          </p>
          <p className="text-xs text-gray-500">
            Rua Brigadeiro Machado, 175, Brás - São Paulo/SP - CEP 03050-050
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2026 Max Runner. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;