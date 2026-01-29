import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// Product images
import cameraMain from "@/assets/camera-main.png";
import productFerramentas from "@/assets/product-ferramentas.webp";
import productMacaco from "@/assets/product-macaco.webp";
import productPneus from "@/assets/product-pneus.webp";
import productBarbeador from "@/assets/product-barbeador.webp";
import productCalcas from "@/assets/product-calcas.webp";
import productCaixaSom from "@/assets/product-caixa-som.webp";

interface Product {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  rating: number;
  reviews: number;
  isAvailable: boolean;
  href: string;
}

const products: Product[] = [
  {
    id: "camera-wifi",
    name: "Câmera Wi-Fi com Sensor de Movimento, Alarme Automático e à Prova d'Água",
    image: cameraMain,
    originalPrice: 157.00,
    salePrice: 65.80,
    rating: 4.5,
    reviews: 127,
    isAvailable: true,
    href: "/",
  },
  {
    id: "ferramentas",
    name: "Kit Jogo de Ferramentas 255 Peças com Maleta Completa + Parafusadeira 12V e Jogo De Soquetes",
    image: productFerramentas,
    originalPrice: 489.90,
    salePrice: 289.90,
    rating: 4.8,
    reviews: 89,
    isAvailable: false,
    href: "#",
  },
  {
    id: "macaco",
    name: "Kit De Macaco Elétrico Para Carro 5t 12V Com Chave De Impacto",
    image: productMacaco,
    originalPrice: 599.90,
    salePrice: 349.90,
    rating: 4.7,
    reviews: 56,
    isAvailable: false,
    href: "#",
  },
  {
    id: "pneus",
    name: "Kit 2 Pneus 175/75 R14 Neupar ECO809 87T Novos Aro 14",
    image: productPneus,
    originalPrice: 699.90,
    salePrice: 459.90,
    rating: 4.6,
    reviews: 34,
    isAvailable: false,
    href: "#",
  },
  {
    id: "barbeador",
    name: "Máquina de Cortar Pelos com Luz LED e Suporte – Ideal para Virilha, Peito e Axilas",
    image: productBarbeador,
    originalPrice: 179.90,
    salePrice: 89.90,
    rating: 4.4,
    reviews: 203,
    isAvailable: false,
    href: "#",
  },
  {
    id: "calcas",
    name: "Kit Calças Jeans Masculina Premium Skinny Corte tradicional Basico com Lycra",
    image: productCalcas,
    originalPrice: 299.90,
    salePrice: 159.90,
    rating: 4.3,
    reviews: 167,
    isAvailable: false,
    href: "#",
  },
  {
    id: "caixa-som",
    name: "Caixa de som Bluetooth Portátil Com Led RGB FM USB TWS 30W Para Praia, Festa ou Viagem",
    image: productCaixaSom,
    originalPrice: 249.90,
    salePrice: 129.90,
    rating: 4.5,
    reviews: 98,
    isAvailable: false,
    href: "#",
  },
];

const ProductCard = ({ product }: { product: Product }) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  );

  const CardWrapper = product.isAvailable ? Link : "div";
  const cardProps = product.isAvailable
    ? { to: product.href }
    : { className: "cursor-not-allowed" };

  return (
    <CardWrapper
      {...(cardProps as any)}
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all relative ${
        !product.isAvailable ? "opacity-75" : ""
      }`}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isAvailable ? (
          <Badge className="bg-success text-white text-[10px] font-bold">
            -{discountPercent}% OFF
          </Badge>
        ) : (
          <Badge className="bg-muted-foreground text-white text-[10px] font-bold">
            ESGOTADO
          </Badge>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square bg-secondary/30 p-4 relative">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain ${
            !product.isAvailable ? "grayscale" : ""
          }`}
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center">
            <span className="bg-foreground/80 text-white text-sm font-bold px-4 py-2 rounded-lg">
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground line-through">
            R$ {product.originalPrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-lg font-bold text-primary">
            R$ {product.salePrice.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-[10px] text-success font-medium">
            à vista no PIX
          </p>
        </div>

        {/* Button */}
        {product.isAvailable ? (
          <div className="mt-3">
            <span className="block w-full text-center bg-primary text-white text-sm font-bold py-2.5 rounded-lg">
              Ver Produto
            </span>
          </div>
        ) : (
          <div className="mt-3">
            <span className="block w-full text-center bg-muted text-muted-foreground text-sm font-medium py-2.5 rounded-lg">
              Avise-me
            </span>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

const Store = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Nossa Loja</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Confira todos os nossos produtos com os melhores preços
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-secondary/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            🔔 Os produtos esgotados estarão disponíveis em breve. Fique atento!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Store;
