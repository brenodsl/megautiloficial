import { Zap, Wind, Footprints, Scale, Activity, Trophy } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Placa de Carbono",
    description: "Retorno de energia excepcional e propulsão otimizada",
  },
  {
    icon: Wind,
    title: "Malha Respirável",
    description: "Mantém seus pés frescos e secos durante toda a corrida",
  },
  {
    icon: Footprints,
    title: "Amortecimento Premium",
    description: "Espuma de alta densidade que absorve impactos",
  },
  {
    icon: Scale,
    title: "Ultra Leve",
    description: "Apenas 220g para máximo conforto e agilidade",
  },
  {
    icon: Activity,
    title: "Antiderrapante",
    description: "Solado de borracha para maior aderência",
  },
  {
    icon: Trophy,
    title: "Design Ergonômico",
    description: "Ideal para corridas longas e treinos intensos",
  },
];

const Benefits = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">
        Características do Produto
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-border p-4"
          >
            <benefit.icon className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
