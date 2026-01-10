import { useState, useEffect } from "react";
import { Flame, AlertTriangle } from "lucide-react";

const ScarcityBanner = () => {
  const [stock, setStock] = useState(23);
  const [viewers, setViewers] = useState(47);

  // Simulate stock decrease and viewers change
  useEffect(() => {
    const stockInterval = setInterval(() => {
      setStock((prev) => Math.max(5, prev - (Math.random() > 0.7 ? 1 : 0)));
    }, 30000);

    const viewersInterval = setInterval(() => {
      setViewers((prev) => Math.max(30, Math.min(100, prev + Math.floor(Math.random() * 5) - 2)));
    }, 5000);

    return () => {
      clearInterval(stockInterval);
      clearInterval(viewersInterval);
    };
  }, []);

  const stockPercentage = (stock / 50) * 100;

  return (
    <div className="space-y-3">
      {/* Stock Warning */}
      <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/30 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-destructive">
            Estoque Limitado!
          </p>
          <p className="text-xs text-muted-foreground">
            Restam apenas <span className="font-bold text-destructive">{stock} unidades</span>
          </p>
        </div>
      </div>

      {/* Stock Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-destructive to-warning transition-all duration-500"
            style={{ width: `${stockPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {stock} de 50 unidades disponíveis
        </p>
      </div>

      {/* Live Viewers */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{viewers} pessoas</span> estão vendo agora
        </span>
      </div>

      {/* Promo Badge */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/30 p-3">
        <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
        <p className="text-sm font-medium text-orange-600">
          Promoção válida até durar o estoque!
        </p>
      </div>
    </div>
  );
};

export default ScarcityBanner;
