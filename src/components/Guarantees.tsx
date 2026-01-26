import { ShieldCheck, CreditCard, Truck, Clock } from "lucide-react";

// PIX Icon Component
const PixIcon = () => (
  <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.5 391.5 392.5 391.5H407.7L310.6 488.6C280.3 518.9 231.7 518.9 201.4 488.6L103.3 390.5H112.5C132.5 390.5 151.3 382.7 165.5 368.5L242.4 291.6V292.5zM262.5 218.5C257.1 223.9 247.8 223.9 242.4 218.5L165.5 141.6C151.3 127.4 132.5 119.6 112.5 119.6H103.3L201.4 21.49C231.7-8.83 280.3-8.83 310.6 21.49L407.7 118.6H392.5C372.5 118.6 353.7 126.4 339.5 140.6L262.5 217.6V218.5zM112.5 142.1C126.7 142.1 140.3 147.6 150.5 157.9L227.4 234.8C234.3 241.7 243.1 245.9 252.5 247.1V264C243.1 265.2 234.3 269.4 227.4 276.3L150.5 353.2C140.3 363.5 126.7 369 112.5 369H80.19L21.49 310.3C-8.832 280-8.832 231.4 21.49 201.1L80.19 142.4H112.5V142.1zM431.8 369H399.5C385.3 369 371.7 363.5 361.5 353.2L284.6 276.3C277.7 269.4 268.9 265.2 259.5 264V247.1C268.9 245.9 277.7 241.7 284.6 234.8L361.5 157.9C371.7 147.6 385.3 142.1 399.5 142.1H431.8L490.5 200.8C520.8 231.1 520.8 279.7 490.5 310L431.8 368.7V369z"/>
  </svg>
);

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description: "Site 100% protegido",
    color: "text-primary",
    bgColor: "bg-secondary",
  },
  {
    icon: PixIcon,
    title: "Pagamento PIX",
    description: "Desconto especial à vista",
    color: "text-primary",
    bgColor: "bg-secondary",
    isCustomIcon: true,
  },
  {
    icon: Truck,
    title: "Entrega Garantida",
    description: "Frete grátis para todo Brasil",
    color: "text-primary",
    bgColor: "bg-secondary",
  },
  {
    icon: Clock,
    title: "Garantia 12 meses",
    description: "Cobertura total",
    color: "text-primary",
    bgColor: "bg-secondary",
  },
];

const Guarantees = () => {
  return (
    <section id="garantias" className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">
        Garantias
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {guarantees.map((guarantee, index) => (
          <div
            key={index}
            className="bg-secondary/50 rounded-xl p-4"
          >
            <div className={`w-10 h-10 rounded-full ${guarantee.bgColor} flex items-center justify-center mb-2`}>
              {guarantee.isCustomIcon ? (
                <div className={guarantee.color}>
                  <guarantee.icon />
                </div>
              ) : (
                <guarantee.icon className={`h-5 w-5 ${guarantee.color}`} />
              )}
            </div>
            <h3 className="font-bold text-foreground text-sm">{guarantee.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{guarantee.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guarantees;
