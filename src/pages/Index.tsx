import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, ShieldCheck, ShoppingCart, Star, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ColorSelector, { colors } from "@/components/ColorSelector";
import SizeSelector, { SizeSelectorRef } from "@/components/SizeSelector";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import ProductDescription from "@/components/ProductDescription";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { usePresence } from "@/hooks/usePresence";
import { trackPixelEvent } from "@/hooks/usePixels";
import { useUserLocation } from "@/hooks/useUserLocation";
import AIChatBot from "@/components/AIChatBot";

// PIX Icon Component
const PixIcon = () => (
  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className="h-4 w-4 flex-shrink-0">
    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.5 391.5 392.5 391.5H407.7L310.6 488.6C280.3 518.9 231.7 518.9 201.4 488.6L103.3 390.5H112.5C132.5 390.5 151.3 382.7 165.5 368.5L242.4 291.6V292.5zM262.5 218.5C257.1 223.9 247.8 223.9 242.4 218.5L165.5 141.6C151.3 127.4 132.5 119.6 112.5 119.6H103.3L201.4 21.49C231.7-8.83 280.3-8.83 310.6 21.49L407.7 118.6H392.5C372.5 118.6 353.7 126.4 339.5 140.6L262.5 217.6V218.5zM112.5 142.1C126.7 142.1 140.3 147.6 150.5 157.9L227.4 234.8C234.3 241.7 243.1 245.9 252.5 247.1V264C243.1 265.2 234.3 269.4 227.4 276.3L150.5 353.2C140.3 363.5 126.7 369 112.5 369H80.19L21.49 310.3C-8.832 280-8.832 231.4 21.49 201.1L80.19 142.4H112.5V142.1zM431.8 369H399.5C385.3 369 371.7 363.5 361.5 353.2L284.6 276.3C277.7 269.4 268.9 265.2 259.5 264V247.1C268.9 245.9 277.7 241.7 284.6 234.8L361.5 157.9C371.7 147.6 385.3 142.1 399.5 142.1H431.8L490.5 200.8C520.8 231.1 520.8 279.7 490.5 310L431.8 368.7V369z"/>
  </svg>
);

const Index = () => {
  const navigate = useNavigate();
  const { addItem, totalItems, unitPrice, displayOriginalPrice } = useCart();
  const sizeSelectorRef = useRef<SizeSelectorRef>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const userLocation = useUserLocation();

  usePresence("/");
  const [selectedColor, setSelectedColor] = useState<string>("gradient");

  const discountPercent = displayOriginalPrice > 0 
    ? Math.round(((displayOriginalPrice - unitPrice) / displayOriginalPrice) * 100) 
    : 0;

  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_type: 'product',
      content_id: 'carbon-3-0',
      content_name: 'Tênis de Corrida Chunta Carbon 3.0',
      value: unitPrice,
      currency: 'BRL',
    });
  }, [unitPrice]);

  const handleBuyClick = () => {
    if (totalItems > 0) {
      navigate("/checkout");
      return;
    }
    
    if (!selectedSize) {
      sizeSelectorRef.current?.showError();
      return;
    }
    
    trackPixelEvent('AddToCart', {
      content_type: 'product',
      content_id: 'carbon-3-0',
      content_name: 'Tênis de Corrida Chunta Carbon 3.0',
      quantity: 1,
      value: unitPrice,
      currency: 'BRL',
    });
    
    addItem(selectedColor, selectedSize, 1);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Calçados</span>
            <span className="text-border">›</span>
            <span>Tênis de Corrida</span>
            <span className="text-border">›</span>
            <span className="text-foreground font-medium">Carbon 3.0</span>
          </nav>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        {/* Product Gallery Card */}
        <div className="bg-white">
          <div className="px-4 py-4">
            <ProductGallery selectedColor={selectedColor} />
          </div>
        </div>

        {/* Product Info Card */}
        <div className="bg-white mt-2 px-4 py-5">
          {/* Product Title */}
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Tênis de Corrida Chunta Carbon 3.0
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placa de Carbono • Ultra Leve • Profissional • Amortecimento Premium
          </p>

          {/* Rating */}
          <a 
            href="#avaliacoes"
            className="inline-flex items-center gap-2 mt-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">4.5</span>
            <span className="text-sm text-primary underline">(127 avaliações)</span>
          </a>

          {/* Seller */}
          <p className="text-xs text-muted-foreground mt-2">
            Vendido e entregue por <span className="text-primary font-semibold">MAX RUNNER</span>
          </p>

          {/* Price Section */}
          <div className="mt-5 bg-secondary/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground line-through">
                De R$ {displayOriginalPrice.toFixed(2).replace(".", ",")}
              </span>
              <span className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            </div>
            <div className="text-3xl font-black text-primary">
              R$ {unitPrice.toFixed(2).replace(".", ",")}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-success mt-1">
              <PixIcon />
              <span className="font-medium">à vista no PIX</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ou 12x de R$ {(unitPrice / 12).toFixed(2).replace(".", ",")} sem juros
            </p>
          </div>

          {/* Guarantees Row */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mb-1">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight">Compra<br/>Segura</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mb-1">
                <PixIcon />
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight">Pagamento<br/>PIX</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mb-1">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight">Entrega<br/>Garantida</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mb-1">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight">Garantia<br/>12 meses</span>
            </div>
          </div>

          {/* Color Selector */}
          <div className="mt-6">
            <ColorSelector 
              selectedColor={selectedColor} 
              onColorSelect={setSelectedColor} 
            />
          </div>

          {/* Size Selector */}
          <div className="mt-5">
            <SizeSelector 
              ref={sizeSelectorRef} 
              selectedSize={selectedSize} 
              onSizeSelect={setSelectedSize} 
            />
          </div>

          {/* Scarcity Banner */}
          <div className="mt-5">
            <ScarcityBanner />
          </div>

          {/* CTA Button */}
          <div className="mt-5">
            <Button
              onClick={handleBuyClick}
              size="lg"
              className={`w-full h-14 font-bold text-base rounded-xl transition-all ${
                (selectedSize || totalItems > 0)
                  ? 'gradient-cta text-white glow-cta hover:opacity-90' 
                  : 'bg-muted text-muted-foreground cursor-default hover:bg-muted'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {totalItems > 0 ? 'Finalizar compra' : 'Comprar agora'}
            </Button>

            {!selectedSize && totalItems === 0 && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Selecione cor e tamanho para continuar
              </p>
            )}
          </div>

          {/* Quick Benefits */}
          <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" />
              Compra Segura
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" />
              Pagamento PIX
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" />
              Entrega Garantida
            </span>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white mt-2 px-4 py-6">
          <ProductDescription />
        </div>

        {/* Features/Benefits */}
        <div className="bg-white mt-2 px-4 py-6">
          <Benefits />
        </div>

        {/* Guarantees */}
        <div className="bg-white mt-2 px-4 py-6">
          <Guarantees />
        </div>

        {/* Reviews */}
        <div className="bg-white mt-2 px-4 py-6">
          <Reviews />
        </div>
      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
};

export default Index;
