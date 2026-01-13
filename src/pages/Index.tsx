import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Zap, Shield, CircleCheckBig, Award, ShieldCheck, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import AIChatBot from "@/components/AIChatBot";

// PIX Icon Component
const PixIcon = () => (
  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className="h-4 w-4 flex-shrink-0">
    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.5 391.5 392.5 391.5H407.7L310.6 488.6C280.3 518.9 231.7 518.9 201.4 488.6L103.3 390.5H112.5C132.5 390.5 151.3 382.7 165.5 368.5L242.4 291.6V292.5zM262.5 218.5C257.1 223.9 247.8 223.9 242.4 218.5L165.5 141.6C151.3 127.4 132.5 119.6 112.5 119.6H103.3L201.4 21.49C231.7-8.83 280.3-8.83 310.6 21.49L407.7 118.6H392.5C372.5 118.6 353.7 126.4 339.5 140.6L262.5 217.6V218.5zM112.5 142.1C126.7 142.1 140.3 147.6 150.5 157.9L227.4 234.8C234.3 241.7 243.1 245.9 252.5 247.1V264C243.1 265.2 234.3 269.4 227.4 276.3L150.5 353.2C140.3 363.5 126.7 369 112.5 369H80.19L21.49 310.3C-8.832 280-8.832 231.4 21.49 201.1L80.19 142.4H112.5V142.1zM431.8 369H399.5C385.3 369 371.7 363.5 361.5 353.2L284.6 276.3C277.7 269.4 268.9 265.2 259.5 264V247.1C268.9 245.9 277.7 241.7 284.6 234.8L361.5 157.9C371.7 147.6 385.3 142.1 399.5 142.1H431.8L490.5 200.8C520.8 231.1 520.8 279.7 490.5 310L431.8 368.7V369z"/>
  </svg>
);

const Index = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const sizeSelectorRef = useRef<SizeSelectorRef>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  // Track presence on this page
  usePresence("/");
  const [selectedColor, setSelectedColor] = useState<string>("gradient");

  // Track ViewContent event for all pixels
  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_type: 'product',
      content_id: 'carbon-3-0',
      content_name: 'Tênis de Corrida Chunta Carbon 3.0',
      value: 77.80,
      currency: 'BRL',
    });
  }, []);

  const handleBuyClick = () => {
    if (!selectedSize) {
      sizeSelectorRef.current?.showError();
      return;
    }
    
    // Track AddToCart event for all pixels
    trackPixelEvent('AddToCart', {
      content_type: 'product',
      content_id: 'carbon-3-0',
      content_name: 'Tênis de Corrida Chunta Carbon 3.0',
      quantity: 1,
      value: 77.80,
      currency: 'BRL',
    });
    
    // Add item to cart and navigate to checkout
    addItem(selectedColor, selectedSize, 1);
    navigate("/checkout");
  };

  const selectedColorData = colors.find(c => c.id === selectedColor);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>Calçados</span>
            <span className="text-gray-300">›</span>
            <span>Tênis de Corrida</span>
            <span className="text-gray-300">›</span>
            <span className="text-gray-700 font-medium">Carbon 3.0</span>
          </nav>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        {/* Product Card */}
        <div className="bg-white">
          <div className="px-4 py-5">
            {/* Trust Badges */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-full">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Loja Verificada</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-full">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                <span>Top 1 em Corrida</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl font-bold text-gray-900 leading-tight mb-1">
              Tênis de Corrida Chunta Carbon 3.0
            </h1>
            <p className="text-sm text-gray-500 mb-4">Placa de Carbono • Ultra Leve • Profissional</p>

            {/* Product Gallery */}
            <ProductGallery selectedColor={selectedColor} />

            {/* Scarcity Banner */}
            <div className="mt-4">
              <ScarcityBanner />
            </div>

            {/* Color Selector with Stock */}
            <div className="mt-5">
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
          </div>
        </div>

        {/* Price Card */}
        <div className="bg-white mt-2 px-4 py-5">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-sm text-gray-400 line-through">R$ 239,80</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-67%</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">R$ 77,80</div>
          <div className="flex items-center gap-1.5 text-sm text-emerald-600 mt-1">
            <PixIcon />
            <span className="font-medium">À vista no PIX</span>
          </div>

          {/* Benefits */}
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Truck className="h-4 w-4 text-emerald-600" />
              </div>
              <span>Frete grátis para todo o Brasil</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Zap className="h-4 w-4 text-emerald-600" />
              </div>
              <span>Entrega expressa em até 2 dias</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <span>Garantia de 90 dias</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleBuyClick}
              size="lg"
              className={`w-full h-14 font-semibold text-base rounded-xl transition-all shadow-lg ${
                selectedSize 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200' 
                  : 'bg-gray-200 text-gray-400 cursor-default hover:bg-gray-200 shadow-none'
              }`}
            >
              Comprar agora
            </Button>

            <Button
              onClick={() => {
                if (!selectedSize) {
                  sizeSelectorRef.current?.showError();
                  return;
                }
                addItem(selectedColor, selectedSize, 1);
                toast.success("Produto adicionado ao carrinho!");
              }}
              variant="outline"
              size="lg"
              className="w-full h-12 font-medium text-sm rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
            >
              Adicionar ao carrinho
            </Button>

            {!selectedSize && (
              <p className="text-center text-xs text-gray-400">
                Selecione cor e tamanho para continuar
              </p>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white mt-2 px-4 py-6">

          {/* Product Description */}
          <ProductDescription />

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          {/* Guarantees */}
          <Guarantees />

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          {/* Benefits */}
          <Benefits />

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          {/* Reviews */}
          <Reviews />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI ChatBot */}
      <AIChatBot />
    </div>
  );
};

export default Index;