import { Camera, Moon, Wifi, MonitorPlay, Mic2, Droplets, Smartphone, UserCheck } from "lucide-react";

const benefits = [
  {
    icon: Camera,
    title: "Lente Dupla",
    description: "3,6mm + 6mm para imagem superior",
  },
  {
    icon: Moon,
    title: "Visão Noturna Colorida",
    description: "Imagens nítidas até 15m no escuro",
  },
  {
    icon: Wifi,
    title: "WiFi Integrado",
    description: "Conecte ao app e monitore de qualquer lugar",
  },
  {
    icon: MonitorPlay,
    title: "Full HD 1080P",
    description: "Gravação em alta definição",
  },
  {
    icon: Mic2,
    title: "Áudio Bidirecional",
    description: "Fale e ouça pelo app",
  },
  {
    icon: Droplets,
    title: "IP66 à Prova D'água",
    description: "Uso interno e externo",
  },
  {
    icon: Smartphone,
    title: "App iCSee",
    description: "Controle total pelo celular",
  },
  {
    icon: UserCheck,
    title: "Rastreamento Humano",
    description: "Alertas inteligentes de movimento",
  },
];

const Benefits = () => {
  return (
    <section className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">
        Características do Produto
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-secondary/50 rounded-xl p-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              <benefit.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground text-sm">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
