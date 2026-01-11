import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Loader2, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

// PIX Icon Component
const PixIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" className={className} fill="currentColor">
    <path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.191 33.046 22 53.12 22h15.098l-97.138 97.139c-30.326 30.327-79.505 30.327-109.831 0L103.472 391.19zm0-270.38c20.056 0 38.928 7.808 53.12 22l76.693 76.692c5.551 5.57 14.6 5.57 20.15 0l76.989-76.989c14.191-14.191 33.046-22 53.12-22h15.098L310.412 23.384c-30.326-30.327-79.505-30.327-109.831 0l-97.138 97.138zm280.068 180.761l45.882-45.882c30.327-30.327 30.327-79.505 0-109.831l-45.882-45.882c-14.191 14.191-33.046 22-53.12 22h-15.098c-20.056 0-38.928-7.808-53.12-22L193.313 177.97c-5.385 5.404-14.765 5.384-20.15 0l-76.989-76.989c-14.191-14.191-33.046-22-53.12-22H26.356l45.882 45.882c30.327 30.327 30.327 79.505 0 109.831l-45.882 45.882c14.191-14.191 33.046-22 53.12-22h15.098c20.056 0 38.928 7.808 53.12 22l77.989 77.989c5.551 5.57 14.6 5.57 20.15 0l76.989-76.989c14.191-14.191 33.046-22 53.12-22h15.098c20.074 0 38.928-7.808 53.12-22z"/>
  </svg>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCode: string;
    qrCodeText: string;
    transactionId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === "document") {
      formattedValue = formatCPF(value);
    } else if (field === "phone") {
      formattedValue = formatPhone(value);
    }
    setCustomerData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleCreatePixPayment = async () => {
    if (!customerData.name || !customerData.email || !customerData.document) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

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

  if (items.length === 0 && !pixData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold text-foreground mb-2">Carrinho vazio</h1>
        <p className="text-muted-foreground mb-6">Adicione produtos antes de continuar</p>
        <Button onClick={() => navigate("/")} className="bg-black hover:bg-black/90">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às compras
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-white py-4 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-lg">Finalizar Compra</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {!pixData ? (
          <>
            {/* Cart Items */}
            <section className="space-y-3">
              <h2 className="font-semibold text-foreground">Seus Produtos</h2>
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-card rounded-xl p-3 border border-border">
                  <img
                    src={item.colorImage}
                    alt={item.colorName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      Tênis Chunta Carbon 3.0
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Cor: {item.colorName} | Tam: {item.size}
                    </p>
                    <p className="font-bold text-success mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Total */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-success font-medium">Grátis</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg text-success">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            {/* Customer Data Form */}
            <section className="space-y-4">
              <h2 className="font-semibold text-foreground">Seus Dados</h2>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Nome completo *</Label>
                  <Input
                    id="name"
                    placeholder="Digite seu nome"
                    value={customerData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={customerData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={customerData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="mt-1"
                    maxLength={15}
                  />
                </div>
                
                <div>
                  <Label htmlFor="document">CPF/CNPJ *</Label>
                  <Input
                    id="document"
                    placeholder="000.000.000-00"
                    value={customerData.document}
                    onChange={(e) => handleInputChange("document", e.target.value)}
                    className="mt-1"
                    maxLength={18}
                  />
                </div>
              </div>
            </section>

            {/* Payment Button */}
            <Button
              onClick={handleCreatePixPayment}
              disabled={isLoading}
              className="w-full h-14 bg-black hover:bg-black/90 text-white font-bold text-base gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <PixIcon />
                  Pagar com PIX
                </>
              )}
            </Button>
          </>
        ) : (
          /* PIX QR Code Display */
          <section className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">QR Code gerado!</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Escaneie o QR Code
              </h2>
              <p className="text-sm text-muted-foreground">
                Abra o app do seu banco e escaneie o código abaixo
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex justify-center mb-4">
                {pixData.qrCode ? (
                  <img
                    src={pixData.qrCode.startsWith("data:") ? pixData.qrCode : `data:image/png;base64,${pixData.qrCode}`}
                    alt="QR Code PIX"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 bg-muted flex items-center justify-center rounded-lg">
                    <PixIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Copy Code Button */}
              {pixData.qrCodeText && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Ou copie o código PIX:
                  </p>
                  <Button
                    onClick={handleCopyPixCode}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-success" />
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

            {/* Order Summary */}
            <div className="bg-muted/50 rounded-xl p-4">
              <h3 className="font-semibold mb-3">Resumo do Pedido</h3>
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.colorName} - Tam {item.size}
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
              <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-success">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
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
          </section>
        )}
      </main>
    </div>
  );
};

export default Checkout;
