import { RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeSelectorRef } from "@/components/SizeSelector";
import { useCart } from "@/contexts/CartContext";

// Checkout URLs per color
const CHECKOUT_URLS: Record<string, string> = {
  "cream-orange": "https://pay.maxrunnerpay.shop/69632af261f923383de76bb1",
  "gradient": "https://pay.maxrunnerpay.shop/69632b2319454c0cfe8e2e4d",
  "green": "https://pay.maxrunnerpay.shop/69632b3661f923383de76c9c",
  "lime": "https://pay.maxrunnerpay.shop/69632b4819454c0cfe8e2ec0",
  "orange": "https://pay.maxrunnerpay.shop/69632b5719454c0cfe8e2f01",
  "pink": "https://pay.maxrunnerpay.shop/69632b6561f923383de76d60",
  "sunset": "https://pay.maxrunnerpay.shop/69632b7519454c0cfe8e2f83",
};

interface FixedCTAProps {
  selectedSize: number | null;
  selectedColor: string;
  sizeSelectorRef: RefObject<SizeSelectorRef>;
}

const FixedCTA = ({ selectedSize, selectedColor, sizeSelectorRef }: FixedCTAProps) => {
  const navigate = useNavigate();
  const { totalItems, unitPrice, displayOriginalPrice } = useCart();
  
  // Calculate discount percentage
  const discountPercent = displayOriginalPrice > 0 
    ? Math.round(((displayOriginalPrice - unitPrice) / displayOriginalPrice) * 100) 
    : 0;
  
  const handleClick = () => {
    // If cart has items, go directly to checkout
    if (totalItems > 0) {
      navigate("/checkout");
      return;
    }
    
    // If cart is empty, user needs to select a size first
    if (!selectedSize) {
      sizeSelectorRef.current?.showError();
      return;
    }
    const checkoutUrl = CHECKOUT_URLS[selectedColor];
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t border-border lg:hidden shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground line-through">R$ {displayOriginalPrice.toFixed(2).replace(".", ",")}</p>
          <p className="text-lg font-bold text-foreground">
            R$ {unitPrice.toFixed(2).replace(".", ",")}
            <span className="ml-2 text-[10px] font-bold text-white bg-destructive px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          </p>
        </div>
        
        <Button
          onClick={handleClick}
          className="font-bold px-6 h-12 bg-black hover:bg-black/90 text-white"
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          {totalItems > 0 ? 'FINALIZAR COMPRA' : 'COMPRAR AGORA'}
        </Button>
      </div>
    </div>
  );
};

export default FixedCTA;
