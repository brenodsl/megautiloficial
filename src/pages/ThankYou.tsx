import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Mail, Truck, Clock, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-max-runner.png";
import { usePresence } from "@/hooks/usePresence";

interface OrderData {
  items: Array<{
    colorName: string;
    size: number;
    quantity: number;
    price: number;
  }>;
  customer: {
    name: string;
    email: string;
  };
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  totalAmount: number;
  shippingPrice: number;
  transactionId: string;
}

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state as OrderData | null;
  
  // Track presence on thank you page
  usePresence("/obrigado");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // TikTok Pixel - CompletePayment event (only fires after payment confirmation)
    if (orderData && typeof window !== 'undefined' && (window as any).ttq) {
      (window as any).ttq.track('CompletePayment', {
        content_type: 'product',
        content_id: 'carbon-3-0',
        content_name: 'Tênis de Corrida Chunta Carbon 3.0',
        quantity: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
        value: orderData.totalAmount,
        currency: 'BRL',
      });
    }
  }, [orderData]);

  // Redirect if no order data
  useEffect(() => {
    if (!orderData) {
      navigate("/");
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  // Calculate estimated delivery date (5 business days from now)
  const getEstimatedDelivery = () => {
    const today = new Date();
    let businessDays = 0;
    const deliveryDate = new Date(today);
    
    while (businessDays < 5) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      const dayOfWeek = deliveryDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }
    
    return deliveryDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center">
          <Link to="/">
            <img src={logo} alt="Max Runner" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#28af60]/10 flex items-center justify-center animate-pulse">
            <CheckCircle className="h-12 w-12 text-[#28af60]" />
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Obrigado pela sua compra, {orderData.customer.name.split(" ")[0]}! 🎉
          </h1>
          <p className="text-gray-600">
            Seu pedido foi confirmado e está sendo preparado com carinho.
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-1">Número do pedido</p>
          <p className="font-mono font-bold text-lg text-gray-900">
            #{orderData.transactionId.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-[#28af60]" />
            <h2 className="font-semibold text-gray-900">Itens do pedido</h2>
          </div>
          
          <div className="space-y-3">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Tênis Carbon 3.0</p>
                  <p className="text-sm text-gray-500">
                    {item.colorName} • Tam. {item.size} • Qtd: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900">
                R$ {(orderData.totalAmount - orderData.shippingPrice).toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Frete</span>
              <span className="text-gray-900">
                {orderData.shippingPrice === 0 ? (
                  <span className="text-[#28af60]">Grátis</span>
                ) : (
                  `R$ ${orderData.shippingPrice.toFixed(2).replace(".", ",")}`
                )}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#28af60]">
                R$ {orderData.totalAmount.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Home className="h-5 w-5 text-[#28af60]" />
            <h2 className="font-semibold text-gray-900">Endereço de entrega</h2>
          </div>
          <p className="text-gray-600 text-sm">
            {orderData.address.street}, {orderData.address.number}
            {orderData.address.complement && ` - ${orderData.address.complement}`}
          </p>
          <p className="text-gray-600 text-sm">
            {orderData.address.neighborhood} - {orderData.address.city}/{orderData.address.state}
          </p>
          <p className="text-gray-600 text-sm">CEP: {orderData.address.zipCode}</p>
        </div>

        {/* Delivery Estimate */}
        <div className="bg-[#28af60]/5 rounded-2xl p-4 border border-[#28af60]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#28af60]/10 flex items-center justify-center flex-shrink-0">
              <Truck className="h-5 w-5 text-[#28af60]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Previsão de entrega</h3>
              <p className="text-sm text-gray-600 mb-2">
                Seu pedido deve chegar até <span className="font-semibold text-[#28af60]">{getEstimatedDelivery()}</span>
              </p>
              <p className="text-xs text-gray-500">
                O prazo estimado é de até 5 dias úteis. Eventuais imprevistos como greves, 
                feriados ou condições climáticas podem causar pequenos atrasos, mas faremos 
                o possível para enviar o mais rápido possível.
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Código de rastreio</h3>
              <p className="text-sm text-gray-600">
                O código de rastreio será enviado para <span className="font-medium">{orderData.customer.email}</span> assim 
                que o produto for postado na transportadora.
              </p>
            </div>
          </div>
        </div>

        {/* Time Info */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Processamento do pedido</h3>
              <p className="text-sm text-gray-600">
                Seu pedido será processado em até 24 horas úteis. Você receberá 
                atualizações por e-mail sobre o status da sua compra.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Store Button */}
        <Button
          onClick={() => navigate("/")}
          className="w-full h-14 bg-[#28af60] hover:bg-[#23994f] text-white rounded-xl text-lg font-semibold"
        >
          Continuar comprando
        </Button>

        {/* Support */}
        <p className="text-center text-sm text-gray-500">
          Dúvidas? Entre em contato pelo nosso WhatsApp ou e-mail de suporte.
        </p>
      </main>
    </div>
  );
};

export default ThankYou;
