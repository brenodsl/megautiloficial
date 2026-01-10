interface SizeSelectorProps {
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const SizeSelector = ({ selectedSize, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tamanho:</span>
        {selectedSize && (
          <span className="text-sm font-medium text-foreground">{selectedSize}</span>
        )}
        {!selectedSize && (
          <span className="text-sm text-destructive font-medium">Selecione</span>
        )}
      </div>
      
      {/* Horizontal scrollable size selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`
                flex-shrink-0 w-12 h-10 rounded-lg border-2 text-sm font-semibold transition-all
                ${isSelected 
                  ? "border-foreground bg-foreground text-white" 
                  : "border-border bg-white text-foreground hover:border-muted-foreground"
                }
              `}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
