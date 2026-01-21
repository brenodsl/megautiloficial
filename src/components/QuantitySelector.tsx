import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector = ({ quantity, maxQuantity, onQuantityChange }: QuantitySelectorProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-700">Quantidade:</span>
          <select
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            className="font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="text-gray-400 text-sm">(+{maxQuantity} disponíveis)</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default QuantitySelector;
