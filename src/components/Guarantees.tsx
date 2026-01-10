import { Truck, RefreshCcw, ShieldCheck, CreditCard } from "lucide-react";

const guarantees = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Entrega para todo o Brasil",
  },
  {
    icon: RefreshCcw,
    title: "Troca Fácil",
    description: "7 dias para trocar ou devolver",
  },
  {
    icon: ShieldCheck,
    title: "Garantia 90 Dias",
    description: "Proteção contra defeitos",
  },
  {
    icon: CreditCard,
    title: "Pagamento Seguro",
    description: "Ambiente 100% protegido",
  },
];

const Guarantees = () => {
  return (
    <section id="garantias" className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">
        Garantias
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {guarantees.map((guarantee, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-border p-4 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
              <guarantee.icon className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-semibold text-foreground text-sm">{guarantee.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{guarantee.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guarantees;
