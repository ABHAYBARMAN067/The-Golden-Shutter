import { useEffect, useState, useRef } from 'react';
import logo1 from '../assets/logo1.png';

const WelcomeSplash = () => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F5F1E8] flex items-center justify-center animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-[#9B7653]/20 via-[#F5F1E8] to-[#9B7653]/10" />

      <div className="relative text-center">
        <div className="mb-6 animate-bounce">
          <div className="w-24 h-24 rounded-full border-2 border-[#9B7653] flex items-center justify-center mx-auto">
            <img
              src={logo1}
              alt="The Golden Shutter Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[#9B7653] text-sm tracking-widest uppercase font-semibold animate-in fade-in duration-700 fill-mode-forwards">
            Welcome to
          </div>

          <h1 className="typing-text mt-3 text-2xl md:text-4xl font-serif italic text-[#2C2C2C] animate-in fade-in duration-1000 fill-mode-forwards">
            THE GOLDEN SHUTTER
          </h1>

          <div className="text-[#6A6A6A] text-sm mt-4 animate-in fade-in duration-1000 delay-300 fill-mode-forwards">
            Capturing Your Cinematic Story
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#9B7653] animate-pulse" />
          <div
            className="w-2 h-2 rounded-full bg-[#9B7653] animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-[#9B7653] animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>

      <style>{`
        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid #2C2C2C;
          width: 0;
          animation:
            typing 2.5s steps(20, end) forwards,
            blinkCursor 0.8s step-end infinite;
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 20ch
          }
        }

        @keyframes blinkCursor {
          50% {
            border-color: transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeSplash;

