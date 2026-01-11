import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Zap, Shield, CircleCheckBig, Award } from "lucide-react";
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
import { colors } from "@/components/ColorSelector";
import SizeSelector, { SizeSelectorRef } from "@/components/SizeSelector";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import Guarantees from "@/components/Guarantees";
import ProductDescription from "@/components/ProductDescription";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

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
  const [selectedColor, setSelectedColor] = useState<string>("gradient");

  // TikTok Pixel - ViewContent event
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('ViewContent', {
        content_type: 'product',
        content_id: 'carbon-3-0',
        content_name: 'Tênis de Corrida Chunta Carbon 3.0',
        value: 77.80,
        currency: 'BRL',
      });
    }
  }, []);

  const handleBuyClick = () => {
    if (!selectedSize) {
      sizeSelectorRef.current?.showError();
      return;
    }
    
    // TikTok Pixel - AddToCart event
    if (typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('AddToCart', {
        content_type: 'product',
        content_id: 'carbon-3-0',
        content_name: 'Tênis de Corrida Chunta Carbon 3.0',
        quantity: 1,
        value: 77.80,
        currency: 'BRL',
      });
    }
    
    // Add item to cart and navigate to checkout
    addItem(selectedColor, selectedSize, 1);
    navigate("/checkout");
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
            <Shield className="h-4 w-4 text-gray-400" />
            <span>Garantia de 90 dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CircleCheckBig className="h-4 w-4 text-gray-400" />
            <span>Estoque disponível</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleBuyClick}
          size="lg"
          className={`w-full h-14 mt-6 font-medium text-base rounded-full transition-colors ${
            selectedSize 
              ? 'bg-[#28af60] hover:bg-[#23994f] text-white' 
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
    </div>
  );
};

export default Index;