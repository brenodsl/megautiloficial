import { useState, useEffect } from "react";
import { X, Gift, Timer } from "lucide-react";
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
      <div className="relative w-full max-w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-accent p-4 text-white text-center">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold">ESPERA! 🎁</h2>
          <p className="text-white/90 text-xs">Oferta especial para você</p>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3 border-2 border-dashed border-primary mb-3">
            <span className="text-4xl font-black text-primary">35%</span>
            <span className="text-xl font-bold text-primary ml-1">OFF</span>
            <p className="text-xs text-muted-foreground mt-1">Cupom de primeira compra</p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-4 bg-destructive/10 rounded-lg p-2">
            <Timer className="w-4 h-4 text-destructive animate-pulse" />
            <span className="text-xs text-muted-foreground">Expira em:</span>
            <span className="font-mono font-bold text-destructive">{formatTime(timeLeft)}</span>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleApply}
            size="sm"
            className="w-full h-11 font-bold text-sm rounded-xl gradient-cta text-white glow-cta hover:opacity-90 transition-all"
          >
            <Gift className="w-4 h-4 mr-2" />
            APLICAR CUPOM
          </Button>

          <p className="text-[10px] text-muted-foreground mt-2">
            Válido apenas para esta sessão
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbandonmentCouponModal;
