"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const sectionVar: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
};

const SCROLL_TEXTS = [
  "TOWNHALL 2026",
  "INNOVATE",
  "COLLABORATE",
  "DOMINATE",
  "CODE CAULDRON",
  "QUANT LEAGUE",
  "TYPE RACING",
  "GET HIRED",
  "LOCKOUT",
  "BIT BY BYTE QUIZ",
  "GOBLIN GAMBLE",
  "CAPTURE THE FLAG",
];

export default function AboutSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVar}
      className="relative py-32 px-6 bg-[#050505] overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 right-0 h-24 bg-[#050505] z-20"
        style={{ clipPath: "ellipse(70% 100% at 50% 0%)" }}
      />

      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about_bg.png"
          alt="Section Background"
          fill
          className="object-cover opacity-20 grayscale"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-5 gap-12 items-center mb-32">
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-custom tracking-tighter">
              About <span className="text-yellow-400">TownHall</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-400" />
            <p className="text-white/70 text-2xl leading-relaxed max-w-2xl font-custom font-medium text-balance">
              TownHall is the premier annual technical symposium of{" "}
              <span className="text-yellow-400">Coding Club NIT Silchar</span>.
              It serves as a battleground for innovation, bringing together the
              sharpest minds for high-stakes challenges, collaborative learning,
              and technological excellence.
            </p>
          </div>

          <div className="md:col-span-2 flex justify-center">
            <motion.div
              whileHover={{ rotate: -2, scale: 1.02 }}
              className="p-8 bg-[#080808] border border-white/10 shadow-2xl relative group"
            >
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-400" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-400" />

              <Image
                src="/images/about_image.png"
                alt="About TownHall"
                width={400}
                height={400}
                className="transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>

        <div className="relative w-screen -ml-[calc((100vw-100%)/2)] py-12">
          <div
            className="absolute inset-0"
            style={{ clipPath: "ellipse(80% 100% at 50% 50%)" }}
          />

          {/* <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" /> */}

          <motion.div
            className="flex whitespace-nowrap relative z-10"
            animate={{ x: [0, -2000] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[
              ...SCROLL_TEXTS,
              ...SCROLL_TEXTS,
              ...SCROLL_TEXTS,
              ...SCROLL_TEXTS,
            ].map((text, idx) => (
              <div key={idx} className="flex items-center">
                <span className="text-yellow-300/90 text-sm md:text-xl font-black uppercase tracking-[0.4em] px-12 font-custom">
                  {text}
                </span>
                <div className="w-2 h-2 rotate-45 bg-yellow-400/30" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-2 bg-[#050505] z-20"
        style={{ clipPath: "ellipse(70% 100% at 50% 100%)" }}
      />
    </motion.section>
  );
}
