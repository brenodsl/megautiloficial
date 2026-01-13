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

const sizes = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44];

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
          <label className={cn(
            "text-sm transition-colors",
            showError ? "text-destructive font-semibold" : "text-muted-foreground"
          )}>
            Tamanho: {showError && <span className="ml-1">⚠️ Selecione um tamanho!</span>}
          </label>
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors">
                <Ruler className="h-3.5 w-3.5" />
                <span className="underline">Tabela de tamanhos</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-transparent border-0">
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
              "w-full h-12 bg-white border-2 text-foreground font-medium transition-all",
              showError 
                ? "border-destructive ring-2 ring-destructive/20 animate-pulse" 
                : "border-border"
            )}
          >
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
  }
);

SizeSelector.displayName = "SizeSelector";

export default SizeSelector;
