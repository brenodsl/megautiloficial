import { Check, Tag } from "lucide-react";

interface QuantityOption {
  quantity: number;
  label: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  isPopular?: boolean;
}

const QUANTITY_OPTIONS: QuantityOption[] = [
  { quantity: 1, label: "1 Und", originalPrice: 157.00, salePrice: 65.80, savings: 0 },
  { quantity: 2, label: "Kit 2 Und", originalPrice: 314.00, salePrice: 119.90, savings: 194.10 },
  { quantity: 3, label: "Kit 3 Und", originalPrice: 471.00, salePrice: 159.90, savings: 311.10, isPopular: true },
  { quantity: 4, label: "Kit 4 Und", originalPrice: 628.00, salePrice: 199.90, savings: 428.10 },
];

interface QuantitySelectorProps {
  selectedQuantity: number;
  onQuantityChange: (quantity: number, price: number, originalPrice: number) => void;
}

const QuantitySelector = ({ selectedQuantity, onQuantityChange }: QuantitySelectorProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground mb-3">Selecione a quantidade:</p>
      <div className="space-y-2">
        {QUANTITY_OPTIONS.map((option) => {
          const isSelected = selectedQuantity === option.quantity;
          
          return (
            <button
              key={option.quantity}
              onClick={() => onQuantityChange(option.quantity, option.salePrice, option.originalPrice)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left relative ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-white hover:border-primary/50"
              }`}
            >
              {/* Popular badge */}
              {option.isPopular && (
                <span className="absolute -top-2.5 right-3 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  MAIS VENDIDO
                </span>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Selection indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? "border-primary bg-primary" 
                      : "border-muted-foreground/30"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  
                  <div>
                    <p className="font-bold text-foreground">{option.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {option.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-xs text-muted-foreground">👉</span>
                      <span className="text-sm font-bold text-primary">
                        R$ {option.salePrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Savings badge */}
                {option.savings > 0 && (
                  <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-lg">
                    <Tag className="h-3 w-3" />
                    <span className="text-xs font-bold">
                      -R$ {option.savings.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuantitySelector;
export { QUANTITY_OPTIONS };
export type { QuantityOption };
