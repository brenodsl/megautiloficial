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
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">Cor</span>
      
      <Select value={selectedColor} onValueChange={onColorSelect}>
        <SelectTrigger className="w-full h-14 bg-card border border-border rounded-lg">
          <SelectValue placeholder="Selecione a cor">
            {selectedColorData && (
              <div className="flex items-center gap-3">
                <img 
                  src={selectedColorData.image} 
                  alt={selectedColorData.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <span className="font-medium text-foreground">{selectedColorData.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedColorData.stock} un.
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-card border border-border rounded-lg shadow-lg z-50">
          {colors.map((color) => (
            <SelectItem 
              key={color.id} 
              value={color.id}
              className={`cursor-pointer rounded-md transition-colors focus:bg-muted focus:text-foreground ${
                selectedColor === color.id 
                  ? 'bg-muted' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3 py-1">
                <img 
                  src={color.image} 
                  alt={color.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <span className="font-medium text-foreground">{color.name}</span>
                <span className="text-xs text-muted-foreground">
                  {color.stock} un.
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ColorSelector;