import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Loader2,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from "qrcode.react";
import meiasImg from "@/assets/upsell-meias.png";
import oculosImg from "@/assets/upsell-oculos.png";
import pocheteImg from "@/assets/upsell-pochete.png";
import logo from "@/assets/logo-max-runner.png";
import { usePresence } from "@/hooks/usePresence";
import ValidatedInput from "@/components/ValidatedInput";

interface UpsellProduct {
  id: string;
  name: string;
  shortName: string;
  description: string;
  originalPrice: number;
  price: number;
  image: string;
}

const products: UpsellProduct[] = [
  {
    id: "meias",
    name: "Kit 03 Pares Meia Corrida HUPI Run",
    shortName: "Meias HUPI",
    description: "Preto, Branco e Amarelo",
    originalPrice: 69.70,
    price: 24.90,
    image: meiasImg,
  },
  {
    id: "oculos",
    name: "Óculos de Sol Esportivo Summer Pro",
    shortName: "Óculos Summer Pro",
    description: "Lente Azul Espelhada - UV400",
    originalPrice: 109.20,
    price: 38.00,
    image: oculosImg,
  },
  {
    id: "pochete",
    name: "Pochete de Corrida Hidrolight",
    shortName: "Pochete Hidrolight",
    description: "Compartimento para garrafa",
    originalPrice: 78.40,
    price: 28.00,
    image: pocheteImg,
  },
];

const bundleOriginalPrice = 69.70 + 109.20 + 78.40; // 257.30
const bundlePrice = 47.90;

// PIX Icon Component
const PixIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M242.4 292.5C247.8 287.1 257.1 287.1 262.5 292.5L339.5 369.5C353.7 383.7 372.5 391.5 392.5 391.5H407.7L310.6 488.6C280.3 518.9 231.7 518.9 201.4 488.6L103.3 390.5H112.5C132.5 390.5 151.3 382.7 165.5 368.5L242.4 291.6V292.5zM262.5 218.5C257.1 223.9 247.8 223.9 242.4 218.5L165.5 141.6C151.3 127.4 132.5 119.6 112.5 119.6H103.3L201.4 21.49C231.7-8.83 280.3-8.83 310.6 21.49L407.7 118.6H392.5C372.5 118.6 353.7 126.4 339.5 140.6L262.5 217.6V218.5zM112.5 142.1C126.7 142.1 140.3 147.6 150.5 157.9L227.4 234.8C234.3 241.7 243.1 245.9 252.5 247.1V264C243.1 265.2 234.3 269.4 227.4 276.3L150.5 353.2C140.3 363.5 126.7 369 112.5 369H80.19L21.49 310.3C-8.832 280-8.832 231.4 21.49 201.1L80.19 142.4H112.5V142.1zM431.8 369H399.5C385.3 369 371.7 363.5 361.5 353.2L284.6 276.3C277.7 269.4 268.9 265.2 259.5 264V247.1C268.9 245.9 277.7 241.7 284.6 234.8L361.5 157.9C371.7 147.6 385.3 142.1 399.5 142.1H431.8L490.5 200.8C520.8 231.1 520.8 279.7 490.5 310L431.8 368.7V369z"/>
  </svg>
);

