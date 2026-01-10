import logo from "@/assets/logo.jpg";
import { ShieldCheck, Truck } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
      {/* Top Bar */}
      <div className="gradient-primary py-2">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs sm:text-sm font-medium text-primary-foreground">
            🔥 PROMOÇÃO ESPECIAL: 76% OFF + FRETE GRÁTIS • Até durar o estoque!
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Max Runner"
              className="h-10 w-10 rounded-full object-cover border-2 border-primary"
            />
            <span className="text-xl font-bold text-foreground">
              Max<span className="text-gradient">Runner</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>Compra Segura</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-success" />
              <span>Frete Grátis</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
