import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, RefreshCcw, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import CameraGallery from "@/components/CameraGallery";
import QuantitySelector from "@/components/QuantitySelector";
import Reviews from "@/components/Reviews";
import CameraBenefits from "@/components/CameraBenefits";
import CameraGuarantees from "@/components/CameraGuarantees";
import CameraDescription from "@/components/CameraDescription";
import Footer from "@/components/Footer";
import { useCameraCart } from "@/contexts/CameraCartContext";
import { usePresence } from "@/hooks/usePresence";
import { trackPixelEvent } from "@/hooks/usePixels";
import { useUserLocation } from "@/hooks/useUserLocation";
import AIChatBot from "@/components/AIChatBot";

const Index = () => {
  const navigate = useNavigate();
  const { addItem, totalItems, unitPrice, displayOriginalPrice } = useCameraCart();
  const [quantity, setQuantity] = useState(1);
  const userLocation = useUserLocation();

  // Track presence on this page
  usePresence("/");

  // Calculate discount percentage
  const discountPercent = displayOriginalPrice > 0 
    ? Math.round(((displayOriginalPrice - unitPrice) / displayOriginalPrice) * 100) 
    : 0;

  // Calculate delivery dates (example: 4-7 business days)
  const getDeliveryDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 4);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    
    const formatDate = (date: Date) => {
      const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      return days[date.getDay()];
    };
    
    return `${formatDate(startDate)} e ${formatDate(endDate)}`;
  };

  // Track ViewContent event for all pixels
  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_type: 'product',
      content_id: 'camera-p11-6mp',
      content_name: 'Câmera Segurança IP Wi-Fi P11 Lente Dupla 6MP',
      value: unitPrice,
      currency: 'BRL',
    });
  }, [unitPrice]);

  const handleBuyClick = () => {
    // Track AddToCart event for all pixels
    trackPixelEvent('AddToCart', {
      content_type: 'product',
      content_id: 'camera-p11-6mp',
      content_name: 'Câmera Segurança IP Wi-Fi P11 Lente Dupla 6MP',
      quantity: quantity,
      value: unitPrice * quantity,
      currency: 'BRL',
    });
    
    // Add item to cart and navigate to checkout
    addItem(quantity);
    navigate("/checkout");
  };

  const handleAddToCart = () => {
    addItem(quantity);
    toast.success("Produto adicionado ao carrinho!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="text-green-600">Novo</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">+1000 vendidos</span>
          </nav>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        {/* Product Card */}
        <div className="bg-white">
          <div className="px-4 py-5">
            {/* Product Title */}
            <h1 className="text-lg font-normal text-gray-800 leading-snug mb-4">
              Câmera Segurança IP Wi-Fi P11 Lente Dupla 6MP Full HD App iCSee
            </h1>

            {/* Product Gallery */}
            <CameraGallery />
          </div>
        </div>

        {/* Price Card - Mercado Livre Style */}
        <div className="bg-white mt-2 px-4 py-5">
          {/* Color */}
          <div className="mb-3">
            <span className="text-sm text-gray-600">Cor: </span>
            <span className="text-sm font-medium text-gray-900">Preto</span>
          </div>

          {/* Price Section */}
          <div className="mb-4">
            <span className="text-sm text-gray-400 line-through">R$ {displayOriginalPrice.toFixed(2).replace(".", ",")}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light text-gray-900">
                R$ {Math.floor(unitPrice).toLocaleString()}
              </span>
              <span className="text-xl font-light text-gray-900">
                {(unitPrice % 1).toFixed(2).substring(2)}
              </span>
              <span className="text-base font-medium text-green-600">{discountPercent}% OFF</span>
            </div>
          </div>

          {/* Free Shipping Badge */}
          <div className="mb-4">
            <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              FRETE GRÁTIS
            </span>
          </div>

          {/* Delivery Info */}
          <div className="mb-4">
            <p className="text-sm text-green-600">
              <span className="font-medium">Chegará grátis</span> entre {getDeliveryDates()}
            </p>
            {!userLocation.loading && userLocation.city && (
              <p className="text-xs text-gray-500 mt-1">
                Enviando para <span className="text-blue-600">{userLocation.city}, {userLocation.state}</span>
              </p>
            )}
          </div>

          {/* Stock Info */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-900">Estoque disponível</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <QuantitySelector 
              quantity={quantity}
              maxQuantity={50}
              onQuantityChange={setQuantity}
            />
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleBuyClick}
              size="lg"
              className="w-full h-12 font-medium text-base rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Comprar agora
            </Button>

            <Button
              onClick={handleAddToCart}
              variant="outline"
              size="lg"
              className="w-full h-12 font-medium text-sm rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Adicionar ao carrinho
            </Button>
          </div>

          {/* Guarantee Links */}
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-start gap-2 text-gray-600">
              <RefreshCcw className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-blue-500 font-medium">Devolução grátis.</span>
                <span className="text-gray-500"> Você tem 30 dias a partir da data de recebimento.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-blue-500 font-medium">Compra Garantida.</span>
                <span className="text-gray-500"> Receba o produto que está esperando ou devolvemos o dinheiro.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-500">30 dias de garantia de fábrica.</span>
            </div>
          </div>
        </div>

        {/* Questions Section - Mercado Livre Style */}
        <div className="bg-white mt-2 px-4 py-5">
          <h3 className="text-lg font-normal text-gray-900 mb-4">Perguntas</h3>
          <Button
            variant="outline"
            className="w-full h-12 rounded-lg border-2 border-blue-500 text-blue-500 font-medium hover:bg-blue-50"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Perguntar
          </Button>
          <button className="w-full mt-3 text-blue-500 text-sm hover:underline flex items-center justify-between py-2">
            Ver todas as perguntas
            <span className="text-gray-400">›</span>
          </button>
        </div>

        {/* Content Sections */}
        <div className="bg-white mt-2 px-4 py-6">
          {/* Product Description */}
          <CameraDescription />

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          {/* Guarantees */}
          <CameraGuarantees />

          {/* Divider */}
          <div className="border-t border-gray-100 my-8" />

          {/* Benefits */}
          <CameraBenefits />

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
