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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground line-through">R$ 239,80</p>
          <p className="text-xl font-bold text-foreground">
            R$ 57,90
            <span className="ml-2 text-xs font-medium text-white bg-orange-500 px-2 py-0.5 rounded-full">
              76% OFF
            </span>
          </p>
        </div>
        
        <Button
          onClick={handleClick}
          size="lg"
          className="gradient-cta hover:opacity-90 text-white font-bold px-6 shadow-lg"
        >
          <ShoppingBag className="h-5 w-5" />
          {selectedSize ? "COMPRAR" : "SELECIONE"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FixedCTA;
