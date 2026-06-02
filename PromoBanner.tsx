import { useState, useEffect } from 'react';
import { Sparkles, Gift } from 'lucide-react';

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 54, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 3 hours for demo continuity
          return { hours: 3, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-neutral-900 text-white text-xs md:text-sm py-2 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-neutral-800">
      <div className="flex items-center gap-2 font-medium tracking-wide">
        <span className="inline-flex items-center justify-center bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-pulse">
          Offer
        </span>
        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Use code <strong className="text-amber-400 font-mono font-bold">FLASH20</strong> for 20% off everything!</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-neutral-300">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>Free shipping on orders over $150</span>
        </div>
        <div className="h-3 w-px bg-neutral-700 hidden sm:block" />
        <div className="flex items-center gap-1.5 font-mono text-neutral-300">
          <span>Ends in:</span>
          <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-400 font-bold">
            {formatNumber(timeLeft.hours)}
          </span>
          <span>:</span>
          <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-400 font-bold">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span>:</span>
          <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-400 font-bold">
            {formatNumber(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
