import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const OfferTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // Set to midnight (00:00) of the next day
      
      const diff = midnight.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 px-4">
      <div className="max-w-lg mx-auto flex items-center justify-center gap-3">
        <Clock className="h-4 w-4 text-[#28af60]" />
        <span className="text-sm font-medium">Oferta encerra hoje em</span>
        <div className="flex items-center gap-1">
          <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-sm font-bold font-mono">{formatNumber(timeLeft.hours)}</span>
          </div>
          <span className="text-[#28af60] font-bold">:</span>
          <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-sm font-bold font-mono">{formatNumber(timeLeft.minutes)}</span>
          </div>
          <span className="text-[#28af60] font-bold">:</span>
          <div className="bg-white/10 backdrop-blur-sm rounded px-2 py-1">
            <span className="text-sm font-bold font-mono">{formatNumber(timeLeft.seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferTimer;
