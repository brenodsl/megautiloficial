import { Camera, Wifi, Eye, Volume2, Moon, Shield, RotateCcw, Smartphone, Bell, HardDrive, Zap, Droplets } from "lucide-react";

const benefits = [
  {
    icon: Camera,
    title: "Lente Dupla 6MP",
    description: "Duas lentes de 3MP para qualidade Full HD",
  },
  {
    icon: Eye,
    title: "Zoom 4x Digital",
    description: "Aproxime para ver detalhes importantes",
  },
  {
    icon: RotateCcw,
    title: "Rotação 360°",
    description: "Panorâmica 340° e inclinação 90°",
  },
  {
    icon: Moon,
    title: "Visão Noturna",
    description: "Imagem colorida mesmo no escuro",
  },
  {
    icon: Volume2,
    title: "Áudio Bidirecional",
    description: "Ouça e fale através da câmera",
  },
  {
    icon: Bell,
    title: "Alarme Inteligente",
    description: "Luz policial de alerta contra invasores",
  },
  {
    icon: Zap,
    title: "Detecção Humana",
    description: "Rastreamento automático de pessoas",
  },
  {
    icon: Smartphone,
    title: "Controle Remoto",
    description: "Monitore pelo celular de qualquer lugar",
  },
  {
    icon: HardDrive,
    title: "Armazenamento",
    description: "Cartão SD até 128GB ou nuvem",
  },
  {
    icon: Wifi,
    title: "Wi-Fi 2.4GHz",
    description: "Conexão sem fio ou cabo LAN",
  },
  {
    icon: Shield,
    title: "À Prova d'Água",
    description: "IP66 para uso interno e externo",
  },
  {
    icon: Droplets,
    title: "Resistente",
    description: "Proteção contra chuva e poeira",
  },
];

const CameraBenefits = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Características do Produto
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <benefit.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CameraBenefits;
