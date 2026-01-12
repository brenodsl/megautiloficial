import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { colors } from "@/components/ColorSelector";

interface AbandonedItem {
  colorId: string;
  colorName: string;
  size: number;
  quantity: number;
  price: number;
}

const ABANDONMENT_KEY = "checkout_abandoned";
const POPUP_SHOWN_KEY = "abandonment_popup_shown";

export const setCheckoutAbandoned = (items: AbandonedItem[]) => {
  sessionStorage.setItem(ABANDONMENT_KEY, JSON.stringify(items));
  sessionStorage.removeItem(POPUP_SHOWN_KEY);
};

export const clearCheckoutAbandoned = () => {
  sessionStorage.removeItem(ABANDONMENT_KEY);
  sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
};

const AbandonmentPopup = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [abandonedItems, setAbandonedItems] = useState<AbandonedItem[]>([]);

  useEffect(() => {
    const checkAbandonment = () => {
      const abandoned = sessionStorage.getItem(ABANDONMENT_KEY);
      const popupShown = sessionStorage.getItem(POPUP_SHOWN_KEY);

      if (abandoned && !popupShown) {
        try {
          const items = JSON.parse(abandoned) as AbandonedItem[];
          if (items.length > 0) {
            setAbandonedItems(items);
            setIsOpen(true);
            sessionStorage.setItem(POPUP_SHOWN_KEY, "true");
          }
        } catch (e) {
          console.error("Error parsing abandoned items:", e);
        }
      }
    };

    // Small delay to ensure proper navigation
    const timeout = setTimeout(checkAbandonment, 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleAcceptOffer = () => {
    setIsOpen(false);
    // Navigate to checkout with discount flag
    sessionStorage.setItem("apply_discount", "true");
    navigate("/checkout");
  };

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.removeItem(ABANDONMENT_KEY);
  };

  if (abandonedItems.length === 0) return null;

  const firstItem = abandonedItems[0];
  const colorData = colors.find(c => c.id === firstItem.colorId);
  
  // Original price and discounted price (20% off)
  const originalPrice = 77.80;
  const discountedPrice = originalPrice * 0.8; // 20% off = R$ 62,24

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm p-0 bg-white rounded-2xl overflow-hidden border-0">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 bg-black/10 rounded-full hover:bg-black/20 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              🔥 OFERTA EXCLUSIVA
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Não perca seu tênis!
            </h2>
            <p className="text-sm text-gray-600">
              Ganhe <span className="font-bold text-green-600">20% de desconto</span> para finalizar sua compra agora
            </p>
          </div>

          {/* Product Card */}
          <div className="bg-gray-50 rounded-xl p-4 flex gap-4 items-center">
            {colorData && (
              <img
                src={colorData.image}
                alt={colorData.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">
                Tênis Carbon 3.0
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {firstItem.colorName} • Tam. {firstItem.size}
              </p>
              <div className="space-y-0.5">
                <p className="text-xs text-gray-400 line-through">
                  R$ {originalPrice.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-lg font-bold text-green-600">
                  R$ {discountedPrice.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleAcceptOffer}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-full"
          >
            Quero essa oferta
          </Button>

          {/* Skip link */}
          <button
            onClick={handleClose}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Não, obrigado
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AbandonmentPopup;
