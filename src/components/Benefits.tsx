import { Zap, Wind, Footprints, Scale, Activity, Trophy } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Placa de Carbono",
    description: "Retorno de energia excepcional",
  },
  {
    icon: Wind,
    title: "Malha Respirável",
    description: "Pés frescos durante a corrida",
  },
  {
    icon: Footprints,
    title: "Amortecimento Premium",
    description: "Absorção de impactos",
  },
  {
    icon: Scale,
    title: "Ultra Leve",
    description: "Apenas 220g",
  },
  {
    icon: Activity,
    title: "Antiderrapante",
    description: "Maior aderência",
  },
  {
    icon: Trophy,
    title: "Design Ergonômico",
    description: "Corridas longas",
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
