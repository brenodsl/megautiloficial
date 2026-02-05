import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Star, Check, Truck } from "lucide-react";
import { useUserLocation } from "@/hooks/useUserLocation";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProductGallery from "@/components/ProductGallery";
import ScarcityBanner from "@/components/ScarcityBanner";
import Reviews from "@/components/Reviews";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import ProductDescription from "@/components/ProductDescription";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { usePresence } from "@/hooks/usePresence";
import { trackPixelEvent } from "@/hooks/usePixels";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";
import AIChatBot from "@/components/AIChatBot";
import PurchaseNotifications from "@/components/PurchaseNotifications";
import { supabase } from "@/integrations/supabase/client";


import QuantitySelector from "@/components/QuantitySelector";
import FloatingBuyButton from "@/components/FloatingBuyButton";
import { useKitPricing } from "@/hooks/useKitPricing";

// PIX Icon Component
const PixIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.5 391.5 392.5 391.5H407.7L310.6 488.6C280.3 518.9 231.7 518.9 201.4 488.6L103.3 390.5H112.5C132.5 390.5 151.3 382.7 165.5 368.5L242.4 291.6V292.5zM262.5 218.5C257.1 223.9 247.8 223.9 242.4 218.5L165.5 141.6C151.3 127.4 132.5 119.6 112.5 119.6H103.3L201.4 21.49C231.7-8.83 280.3-8.83 310.6 21.49L407.7 118.6H392.5C372.5 118.6 353.7 126.4 339.5 140.6L262.5 217.6V218.5zM112.5 142.1C126.7 142.1 140.3 147.6 150.5 157.9L227.4 234.8C234.3 241.7 243.1 245.9 252.5 247.1V264C243.1 265.2 234.3 269.4 227.4 276.3L150.5 353.2C140.3 363.5 126.7 369 112.5 369H80.19L21.49 310.3C-8.832 280-8.832 231.4 21.49 201.1L80.19 142.4H112.5V142.1zM431.8 369H399.5C385.3 369 371.7 363.5 361.5 353.2L284.6 276.3C277.7 269.4 268.9 265.2 259.5 264V247.1C268.9 245.9 277.7 241.7 284.6 234.8L361.5 157.9C371.7 147.6 385.3 142.1 399.5 142.1H431.8L490.5 200.8C520.8 231.1 520.8 279.7 490.5 310L431.8 368.7V369z"/>
  </svg>
);

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem, totalItems, clearCart } = useCart();
  const { city, state, loading: locationLoading } = useUserLocation();
  const { kitPrices, isLoading: isLoadingPrices } = useKitPricing();
  const [selectedQuantity, setSelectedQuantity] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState(0);
  const [defaultKitLoaded, setDefaultKitLoaded] = useState(false);

  // Fetch default kit setting
  useEffect(() => {
    const fetchDefaultKit = async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'default_kit')
        .maybeSingle();

      if (!error && data?.setting_value) {
        const value = data.setting_value as { quantity: number };
        setSelectedQuantity(value.quantity || 1);
      } else {
        setSelectedQuantity(1); // Default to kit 1 if not configured
      }
      setDefaultKitLoaded(true);
    };
    fetchDefaultKit();
  }, []);

  // Update prices when kit prices load or selection changes
  useEffect(() => {
    if (!isLoadingPrices && kitPrices.length > 0 && selectedQuantity !== null) {
      const selectedKit = kitPrices.find(k => k.quantity === selectedQuantity) || kitPrices[0];
      setCurrentPrice(selectedKit.salePrice);
      setCurrentOriginalPrice(selectedKit.originalPrice);
    }
  }, [kitPrices, isLoadingPrices, selectedQuantity]);
  usePresence("/");
  const { trackEvent } = useFunnelTracking("/");


  // Track product view on mount
  useEffect(() => {
    trackEvent('product_view', { product: 'camera-wifi' });
  }, [trackEvent]);

  // Calculate delivery date (5-8 days from now)
  const getDeliveryDateRange = () => {
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);
    minDate.setDate(today.getDate() + 5);
    maxDate.setDate(today.getDate() + 8);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    };
    
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  // Only calculate if prices are loaded
  const discountPercent = currentOriginalPrice > 0 && currentPrice > 0
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100) 
    : 0;

  const currentSavings = currentOriginalPrice > 0 ? currentOriginalPrice - currentPrice : 0;

  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_type: 'product',
      content_id: 'camera-wifi-security',
      content_name: 'Câmera Wi-Fi com Sensor de Movimento',
      value: currentPrice,
      currency: 'BRL',
    });
  }, [currentPrice]);

  const handleQuantityChange = (quantity: number, price: number, originalPrice: number) => {
    setSelectedQuantity(quantity);
    setCurrentPrice(price);
    setCurrentOriginalPrice(originalPrice);
    
    // Atualiza o carrinho automaticamente quando troca de kit
    if (totalItems > 0) {
      clearCart();
      addItem("default", quantity, 1, price, originalPrice);
    }
  };

  const handleBuyClick = () => {
    if (totalItems > 0) {
      navigate("/checkout");
      return;
    }
    
    trackPixelEvent('AddToCart', {
      content_type: 'product',
      content_id: 'camera-wifi-security',
      content_name: 'Câmera Wi-Fi com Sensor de Movimento',
      quantity: selectedQuantity,
      value: currentPrice,
      currency: 'BRL',
    });
    
    // Track funnel event
    trackEvent('add_to_cart', { 
      quantity: selectedQuantity, 
      price: currentPrice,
      kit: selectedQuantity === 1 ? '1 Câmera' : `Kit ${selectedQuantity} Câmeras`
    });
    
    // Clear cart and add new selection
    clearCart();
    addItem("default", selectedQuantity, 1, currentPrice, currentOriginalPrice);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Eletrônicos</span>
            <span className="text-border">›</span>
            <span>Segurança</span>
            <span className="text-border">›</span>
            <span className="text-primary font-medium">Kit Câmeras WiFi</span>
          </nav>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        {/* Product Gallery Card */}
        <div className="bg-white">
          <div className="px-4 py-4">
            <ProductGallery />
          </div>
        </div>

        {/* Product Info Card */}
        <div className="bg-white mt-2 px-4 py-5">
          {/* Product Title */}
          <h1 className="text-xl font-bold text-foreground leading-tight">
            Câmera Wi-Fi com Sensor de Movimento, Alarme Automático e à Prova d'Água
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visão Noturna Colorida • IP66 • Áudio Bidirecional • Rastreamento Humano • App iCSee
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
            Vendido e entregue por <span className="text-primary font-semibold">MegaUtil</span>
          </p>

          {/* Quantity Selector */}
          <div className="mt-5">
            <QuantitySelector 
              selectedQuantity={selectedQuantity}
              onQuantityChange={handleQuantityChange}
            />
          </div>

          {/* Price Section */}
          <div className="mt-5 bg-secondary/40 rounded-2xl p-5 border border-primary/10">
            {isLoadingPrices || currentPrice === 0 ? (
              <div className="animate-pulse">
                <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                <div className="h-10 w-40 bg-muted rounded mb-2"></div>
                <div className="h-4 w-28 bg-muted rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground line-through">
                    De: R$ {currentOriginalPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {discountPercent}% OFF
                  </span>
                </div>
                <div className="text-4xl font-black text-primary">
                  R$ {currentPrice.toFixed(2).replace(".", ",")}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-success mt-1.5">
                  <PixIcon className="h-4 w-4" />
                  <span className="font-semibold">à vista no PIX</span>
                </div>
                {currentSavings > 0 && (
                  <p className="text-sm text-success font-bold mt-2">
                    💰 Você economiza R$ {currentSavings.toFixed(2).replace(".", ",")}
                  </p>
                )}
              </>
            )}
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
              className="w-full h-14 font-bold text-base rounded-xl gradient-cta text-white glow-cta hover:opacity-90 transition-all"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {totalItems > 0 ? 'Finalizar compra' : 'Comprar agora'}
            </Button>
            
            {/* Free Shipping Info */}
            <div className="mt-3 flex items-center justify-center gap-2 bg-success/10 border border-success/20 rounded-xl p-3">
              <Truck className="h-5 w-5 text-success flex-shrink-0" />
              <div className="text-sm">
                <span className="font-bold text-success">FRETE GRÁTIS</span>
                {!locationLoading && city ? (
                  <span className="text-foreground"> para <span className="font-semibold">{city}{state ? `, ${state}` : ''}</span></span>
                ) : (
                  <span className="text-foreground"> para todo o Brasil</span>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chegará entre <span className="font-medium text-foreground">{getDeliveryDateRange()}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Benefits Row */}
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
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



        {/* Reviews */}
        <div className="bg-white mt-2 px-4 py-6">
          <Reviews />
        </div>

        {/* FAQ */}
        <div className="bg-white mt-2 px-4 py-6">
          <FAQ />
        </div>
      </main>

      <Footer />
      <AIChatBot />
      <PurchaseNotifications />
      
    </div>
  );
};

export default Index;
