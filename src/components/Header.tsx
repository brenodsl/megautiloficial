import { useState } from "react";
import { Menu, ShoppingCart, Star, Search, X, Home, Package, MessageSquare, Shield, FileText, Truck, RefreshCw, ArrowLeftRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo-max-runner.png";
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

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Top Promo Bar - Premium gradient */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-2">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-medium text-white flex items-center justify-center gap-2 tracking-wide">
              ✨ OFERTA EXCLUSIVA • 67% OFF + FRETE GRÁTIS
            </p>
          </div>
        </div>

        {/* Main Header - Light/Premium */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            {/* Search Bar - Expanded */}
            {showSearch ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 h-10 focus:ring-emerald-500 focus:border-emerald-500"
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-gray-100"
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
                    <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 bg-white p-0 border-0">
                    <div className="flex flex-col h-full">
                      {/* Menu Header */}
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <span className="text-lg font-semibold text-gray-900">
                          Max Runner
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>4.9 (578 avaliações)</span>
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <nav className="flex-1 p-2 overflow-y-auto">
                        {/* Main Navigation */}
                        <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Navegação
                        </p>
                        <ul className="space-y-1 mb-4">
                          {menuItems.map((item) => (
                            <li key={item.label}>
                              {item.isRoute ? (
                                <Link
                                  to={item.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                  <item.icon className="h-4 w-4 text-gray-400" />
                                  {item.label}
                                </Link>
                              ) : (
                                <a
                                  href={item.href}
                                  onClick={() => setIsOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                  <item.icon className="h-4 w-4 text-gray-400" />
                                  {item.label}
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>

                        {/* Policy Links */}
                        <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Institucional
                        </p>
                        <ul className="space-y-1">
                          {policyItems.map((item) => (
                            <li key={item.label}>
                              <Link
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium text-sm"
                              >
                                <item.icon className="h-4 w-4 text-gray-400" />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>

                      {/* Menu Footer */}
                      <div className="p-4 border-t border-gray-100">
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            navigate("/");
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 rounded-xl"
                        >
                          Ver Produto
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Logo - Centered */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <Link to="/">
                    <img
                      src={logo}
                      alt="Max Runner"
                      className="h-9 w-auto object-contain"
                    />
                  </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1">
                  {/* Search Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-gray-100"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="h-5 w-5" />
                  </Button>

                  {/* Cart Button - Opens drawer */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-gray-100 relative"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
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

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;