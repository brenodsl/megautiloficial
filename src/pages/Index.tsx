import { useState, useEffect, useRef } from "react";
import { Truck, Zap, Circle, CircleCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import tenisMain from "@/assets/tenis-main.webp";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import { colors } from "@/components/ColorSelector";
import SizeSelector, { SizeSelectorRef } from "@/components/SizeSelector";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import ProductDescription from "@/components/ProductDescription";
import Footer from "@/components/Footer";

// PIX Icon Component (diamond shape like in reference)
const PixIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2L2 12l10 10 10-10L12 2zm0 2.83L19.17 12 12 19.17 4.83 12 12 4.83z"/>
    <path d="M12 7l-5 5 5 5 5-5-5-5z"/>
  </svg>
);

const PROMO_CHECKOUT_URL = "https://pay.maxrunnerpay.shop/6961c264c4b1fc0d57af6648";

// Checkout URLs per color
const CHECKOUT_URLS: Record<string, string> = {
  "cream-orange": "https://pay.maxrunnerpay.shop/69632af261f923383de76bb1",
  "gradient": "https://pay.maxrunnerpay.shop/69632b2319454c0cfe8e2e4d",
  "green": "https://pay.maxrunnerpay.shop/69632b3661f923383de76c9c",
  "lime": "https://pay.maxrunnerpay.shop/69632b4819454c0cfe8e2ec0",
  "orange": "https://pay.maxrunnerpay.shop/69632b5719454c0cfe8e2f01",
  "pink": "https://pay.maxrunnerpay.shop/69632b6561f923383de76d60",
  "sunset": "https://pay.maxrunnerpay.shop/69632b7519454c0cfe8e2f83",
};

const Index = () => {
  const sizeSelectorRef = useRef<SizeSelectorRef>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("gradient");
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isBackRedirect = urlParams.get('backredirect') === 'true' || 
                           document.referrer.includes('maxrunnerpay.shop') ||
                           document.referrer.includes('pay.');
    
    const hasSeenPromo = sessionStorage.getItem('hasSeenBackPromo');
    
    if (isBackRedirect && !hasSeenPromo) {
      setTimeout(() => {
        setShowPromoPopup(true);
        sessionStorage.setItem('hasSeenBackPromo', 'true');
      }, 500);
    }
  }, []);

  const handleBuyClick = () => {
    if (!selectedSize) {
      sizeSelectorRef.current?.showError();
      return;
    }
    const checkoutUrl = CHECKOUT_URLS[selectedColor];
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  const handlePromoClick = () => {
    window.open(PROMO_CHECKOUT_URL, "_blank");
    setShowPromoPopup(false);
  };

  const selectedColorData = colors.find(c => c.id === selectedColor);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-2">
          <nav className="flex items-center gap-1 text-xs text-gray-500">
            <span>Calçados</span>
            <span>›</span>
            <span>Tênis de Corrida</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">Carbon 3.0</span>
          </nav>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            🔥 SUPER DESCONTO
          </span>
          <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded">
            🔥 OFERTA IMPERDÍVEL
          </span>
        </div>

        {/* 1º Lugar Badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
          <Award className="h-4 w-4 text-yellow-500" />
          <span>1º Lugar em Tênis de Corrida</span>
        </div>

        {/* Product Title */}
        <h1 className="text-lg font-bold text-gray-900 leading-tight mb-2">
          Tênis de Corrida Chunta Carbon 3.0 - Placa de Carbono Ultra Leve
        </h1>

        {/* Product Gallery */}
        <ProductGallery selectedColor={selectedColor} />

        {/* Scarcity Banner */}
        <div className="mt-4">
          <ScarcityBanner />
        </div>

        {/* Model Selector (Color Dropdown) */}
        <div className="mt-4 space-y-2">
          <label className="text-sm text-gray-600">Modelo</label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-full h-12 bg-white border border-gray-300">
              <div className="flex items-center gap-3">
                {selectedColorData && (
                  <img 
                    src={selectedColorData.image} 
                    alt={selectedColorData.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <span className="text-gray-900">{selectedColorData?.name}</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={color.image} 
                      alt={color.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                    <span>{color.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Selector */}
        <div className="mt-4">
          <SizeSelector 
            ref={sizeSelectorRef} 
            selectedSize={selectedSize} 
            onSizeSelect={setSelectedSize} 
          />
        </div>

        {/* Price Section */}
        <div className="mt-6 space-y-1">
          <div className="text-sm text-gray-400 line-through">R$ 239,80</div>
          <div className="text-3xl font-bold text-green-600">R$ 77,80</div>
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <PixIcon />
            <span>À vista no PIX</span>
          </div>
        </div>

        {/* Benefits List */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Truck className="h-4 w-4 text-gray-400" />
            <span>Frete grátis para todo o Brasil</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 rounded-md px-3 py-1.5">
            <Zap className="h-4 w-4" />
            <span>Envios para Capitais em até 2 dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Circle className="h-4 w-4 text-gray-400" />
            <span>Garantia de 90 dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CircleCheck className="h-4 w-4 text-gray-400" />
            <span>Estoque disponível</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleBuyClick}
          size="lg"
          className={`w-full h-14 mt-6 font-medium text-base rounded-full transition-colors ${
            selectedSize 
              ? 'bg-gray-900 hover:bg-gray-800 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-default hover:bg-gray-200'
          }`}
        >
          Comprar agora
        </Button>

        {/* Size warning text */}
        {!selectedSize && (
          <p className="text-center text-sm text-green-600 mt-2">
            Selecione um tamanho para continuar
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Product Description */}
        <ProductDescription />

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Guarantees */}
        <Guarantees />

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Benefits */}
        <Benefits />

        {/* Divider */}
        <div className="border-t border-gray-200 my-8" />

        {/* Reviews */}
        <Reviews />
      </main>

      {/* Footer */}
      <Footer />


      {/* Promo Popup for Back Redirect */}
      <Dialog open={showPromoPopup} onOpenChange={setShowPromoPopup}>
        <DialogContent className="sm:max-w-[320px] p-0 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-gray-100 p-4">
            <div className="relative mx-auto w-36 h-24">
              <img 
                src={tenisMain} 
                alt="Tênis de Corrida Max Runner" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="px-5 pb-5 pt-3 space-y-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Oferta exclusiva</p>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Última chance! Desconto especial
              </h3>
              
              <div className="mb-3">
                <span className="text-sm text-gray-400 line-through mr-2">
                  R$ 78,90
                </span>
                <span className="text-2xl font-bold text-green-600">
                  R$ 47,20
                </span>
              </div>
            </div>
            
            <Button
              onClick={handlePromoClick}
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-lg"
            >
              Quero essa oferta
            </Button>
            
            <button
              onClick={() => setShowPromoPopup(false)}
              className="w-full text-xs text-gray-500 hover:text-gray-700 transition-colors"
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