const Upsell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state as {
    fromCheckout?: boolean;
    customer?: {
      name: string;
      email: string;
      phone: string;
      document: string;
    };
    address?: {
      street: string;
      number: string;
      complement: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  } | null;

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isBundle, setIsBundle] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Customer data - pre-fill if coming from checkout
  const [customerData, setCustomerData] = useState({
    name: checkoutData?.customer?.name || "",
    document: checkoutData?.customer?.document || "",
    phone: checkoutData?.customer?.phone || "",
    email: checkoutData?.customer?.email || "",
  });
  
  // Address data - pre-fill if coming from checkout
  const [addressData, setAddressData] = useState({
    zipCode: checkoutData?.address?.zipCode || "",
    street: checkoutData?.address?.street || "",
    number: checkoutData?.address?.number || "",
    complement: checkoutData?.address?.complement || "",
    neighborhood: checkoutData?.address?.neighborhood || "",
    city: checkoutData?.address?.city || "",
    state: checkoutData?.address?.state || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string | null;
    qrCodeText: string | null;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [expirationTime, setExpirationTime] = useState(30 * 60);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'checking'>('pending');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  
  const isFromCheckout = checkoutData?.fromCheckout === true;
  
  // Track presence on upsell page
  usePresence("/upsell");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // PIX expiration timer
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
          toast.success("Pagamento confirmado!");
          setTimeout(() => {
            navigate("/obrigado");
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
  }, [pixData, paymentStatus, isCheckingPayment, navigate]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const discount = Math.round(((bundleOriginalPrice - bundlePrice) / bundleOriginalPrice) * 100);

  // Formatting functions
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
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

  const getSelectedItems = () => {
    if (isBundle) {
      return products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
      }));
    }
    const product = products.find(p => p.id === selectedProduct);
    return product ? [{ id: product.id, name: product.name, price: product.price }] : [];
  };

  const getTotalPrice = () => {
    if (isBundle) return bundlePrice;
    const product = products.find(p => p.id === selectedProduct);
    return product?.price || 0;
  };

  const validateForm = () => {
    if (!customerData.name.trim()) {
      toast.error("Preencha seu nome completo");
      return false;
    }
    if (!validateCPF(customerData.document)) {
      toast.error("CPF inválido");
      return false;
    }
    if (customerData.phone.replace(/\D/g, "").length < 10) {
      toast.error("Telefone inválido");
      return false;
    }
    if (!customerData.email.includes("@")) {
      toast.error("E-mail inválido");
      return false;
    }
    if (addressData.zipCode.replace(/\D/g, "").length !== 8) {
      toast.error("CEP inválido");
      return false;
    }
    if (!addressData.street.trim() || !addressData.number.trim() || !addressData.neighborhood.trim() || !addressData.city.trim() || addressData.state.length !== 2) {
      toast.error("Preencha todos os campos do endereço");
      return false;
    }
    return true;
  };

  const handleCreatePixPayment = async () => {
    if (isLoading || pixData) return;
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const items = getSelectedItems().map(item => ({
        colorId: item.id,
        colorName: item.name,
        size: 0,
        quantity: 1,
        price: item.price,
      }));

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          items,
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
          totalAmount: getTotalPrice(),
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error(error.message || "Erro ao gerar pagamento");
        return;
      }

      if (data?.success) {
        // Save order to database
        const orderItems = getSelectedItems().map(item => ({
          name: item.name,
          quantity: 1,
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
          subtotal: getTotalPrice(),
          shipping_price: 0,
          total_amount: getTotalPrice(),
          payment_status: 'pending',
          payment_method: 'pix',
          pix_code: data.qrCodeText || null,
        });

        setPixData({
          qrCode: data.qrCode || null,
          qrCodeText: data.qrCodeText || null,
          transactionId: data.transactionId,
        });
        
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

  const handleSelectProduct = (productId: string) => {
    setSelectedProduct(productId);
    setIsBundle(false);
    setShowCheckout(true);
    setPixData(null);
  };

  const handleSelectBundle = () => {
    setSelectedProduct(null);
    setIsBundle(true);
    setShowCheckout(true);
    setPixData(null);
  };

  // Validation states
  const isNameValid = customerData.name.trim().length >= 3;
  const isCpfValid = validateCPF(customerData.document);
  const isPhoneValid = customerData.phone.replace(/\D/g, "").length >= 10;
  const isEmailValid = customerData.email.includes("@") && customerData.email.includes(".");
  const isCepValid = addressData.zipCode.replace(/\D/g, "").length === 8;
  const isStreetValid = addressData.street.trim().length >= 3;
  const isNumberValid = addressData.number.trim().length >= 1;
  const isNeighborhoodValid = addressData.neighborhood.trim().length >= 2;
  const isCityValid = addressData.city.trim().length >= 2;
  const isStateValid = addressData.state.length === 2;
  const isFormComplete = isNameValid && isCpfValid && isPhoneValid && isEmailValid && isCepValid && isStreetValid && isNumberValid && isNeighborhoodValid && isCityValid && isStateValid;

  // PIX Payment Screen
  if (pixData) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-center">
            <Link to="/">
              <img src={logo} alt="Max Runner" className="h-8 w-auto" />
            </Link>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#28af60]/10 flex items-center justify-center">
              <PixIcon className="h-8 w-8 text-[#28af60]" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#28af60] mb-2">Pagamento via PIX</h1>
            <p className="text-sm text-gray-500">Escaneie o QR Code ou copie o código</p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-[#28af60] text-white px-6 py-3 rounded-full">
              <Clock className="h-5 w-5" />
              <span className="font-medium">Expira em: {formatTime(expirationTime)}</span>
            </div>
          </div>

          <div className="text-center py-4 border-y border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Valor a pagar</p>
            <p className="text-3xl font-bold text-[#28af60]">
              R$ {getTotalPrice().toFixed(2).replace(".", ",")}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex justify-center">
              {pixData.qrCodeText ? (
                <QRCodeSVG value={pixData.qrCodeText} size={220} level="M" includeMargin={true} />
              ) : (
                <div className="w-56 h-56 bg-gray-100 flex items-center justify-center rounded-lg">
                  <PixIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {pixData.qrCodeText && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-600 font-mono break-all line-clamp-3">
                  {pixData.qrCodeText}
                </p>
              </div>
              <Button
                onClick={handleCopyPixCode}
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl gap-2"
              >
                {copied ? <><CheckCircle className="h-5 w-5" /> Copiado!</> : <><Copy className="h-5 w-5" /> Copiar código PIX</>}
              </Button>
            </div>
          )}

          {paymentStatus === 'paid' ? (
            <div className="flex items-center justify-center gap-2 text-sm bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Pagamento confirmado! Redirecionando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verificando pagamento...</span>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Checkout Form
  if (showCheckout) {
    const selectedItems = getSelectedItems();
    const total = getTotalPrice();

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="Max Runner" className="h-8 w-auto" />
            </Link>
            <button onClick={() => setShowCheckout(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Voltar
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h2>
            {selectedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-700">{item.name}</span>
                <span className="font-medium text-gray-900">R$ {item.price.toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-[#28af60] text-lg">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          {/* Customer Data */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Seus Dados</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nome completo</label>
                <ValidatedInput
                  value={customerData.name}
                  onChange={(e) => handleCustomerChange("name", e.target.value)}
                  isValid={isNameValid}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">CPF</label>
                <ValidatedInput
                  value={customerData.document}
                  onChange={(e) => handleCustomerChange("document", e.target.value)}
                  isValid={isCpfValid}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  maxLength={14}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
                <ValidatedInput
                  value={customerData.phone}
                  onChange={(e) => handleCustomerChange("phone", e.target.value)}
                  isValid={isPhoneValid}
                  placeholder="(00) 00000-0000"
                  inputMode="tel"
                  maxLength={15}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">E-mail</label>
                <ValidatedInput
                  value={customerData.email}
                  onChange={(e) => handleCustomerChange("email", e.target.value)}
                  isValid={isEmailValid}
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>
            </div>
          </div>

          {/* Address Data */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-4">Endereço de Entrega</h2>
            <div className="space-y-3">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">CEP</label>
                <ValidatedInput
                  value={addressData.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  isValid={isCepValid}
                  placeholder="00000-000"
                  inputMode="numeric"
                  maxLength={9}
                />
                {isLoadingCep && (
                  <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Rua/Avenida</label>
                <ValidatedInput
                  value={addressData.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  isValid={isStreetValid}
                  placeholder="Nome da rua"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Número</label>
                  <ValidatedInput
                    value={addressData.number}
                    onChange={(e) => handleAddressChange("number", e.target.value)}
                    isValid={isNumberValid}
                    placeholder="123"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Complemento</label>
                  <Input
                    value={addressData.complement}
                    onChange={(e) => handleAddressChange("complement", e.target.value)}
                    placeholder="Apto, bloco..."
                    className="h-12"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bairro</label>
                <ValidatedInput
                  value={addressData.neighborhood}
                  onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
                  isValid={isNeighborhoodValid}
                  placeholder="Seu bairro"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cidade</label>
                  <ValidatedInput
                    value={addressData.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    isValid={isCityValid}
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">UF</label>
                  <ValidatedInput
                    value={addressData.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    isValid={isStateValid}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handleCreatePixPayment}
            disabled={!isFormComplete || isLoading}
            className="w-full h-14 bg-[#28af60] hover:bg-[#23994f] text-white rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Gerando PIX...</>
            ) : (
              <>
                <PixIcon className="h-5 w-5 mr-2" />
                Pagar R$ {total.toFixed(2).replace(".", ",")} com PIX
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-[#28af60]" />
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4 text-[#28af60]" />
              <span>Frete grátis</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Upsell Page
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center">
          <Link to="/">
            <img src={logo} alt="Max Runner" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      {/* Success Banner - Simple */}
      <div className="bg-[#28af60] text-white py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Pedido confirmado! Aproveite esta oferta exclusiva:</span>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Timer - Clean */}
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Oferta expira em</span>
          <span className="font-mono font-bold text-gray-900">{formatTime(timeLeft)}</span>
        </div>

        {/* Section Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete seu Kit</h2>
          <p className="text-gray-500">Desconto exclusivo para clientes Max Runner</p>
        </div>

        {/* Individual Products */}
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-4 border border-gray-200 flex gap-4 hover:border-gray-300 transition-colors"
            >
              <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                  {product.shortName}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSelectProduct(product.id)}
                    className="h-9 bg-[#28af60] hover:bg-[#23994f] text-white text-sm px-4"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">OU LEVE TUDO</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Bundle Offer */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Kit Completo</h3>
              <p className="text-sm text-gray-500">Meias + Óculos + Pochete</p>
            </div>
            <span className="bg-[#28af60] text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          </div>

          {/* Bundle Products Preview */}
          <div className="flex gap-2 mb-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Bundle Pricing */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm text-gray-400 line-through mr-2">
                R$ {bundleOriginalPrice.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                R$ {bundlePrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="text-xs text-gray-500">Frete grátis</div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={handleSelectBundle}
            className="w-full h-12 bg-[#28af60] hover:bg-[#23994f] text-white font-semibold rounded-lg"
          >
            Quero o Kit Completo
          </Button>
        </div>

        {/* Skip Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate("/obrigado")}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Não, obrigado →
          </button>
        </div>
      </main>
    </div>
  );
};

export default Upsell;
