import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Lock, 
  User, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  Hash, 
  Home,
  Building,
  Loader2, 
  Copy, 
  CheckCircle,
  ShieldCheck,
  Truck,
  Award,
  Star,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpg";

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

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeText: string;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Format CPF
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

  // Format Phone
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

  // Format CEP
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
          totalAmount: totalPrice,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error(error.message || "Erro ao gerar pagamento");
        return;
      }

      if (data?.success) {
        setPixData({
          qrCode: data.qrCode,
          qrCodeText: data.qrCodeText,
          transactionId: data.transactionId,
        });
        toast.success("QR Code PIX gerado com sucesso!");
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

  const isFormComplete = 
    customerData.name && 
    customerData.document && 
    customerData.phone && 
    customerData.email &&
    addressData.zipCode &&
    addressData.street &&
    addressData.number &&
    addressData.neighborhood &&
    addressData.city &&
    addressData.state;

  // Get first item for display
  const firstItem = items[0];

  if (items.length === 0 && !pixData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Carrinho vazio</h1>
          <p className="text-gray-500 mb-6">Adicione produtos antes de continuar</p>
          <Button onClick={() => navigate("/")} className="bg-[#28af60] hover:bg-[#23994f]">
            Voltar às compras
          </Button>
        </div>
      </div>
    );
  }

  if (pixData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-3 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <Link to="/">
              <img src={logo} alt="Max Runner" className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
              <Lock className="h-3 w-3 text-[#28af60]" />
              <span>Ambiente seguro</span>
            </div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-50 text-[#28af60] px-4 py-2 rounded-full mb-4">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">QR Code gerado!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Escaneie o QR Code
            </h2>
            <p className="text-sm text-gray-500">
              Abra o app do seu banco e escaneie o código
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-center mb-4">
              {pixData.qrCode ? (
                <img
                  src={pixData.qrCode.startsWith("data:") ? pixData.qrCode : `data:image/png;base64,${pixData.qrCode}`}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                  <PixIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {pixData.qrCodeText && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  Ou copie o código PIX:
                </p>
                <Button
                  onClick={handleCopyPixCode}
                  variant="outline"
                  className="w-full gap-2 border-[#28af60] text-[#28af60] hover:bg-green-50"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar código PIX
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-900 mb-2">Valor a pagar:</p>
            <p className="text-2xl font-bold text-[#28af60]">
              R$ {totalPrice.toFixed(2).replace(".", ",")}
            </p>
          </div>

          <Button
            onClick={() => {
              clearCart();
              navigate("/");
            }}
            variant="outline"
            className="w-full"
          >
            Voltar à loja
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/">
            <img src={logo} alt="Max Runner" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
            <Lock className="h-3 w-3 text-[#28af60]" />
            <span>Ambiente seguro</span>
          </div>
        </div>
      </header>

      {/* Security Badge */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock className="h-4 w-4 text-gray-400" />
          <span>Checkout seguro e criptografado</span>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Product Card */}
        {firstItem && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex gap-3">
              <div className="relative">
                <img
                  src={firstItem.colorImage}
                  alt={firstItem.colorName}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#28af60] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Tênis Carbon 3.0</h3>
                <p className="text-sm text-gray-500">{firstItem.colorName} • Tam. {firstItem.size}</p>
                <p className="font-bold text-[#28af60] mt-1">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-600">Estoque limitado para este tamanho</span>
            </div>
          </div>
        )}

        {/* Customer Data Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-[#28af60]" />
            </div>
            <h2 className="font-semibold text-gray-900">Seus dados</h2>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Nome completo"
                value={customerData.name}
                onChange={(e) => handleCustomerChange("name", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="CPF"
                value={customerData.document}
                onChange={(e) => handleCustomerChange("document", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                maxLength={14}
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Telefone"
                value={customerData.phone}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                maxLength={15}
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="E-mail"
                value={customerData.email}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-[#28af60]" />
            </div>
            <h2 className="font-semibold text-gray-900">Endereço de entrega</h2>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="CEP"
                value={addressData.zipCode}
                onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                maxLength={9}
              />
              {isLoadingCep && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}
            </div>
            
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rua / Avenida"
                value={addressData.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Número"
                value={addressData.number}
                onChange={(e) => handleAddressChange("number", e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
              <Input
                placeholder="Complemento"
                value={addressData.complement}
                onChange={(e) => handleAddressChange("complement", e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Bairro"
                value={addressData.neighborhood}
                onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Input
                  placeholder="Cidade"
                  value={addressData.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <Input
                placeholder="UF"
                value={addressData.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-center"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
              <CreditCard className="h-3.5 w-3.5 text-[#28af60]" />
            </div>
            <h2 className="font-semibold text-gray-900">Pagamento</h2>
          </div>
          
          {/* PIX Payment Option */}
          <div className="border-2 border-[#28af60] rounded-xl p-4 bg-green-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QRCodeIcon />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">PIX</span>
                    <span className="text-[10px] font-bold text-[#28af60] bg-green-100 px-1.5 py-0.5 rounded">RECOMENDADO</span>
                  </div>
                  <p className="text-xs text-gray-500">Aprovação instantânea</p>
                  <p className="text-[10px] text-gray-400">Aprovação instantânea • Sem taxas adicionais</p>
                </div>
              </div>
              <span className="font-bold text-[#28af60]">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center gap-6 py-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[#28af60]" />
            </div>
            <span className="text-[10px] text-gray-500 text-center">Pagamento<br/>seguro</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Truck className="h-5 w-5 text-[#28af60]" />
            </div>
            <span className="text-[10px] text-gray-500 text-center">Frete<br/>garantido</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Award className="h-5 w-5 text-[#28af60]" />
            </div>
            <span className="text-[10px] text-gray-500 text-center">Garantia<br/>90 dias</span>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold text-gray-900">4.9</span>
              <span className="text-sm text-gray-500">(327 avaliações)</span>
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Avaliações reais</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Institucional</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <Link to="/politica-de-privacidade" className="block hover:text-gray-700">Política de Privacidade</Link>
              <Link to="/termos-de-uso" className="block hover:text-gray-700">Termos de Uso</Link>
              <Link to="/politica-de-envio" className="block hover:text-gray-700">Política de Envio</Link>
              <Link to="/politica-de-reembolso" className="block hover:text-gray-700">Política de Reembolso</Link>
              <Link to="/trocas-e-devolucoes" className="block hover:text-gray-700">Trocas e Devoluções</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Atendimento</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Fale Conosco</p>
              <p>E-mail:<br/>contato@maxrunner.com.br</p>
              <p>Horário:<br/>Seg a Sex: 8h às 18h</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Segurança</h3>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Site 100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Conexão Criptografada (SSL)</span>
              </div>
            </div>
            <div className="mt-3 bg-green-50 border border-[#28af60] rounded-lg p-3">
              <p className="text-xs font-semibold text-[#28af60]">Ambiente Protegido</p>
              <p className="text-[10px] text-gray-500">Seus dados são protegidos com criptografia de ponta a ponta.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-inset-bottom">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleCreatePixPayment}
            disabled={isLoading || !isFormComplete}
            className={`w-full h-14 font-medium text-base rounded-full transition-colors gap-2 ${
              isFormComplete && !isLoading
                ? 'bg-[#28af60] hover:bg-[#23994f] text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pagar com segurança
              </>
            )}
          </Button>
          {!isFormComplete && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Preencha todos os campos para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
