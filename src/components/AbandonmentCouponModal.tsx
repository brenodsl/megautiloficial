import { useState, useEffect } from "react";
import { X, Gift, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AbandonmentCouponModalProps {
  onApplyCoupon: () => void;
  onClose: () => void;
}

const AbandonmentCouponModal = ({ onApplyCoupon, onClose }: AbandonmentCouponModalProps) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApply = () => {
    localStorage.setItem('coupon_applied', 'true');
    localStorage.setItem('coupon_discount', '35');
    onApplyCoupon();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary via-primary to-accent p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute bottom-4 right-6 animate-pulse delay-150">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="absolute top-8 right-12 animate-pulse delay-300">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black mb-1">ESPERA! 🎁</h2>
            <p className="text-white/90 text-sm">Temos uma oferta especial para você</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Cupom exclusivo de primeira compra:</p>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 border-2 border-dashed border-primary">
              <span className="text-5xl font-black text-primary">35%</span>
              <span className="text-2xl font-bold text-primary ml-1">OFF</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Use agora e garanta o melhor preço!
          </p>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-5 bg-destructive/10 rounded-xl p-3">
            <Timer className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-sm text-gray-600">Este cupom expira em:</span>
            <span className="font-mono font-bold text-destructive text-lg">{formatTime(timeLeft)}</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleApply}
            size="lg"
            className="w-full h-14 font-bold text-lg rounded-xl gradient-cta text-white glow-cta hover:opacity-90 transition-all"
          >
            <Gift className="w-5 h-5 mr-2" />
            APLICAR CUPOM DE 35%
          </Button>

          <p className="text-xs text-gray-400 mt-3">
            Válido apenas para esta sessão
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbandonmentCouponModal;
