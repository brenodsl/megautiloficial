interface SizeSelectorProps {
  selectedSize: number | null;
  onSizeSelect: (size: number) => void;
}

const sizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const SizeSelector = ({ selectedSize, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tamanho:</span>
        {selectedSize ? (
          <span className="text-sm font-semibold text-foreground">{selectedSize}</span>
        ) : (
          <span className="text-sm text-destructive font-medium animate-pulse">Selecione</span>
        )}
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          
          return (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`
                relative h-11 rounded-lg text-sm font-semibold transition-all duration-200
                ${isSelected 
                  ? "bg-foreground text-white shadow-lg scale-105" 
                  : "bg-white border-2 border-border text-foreground hover:border-foreground hover:bg-muted/50"
                }
              `}
            >
              {size}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
