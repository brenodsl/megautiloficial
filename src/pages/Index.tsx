import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, Shield, CreditCard, CheckCircle, Award, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { toast } from "sonner";
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
import { useCart } from "@/contexts/CartContext";

const PROMO_CHECKOUT_URL = "https://pay.maxrunnerpay.shop/6961c264c4b1fc0d57af6648";

// PIX Icon Component
const PixIcon = () => (
  <svg viewBox="0 0 512 512" className="h-4 w-4" fill="currentColor">
    <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.191 33.046 22 53.12 22h15.098l-97.138 97.139c-30.326 30.327-79.505 30.327-109.831 0L103.472 391.19zm0-270.38c20.056 0 38.928 7.808 53.12 22l76.693 76.692c5.551 5.57 14.6 5.57 20.15 0l76.989-76.989c14.191-14.191 33.046-22 53.12-22h15.098L310.412 23.384c-30.326-30.327-79.505-30.327-109.831 0l-97.138 97.138zm280.068 180.761l45.882-45.882c30.327-30.327 30.327-79.505 0-109.831l-45.882-45.882c-14.191 14.191-33.046 22-53.12 22h-15.098c-20.056 0-38.928-7.808-53.12-22L193.313 177.97c-5.385 5.404-14.765 5.384-20.15 0l-76.989-76.989c-14.191-14.191-33.046-22-53.12-22H26.356l45.882 45.882c30.327 30.327 30.327 79.505 0 109.831l-45.882 45.882c14.191-14.191 33.046-22 53.12-22h15.098c20.056 0 38.928 7.808 53.12 22l77.989 77.989c5.551 5.57 14.6 5.57 20.15 0l76.989-76.989c14.191-14.191 33.046-22 53.12-22h15.098c20.074 0 38.928-7.808 53.12-22z"/>
  </svg>
);

const Index = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
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
    if (!selectedColor) {
      toast.error("Selecione uma cor antes de continuar", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      document.getElementById("produto")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!selectedSize) {
      toast.error("Selecione um tamanho antes de continuar", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    addItem(selectedColor, selectedSize);
    navigate("/checkout");
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
            <p className="text-sm text-success font-medium flex items-center gap-1.5">
              <PixIcon />
              À vista no PIX
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
            className="w-full h-14 font-bold text-base gap-2 bg-black hover:bg-black/90 text-white"
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
            className="w-full h-14 font-bold text-base gap-2 bg-black hover:bg-black/90 text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            COMPRAR AGORA
          </Button>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed CTA Mobile */}
      <FixedCTA selectedSize={selectedSize} selectedColor={selectedColor} />

      {/* Promo Popup for Back Redirect */}
      <Dialog open={showPromoPopup} onOpenChange={setShowPromoPopup}>
        <DialogContent className="sm:max-w-[320px] p-0 rounded-2xl border border-border bg-background overflow-hidden">
          {/* Product Image */}
          <div className="bg-muted/30 p-4">
            <div className="relative mx-auto w-36 h-24">
              <img 
                src={tenisMain} 
                alt="Tênis de Corrida Max Runner" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="px-5 pb-5 pt-3 space-y-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Oferta exclusiva</p>
              <h3 className="text-base font-bold text-foreground mb-3">
                Última chance! Desconto especial
              </h3>
              
              {/* Price */}
              <div className="mb-3">
                <span className="text-sm text-muted-foreground line-through mr-2">
                  R$ 78,90
                </span>
                <span className="text-2xl font-bold text-success">
                  R$ 47,20
                </span>
              </div>
            </div>
            
            <Button
              onClick={handlePromoClick}
              className="w-full h-11 bg-black hover:bg-black/90 text-white font-semibold text-sm rounded-lg"
            >
              Quero essa oferta
            </Button>
            
            <button
              onClick={() => setShowPromoPopup(false)}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Não, obrigado
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
