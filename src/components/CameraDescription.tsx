import { 
  Camera, 
  Wifi, 
  Eye, 
  Volume2, 
  Smartphone, 
  Moon, 
  Bell, 
  HardDrive,
  Shield,
  RotateCcw,
  Zap,
  Droplets
} from "lucide-react";
import cameraFeatures from "@/assets/camera-features.jpg";
import cameraControl from "@/assets/camera-control.jpg";
import cameraPanoramic from "@/assets/camera-panoramic.webp";

const CameraDescription = () => {
  const features = [
    { icon: Camera, title: "Lente Dupla 6MP", description: "3MP + 3MP = 6MP Full HD" },
    { icon: Eye, title: "Zoom 4x", description: "Zoom digital para detalhes" },
    { icon: RotateCcw, title: "360° PTZ", description: "Panorâmica 340° / Inclinação 90°" },
    { icon: Volume2, title: "Áudio Bidirecional", description: "Microfone e alto-falante" },
    { icon: Moon, title: "Visão Noturna", description: "Colorida com LED infravermelho" },
    { icon: Bell, title: "Alarme de Luz", description: "Luz policial de alerta" },
    { icon: Smartphone, title: "App iCSee", description: "Controle pelo celular" },
    { icon: Wifi, title: "Wi-Fi 2.4GHz", description: "Conexão sem fio ou cabo LAN" },
    { icon: HardDrive, title: "Armazenamento", description: "Cartão SD até 128GB ou nuvem" },
    { icon: Shield, title: "À Prova d'Água", description: "IP66 uso interno e externo" },
    { icon: Zap, title: "Detecção Humana", description: "Rastreamento automático" },
    { icon: Droplets, title: "Resistente", description: "Proteção contra intempéries" },
  ];

  return (
    <section className="py-2">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Descrição do Produto</h3>
      
      {/* Main Description */}
      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-800">
          Câmera Segurança IP Wi-Fi P11 Lente Dupla 6MP Full HD
        </p>
        
        <p>
          Câmera com Lente dupla, tela dupla, zoom 4x, alarme de luz policial, rastreamento humano, 
          monitoramento de voz bidirecional 360°, visão noturna colorida, monitoramento remoto pelo 
          celular, compartilhar vídeo, armazenamento em cartão SD, gravação 24 horas.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">{feature.title}</p>
              <p className="text-xs text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Sections */}
      <div className="mt-8 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-bold text-amber-800 mb-2">⚠️ ATENÇÃO - CÂMERA 4K 6MP:</h4>
          <p className="text-sm text-amber-700">
            Significa que cada lente é de 3MP, então a lente dupla é 3MP + 3MP = 6MP.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">📹 CÂMERA DE LENTE DUPLA:</h4>
          <p className="text-sm text-gray-600">
            São 2 telas de vídeo no APP, uma é da câmera de posição fixa e a outra tela é da câmera giratória. 
            Uma câmera gira e a outra fica fixa.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">🔊 ÁUDIO BIDIRECIONAL:</h4>
          <p className="text-sm text-gray-600">
            Microfone e alto-falantes embutidos com volume alto. Você pode falar com qualquer pessoa 
            que se aproxima da câmera (Avise alguém para sair de casa).
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">💡 MODO INTELIGENTE COM LUZ DUPLA:</h4>
          <p className="text-sm text-gray-600">
            Monitore objetos em movimento, ilumine automaticamente. Esta é uma arma impressionante contra o crime. 
            A câmera também pode mostrar visão colorida à noite, existem três modos noturnos para selecionar.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">🚨 ALERTA DE DETECÇÃO HUMANA:</h4>
          <p className="text-sm text-gray-600">
            Encontra rapidamente alvos humanos e envia imediatamente uma notificação para o seu telefone, 
            permitindo que você veja o que está acontecendo no ambiente com rastreamento automático.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-800 mb-2">📡 CONEXÃO Wi-Fi:</h4>
          <p className="text-sm text-blue-700">
            Conexão via Wi-Fi 2.4GHz ou cabo LAN. Você só pode conectar a câmera à rede Wi-Fi 2.4GHz 
            (não suporta rede 5GHz). Também pode usar cabo de rede conectado ao roteador.
          </p>
        </div>
      </div>

      {/* Feature Images */}
      <div className="mt-8 space-y-4">
        <img 
          src={cameraFeatures} 
          alt="Características da câmera" 
          className="w-full rounded-lg"
          loading="lazy"
        />
        <img 
          src={cameraControl} 
          alt="Controle pelo celular" 
          className="w-full rounded-lg"
          loading="lazy"
        />
        <img 
          src={cameraPanoramic} 
          alt="Visão panorâmica" 
          className="w-full rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Technical Specs */}
      <div className="mt-8">
        <h4 className="font-semibold text-gray-900 mb-3">📋 PRINCIPAIS CARACTERÍSTICAS TÉCNICAS:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Dispensa uso de DVR
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Grava em cartão de memória ou na nuvem
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Rastreamento automático de pessoas ou objetos
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Rotação da câmera em 360°
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Imagem colorida à noite
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Infravermelho - vê em total escuridão
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Notificação no celular ao detectar movimento
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Luz de LED manual e automática
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Áudio bilateral - ouve e fala
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Compartilhe acesso com familiares
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Acesso via computador ou tablet
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Alarme em zona definida por você
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            Linha do tempo de gravações
          </li>
        </ul>
      </div>

      {/* App Download */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-bold text-green-800 mb-2">📱 BAIXE O APP iCSee:</h4>
        <p className="text-sm text-green-700">
          Disponível no Android (Google Play) e iOS. Compartilhe a câmera com seus familiares, 
          deixe que todos façam o monitoramento através do celular. A tecnologia P2P permite 
          visualizar sua casa de qualquer lugar através do seu Smartphone ou tablet.
        </p>
      </div>
    </section>
  );
};

export default CameraDescription;
