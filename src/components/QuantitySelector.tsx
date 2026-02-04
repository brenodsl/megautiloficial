import { Tag } from "lucide-react";
import kit1und from "@/assets/kit-1und.jpg";
import kit2und from "@/assets/kit-2und.jpg";
import kit3und from "@/assets/kit-3und.jpg";
import kit4und from "@/assets/kit-4und.jpg";
import { useKitPricing, KitPriceOption, DEFAULT_KIT_PRICES } from "@/hooks/useKitPricing";

const KIT_IMAGES: Record<number, string> = {
  1: kit1und,
  2: kit2und,
  3: kit3und,
  4: kit4und,
};

interface QuantitySelectorProps {
  selectedQuantity: number | null;
  onQuantityChange: (quantity: number, price: number, originalPrice: number) => void;
}

const QuantitySelector = ({ selectedQuantity, onQuantityChange }: QuantitySelectorProps) => {
  const { kitPrices, isLoading } = useKitPricing();

  const options = isLoading ? DEFAULT_KIT_PRICES : kitPrices;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground mb-3">Selecione a quantidade:</p>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedQuantity === option.quantity;
          const image = KIT_IMAGES[option.quantity] || kit1und;
          
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
              
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Kit Image */}
                  <img 
                    src={image} 
                    alt={option.label}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-border flex-shrink-0"
                  />
                  
                  <div className="min-w-0">
                    <p className="font-bold text-foreground text-sm sm:text-base">{option.label}</p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground line-through">
                        R$ {option.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        R$ {option.salePrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Savings badge */}
                {option.savings > 0 && (
                  <div className="flex items-center gap-1 bg-success/10 text-success px-1.5 sm:px-2 py-1 rounded-lg flex-shrink-0">
                    <Tag className="h-3 w-3 hidden sm:block" />
                    <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">
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
export { DEFAULT_KIT_PRICES as QUANTITY_OPTIONS };
export type { KitPriceOption as QuantityOption };
