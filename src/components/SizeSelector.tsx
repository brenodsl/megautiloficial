import { Check } from "lucide-react";

interface SizeSelectorProps {
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const SizeSelector = ({ selectedSize, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-medium text-foreground">Tamanho:</span>
        {selectedSize && (
          <span className="text-sm text-muted-foreground">{selectedSize} selecionado</span>
        )}
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`
                relative h-11 rounded-lg border-2 text-sm font-medium transition-all
                ${isSelected 
                  ? "border-foreground bg-foreground text-white" 
                  : "border-border bg-white text-foreground hover:border-muted-foreground"
                }
              `}
            >
              {size}
              {isSelected && (
                <Check className="absolute -top-1 -right-1 h-4 w-4 bg-success text-white rounded-full p-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
