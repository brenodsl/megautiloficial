import { useState, useEffect } from "react";
import { ShoppingBag, Truck, Shield, CreditCard, CheckCircle, Award, X, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import tenisMain from "@/assets/tenis-main.webp";
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
        <DialogContent className="sm:max-w-[380px] p-0 rounded-3xl border-0 overflow-hidden shadow-2xl">
          {/* Close button */}
          <button
            onClick={() => setShowPromoPopup(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-6 py-4 text-center">
            <div className="flex items-center justify-center gap-2 text-white mb-1">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Oferta Exclusiva</span>
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-white text-lg font-bold">
              🎁 ESPERA! Última chance!
            </h2>
          </div>
          
          {/* Product Image */}
          <div className="bg-gradient-to-b from-gray-100 to-white px-6 py-4">
            <div className="relative mx-auto w-48 h-32">
              <img 
                src={tenisMain} 
                alt="Tênis de Corrida Max Runner" 
                className="w-full h-full object-contain drop-shadow-xl"
              />
              {/* Discount badge */}
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                -40%
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 pb-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Temos um desconto especial só pra você! 🔥
              </p>
              
              {/* Price box */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                <p className="text-sm text-muted-foreground line-through mb-1">
                  De R$ 78,90
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-black text-green-600">
                    R$ 47,20
                  </span>
                </div>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  Você economiza R$ 31,70! 💰
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-orange-500 text-sm font-semibold">
                <span className="animate-pulse">⏰</span>
                <span>Oferta válida apenas agora!</span>
              </div>
            </div>
            
            <Button
              onClick={handlePromoClick}
              size="lg"
              className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base gap-2 rounded-xl shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02]"
            >
              <ShoppingBag className="h-5 w-5" />
              QUERO ESSA OFERTA!
            </Button>
            
            <button
              onClick={() => setShowPromoPopup(false)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
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
