import { ShoppingBag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FixedCTAProps {
  selectedSize: number | null;
  selectedColor: string;
}

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";

const FixedCTA = ({ selectedSize, selectedColor }: FixedCTAProps) => {
  const canCheckout = selectedSize !== null && selectedColor !== "";

  const handleClick = () => {
    if (!selectedColor) {
      toast.error("Selecione uma cor antes de continuar", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      document.getElementById("produto")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!selectedSize) {
      toast.error("Selecione um tamanho antes de continuar", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
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
            R$ 78,90
            <span className="ml-2 text-[10px] font-bold text-white bg-destructive px-1.5 py-0.5 rounded">
              -67%
            </span>
          </p>
        </div>
        
        <Button
          onClick={handleClick}
          className={`font-bold px-6 h-12 ${
            canCheckout 
              ? "bg-black hover:bg-black/90 text-white" 
              : "bg-muted text-muted-foreground hover:bg-muted"
          }`}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          COMPRAR AGORA
        </Button>
      </div>
    </div>
  );
};

export default FixedCTA;
