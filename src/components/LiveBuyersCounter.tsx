import { useState, useEffect } from "react";
import { Users, Eye } from "lucide-react";

const LiveBuyersCounter = () => {
  const [viewersCount, setViewersCount] = useState(0);
  const [buyersCount, setBuyersCount] = useState(0);

  useEffect(() => {
    // Initialize with realistic random values
    setViewersCount(Math.floor(Math.random() * 15) + 12); // 12-26
    setBuyersCount(Math.floor(Math.random() * 5) + 3); // 3-7

    // Simulate live updates
    const interval = setInterval(() => {
      // Randomly fluctuate viewers (-2 to +3)
      setViewersCount((prev) => {
        const change = Math.floor(Math.random() * 6) - 2;
        const newValue = prev + change;
        return Math.max(8, Math.min(35, newValue));
      });

      // Occasionally update buyers
      if (Math.random() > 0.7) {
        setBuyersCount((prev) => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newValue = prev + change;
          return Math.max(2, Math.min(12, newValue));
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3">
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Eye className="h-4 w-4 text-orange-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <span className="text-orange-700">
            <span className="font-bold">{viewersCount}</span> vendo agora
          </span>
        </div>
        <div className="w-px h-4 bg-orange-300" />
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-green-600" />
          <span className="text-green-700">
            <span className="font-bold">{buyersCount}</span> comprando
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveBuyersCounter;
