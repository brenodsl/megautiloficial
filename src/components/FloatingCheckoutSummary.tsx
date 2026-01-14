import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";

interface FloatingCheckoutSummaryProps {
  totalPrice: number;
  shippingPrice: number;
  itemCount: number;
}

const FloatingCheckoutSummary = ({
  totalPrice,
  shippingPrice,
  itemCount,
}: FloatingCheckoutSummaryProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const finalTotal = totalPrice + shippingPrice;

  useEffect(() => {
    const handleScroll = () => {
      // Show floating summary after scrolling past 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-2 px-4 z-40 shadow-sm md:hidden animate-in slide-in-from-top duration-300">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#28af60]/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-[#28af60]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-[#28af60]">
            R$ {finalTotal.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingCheckoutSummary;
