import { useState } from "react";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import SizeSelector from "@/components/SizeSelector";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import FAQ from "@/components/FAQ";
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

      <main className="container mx-auto px-4 py-6 space-y-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-success/20 text-success">
                FRETE GRÁTIS
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-destructive/20 text-destructive animate-pulse">
                ÚLTIMAS UNIDADES
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">
                MAIS VENDIDO
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Tênis Max Runner Premium
              </h1>
              <p className="text-muted-foreground">
                O tênis perfeito para corrida, academia e dia a dia. Ultra confortável com tecnologia de amortecimento avançada.
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9</span>
              <span className="text-muted-foreground">(2.847 avaliações)</span>
              <span className="text-success text-sm">• +2.500 vendidos</span>
            </div>

            {/* Price */}
            <div className="p-4 rounded-xl gradient-card border border-border space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-lg text-muted-foreground line-through">
                  R$ 239,80
                </span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
                  -76%
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gradient">R$ 57,90</span>
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

            {/* CTA Button (Desktop) */}
            <Button
              onClick={handleBuyClick}
              size="lg"
              className="hidden lg:flex w-full h-14 gradient-cta hover:opacity-90 glow-primary text-primary-foreground font-bold text-lg gap-3"
            >
              <ShoppingBag className="h-6 w-6" />
              {selectedSize ? "COMPRAR AGORA" : "SELECIONE O TAMANHO"}
              <ArrowRight className="h-5 w-5" />
            </Button>

            {/* Scarcity */}
            <ScarcityBanner />
          </div>
        </section>

        {/* Guarantees */}
        <Guarantees />

        {/* Benefits */}
        <Benefits />

        {/* Reviews */}
        <Reviews />

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <section className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-bold text-foreground">
            Garanta já o seu <span className="text-gradient">Max Runner</span>!
          </h2>
          <p className="text-muted-foreground">
            Aproveite a promoção enquanto durarem os estoques
          </p>
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="gradient-cta hover:opacity-90 glow-primary text-primary-foreground font-bold text-lg px-12 h-14 gap-3"
          >
            <ShoppingBag className="h-6 w-6" />
            {selectedSize ? "COMPRAR AGORA" : "SELECIONE O TAMANHO"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8 border-t border-border">
          <p>© 2024 Max Runner. Todos os direitos reservados.</p>
          <p className="mt-2">
            Atendimento: contato@maxrunner.com.br
          </p>
        </footer>
      </main>

      {/* Fixed CTA Mobile */}
      <FixedCTA selectedSize={selectedSize} />
    </div>
  );
};

export default Index;
