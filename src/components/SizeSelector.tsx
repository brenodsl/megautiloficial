import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

export interface SizeSelectorRef {
  showError: () => void;
}

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

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
        <label className={cn(
          "text-sm transition-colors",
          showError ? "text-destructive font-semibold" : "text-muted-foreground"
        )}>
          Tamanho: {showError && <span className="ml-1">⚠️ Selecione um tamanho!</span>}
        </label>
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
