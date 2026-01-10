import { useState, useEffect } from "react";
import { CheckCircle, Gift, Clock, Zap, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import meiasImg from "@/assets/upsell-meias.png";
import oculosImg from "@/assets/upsell-oculos.png";
import pocheteImg from "@/assets/upsell-pochete.png";

const products = [
  {
    id: 1,
    name: "Kit 03 Pares Meia Corrida HUPI Run",
    description: "Preto, Branco e Amarelo - Conforto máximo para suas corridas",
    originalPrice: 69.70,
    price: 24.90,
    image: meiasImg,
    url: "https://pay.maxrunnerpay.shop/6961c0d728b895ed414a4018",
  },
  {
    id: 2,
    name: "Óculos de Sol Esportivo Summer Pro",
    description: "Lente Azul Espelhada - Proteção UV400 para treinos ao ar livre",
    originalPrice: 109.20,
    price: 38.00,
    image: oculosImg,
    url: "https://pay.maxrunnerpay.shop/6961c1be9ca2d62a65455225",
  },
  {
    id: 3,
    name: "Pochete de Corrida Hidrolight",
    description: "Compartimento para garrafa - Ideal para longas distâncias",
    originalPrice: 78.40,
    price: 28.00,
    image: pocheteImg,
    url: "https://pay.maxrunnerpay.shop/6961c141c4b1fc0d57af6184",
  },
];

const bundleUrl = "https://pay.maxrunnerpay.shop/6961c264c4b1fc0d57af6648";
const bundleOriginalPrice = 69.70 + 109.20 + 78.40; // 257.30
const bundlePrice = 47.90;

const Upsell = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const discount = Math.round(((bundleOriginalPrice - bundlePrice) / bundleOriginalPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
      {/* Success Header */}
      <div className="bg-green-600 text-white py-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-8 h-8" />
            <h1 className="text-xl font-bold">Pedido Confirmado!</h1>
          </div>
          <p className="text-green-100 text-sm">
            Seu tênis Chunta Carbon 3.0 está sendo preparado para envio
          </p>
        </div>
      </div>

      {/* Exclusive Offer Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Gift className="w-5 h-5 animate-bounce" />
            <span className="font-bold text-lg">OFERTA EXCLUSIVA</span>
            <Gift className="w-5 h-5 animate-bounce" />
          </div>
          <p className="text-sm text-orange-100">
            Disponível apenas para você neste momento!
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-black text-white py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 text-yellow-400" />
          <span className="text-sm">Esta oferta expira em:</span>
          <span className="bg-red-600 px-3 py-1 rounded font-mono font-bold text-lg">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Individual Products */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Complemente seu treino
          </h2>

          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md border border-muted p-4 flex gap-4"
              >
                <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm leading-tight mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = product.url}
                  >
                    Adicionar ao Pedido
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bundle Offer */}
        <div className="relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-xs font-bold z-10">
            🔥 MELHOR OFERTA - ECONOMIA DE {discount}%
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-400 rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-foreground mb-1">
                🎁 Kit Completo do Corredor
              </h3>
              <p className="text-sm text-muted-foreground">
                Leve os 3 produtos por um preço especial
              </p>
            </div>

            {/* Bundle Products Preview */}
            <div className="flex justify-center gap-2 mb-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow-sm border border-orange-200"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Bundle Items List */}
            <div className="bg-white rounded-lg p-3 mb-4">
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Kit 03 Pares Meia Corrida HUPI</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Óculos de Sol Esportivo Summer Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Pochete de Corrida Hidrolight</span>
                </li>
              </ul>
            </div>

            {/* Bundle Pricing */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-lg text-muted-foreground line-through">
                  R$ {bundleOriginalPrice.toFixed(2).replace(".", ",")}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  -{discount}%
                </span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                R$ 47,90
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Apenas neste momento • Oferta exclusiva
              </p>
            </div>

            {/* Benefits */}
            <div className="flex justify-center gap-4 mb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4 text-green-600" />
                <span>Envio junto</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Garantia 30 dias</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-lg font-bold py-6 rounded-xl shadow-lg animate-pulse"
              onClick={() => window.location.href = bundleUrl}
            >
              <Gift className="w-5 h-5 mr-2" />
              QUERO O KIT COMPLETO POR R$ 47,90
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              ⚡ Pagamento 100% seguro • Entrega garantida
            </p>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Não, obrigado. Continuar para a loja.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Upsell;
