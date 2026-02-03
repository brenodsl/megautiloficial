import { AlertTriangle } from "lucide-react";

const ScarcityBanner = () => {
  return (
    <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2.5 rounded-lg">
      <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
      </span>
      <span className="text-sm font-semibold">
        ⚠️ Restam apenas <span className="font-black">6 unidades</span> no estoque!
      </span>
    </div>
  );
};

export default ScarcityBanner;
