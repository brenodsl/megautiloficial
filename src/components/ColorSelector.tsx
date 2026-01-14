import colorGradient from "@/assets/color-gradient.webp";
import colorGreen from "@/assets/color-green.webp";
import colorLime from "@/assets/color-lime.webp";
import colorOrangeHd from "@/assets/color-orange-hd.webp";
import colorPink from "@/assets/color-pink.webp";
import colorSunset from "@/assets/color-sunset.webp";
import colorCreamOrange from "@/assets/color-cream-orange.webp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <span className="text-sm font-medium text-foreground">Cor</span>
        {selectedColorData && (
          <span className="text-sm text-muted-foreground">{selectedColorData.name}</span>
        )}
      </div>
      
      <Select value={selectedColor} onValueChange={onColorSelect}>
        <SelectTrigger className="w-full h-16 bg-card border border-border rounded-xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary">
          <SelectValue placeholder="Selecione a cor">
            {selectedColorData && (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={selectedColorData.image} 
                    alt={selectedColorData.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-border"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold text-foreground">{selectedColorData.name}</span>
                  <span className={`text-xs font-medium ${
                    selectedColorData.stock <= 5 
                      ? 'text-destructive' 
                      : selectedColorData.stock <= 10 
                        ? 'text-warning' 
                        : 'text-muted-foreground'
                  }`}>
                    {selectedColorData.stock <= 5 
                      ? `⚡ Apenas ${selectedColorData.stock} restantes` 
                      : `${selectedColorData.stock} em estoque`}
                  </span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border border-border rounded-xl shadow-xl z-50 p-1">
          {colors.map((color) => (
            <SelectItem 
              key={color.id} 
              value={color.id}
              className="cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50 transition-colors duration-150 my-0.5"
            >
              <div className="flex items-center gap-4 py-1.5">
                <img 
                  src={color.image} 
                  alt={color.name}
                  className={`w-11 h-11 rounded-xl object-cover transition-all duration-200 ${
                    selectedColor === color.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'ring-1 ring-border hover:ring-2 hover:ring-primary/50'
                  }`}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{color.name}</span>
                  <span className={`text-xs ${
                    color.stock <= 5 
                      ? 'text-destructive font-medium' 
                      : color.stock <= 10 
                        ? 'text-warning' 
                        : 'text-muted-foreground'
                  }`}>
                    {color.stock <= 5 
                      ? `⚡ Apenas ${color.stock} restantes` 
                      : `${color.stock} em estoque`}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColorSelector;