import { useNavigate } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

// Import color images
import colorGradient from "@/assets/color-gradient.webp";
import colorOrange from "@/assets/color-orange.webp";
import colorMint from "@/assets/color-mint.webp";
import colorPink from "@/assets/color-pink.webp";
import colorPurple from "@/assets/color-purple.webp";
import colorGreen from "@/assets/color-green.webp";
import colorLime from "@/assets/color-lime.webp";
import colorSunset from "@/assets/color-sunset.webp";
import colorCreamOrange from "@/assets/color-cream-orange.webp";
import colorOrangeHd from "@/assets/color-orange-hd.webp";

const colorImages: Record<string, string> = {
  gradient: colorGradient,
  orange: colorOrange,
  mint: colorMint,
  pink: colorPink,
  purple: colorPurple,
  green: colorGreen,
  lime: colorLime,
  sunset: colorSunset,
  "cream-orange": colorCreamOrange,
  "orange-hd": colorOrangeHd,
};

const colorNames: Record<string, string> = {
  gradient: "Gradient",
  orange: "Orange",
  mint: "Mint",
  pink: "Pink",
  purple: "Purple",
  green: "Green",
  lime: "Lime",
  sunset: "Sunset",
  "cream-orange": "Cream Orange",
  "orange-hd": "Orange HD",
};

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer = ({ open, onOpenChange }: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice, totalItems, originalPrice, discount } = useCart();

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">Carrinho vazio</p>
            <p className="text-sm text-muted-foreground">
              Adicione produtos ao carrinho para continuar
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={colorImages[item.colorId] || colorGradient}
                      alt={item.colorName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      Tênis Carbon 3.0
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {colorNames[item.colorId] || item.colorName} • Tam. {item.size}
                    </p>
                    <p className="text-sm font-bold text-success mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4 space-y-4">
              {/* Promotion Banner - Encourage 2nd pair */}
              {totalItems === 1 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-3 shadow-md">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">👟</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">Adicione +1 par</p>
                      <p className="text-emerald-100 text-xs">e ganhe <span className="font-bold text-white">20% OFF</span> no segundo!</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Discount Applied Banner */}
              {discount > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-base">✨</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Desconto aplicado!</p>
                        <p className="text-emerald-100 text-xs">Você está economizando</p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <p className="text-white font-bold text-base">-R$ {discount.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Price Summary */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-muted-foreground line-through">
                      R$ {originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-xl text-foreground">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-success hover:bg-success/90 text-white font-bold rounded-xl shadow-lg shadow-success/20"
              >
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
