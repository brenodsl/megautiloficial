import { AlertTriangle } from "lucide-react";

const ScarcityBanner = () => {
  return (
    <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent px-4 py-2.5 rounded-lg">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-semibold">Últimas unidades com 58% OFF!</span>
    </div>
  );
};

export default ScarcityBanner;
