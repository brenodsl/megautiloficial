import { Truck, RefreshCcw, ShieldCheck, CreditCard, Clock, Package } from "lucide-react";

const guarantees = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Entrega para todo o Brasil",
  },
  {
    icon: RefreshCcw,
    title: "Devolução Grátis",
    description: "30 dias após o recebimento",
  },
  {
    icon: ShieldCheck,
    title: "Compra Garantida",
    description: "Receba ou devolvemos o dinheiro",
  },
  {
    icon: Clock,
    title: "Garantia de Fábrica",
    description: "30 dias de garantia",
  },
];

const CameraGuarantees = () => {
  return (
    <section id="garantias" className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Garantias
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {guarantees.map((guarantee, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 text-center"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <guarantee.icon className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{guarantee.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{guarantee.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CameraGuarantees;
