import colorGradient from "@/assets/color-gradient.webp";
import colorGreen from "@/assets/color-green.webp";
import colorLime from "@/assets/color-lime.webp";
import colorOrangeHd from "@/assets/color-orange-hd.webp";
import colorPink from "@/assets/color-pink.webp";
import colorSunset from "@/assets/color-sunset.webp";
import colorCreamOrange from "@/assets/color-cream-orange.webp";

export interface ColorOption {
  id: string;
  name: string;
  image: string;
  stock: number;
}

export const colors: ColorOption[] = [
  { id: "gradient", name: "Gradient", image: colorGradient, stock: 12 },
  { id: "green", name: "Green", image: colorGreen, stock: 8 },
  { id: "lime", name: "Lime", image: colorLime, stock: 5 },
  { id: "orange", name: "Orange", image: colorOrangeHd, stock: 15 },
  { id: "pink", name: "Pink", image: colorPink, stock: 3 },
  { id: "sunset", name: "Sunset", image: colorSunset, stock: 7 },
  { id: "cream-orange", name: "Cream Orange", image: colorCreamOrange, stock: 10 },
];

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorSelector = ({ selectedColor, onColorSelect }: ColorSelectorProps) => {
  const selectedColorData = colors.find(c => c.id === selectedColor);
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Cor:</span>
          {selectedColor ? (
            <span className="text-sm font-semibold text-gray-900">{selectedColorData?.name}</span>
          ) : (
            <span className="text-sm text-red-500 font-medium">Selecione</span>
          )}
        </div>
        {selectedColorData && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            selectedColorData.stock <= 5 
              ? 'bg-red-50 text-red-600' 
              : selectedColorData.stock <= 10 
                ? 'bg-amber-50 text-amber-600' 
                : 'bg-emerald-50 text-emerald-600'
          }`}>
            {selectedColorData.stock <= 5 
              ? `Últimas ${selectedColorData.stock} unidades` 
              : `${selectedColorData.stock} em estoque`}
          </span>
        )}
      </div>
      
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          const isLowStock = color.stock <= 5;
          
          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color.id)}
              className={`
                group relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200
                ${isSelected 
                  ? "ring-2 ring-gray-900 ring-offset-2 scale-105 shadow-lg" 
                  : "ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-102"
                }
              `}
            >
              <img
                src={color.image}
                alt={color.name}
                className="h-full w-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Stock indicator */}
              {isLowStock && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-[8px] font-bold text-center py-0.5">
                  {color.stock} un.
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;