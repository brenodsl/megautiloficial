import colorGradient from "@/assets/color-gradient.webp";
import colorPurple from "@/assets/color-purple.webp";
import colorOrange from "@/assets/color-orange.webp";
import colorMint from "@/assets/color-mint.webp";
import colorPink from "@/assets/color-pink.webp";
import tenisMain from "@/assets/tenis-main.webp";

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  { id: "gradient", name: "Gradient", image: colorGradient },
  { id: "purple", name: "Roxo", image: colorPurple },
  { id: "orange", name: "Laranja", image: colorOrange },
  { id: "mint", name: "Verde", image: colorMint },
  { id: "pink", name: "Rosa", image: colorPink },
  { id: "main", name: "Original", image: tenisMain },
];

const ColorSelector = ({ selectedColor, onColorSelect }: ColorSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Cor:</span>
        <span className="text-sm font-medium text-foreground">
          {colors.find(c => c.id === selectedColor)?.name || "Gradient"}
        </span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-1">
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          
          return (
            <button
              key={color.id}
              onClick={() => onColorSelect(color.id)}
              className={`
                relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all
                ${isSelected 
                  ? "border-foreground ring-2 ring-foreground ring-offset-2" 
                  : "border-border hover:border-muted-foreground"
                }
              `}
            >
              <img
                src={color.image}
                alt={color.name}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
