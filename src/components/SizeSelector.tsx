import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
        setTimeout(() => setShowError(false), 3000);
      },
    }));

    const handleSelect = (size: number) => {
      setShowError(false);
      onSizeSelect(size);
    };

    return (
      <div ref={containerRef} className="space-y-3">
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
        
        <div className="grid grid-cols-5 gap-2">
          {sizes.map((sizeOption) => (
            <button
              key={sizeOption.size}
              onClick={() => sizeOption.inStock && handleSelect(sizeOption.size)}
              disabled={!sizeOption.inStock}
              className={cn(
                "h-12 rounded-lg border text-sm font-medium transition-all",
                !sizeOption.inStock 
                  ? "bg-muted/30 text-muted-foreground/50 border-border/50 cursor-not-allowed line-through" 
                  : selectedSize === sizeOption.size
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card text-foreground border-border hover:border-foreground/50",
                showError && !selectedSize && sizeOption.inStock && "border-destructive"
              )}
            >
              {sizeOption.size}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

SizeSelector.displayName = "SizeSelector";

export default SizeSelector;
