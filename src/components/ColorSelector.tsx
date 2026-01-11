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
}

export const colors: ColorOption[] = [
  { id: "gradient", name: "Gradient", image: colorGradient },
  { id: "green", name: "Green", image: colorGreen },
  { id: "lime", name: "Lime", image: colorLime },
  { id: "orange", name: "Orange", image: colorOrangeHd },
  { id: "pink", name: "Pink", image: colorPink },
  { id: "sunset", name: "Sunset", image: colorSunset },
  { id: "cream-orange", name: "Cream Orange", image: colorCreamOrange },
];

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const ColorSelector = ({ selectedColor, onColorSelect }: ColorSelectorProps) => {
  const selectedColorName = colors.find(c => c.id === selectedColor)?.name;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Cor:</span>
        {selectedColor ? (
          <span className="text-sm font-semibold text-foreground">{selectedColorName}</span>
        ) : (
          <span className="text-sm text-destructive font-medium">Selecione</span>
        )}
      </div>
      
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          
          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color.id)}
              className={`
                group relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200
                ${isSelected 
                  ? "ring-2 ring-foreground ring-offset-2 scale-105 shadow-lg" 
                  : "ring-1 ring-border hover:ring-foreground/50 hover:scale-102"
                }
              `}
            >
              <img
                src={color.image}
                alt={color.name}
                className="h-full w-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center">
                  <div className="w-5 h-5 bg-foreground rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
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
