import { Truck, RefreshCw, ShieldCheck, CreditCard } from "lucide-react";

const guarantees = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Para todo Brasil",
  },
  {
    icon: RefreshCw,
    title: "Troca Grátis",
    description: "30 dias sem custo",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description: "Site 100% protegido",
  },
  {
    icon: CreditCard,
    title: "Até 12x",
    description: "Sem juros no cartão",
  },
];

const Guarantees = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {guarantees.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-2 p-3 rounded-xl gradient-card border border-border text-center"
        >
          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
            <item.icon className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Guarantees;
