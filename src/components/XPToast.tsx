import { useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { addXP } from "../utils/xp";

interface XPToastProps {
  label: string;
  xp: number;
  onDone?: () => void;
}

/**
 * Full-screen XP burst overlay — shows confetti + "+N XP" for 2.5s then calls onDone.
 * Usage: conditionally render this when you want to award XP.
 */
export default function XPToast({ label, xp, onDone }: XPToastProps) {
  const awarded = useRef(false);

  useEffect(() => {
    if (!awarded.current) {
      awarded.current = true;
      addXP(label, xp);
    }
    const t = setTimeout(() => onDone?.(), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-9999 pointer-events-none flex items-center justify-center">
      {/* Lottie confetti — full screen */}
      <div className="absolute inset-0">
        <DotLottieReact
          src="/confetti.lottie"
          autoplay
          loop={false}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* XP badge */}
      <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-green-400 px-10 py-6 text-center animate-bounce">
        <div className="text-4xl mb-1">⭐</div>
        <div className="text-4xl font-extrabold text-green-600">+{xp} XP</div>
        <div className="text-gray-600 text-sm mt-1 font-medium">{label}</div>
      </div>
    </div>
  );
}
