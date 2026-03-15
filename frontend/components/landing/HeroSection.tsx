"use client";
import {
  motion,
  Variants,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const TERMINAL_LINES = [
  { prefix: "$ ", text: "init --event townhall_2026", color: "#facc15" },
  { prefix: "> ", text: "status: ARENA_READY", color: "#ffffff" },
  { prefix: "$ ", text: "deploy --org coding_club_nits", color: "#facc15" },
  { prefix: "✓ ", text: "LET IT RIP.", color: "#facc15" },
];

const TerminalWidget = () => {
  const [lines, setLines] = useState<
    { prefix: string; text: string; color: string; done: boolean }[]
  >([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[currentLine];
    if (currentChar === 0) {
      setLines((prev) => [...prev, { ...line, text: "", done: false }]);
    }
    if (currentChar < line.text.length) {
      const t = setTimeout(() => {
        setLines((prev) =>
          prev.map((l, i) =>
            i === prev.length - 1
              ? { ...l, text: line.text.slice(0, currentChar + 1) }
              : l,
          ),
        );
        setCurrentChar((c) => c + 1);
      }, 30);
      return () => clearTimeout(t);
    } else {
      setLines((prev) =>
        prev.map((l, i) => (i === prev.length - 1 ? { ...l, done: true } : l)),
      );
      const t = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="font-mono text-[10px] sm:text-sm rounded-xl overflow-hidden border border-yellow-400/20 bg-black/80 backdrop-blur-xl w-full max-w-sm md:max-w-md shadow-2xl"
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="ml-2 text-white/20 text-[9px] uppercase tracking-widest font-custom">
          system.console
        </span>
      </div>
      <div className="px-4 py-4 space-y-2 min-h-[120px]">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              style={{ color: line.color }}
              className="shrink-0 font-bold opacity-50"
            >
              {line.prefix}
            </span>
            <span
              style={{ color: line.color }}
              className="opacity-90 leading-relaxed"
            >
              {line.text}
            </span>
            {!line.done && i === lines.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-yellow-400"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function HeroSection() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the movement
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    // Normalize values between -0.5 and 0.5
    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black px-4 pt-24 pb-12 lg:py-0"
    >
      {/*Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.gif"
          alt="Background"
          fill
          priority
          className="object-cover opacity-20 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black" />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-yellow-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mt-20 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 h-full">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col sm:-mt-70 -mt-30 items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8 w-full order-1 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-yellow-400/80 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-custom">
              Coding Club · NIT Silchar
            </span>
          </motion.div>

          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] sm:text-xs tracking-[0.6em] uppercase text-white font-mono"
            >
              presents
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl sm:text-7xl lg:text-9xl font-black text-white tracking-tighter font-custom italic uppercase leading-[0.85]"
              style={{ textShadow: "0 0 40px rgba(250,204,21,0.2)" }}
            >
              Town<span className="text-yellow-400">hall</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="h-px w-8 sm:w-12 bg-yellow-400/50" />
              <span className="text-3xl sm:text-5xl font-black text-white tracking-[0.15em] font-custom">
                2026
              </span>
              <div className="h-px w-8 sm:w-12 bg-yellow-400/50" />
            </motion.div>
          </div>

          <TerminalWidget />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="hidden lg:block text-[10px] text-white/60 tracking-[0.3em] font-mono uppercase"
          >
            &gt; arena_mode: active // protocol: let_it_rip
          </motion.div>
        </div>

        {/* Tyson  */}
        <div className="flex-1 order-2 flex items-center justify-center relative w-full lg:order-2">
          {/* Background spinning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] border border-yellow-400/10 rounded-full border-dashed pointer-events-none"
          />

          {/* 3D Motion Container */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              perspective: 1000,
              transformStyle: "preserve-3d",
            }}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 60,
            }}
            className="relative z-10 w-[280px] sm:w-[450px] lg:w-[550px]"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/images/ash.png"
                alt="Hero Character"
                width={600}
                height={600}
                unoptimized
                className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(250,204,21,0.15))",
                  translateZ: "50px",
                }}
              />
            </motion.div>

            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
          </motion.div>
        </div>
      </div>

      {/*Mobile Footer Helper*/}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-1 h-8 rounded-full bg-gradient-to-b from-yellow-400 to-transparent opacity-20"
        />
      </div>
    </section>
  );
}
