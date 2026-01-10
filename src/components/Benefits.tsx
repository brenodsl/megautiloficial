import { Zap, Feather, Shield, Wind, Award, Heart } from "lucide-react";

const benefits = [
  {
    icon: Feather,
    title: "Ultra Leve",
    description: "Apenas 280g para máximo conforto",
  },
  {
    icon: Zap,
    title: "Amortecimento",
    description: "Tecnologia de absorção de impacto",
  },
  {
    icon: Wind,
    title: "Respirável",
    description: "Malha que permite ventilação",
  },
  {
    icon: Shield,
    title: "Durável",
    description: "Sola resistente ao desgaste",
  },
  {
    icon: Award,
    title: "Design Premium",
    description: "Estilo moderno e versátil",
  },
  {
    icon: Heart,
    title: "Conforto Total",
    description: "Palmilha ergonômica anatômica",
  },
];

const Benefits = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-foreground">
        Por que escolher o <span className="text-primary">Max Runner</span>?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="group p-4 rounded-xl bg-card border border-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all text-center space-y-2"
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
              <benefit.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
