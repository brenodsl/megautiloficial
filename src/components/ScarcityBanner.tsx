import { useState, useEffect } from "react";

const ScarcityBanner = () => {
  const [stock, setStock] = useState(48);
  const [viewers, setViewers] = useState(47);

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

  return (
    <div className="space-y-3">
      {/* Stock Info */}
      <div className="bg-white rounded-lg border border-border p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Estoque disponível:</span>
          <span className="font-semibold text-foreground">{stock} unidades</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(stock / 100) * 100}%` }}
          />
        </div>
      </div>

      {/* Live Viewers */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{viewers} pessoas</span> vendo agora
        </span>
      </div>
    </div>
  );
};

export default ScarcityBanner;
