import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Ruler } from "lucide-react";
import tabelaTamanhos from "@/assets/tabela-tamanhos.png";

interface SizeSelectorProps {
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

export interface SizeSelectorRef {
  showError: () => void;
}

interface SizeOption {
  size: number;
  inStock: boolean;
}

const sizes: SizeOption[] = [
  { size: 34, inStock: false },
  { size: 35, inStock: true },
  { size: 36, inStock: true },
  { size: 37, inStock: true },
  { size: 38, inStock: true },
  { size: 39, inStock: true },
  { size: 40, inStock: true },
  { size: 41, inStock: true },
  { size: 42, inStock: true },
  { size: 44, inStock: false },
];

const SizeSelector = forwardRef<SizeSelectorRef, SizeSelectorProps>(
  ({ selectedSize, onSizeSelect }, ref) => {
    const [showError, setShowError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      showError: () => {
        setShowError(true);
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        // Remove error after 3 seconds
        setTimeout(() => setShowError(false), 3000);
      },
    }));

    const handleSelect = (value: string) => {
      setShowError(false);
      onSizeSelect(Number(value));
    };

    return (
      <div ref={containerRef} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-sm font-medium transition-colors",
            showError ? "text-destructive" : "text-foreground"
          )}>
            Tamanho {showError && <span className="text-destructive ml-1">• Selecione</span>}
          </span>
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Ruler className="h-3.5 w-3.5" />
                <span className="underline">Tabela de tamanhos</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-0 [&>button]:bg-white [&>button]:rounded-full [&>button]:p-1 [&>button]:shadow-lg">
              <img 
                src={tabelaTamanhos} 
                alt="Tabela de Tamanhos Max Runner" 
                className="w-full h-auto rounded-lg"
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Select
          value={selectedSize?.toString() || ""}
          onValueChange={handleSelect}
        >
          <SelectTrigger 
            className={cn(
              "w-full h-14 bg-card border rounded-lg font-medium transition-all focus:ring-0 focus:ring-offset-0",
              showError 
                ? "border-destructive" 
                : "border-border"
            )}
          >
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent 
            className="bg-card border border-border rounded-lg shadow-lg z-50"
            position="popper"
            sideOffset={4}
          >
            {sizes.map((sizeOption) => (
              <SelectItem 
                key={sizeOption.size}
                value={sizeOption.size.toString()}
                disabled={!sizeOption.inStock}
                className={cn(
                  "cursor-pointer rounded-md focus:bg-muted focus:text-foreground",
                  !sizeOption.inStock 
                    ? "opacity-40 cursor-not-allowed" 
                    : selectedSize === sizeOption.size
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between w-full py-0.5">
                  <span className="text-foreground">{sizeOption.size}</span>
                  {!sizeOption.inStock && (
                    <span className="text-xs text-muted-foreground">Esgotado</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

SizeSelector.displayName = "SizeSelector";

export default SizeSelector;
