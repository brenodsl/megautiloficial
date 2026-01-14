import { Flame } from "lucide-react";

const ScarcityBanner = () => {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
      <Flame className="w-4 h-4 animate-bounce" />
      <span className="tracking-wide">ÚLTIMAS UNIDADES</span>
    </div>
  );
};

export default ScarcityBanner;