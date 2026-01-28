import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const FloatingBuyButton = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleClick = () => {
    navigate("/checkout");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border p-3 shadow-lg">
      <div className="max-w-lg mx-auto">
        <Button
          onClick={handleClick}
          size="lg"
          className="w-full h-14 font-bold text-base rounded-xl gradient-cta text-white glow-cta hover:opacity-90 transition-all"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          {totalItems > 0 ? 'Finalizar compra' : 'Comprar agora'}
        </Button>
      </div>
    </div>
  );
};

export default FloatingBuyButton;
