import { useState } from "react";
import { Menu, ShoppingCart, Star } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";

const menuItems = [
  { label: "Início", href: "#" },
  { label: "Produto", href: "#produto" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Garantias", href: "#garantias" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      {/* Top Promo Bar */}
      <div className="bg-success py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold text-white flex items-center justify-center gap-2">
            🔥 SUPER DESCONTO • 67% OFF + FRETE GRÁTIS
          </p>
        </div>
      </div>

      {/* Main Header - Black */}
      <div className="bg-black">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-white p-0 border-0">
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3 bg-muted/50">
                    <img
                      src={logo}
                      alt="Max Runner"
                      className="h-10 w-auto object-contain"
                    />
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        Max Runner
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>4.9 (578 avaliações)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <nav className="flex-1 p-2">
                    <ul className="space-y-1">
                      {menuItems.map((item) => (
                        <li key={item.label}>
                          <a
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                          >
                            {item.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Menu Footer */}
                  <div className="p-4 border-t border-border">
                    <Button
                      onClick={() => window.open(CHECKOUT_URL, "_blank")}
                      className="w-full gradient-cta text-white font-bold h-12"
                    >
                      Comprar Agora
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo - Centered without circle */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <img
                src={logo}
                alt="Max Runner"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative"
              onClick={() => window.open(CHECKOUT_URL, "_blank")}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-success text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
