"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const battlePhrases = [
  "READY...",
  "3...",
  "2...",
  "1...",
  "GO SHOOT!",
  "LET IT RIP!",
];

export default function BeybladePreloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Loading Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 20) setPhraseIndex(0);
    else if (progress < 40) setPhraseIndex(1);
    else if (progress < 60) setPhraseIndex(2);
    else if (progress < 80) setPhraseIndex(3);
    else if (progress < 95) setPhraseIndex(4);
    else setPhraseIndex(5);
  }, [progress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fa4141_0.5px,transparent_0.5px),radial-gradient(#4182fa_0.5px,transparent_0.5px)] bg-[size:40px_40px]" />

          <div className="relative w-full max-w-4xl flex flex-col items-center px-6">
            {/* TOP HEADER */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-12 text-center"
            >
              <h2 className="text-yellow-400 font-custom italic text-xl tracking-[0.5em] mb-2">
                TOWNHALL 2026
              </h2>
              <div className="h-[2px] w-32 bg-yellow-400 mx-auto" />
            </motion.div>

            {/* THE BATTLE ARENA */}
            <div className="relative w-full h-64 flex items-center justify-between">
              {/* LEFT BLADE (RED) */}
              <motion.div
                animate={{
                  x: progress > 80 ? [0, 150, 120] : 0,
                  rotate: progress * 20,
                  scale: progress > 90 ? 1.2 : 1,
                }}
                className="relative z-20"
              >
                <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full" />
                <BeybladeSVG color="#ff1e1e" glow="#ff9100" />
              </motion.div>

              {/* VS TEXT */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={phraseIndex}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="text-5xl md:text-7xl font-custom italic font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    {progress > 90 ? "RIP!" : "VS"}
                  </motion.h1>
                </AnimatePresence>
              </div>

              {/* RIGHT BLADE (BLUE) */}
              <motion.div
                animate={{
                  x: progress > 80 ? [0, -150, -120] : 0,
                  rotate: -(progress * 20),
                  scale: progress > 90 ? 1.2 : 1,
                }}
                className="relative z-20"
              >
                <div className="absolute inset-0 bg-blue-600/30 blur-2xl rounded-full" />
                <BeybladeSVG color="#1e90ff" glow="#00ffff" />
              </motion.div>
            </div>

            {/* PROGRESS SECTION */}
            <div className="w-full max-w-md mt-16 space-y-4">
              <div className="flex justify-between items-end font-custom italic">
                <span className="text-white text-lg">
                  {battlePhrases[phraseIndex]}
                </span>
                <span className="text-yellow-400 text-3xl">{progress}%</span>
              </div>

              {/* THE TRACK */}
              <div className="relative h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                />
              </div>

              <p className="text-center text-[10px] text-white/40 tracking-[0.3em] font-mono">
                INITIALIZING BIT-BEAST PROTOCOL // STADIUM READY
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BeybladeSVG({ color, glow }: { color: string; glow: string }) {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 100 100"
      className="drop-shadow-2xl"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="10 5"
        opacity="0.5"
      />

      {/* Attack Layers */}
      {[0, 90, 180, 270].map((r) => (
        <g key={r} transform={`rotate(${r} 50 50)`}>
          <path d="M50 5 L65 30 L50 25 L35 30 Z" fill={color} />
          <path d="M50 15 L58 30 L50 28 L42 30 Z" fill={glow} opacity="0.8" />
        </g>
      ))}

      {/* Center Bit Chip */}
      <rect
        x="35"
        y="35"
        width="30"
        height="30"
        rx="2"
        fill="#111"
        stroke={color}
        strokeWidth="3"
      />
      <circle cx="50" cy="50" r="8" fill={glow} filter="url(#glow)" />

      {/* Spin Detail */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  );
}
