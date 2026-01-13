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
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Cor:</span>
        {!selectedColor && (
          <span className="text-sm text-red-500 font-medium">Selecione</span>
        )}
      </div>
      
      <Select value={selectedColor} onValueChange={onColorSelect}>
        <SelectTrigger className="w-full h-14 bg-white border-gray-200">
          <SelectValue placeholder="Selecione a cor">
            {selectedColorData && (
              <div className="flex items-center gap-3">
                <img 
                  src={selectedColorData.image} 
                  alt={selectedColorData.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedColorData.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedColorData.stock <= 5 
                      ? 'bg-red-50 text-red-600' 
                      : selectedColorData.stock <= 10 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {selectedColorData.stock <= 5 
                      ? `Últimas ${selectedColorData.stock}` 
                      : `${selectedColorData.stock} un.`}
                  </span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {colors.map((color) => (
            <SelectItem 
              key={color.id} 
              value={color.id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-3 py-1">
                <img 
                  src={color.image} 
                  alt={color.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex items-center gap-2">
                  <span className="font-medium">{color.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    color.stock <= 5 
                      ? 'bg-red-50 text-red-600' 
                      : color.stock <= 10 
                        ? 'bg-amber-50 text-amber-600' 
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {color.stock <= 5 
                      ? `Últimas ${color.stock}` 
                      : `${color.stock} un.`}
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