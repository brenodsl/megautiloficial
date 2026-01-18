import { useState } from "react";
import { Gift, X } from "lucide-react";
import oculosImg from "@/assets/oculos-brinde.jpg";

const FloatingGiftBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-[280px] animate-fade-in">
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="w-3 h-3 text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 flex items-center gap-2">
          <Gift className="w-4 h-4 text-white animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            Brinde Exclusivo
          </span>
          <span className="ml-auto text-[10px] text-white/90 font-medium">
            Só hoje!
          </span>
        </div>

        {/* Content */}
        <div className="p-3 flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
            <img
              src={oculosImg}
              alt="Óculos Esportivo UV"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              Óculos Esportivo UV
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Proteção UV • Unissex
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 line-through">R$ 89,90</span>
              <span className="text-xs font-bold text-green-600">GRÁTIS</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 pb-2">
          <p className="text-[10px] text-gray-400 text-center">
            Na compra do seu tênis hoje
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingGiftBanner;
