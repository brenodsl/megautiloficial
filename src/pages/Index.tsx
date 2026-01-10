import { useState } from "react";
import { ShoppingBag, Truck, Shield, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ColorSelector from "@/components/ColorSelector";
import SizeSelector from "@/components/SizeSelector";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import FixedCTA from "@/components/FixedCTA";

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";

const Index = () => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("gradient");

  const handleBuyClick = () => {
    if (!selectedSize) {
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.open(CHECKOUT_URL, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Product Gallery */}
        <ProductGallery selectedColor={selectedColor} />

        {/* Product Info */}
        <div className="space-y-4 mt-4">
          {/* Color Selector */}
          <ColorSelector 
            selectedColor={selectedColor} 
            onColorSelect={setSelectedColor} 
          />

          {/* Size Selector */}
          <div id="size-selector">
            <SizeSelector selectedSize={selectedSize} onSizeSelect={setSelectedSize} />
          </div>

          {/* Super Desconto Badge */}
          <div className="inline-flex items-center gap-2 bg-success text-white text-xs font-bold px-3 py-1.5 rounded">
            🔥 SUPER DESCONTO
          </div>

          {/* Price Card */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground line-through text-base">
                R$ 239,80
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-success">R$ 78,90</span>
            </div>
            <p className="text-sm text-success font-medium">
              em 3x R$ 26,30 sem juros
            </p>
          </div>

          {/* Quick Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Frete grátis para todo o Brasil</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Garantia de 90 dias</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Parcele em até 3x sem juros</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Estoque disponível</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="w-full h-14 gradient-cta glow-cta hover:opacity-95 text-white font-bold text-base gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            COMPRAR AGORA
          </Button>

          {/* Scarcity */}
          <ScarcityBanner />
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Guarantees */}
        <Guarantees />

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Benefits */}
        <Benefits />

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Reviews */}
        <Reviews />

        {/* Final CTA */}
        <section className="text-center py-8">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Garanta já o seu Max Runner!
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Aproveite a promoção enquanto durarem os estoques
          </p>
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="w-full gradient-cta glow-cta hover:opacity-95 text-white font-bold text-base h-14 gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            COMPRAR AGORA
          </Button>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-6 border-t border-border">
          <p>© 2024 Max Runner. Todos os direitos reservados.</p>
          <p className="mt-1">contato@maxrunner.com.br</p>
        </footer>
      </main>

      {/* Fixed CTA Mobile */}
      <FixedCTA selectedSize={selectedSize} />
    </div>
  );
};

export default Index;
