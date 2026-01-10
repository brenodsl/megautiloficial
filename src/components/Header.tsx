import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
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
      {/* Top Bar */}
      <div className="gradient-cta py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs sm:text-sm font-medium text-white">
            🔥 PROMOÇÃO ESPECIAL: 76% OFF + FRETE GRÁTIS • Até durar o estoque!
          </p>
        </div>
      </div>

      {/* Main Header - Dark */}
      <div className="header-dark border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-card p-0">
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={logo}
                        alt="Max Runner"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-lg font-bold text-foreground">
                        MaxRunner
                      </span>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <nav className="flex-1 p-4">
                    <ul className="space-y-2">
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
                      className="w-full gradient-cta text-white font-semibold"
                    >
                      Comprar Agora
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo - Centered */}
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Max Runner"
                className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
              />
              <span className="text-xl font-bold text-white">
                Max<span className="text-orange-400">Runner</span>
              </span>
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 relative"
              onClick={() => window.open(CHECKOUT_URL, "_blank")}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
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
