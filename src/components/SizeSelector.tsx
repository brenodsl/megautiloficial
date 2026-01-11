import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SizeSelectorProps {
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const SizeSelector = ({ selectedSize, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">Tamanho:</label>
      <Select
        value={selectedSize?.toString() || ""}
        onValueChange={(value) => onSizeSelect(Number(value))}
      >
        <SelectTrigger className="w-full h-12 bg-white border-2 border-border text-foreground font-medium">
          <SelectValue placeholder="Selecione o tamanho" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-border z-50">
          {sizes.map((size) => (
            <SelectItem 
              key={size} 
              value={size.toString()}
              className="cursor-pointer hover:bg-muted"
            >
              Tamanho {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SizeSelector;
