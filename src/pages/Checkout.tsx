import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Lock, 
  User, 
  MapPin, 
  Truck,
  Phone, 
  Mail, 
  Hash, 
  Home,
  Building,
  Loader2, 
  Copy, 
  CheckCircle,
  ShieldCheck,
  Award,
  Clock,
  AlertCircle,
  ArrowLeft,
  Gift,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  CreditCard,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import logo from "@/assets/logo.jpg";
import cameraMain from "@/assets/camera-main.png";
import kit1und from "@/assets/kit-1und.jpg";
import kit2und from "@/assets/kit-2und.jpg";
import kit3und from "@/assets/kit-3und.jpg";
import kit4und from "@/assets/kit-4und.jpg";
import reviewCamera1 from "@/assets/review-camera-1.webp";
import reviewCamera2 from "@/assets/review-camera-2.webp";
import reviewCamera3 from "@/assets/review-camera-3.webp";
import reviewCamera4 from "@/assets/review-camera-4.webp";
import reviewCamera5 from "@/assets/review-camera-5.webp";
import reviewNew1 from "@/assets/review-new-1.webp";
import reviewNew2 from "@/assets/review-new-2.webp";
import reviewNew3 from "@/assets/review-new-3.webp";
import reviewNew4 from "@/assets/review-new-4.webp";
import reviewNew5 from "@/assets/review-new-5.webp";
import reviewNew6 from "@/assets/review-new-6.webp";
import reviewNew7 from "@/assets/review-new-7.webp";
import reviewNew8 from "@/assets/review-new-8.webp";
import seloSiteBlindado from "@/assets/selo-site-blindado.png";
import seloReclameAqui from "@/assets/selo-reclame-aqui.png";

// Map quantity to kit images
const KIT_IMAGES: Record<number, string> = {
  1: kit1und,
  2: kit2und,
  3: kit3und,
  4: kit4und,
};
import { usePresence } from "@/hooks/usePresence";
import { trackPixelEvent } from "@/hooks/usePixels";
import { useFunnelTracking, trackFunnelEvent } from "@/hooks/useFunnelTracking";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import PaymentProgressBar from "@/components/PaymentProgressBar";

// PIX Icon Component
const PixIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.5 391.5 392.5 391.5H407.7L310.6 488.6C280.3 518.9 231.7 518.9 201.4 488.6L103.3 390.5H112.5C132.5 390.5 151.3 382.7 165.5 368.5L242.4 291.6V292.5zM262.5 218.5C257.1 223.9 247.8 223.9 242.4 218.5L165.5 141.6C151.3 127.4 132.5 119.6 112.5 119.6H103.3L201.4 21.49C231.7-8.83 280.3-8.83 310.6 21.49L407.7 118.6H392.5C372.5 118.6 353.7 126.4 339.5 140.6L262.5 217.6V218.5zM112.5 142.1C126.7 142.1 140.3 147.6 150.5 157.9L227.4 234.8C234.3 241.7 243.1 245.9 252.5 247.1V264C243.1 265.2 234.3 269.4 227.4 276.3L150.5 353.2C140.3 363.5 126.7 369 112.5 369H80.19L21.49 310.3C-8.832 280-8.832 231.4 21.49 201.1L80.19 142.4H112.5V142.1zM431.8 369H399.5C385.3 369 371.7 363.5 361.5 353.2L284.6 276.3C277.7 269.4 268.9 265.2 259.5 264V247.1C268.9 245.9 277.7 241.7 284.6 234.8L361.5 157.9C371.7 147.6 385.3 142.1 399.5 142.1H431.8L490.5 200.8C520.8 231.1 520.8 279.7 490.5 310L431.8 368.7V369z"/>
  </svg>
);

// QRCode Icon for payment section
const QRCodeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#28af60]" fill="currentColor">
    <path d="M3 11h2v2H3v-2m8-6h2v4h-2V5m-2 6h4v4h-2v-2H9v-2m6 0h2v2h2v-2h2v2h-2v2h2v4h-2v2h-2v-2h-4v2h-2v-4h4v-2h2v-2h-2v-2m4 8v-4h-2v4h2M15 3h6v6h-6V3m2 2v2h2V5h-2M3 3h6v6H3V3m2 2v2h2V5H5M3 15h6v6H3v-6m2 2v2h2v-2H5Z"/>
  </svg>
);

