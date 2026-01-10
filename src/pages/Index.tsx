import { useState } from "react";
import { ShoppingBag, Truck, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import SizeSelector from "@/components/SizeSelector";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import FixedCTA from "@/components/FixedCTA";

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";

const Index = () => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

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

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Product Section */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery />

          {/* Product Info */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Tênis Max Runner Premium
              </h1>
              <p className="text-muted-foreground mt-1">
                Tênis de Corrida com Tecnologia de Amortecimento Avançada
              </p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground line-through text-lg">
                  R$ 239,80
                </span>
                <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
                  -76%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">R$ 57,90</span>
                <span className="text-sm text-muted-foreground">à vista no PIX</span>
              </div>
              <p className="text-sm text-muted-foreground">
                ou em até <span className="font-semibold text-foreground">12x de R$ 5,79</span> sem juros
              </p>
            </div>

            {/* Size Selector */}
            <div id="size-selector">
              <SizeSelector selectedSize={selectedSize} onSizeSelect={setSelectedSize} />
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleBuyClick}
              size="lg"
              className="w-full h-14 gradient-cta glow-cta hover:opacity-95 text-white font-bold text-base gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {selectedSize ? "COMPRAR AGORA" : "SELECIONE O TAMANHO"}
            </Button>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-lg border border-border p-3">
                <Truck className="h-5 w-5 mx-auto text-success mb-1" />
                <p className="text-xs font-medium text-foreground">Frete Grátis</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-3">
                <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xs font-medium text-foreground">Garantia 90 dias</p>
              </div>
              <div className="bg-white rounded-lg border border-border p-3">
                <CreditCard className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xs font-medium text-foreground">12x sem juros</p>
              </div>
            </div>

            {/* Scarcity */}
            <ScarcityBanner />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Guarantees */}
        <Guarantees />

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Benefits */}
        <Benefits />

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Reviews */}
        <Reviews />

        {/* Final CTA */}
        <section className="text-center py-10">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Garanta já o seu Max Runner!
          </h2>
          <p className="text-muted-foreground mb-4">
            Aproveite a promoção enquanto durarem os estoques
          </p>
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="gradient-cta glow-cta hover:opacity-95 text-white font-bold text-base px-10 h-14 gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            {selectedSize ? "COMPRAR AGORA" : "SELECIONE O TAMANHO"}
          </Button>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border">
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
