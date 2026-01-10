import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FixedCTAProps {
  selectedSize: number | null;
}

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";

const FixedCTA = ({ selectedSize }: FixedCTAProps) => {
  const handleClick = () => {
    if (!selectedSize) {
      // Scroll to size selector
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.open(CHECKOUT_URL, "_blank");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t border-border lg:hidden shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground line-through">R$ 239,80</p>
          <p className="text-lg font-bold text-foreground">
            R$ 57,90
            <span className="ml-2 text-[10px] font-bold text-white bg-destructive px-1.5 py-0.5 rounded">
              -76%
            </span>
          </p>
        </div>
        
        <Button
          onClick={handleClick}
          className="gradient-cta glow-cta hover:opacity-95 text-white font-bold px-6 h-12"
        >
          <ShoppingBag className="h-5 w-5" />
          {selectedSize ? "COMPRAR" : "SELECIONE"}
        </Button>
      </div>
    </div>
  );
};

export default FixedCTA;
