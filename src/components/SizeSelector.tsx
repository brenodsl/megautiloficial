import { useState } from "react";

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

interface SizeSelectorProps {
  onSizeSelect: (size: number | null) => void;
  selectedSize: number | null;
}

const SizeSelector = ({ onSizeSelect, selectedSize }: SizeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Tamanho</span>
        {selectedSize && (
          <span className="text-sm text-primary font-medium">
            Selecionado: {selectedSize}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`h-11 w-11 rounded-lg border-2 text-sm font-medium transition-all ${
              selectedSize === size
                ? "border-primary bg-primary text-primary-foreground glow-primary"
                : "border-border bg-card text-foreground hover:border-primary/50"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
