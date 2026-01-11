import { Truck, Clock, Package } from "lucide-react";

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ElementType;
  badge?: string;
}

export const shippingOptions: ShippingOption[] = [
  {
    id: "free",
    name: "Frete grátis",
    description: "8 a 12 dias úteis",
    price: 0,
    icon: Package,
    badge: "GRÁTIS",
  },
  {
    id: "express",
    name: "Frete expresso",
    description: "3 a 6 dias úteis",
    price: 12.90,
    icon: Truck,
  },
  {
    id: "capital",
    name: "Entrega para capitais",
    description: "1 a 2 dias úteis",
    price: 29.90,
    icon: Clock,
  },
];

export const getShippingPrice = (shippingId: string): number => {
  const option = shippingOptions.find(opt => opt.id === shippingId);
  return option?.price || 0;
};

interface ShippingOptionsProps {
  selectedShipping: string;
  onSelect: (id: string) => void;
}

const ShippingOptions = ({ selectedShipping, onSelect }: ShippingOptionsProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
          <Package className="h-3.5 w-3.5 text-[#28af60]" />
        </div>
        <h2 className="font-semibold text-gray-900">Opções de entrega</h2>
      </div>
      
      <div className="space-y-3">
        {shippingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedShipping === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isSelected 
                  ? "border-[#28af60] bg-green-50/50" 
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSelected ? "bg-[#28af60] text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{option.name}</span>
                    {option.badge && (
                      <span className="text-[10px] font-bold text-white bg-[#28af60] px-1.5 py-0.5 rounded">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                  {option.id === "capital" && (
                    <p className="text-[10px] text-gray-400">Válido apenas para capitais do Brasil</p>
                  )}
                </div>
              </div>
              <span className={`font-bold ${option.price === 0 ? "text-[#28af60]" : "text-gray-900"}`}>
                {option.price === 0 ? "R$ 0,00" : `R$ ${option.price.toFixed(2).replace(".", ",")}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingOptions;
