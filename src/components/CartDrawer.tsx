import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import cameraMain from "@/assets/camera-main.png";

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
            <ShoppingCart className="h-16 w-16 text-primary/50 mb-4" />
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
                  className="flex gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-primary/20">
                    <img
                      src={cameraMain}
                      alt={item.colorName}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground">
                      {item.colorName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Full HD 1080P • Visão Noturna
                    </p>
                    <p className="text-lg font-bold text-accent mt-2">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 mt-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Remover</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-primary/20 p-4 space-y-4 bg-gradient-to-t from-primary/5 to-transparent">
              {/* Discount Applied Banner */}
              {discount > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 rounded-xl p-3 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-base">💰</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Você economiza</p>
                      </div>
                    </div>
                    <div className="bg-accent rounded-lg px-3 py-1.5">
                      <p className="text-white font-bold text-base">R$ {discount.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Price Summary */}
              <div className="bg-primary/10 rounded-xl p-4 space-y-2 border border-primary/20">
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
                  <span className="font-bold text-xl text-primary">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-lg shadow-accent/30"
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