// Shipping options data
const shippingOptions = [
  {
    id: "free",
    name: "Envio Grátis",
    description: "8 a 12 dias úteis",
    price: 0,
    badge: "Grátis",
  },
  {
    id: "sedex",
    name: "SEDEX",
    description: "3 a 6 dias úteis",
    price: 19.00,
    logo: "SEDEX",
  },
  {
    id: "express",
    name: "Envio Express",
    description: "1 a 2 dias úteis",
    price: 39.90,
    note: "Somente para capitais",
  },
];

const getShippingPrice = (shippingId: string): number => {
  const option = shippingOptions.find(opt => opt.id === shippingId);
  return option?.price || 0;
};

// Customer reviews for carousel
const customerReviews = [
  {
    id: 1,
    name: "Maria S.",
    location: "São Paulo, SP",
    rating: 5,
    comment: "Câmera instalada no poste, imagem perfeita!",
    images: [reviewCamera1],
  },
  {
    id: 2,
    name: "Carlos M.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    comment: "Qualidade incrível, recomendo!",
    images: [reviewCamera2],
  },
  {
    id: 3,
    name: "Ana Paula S.",
    location: "Belo Horizonte, MG",
    rating: 5,
    comment: "Chegou super bem embalado!",
    images: [reviewCamera3],
  },
  {
    id: 4,
    name: "Roberto F.",
    location: "Curitiba, PR",
    rating: 5,
    comment: "Produto idêntico ao anunciado!",
    images: [reviewCamera4],
  },
  {
    id: 5,
    name: "Fernanda L.",
    location: "Salvador, BA",
    rating: 5,
    comment: "Kit completo, visão noturna incrível!",
    images: [reviewCamera5],
  },
  {
    id: 6,
    name: "Ricardo A.",
    location: "Brasília, DF",
    rating: 5,
    comment: "Instalação super fácil!",
    images: [reviewNew1],
  },
  {
    id: 7,
    name: "Juliana P.",
    location: "Porto Alegre, RS",
    rating: 5,
    comment: "Qualidade excepcional!",
    images: [reviewNew2],
  },
  {
    id: 8,
    name: "Marcos V.",
    location: "Recife, PE",
    rating: 5,
    comment: "Monitorando 24h perfeitamente!",
    images: [reviewNew3],
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, originalPrice, discount, clearCart, updateQuantity, unitPrice, displayOriginalPrice } = useCart();
  
  const [customerData, setCustomerData] = useState({
    name: "",
    document: "",
    phone: "",
    email: "",
  });

  const [addressData, setAddressData] = useState({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [selectedShipping, setSelectedShipping] = useState("free");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string | null;
    qrCodeText: string | null;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [expirationTime, setExpirationTime] = useState(7 * 60);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'checking'>('pending');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  
  
  // Notification sounds
  const { playPixGenerated, playPaymentConfirmed } = useNotificationSound();

  // Timer countdown state - ends at 23:59 of current day
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate total with shipping
  const shippingPrice = getShippingPrice(selectedShipping);
  const finalTotal = totalPrice + shippingPrice;
  
  // Calculate PIX discount (65% off from original price)
  const pixDiscount = displayOriginalPrice - unitPrice;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPixDiscount = pixDiscount * totalQuantity;

  // Track presence on checkout
  usePresence("/checkout");
  const { trackEvent } = useFunnelTracking("/checkout");

  // Track checkout started on mount
  useEffect(() => {
    trackEvent('checkout_started', { step: 1 });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track InitiateCheckout event
  useEffect(() => {
    if (items.length > 0) {
      const quantityLabel = items[0]?.size === 1 ? "1 Câmera" : `Kit ${items[0]?.size} Câmeras`;
      trackPixelEvent('InitiateCheckout', {
        content_type: 'product',
        content_id: 'camera-wifi',
        content_name: `${quantityLabel} Wi-Fi MegaUtil`,
        quantity: totalQuantity,
        value: totalPrice,
        currency: 'BRL',
      });
    }
  }, []);

  // Countdown timer for PIX expiration
  useEffect(() => {
    if (pixData && expirationTime > 0) {
      const timer = setInterval(() => {
        setExpirationTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pixData, expirationTime]);

  // Auto-check payment status
  useEffect(() => {
    if (!pixData || paymentStatus === 'paid') return;

    const checkPaymentStatus = async () => {
      if (isCheckingPayment) return;
      
      setIsCheckingPayment(true);
      try {
        const { data, error } = await supabase.functions.invoke("check-payment-status", {
          body: { transactionId: pixData.transactionId }
        });

        if (error) {
          console.error("Error checking payment status:", error);
          return;
        }

        if (data?.isPaid) {
          setPaymentStatus('paid');
          
          // Play payment confirmed sound
          playPaymentConfirmed();
          
          // Track payment confirmed for funnel analytics
          trackFunnelEvent('payment_confirmed', '/checkout', { 
            value: finalTotal, 
            transactionId: pixData.transactionId 
          });
          
          toast.success("Pagamento confirmado!");
          
          // Redirect to external URL after payment confirmed
          setTimeout(() => {
            clearCart();
            window.location.href = "https://correiostiktok.netlify.app/";
          }, 2000);
        }
      } catch (err) {
        console.error("Error checking payment:", err);
      } finally {
        setIsCheckingPayment(false);
      }
    };

    checkPaymentStatus();
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [pixData, paymentStatus, isCheckingPayment, navigate, customerData, addressData, clearCart]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate CPF
  const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, "");
    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers[9])) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers[10])) return false;
    
    return true;
  };

  // Format functions
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d)/, "$1-$2");
  };

  const handleCustomerChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === "document") {
      formattedValue = formatCPF(value);
    } else if (field === "phone") {
      formattedValue = formatPhone(value);
    }
    setCustomerData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleAddressChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === "zipCode") {
      formattedValue = formatCEP(value);
    } else if (field === "state") {
      formattedValue = value.toUpperCase().substring(0, 2);
    }
    setAddressData(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Auto-fill address from CEP
  useEffect(() => {
    const fetchAddress = async () => {
      const cepNumbers = addressData.zipCode.replace(/\D/g, "");
      if (cepNumbers.length === 8) {
        setIsLoadingCep(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setAddressData(prev => ({
              ...prev,
              street: data.logradouro || "",
              neighborhood: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching CEP:", error);
        } finally {
          setIsLoadingCep(false);
        }
      }
    };
    fetchAddress();
  }, [addressData.zipCode]);

  const validateForm = () => {
    if (!customerData.name.trim()) {
      toast.error("Preencha seu nome completo");
      return false;
    }
    if (!customerData.document || customerData.document.replace(/\D/g, "").length < 11) {
      toast.error("Preencha um CPF válido");
      return false;
    }
    if (!validateCPF(customerData.document)) {
      toast.error("CPF inválido. Por favor, verifique o número digitado.");
      return false;
    }
    if (!customerData.phone || customerData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Preencha um telefone válido");
      return false;
    }
    if (!customerData.email || !customerData.email.includes("@")) {
      toast.error("Preencha um e-mail válido");
      return false;
    }
    if (!addressData.zipCode || addressData.zipCode.replace(/\D/g, "").length !== 8) {
      toast.error("Preencha um CEP válido");
      return false;
    }
    if (!addressData.street.trim()) {
      toast.error("Preencha a rua/avenida");
      return false;
    }
    if (!addressData.number.trim()) {
      toast.error("Preencha o número");
      return false;
    }
    if (!addressData.neighborhood.trim()) {
      toast.error("Preencha o bairro");
      return false;
    }
    if (!addressData.city.trim()) {
      toast.error("Preencha a cidade");
      return false;
    }
    if (!addressData.state || addressData.state.length !== 2) {
      toast.error("Preencha o estado (UF)");
      return false;
    }
    return true;
  };

  const handleCreatePixPayment = async () => {
    if (isLoading || pixData) return;
    if (!validateForm()) return;
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          items: items.map(item => ({
            colorId: item.colorId,
            colorName: item.colorName,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
          customer: {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone.replace(/\D/g, ""),
            document: customerData.document.replace(/\D/g, ""),
            address: {
              zipCode: addressData.zipCode.replace(/\D/g, ""),
              street: addressData.street,
              number: addressData.number,
              complement: addressData.complement,
              neighborhood: addressData.neighborhood,
              city: addressData.city,
              state: addressData.state,
            },
          },
          totalAmount: finalTotal,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error(error.message || "Erro ao gerar pagamento");
        return;
      }

      if (data?.success) {
        const quantityLabel = items[0]?.size === 1 ? "1 Câmera" : `Kit ${items[0]?.size} Câmeras`;
        const orderItems = items.map(item => ({
          name: quantityLabel,
          color: item.colorName,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        }));

        await supabase.from('orders').insert({
          transaction_id: data.transactionId,
          customer_name: customerData.name,
          customer_email: customerData.email,
          customer_phone: customerData.phone.replace(/\D/g, ""),
          customer_cpf: customerData.document.replace(/\D/g, ""),
          address_cep: addressData.zipCode.replace(/\D/g, ""),
          address_street: addressData.street,
          address_number: addressData.number,
          address_complement: addressData.complement,
          address_neighborhood: addressData.neighborhood,
          address_city: addressData.city,
          address_state: addressData.state,
          items: orderItems,
          subtotal: totalPrice,
          shipping_price: shippingPrice,
          total_amount: finalTotal,
          payment_status: 'pending',
          payment_method: 'pix',
          pix_code: data.qrCodeText || null,
          gateway_used: data.gateway || null,
        });

        setPixData({
          qrCode: data.qrCode || null,
          qrCodeText: data.qrCodeText || null,
          transactionId: data.transactionId,
        });
        
        // Track PIX generated for funnel analytics
        trackEvent('pix_generated', { 
          value: finalTotal, 
          quantity: totalQuantity 
        });
        
        trackPixelEvent('Purchase', {
          content_type: 'product',
          content_id: 'camera-wifi',
          content_name: `${quantityLabel} Wi-Fi MegaUtil`,
          currency: 'BRL',
          value: finalTotal,
          num_items: totalQuantity,
        });
        
        // Play PIX generated sound
        playPixGenerated();
        
        toast.success("PIX gerado com sucesso!");
      } else {
        toast.error(data?.error || "Erro ao gerar QR Code");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPixCode = async () => {
    if (pixData?.qrCodeText) {
      await navigator.clipboard.writeText(pixData.qrCodeText);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Track touched fields for validation display
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  // Email validation with regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation helpers
  const isNameValid = customerData.name.trim().length >= 3;
  const isCpfComplete = customerData.document.replace(/\D/g, "").length === 11;
  const isCpfValid = validateCPF(customerData.document);
  const isPhoneValid = customerData.phone.replace(/\D/g, "").length >= 10;
  const isEmailValid = validateEmail(customerData.email);
  const isCepValid = addressData.zipCode.replace(/\D/g, "").length === 8;
  const isStreetValid = addressData.street.trim().length >= 3;
  const isNumberValid = addressData.number.trim().length >= 1;
  const isNeighborhoodValid = addressData.neighborhood.trim().length >= 2;
  const isCityValid = addressData.city.trim().length >= 2;
  const isStateValid = addressData.state.length === 2;

  const isFormComplete = isNameValid && isCpfValid && isPhoneValid && isEmailValid && isCepValid && isStreetValid && isNumberValid && isNeighborhoodValid && isCityValid && isStateValid;

  if (items.length === 0 && !pixData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Carrinho vazio</h1>
          <p className="text-gray-500 mb-6">Adicione produtos antes de continuar</p>
          <Button onClick={() => navigate("/")} className="bg-accent hover:bg-accent/90">
            Voltar às compras
          </Button>
        </div>
      </div>
    );
  }

  // PIX Payment Screen
  if (pixData) {
    // Calculate urgency percentage based on time left
    const urgencyPercent = Math.max(0, Math.min(100, (expirationTime / (7 * 60)) * 100));
    const isUrgent = expirationTime < 180; // Less than 3 minutes
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-primary py-3 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <button onClick={() => navigate("/")} className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Link to="/">
              <img src="/logo-megautil.png" alt="MegaUtil" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-1 text-white text-sm">
              <Lock className="h-4 w-4" />
              <span>Seguro</span>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
          
          {/* Simple Value Display */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 text-lg mb-1">Valor a pagar:</p>
            <p className="text-4xl font-black text-primary">
              R$ {finalTotal.toFixed(2).replace(".", ",")}
            </p>
          </div>

          {/* Timer - Simplified */}
          <div className={`rounded-xl p-4 text-center ${isUrgent ? 'bg-red-100 border-2 border-red-300' : 'bg-amber-50 border border-amber-200'}`}>
            <p className={`text-sm ${isUrgent ? 'text-red-700' : 'text-amber-700'}`}>
              Tempo para pagar:
            </p>
            <p className={`text-2xl font-bold ${isUrgent ? 'text-red-600' : 'text-amber-800'}`}>
              {formatTime(expirationTime)}
            </p>
          </div>

          {/* MAIN: Copy Button - Very Prominent */}
          {pixData.qrCodeText && (
            <div className="space-y-3">
              <Button
                onClick={handleCopyPixCode}
                className={`w-full h-16 rounded-2xl gap-3 text-lg font-bold transition-all shadow-lg ${
                  copied 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    CÓDIGO COPIADO!
                  </>
                ) : (
                  <>
                    <Copy className="h-6 w-6" />
                    COPIAR CÓDIGO PIX
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step by Step Instructions - Very Clear */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              📱 Como pagar pelo celular:
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Clique no botão acima</p>
                  <p className="text-gray-600">O código será copiado automaticamente</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Abra o app do seu banco</p>
                  <p className="text-gray-600">Nubank, Itaú, Bradesco, Caixa, etc.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Vá em PIX → "Pagar" ou "Copia e Cola"</p>
                  <p className="text-gray-600">Cole o código que você copiou</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Confirme o pagamento</p>
                  <p className="text-gray-600">Pronto! Você será redirecionado automaticamente</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code - Optional, smaller */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-3">
              Ou escaneie com a câmera do banco:
            </p>
            <div className="flex justify-center">
              {pixData.qrCodeText ? (
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <QRCodeSVG
                    value={pixData.qrCodeText}
                    size={140}
                    level="M"
                    includeMargin={true}
                  />
                </div>
              ) : pixData.qrCode ? (
                <img
                  src={pixData.qrCode.startsWith("data:") ? pixData.qrCode : `data:image/png;base64,${pixData.qrCode}`}
                  alt="QR Code PIX"
                  className="w-36 h-36 rounded-lg"
                />
              ) : null}
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'paid' ? (
            <div className="bg-green-100 text-green-700 p-5 rounded-2xl border-2 border-green-300 text-center">
              <CheckCircle className="h-10 w-10 mx-auto mb-2" />
              <p className="font-bold text-xl">Pagamento confirmado!</p>
              <p className="text-green-600">Aguarde, estamos te redirecionando...</p>
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Aguardando seu pagamento...</span>
              </div>
            </div>
          )}

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted pb-8">
      {/* Checkout Header */}
      <header className="bg-primary py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Link to="/">
            <img src="/logo-megautil.png" alt="MegaUtil" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-1 text-white text-sm">
            <Lock className="h-4 w-4" />
            <span>Seguro</span>
          </div>
        </div>
      </header>

      {/* Security Bar */}
      <div className="bg-primary/90 py-1.5 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-6 text-white/80 text-xs">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            <span>SSL 256-bit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Compra Protegida</span>
          </div>
        </div>
      </div>

      {/* Offer Timer Banner */}
      <div className="bg-accent py-2 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-white">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Últimas horas de oferta:</span>
          </div>
          <div className="flex items-center gap-0.5 bg-white/20 rounded-md px-2 py-0.5">
            <span className="text-white font-bold text-sm min-w-[20px] text-center">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-white font-bold text-sm">:</span>
            <span className="text-white font-bold text-sm min-w-[20px] text-center">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-white font-bold text-sm">:</span>
            <span className="text-white font-bold text-sm min-w-[20px] text-center">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        
        {/* Product Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex gap-4 items-start">
            <div className="relative">
              <img
                src={KIT_IMAGES[items[0]?.size] || kit1und}
                alt={items[0]?.size === 1 ? "1 Câmera" : `Kit ${items[0]?.size} Câmeras`}
                className="w-24 h-24 object-cover rounded-xl border border-gray-200"
              />
              <span className="absolute -top-2 -left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded">
                PROMOÇÃO!
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-sm font-semibold text-foreground leading-tight">
                {items[0]?.size === 1 ? "Câmera" : `Kit ${items[0]?.size} Câmeras`} Wi-Fi Full HD - Leboss
              </h1>
              <div className="mt-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-bold text-primary">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    R$ {displayOriginalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Badges */}
          <div className="flex justify-between mt-4 pt-4 border-t border-border">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Compra<br/>Segura</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Frete Grátis</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Garantia 12m</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">PIX Seguro</span>
            </div>
          </div>
        </div>

        {/* Personal Data Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Dados Pessoais</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                Nome completo <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Seu nome completo"
                value={customerData.name}
                onChange={(e) => handleCustomerChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={customerData.email}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                Telefone/WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="(00) 00000-0000"
                value={customerData.phone}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                onBlur={() => handleFieldBlur("phone")}
                maxLength={15}
                inputMode="tel"
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                CPF <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="000.000.000-00"
                value={customerData.document}
                onChange={(e) => handleCustomerChange("document", e.target.value)}
                onBlur={() => handleFieldBlur("document")}
                maxLength={14}
                inputMode="numeric"
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Endereço de Entrega</h2>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                CEP <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="00000-000"
                value={addressData.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                onBlur={() => handleFieldBlur("zipCode")}
                maxLength={9}
                inputMode="numeric"
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
              {isLoadingCep && (
                <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            
            <div>
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                Endereço <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Rua, avenida..."
                value={addressData.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                onBlur={() => handleFieldBlur("street")}
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-700 flex items-center gap-1">
                  Nº <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="123"
                  value={addressData.number}
                  onChange={(e) => handleAddressChange("number", e.target.value)}
                  onBlur={() => handleFieldBlur("number")}
                  inputMode="numeric"
                  className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-700">Complemento</Label>
                <Input
                  placeholder="Apto, bloco..."
                  value={addressData.complement}
                  onChange={(e) => handleAddressChange("complement", e.target.value)}
                  className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-700 flex items-center gap-1">
                Bairro <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Seu bairro"
                value={addressData.neighborhood}
                onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
                onBlur={() => handleFieldBlur("neighborhood")}
                className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-3">
                <Label className="text-sm text-gray-700 flex items-center gap-1">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Sua cidade"
                  value={addressData.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  onBlur={() => handleFieldBlur("city")}
                  className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-700 flex items-center gap-1">
                  UF <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="UF"
                  value={addressData.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  onBlur={() => handleFieldBlur("state")}
                  maxLength={2}
                  className="mt-1 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Options Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Opções de Envio</h2>
          </div>
          
          <div className="space-y-3">
            {shippingOptions.map((option) => {
              const isSelected = selectedShipping === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedShipping(option.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-primary" : "border-gray-300"
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <div>
                      {option.id === "sedex" ? (
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">SEDEX</span>
                      ) : (
                        <span className="font-medium text-gray-900">{option.name}</span>
                      )}
                      <p className="text-xs text-gray-500">{option.description}</p>
                      {option.note && (
                        <p className="text-[10px] text-accent">{option.note}</p>
                      )}
                    </div>
                  </div>
                  <span className={`font-bold ${option.price === 0 ? "text-[#28af60]" : "text-gray-900"}`}>
                    {option.badge || `R$ ${option.price.toFixed(2).replace(".", ",")}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">R$ {displayOriginalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#28af60]">Desconto PIX (65%)</span>
              <span className="text-[#28af60] font-medium">- R$ {totalPixDiscount.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frete ({shippingOptions.find(s => s.id === selectedShipping)?.name})</span>
              <span className={shippingPrice === 0 ? "text-[#28af60] font-medium" : "text-gray-900"}>
                {shippingPrice === 0 ? "Grátis" : `R$ ${shippingPrice.toFixed(2).replace(".", ",")}`}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="font-bold text-2xl text-accent">
                    R$ {finalTotal.toFixed(2).replace(".", ",")}
                  </span>
                  <p className="text-xs text-gray-500">à vista no PIX</p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCreatePixPayment}
            disabled={isLoading || !isFormComplete}
            className={`w-full h-14 font-bold text-lg rounded-xl mt-6 gap-2 ${
              isFormComplete
                ? 'bg-accent hover:bg-accent/90 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              "Finalizar Compra"
            )}
          </Button>
          
          {/* Security message */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-3">
            <Lock className="h-3 w-3" />
            <span>Pagamento 100% seguro e criptografado</span>
          </div>
        </div>

        {/* Site Blindado Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <img 
              src={seloSiteBlindado} 
              alt="Site Blindado" 
              className="h-12 object-contain mb-2"
            />
            <p className="text-sm text-gray-600">
              Sua navegação é protegida com criptografia de ponta a ponta
            </p>
          </div>
        </div>

        {/* Reclame Aqui Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <img 
              src={seloReclameAqui} 
              alt="RA1000 Reclame Aqui" 
              className="h-14 object-contain mb-2"
            />
            <p className="text-sm text-gray-600">
              Nota máxima no Reclame Aqui por excelência no atendimento
            </p>
          </div>
        </div>

        {/* Secure Purchase Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-[#28af60]" />
            <h2 className="font-semibold text-gray-900">Compra 100% Segura</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Site protegido com certificado SSL. Seus dados estão criptografados e seguros.
          </p>
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">SSL</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                <ShieldCheck className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">PCI-DSS</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                <Check className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs text-gray-500">Antifraude</span>
            </div>
          </div>
        </div>

        {/* Customer Reviews Carousel */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Clientes satisfeitos</h2>
          
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-3" style={{ width: 'max-content' }}>
              {customerReviews.map((review) => (
                <div key={review.id} className="w-64 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  {review.images.length > 0 && (
                    <div className="relative">
                      <img 
                        src={review.images[0]} 
                        alt={`Avaliação de ${review.name}`}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900">{review.name}</span>
                          <CheckCircle className="h-3.5 w-3.5 text-[#28af60]" />
                        </div>
                        <p className="text-[10px] text-gray-500">{review.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 space-y-3">
          {/* Logo */}
          <div className="flex justify-center">
            <img src="/logo-megautil.png" alt="MegaUtil" className="h-10 w-auto" />
          </div>

          {/* Company Info */}
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">MegaUtil Comércio de Eletrônicos LTDA</p>
            <p>CNPJ: 13.865.865/0001-62</p>
          </div>

          {/* Address */}
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <p>Rua das Indústrias, 1500 - Galpão 12</p>
            <p>Distrito Industrial - São Paulo/SP</p>
            <p>CEP: 04567-890</p>
          </div>

          {/* Contact */}
          <div className="text-xs text-muted-foreground">
            <p>
              <a href="mailto:contato@megautil.com.br" className="hover:text-foreground transition-colors">
                contato@megautil.com.br
              </a>
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs pt-2">
            <Link to="/politica-de-privacidade" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Privacidade
            </Link>
            <Link to="/termos-de-uso" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Termos
            </Link>
            <Link to="/trocas-e-devolucoes" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Trocas
            </Link>
            <Link to="/politica-de-reembolso" className="text-muted-foreground hover:text-foreground underline transition-colors">
              Reembolso
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-[10px] text-muted-foreground/60 pt-2">
            © {new Date().getFullYear()} MegaUtil. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Checkout;
