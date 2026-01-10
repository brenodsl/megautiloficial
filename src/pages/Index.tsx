import { useState, useEffect } from "react";
import { ShoppingBag, Truck, Shield, CreditCard, CheckCircle, Award, X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import ProductGallery from "@/components/ProductGallery";
import ColorSelector from "@/components/ColorSelector";
import SizeSelector from "@/components/SizeSelector";
import ShippingCalculator from "@/components/ShippingCalculator";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import ProductDescription from "@/components/ProductDescription";
import Footer from "@/components/Footer";
import FixedCTA from "@/components/FixedCTA";

const CHECKOUT_URL = "https://pay.maxrunnerpay.shop/69618e8fc4b1fc0d57ae958d";
const PROMO_CHECKOUT_URL = "https://pay.maxrunnerpay.shop/6961c264c4b1fc0d57af6648";

const Index = () => {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("gradient");
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    // Check if user is coming back from checkout (backredirect)
    const urlParams = new URLSearchParams(window.location.search);
    const isBackRedirect = urlParams.get('backredirect') === 'true' || 
                           document.referrer.includes('maxrunnerpay.shop') ||
                           document.referrer.includes('pay.');
    
    // Also check sessionStorage to not show popup multiple times
    const hasSeenPromo = sessionStorage.getItem('hasSeenBackPromo');
    
    if (isBackRedirect && !hasSeenPromo) {
      // Small delay for better UX
      setTimeout(() => {
        setShowPromoPopup(true);
        sessionStorage.setItem('hasSeenBackPromo', 'true');
      }, 500);
    }
  }, []);

  const handleBuyClick = () => {
    window.open(CHECKOUT_URL, "_blank");
  };

  const handlePromoClick = () => {
    window.open(PROMO_CHECKOUT_URL, "_blank");
    setShowPromoPopup(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />
      <Breadcrumb />

      {/* 1º Lugar Badge */}
      <div className="bg-warning/10 border-b border-warning/20">
        <div className="max-w-lg mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-warning">
            <Award className="h-4 w-4" />
            <span>1º Lugar em Tênis de Corrida</span>
          </div>
        </div>
      </div>

      {/* Product Title */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-lg font-bold text-foreground leading-tight">
          Tênis de Corrida Chunta Carbon 3.0 - Placa de Carbono Ultra Leve
        </h1>
      </div>

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
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              <Truck className="h-4 w-4" />
              <span>FRETE GRÁTIS para todo o Brasil</span>
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

          {/* Shipping Calculator */}
          <ShippingCalculator />

          {/* CTA Button */}
          <Button
            onClick={handleBuyClick}
            size="lg"
            className="w-full h-14 bg-black hover:bg-black/90 text-white font-bold text-base gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            COMPRAR AGORA
          </Button>

          {/* Scarcity */}
          <ScarcityBanner />
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6" />

        {/* Product Description */}
        <ProductDescription />

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
            className="w-full bg-black hover:bg-black/90 text-white font-bold text-base h-14 gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            COMPRAR AGORA
          </Button>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed CTA Mobile */}
      <FixedCTA selectedSize={selectedSize} />

      {/* Promo Popup for Back Redirect */}
      <Dialog open={showPromoPopup} onOpenChange={setShowPromoPopup}>
        <DialogContent className="sm:max-w-md border-2 border-destructive/50 bg-gradient-to-b from-background to-destructive/5">
          <DialogHeader>
            <div className="flex items-center justify-center gap-2 text-destructive mb-2">
              <Gift className="h-6 w-6 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Oferta Exclusiva</span>
            </div>
            <DialogTitle className="text-center text-xl font-bold">
              🎁 ESPERA! Temos uma oferta imperdível para você!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-3">
                Sabemos que você estava interessado no nosso tênis. Que tal um desconto especial?
              </p>
              
              <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4">
                <p className="text-xs text-muted-foreground line-through mb-1">
                  De R$ 78,90
                </p>
                <p className="text-3xl font-bold text-success">
                  R$ 47,20
                </p>
                <p className="text-xs text-success font-medium mt-1">
                  Economia de R$ 31,70!
                </p>
              </div>
              
              <p className="text-xs text-destructive font-semibold animate-pulse">
                ⏰ Oferta válida apenas agora!
              </p>
            </div>
            
            <Button
              onClick={handlePromoClick}
              size="lg"
              className="w-full h-14 bg-success hover:bg-success/90 text-white font-bold text-base gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              QUERO ESSA OFERTA!
            </Button>
            
            <button
              onClick={() => setShowPromoPopup(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Não, obrigado. Prefiro pagar mais caro.
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
