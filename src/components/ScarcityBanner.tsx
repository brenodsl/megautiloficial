import { Zap } from "lucide-react";

const ScarcityBanner = () => {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md">
      <Zap className="w-3.5 h-3.5 fill-current" />
      <span>Últimas unidades</span>
    </div>
  );
};

export default ScarcityBanner;