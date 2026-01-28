import { useState, useEffect } from "react";
import { Menu, ShoppingCart, Search, X, Home, Package, MessageSquare, Shield, FileText, Truck, RefreshCw, ArrowLeftRight, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

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
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  
  // Timer state - countdown to 23:59 of current day
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Top Promo Bar - Orange with Timer */}
        <div className="bg-accent py-2.5 px-4">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-white">
              <Zap className="h-4 w-4 fill-current" />
              <span className="text-xs sm:text-sm font-bold">Oferta Relâmpago</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-white/20 backdrop-blur text-white font-bold text-xs sm:text-sm px-2 py-1 rounded-md min-w-[32px] text-center">
                {formatTime(timeLeft.hours)}
              </span>
              <span className="text-white font-bold">:</span>
              <span className="bg-white/20 backdrop-blur text-white font-bold text-xs sm:text-sm px-2 py-1 rounded-md min-w-[32px] text-center">
                {formatTime(timeLeft.minutes)}
              </span>
              <span className="text-white font-bold">:</span>
              <span className="bg-white/20 backdrop-blur text-white font-bold text-xs sm:text-sm px-2 py-1 rounded-md min-w-[32px] text-center">
                {formatTime(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Header - Dark Blue */}
        <div className="bg-primary">
          <div className="container mx-auto px-4 py-3">
            {/* Search Bar - Expanded */}
            {showSearch ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex">
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border-0 h-10 rounded-l-lg rounded-r-none flex-1"
                    autoFocus
                  />
                  <Button className="bg-accent hover:bg-accent/90 h-10 rounded-l-none rounded-r-lg px-4">
                    <Search className="h-5 w-5 text-white" />
                  </Button>
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
              <div className="flex items-center justify-between gap-3">
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
                      <div className="p-4 border-b border-border bg-primary flex items-center">
                        <img src="/logo-megautil.png" alt="MegaUtil" className="h-8 w-auto" />
                      </div>
                      
                      {/* Menu Items */}
                      <nav className="flex-1 p-2 overflow-y-auto">
                        <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Navegação
                        </p>
                        <ul className="space-y-1 mb-4">
                          {menuItems.map((item) => (
                            <li key={item.label}>
                              {item.isRoute ? (
                                <Link
                                  to={item.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
                                >
                                  <item.icon className="h-4 w-4 text-primary" />
                                  {item.label}
                                </Link>
                              ) : (
                                <a
                                  href={item.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
                                >
                                  <item.icon className="h-4 w-4 text-primary" />
                                  {item.label}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>

                        <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Institucional
                        </p>
                        <ul className="space-y-1">
                          {policyItems.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary transition-colors font-medium text-sm"
                              >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      <div className="p-4 border-t border-border">
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            navigate("/");
                          }}
                          className="w-full gradient-cta text-white font-bold h-12 rounded-xl"
                        >
                          Ver Produto
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                  <img src="/logo-megautil.png" alt="MegaUtil" className="h-8 w-auto" />
                </Link>

                {/* Search Bar - Desktop */}
                <div className="hidden sm:flex flex-1 max-w-md mx-4">
                  <div className="flex w-full">
                    <Input
                      type="text"
                      placeholder="Busque aqui..."
                      className="bg-white border-0 h-10 rounded-l-lg rounded-r-none"
                    />
                    <Button className="bg-accent hover:bg-accent/90 h-10 rounded-l-none rounded-r-lg px-4">
                      <Search className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                  {/* Search Button - Mobile */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="sm:hidden text-white hover:bg-white/10"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  {/* Cart Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 relative"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold border-2 border-primary">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;
