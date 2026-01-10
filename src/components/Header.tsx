import { useState } from "react";
import { Menu, ShoppingCart, Star, Search, X, Home, Package, MessageSquare, Shield, FileText, Truck, RefreshCw, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";

const menuItems = [
  { label: "Início", href: "/", icon: Home, isRoute: true },
  { label: "Produto", href: "#produto", icon: Package, isRoute: false },
  { label: "Avaliações", href: "#avaliacoes", icon: MessageSquare, isRoute: false },
  { label: "Garantias", href: "#garantias", icon: Shield, isRoute: false },
];

const policyItems = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade", icon: FileText },
  { label: "Termos de Uso", href: "/termos-de-uso", icon: FileText },
  { label: "Política de Envio", href: "/politica-de-envio", icon: Truck },
  { label: "Política de Reembolso", href: "/politica-de-reembolso", icon: RefreshCw },
  { label: "Trocas e Devoluções", href: "/trocas-e-devolucoes", icon: ArrowLeftRight },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
          {/* Search Bar - Expanded */}
          {showSearch ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-0 h-10"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
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
                    <div className="p-4 border-b border-border bg-muted/50">
                      <span className="text-lg font-bold text-foreground">
                        Max Runner
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span>4.9 (578 avaliações)</span>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <nav className="flex-1 p-2 overflow-y-auto">
                      {/* Main Navigation */}
                      <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Navegação
                      </p>
                      <ul className="space-y-1 mb-4">
                        {menuItems.map((item) => (
                          <li key={item.label}>
                            {item.isRoute ? (
                              <Link
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                              >
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                {item.label}
                              </Link>
                            ) : (
                              <a
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                              >
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                {item.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>

                      {/* Policy Links */}
                      <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Institucional
                      </p>
                      <ul className="space-y-1">
                        {policyItems.map((item) => (
                          <li key={item.label}>
                            <Link
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium text-sm"
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    {/* Menu Footer */}
                    <div className="p-4 border-t border-border">
                      <Button
                        onClick={() => window.open(CHECKOUT_URL, "_blank")}
                        className="w-full bg-black hover:bg-black/90 text-white font-bold h-12"
                      >
                        Comprar Agora
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo - Centered without circle */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <Link to="/">
                  <img
                    src={logo}
                    alt="Max Runner"
                    className="h-10 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1">
                {/* Search Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>

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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
