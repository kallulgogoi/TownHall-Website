"use client";
import { motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Zap,
  Swords,
  Users,
  Trophy,
  Code2,
  Globe,
  GraduationCap,
  ChevronRight,
  Info,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  CalendarDays,
  Images,
  Mail,
  MapPin,
  Flame,
  Clock,
} from "lucide-react";

const titleContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const letterAnim = {
  hidden: { y: 40, opacity: 0, scale: 0.8 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 10 },
  },
};

const sectionVar = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
};

const eventTimeline = [
  { name: "Code Cauldron", icon: Code2, date: "Day 1" },
  { name: "Quant League", icon: Trophy, date: "Day 2" },
  { name: "Type Racing", icon: Zap, date: "Day 2" },
  { name: "Get Hired", icon: GraduationCap, date: "Day 3" },
  { name: "Lockout", icon: Swords, date: "Day 3" },
  { name: "Bit by Byte Quiz", icon: Info, date: "Day 4" },
  { name: "Goblin Gamble", icon: Globe, date: "Day 4" },
  { name: "Capture the Flag", icon: Images, date: "Day 5" },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484417894907-623942c8ea29?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511376777868-611b54f68947?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526666923127-b2970f64b422?q=80&w=600&auto=format&fit=crop",
];

const InfiniteScrollRow = ({ images, direction = "left", onImageClick }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start({
      x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
      transition: {
        ease: "linear",
        duration: 35,
        repeat: Infinity,
      },
    });
  }, [controls, direction]);

  return (
    <div
      className="relative w-full overflow-hidden py-12"
      style={{
        perspective: "1000px",
        maskImage:
          "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
    >
      <motion.div
        className="flex space-x-6 px-4"
        animate={controls}
        style={{
          transformStyle: "preserve-3d",
          rotateY: direction === "left" ? "5deg" : "-5deg",
        }}
      >
        {[...images, ...images].map((src, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, translateZ: "50px" }}
            className="flex-shrink-0 w-80 h-56 relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
            onClick={() => onImageClick(src)}
            style={{
              transform: "rotateY(-5deg)",
            }}
          >
            <Image
              src={src}
              alt="Gallery"
              fill
              className="object-cover"
              sizes="400px"
              unoptimized
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-yellow-400/10 rounded-full"
          initial={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [0, -200],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden font-['Rajdhani']">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_bg.png"
            alt="Hero Background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/60 bg-linear-to-b from-black via-transparent to-black" />
        </div>
        <ParticleBackground />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-yellow-400/[0.02] rounded-full blur-[140px]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="relative w-full max-w-7xl flex flex-col items-center justify-center z-10">
          <motion.div
            variants={titleContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <h1 className="text-[19vw] md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] font-['Orbitron'] flex flex-col md:flex-row justify-center items-center text-center gap-2 md:gap-0">
              <motion.span
                variants={letterAnim}
                className="inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                TOWN
              </motion.span>
              <motion.span
                variants={letterAnim}
                className="text-yellow-400 inline-block md:ml-4 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse"
                style={{
                  textShadow:
                    "0 0 20px rgba(250,204,21,0.5), 2px 2px 0px rgba(0,0,0,1)",
                }}
              >
                HALL
              </motion.span>
              <motion.span
                variants={letterAnim}
                className="text-white/20 md:text-white/90 text-[18vw] md:text-9xl md:ml-6 mt-1 md:mt-0 font-outline-2 transition-all duration-500 hover:text-white"
                style={{
                  WebkitTextStroke: "1.5px rgba(255,255,255,0.4)",
                  textShadow: "4px 4px 0px rgba(0,0,0,0.5)",
                }}
              >
                2026
              </motion.span>
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 1, duration: 1 }}
              className="h-[1px] bg-yellow-400/50 mx-auto mt-4"
            />
          </motion.div>

          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.2 }}
            className="relative flex justify-center z-20 sm:-mt-24 lg:-mt-32"
          >
            <Image
              src="/images/ash.png"
              alt="Hero"
              width={600}
              height={600}
              unoptimized
              className="object-contain drop-shadow-[0_40px_70px_rgba(0,0,0,0.9)]"
            />
            <div className="absolute bottom-0 w-full h-32 bg-linear-to-t from-black to-transparent" />
          </motion.div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVar}
        className="relative py-24 px-6 bg-[#050505] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-400">
              <Info className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-wider">
                Annual Flagship Event
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-['Orbitron'] tracking-tighter">
              About <span className="text-yellow-400">TownHall</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-400" />
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl font-['Rajdhani'] font-medium">
              TownHall is the premier annual technical symposium of **Coding
              Club NIT Silchar**. It serves as a battleground for innovation,
              bringing together the sharpest minds for high-stakes challenges,
              collaborative learning, and technological excellence.
            </p>
          </div>
          <div className="md:col-span-2 flex justify-center">
            <div className="p-8 border border-white/5 rounded-3xl bg-[#080808] shadow-2xl">
              <Image
                src="/images/about_image.png"
                alt="About TownHall"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVar}
        className="py-24 px-6 relative bg-black overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-black text-white uppercase font-['Orbitron'] mb-24 tracking-tighter">
            Mission <span className="text-yellow-400">Roadmap</span>
          </h2>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-y-20 gap-x-4">
            <div className="absolute top-20 left-10 right-10 bottom-0 pointer-events-none hidden md:block">
              <svg width="100%" height="100%" className="opacity-20">
                <path
                  d="M 50 40 L 950 40 Q 1000 40 1000 120 L 1000 180 Q 1000 260 950 260 L 50 260 Q 0 260 0 340 L 0 400"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>

            {eventTimeline.map((item, index) => {
              const isTop = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center group"
                >
                  <div
                    className={`text-center mb-8 flex flex-col items-center ${!isTop ? "order-last mt-8 mb-0" : ""}`}
                  >
                    <span className="text-yellow-400 font-black text-sm tracking-widest font-['Orbitron'] mb-1">
                      {item.date.toUpperCase()}
                    </span>
                    <h3 className="text-white font-bold text-lg uppercase leading-tight max-w-[150px]">
                      {item.name}
                    </h3>
                  </div>
                  <div className="relative">
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-[2px] bg-yellow-400/40 ${isTop ? "h-12 top-full" : "h-12 bottom-full"}`}
                    />
                    <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform duration-300 z-10">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center">
                      0{index + 1}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <section className="py-24 bg-[#050505] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-16 text-center px-6">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase font-['Orbitron'] tracking-tighter">
            Photo <span className="text-yellow-400">Gallery</span>
          </h2>
        </div>
        <div className="space-y-[-2rem]">
          <InfiniteScrollRow
            images={galleryImages}
            direction="left"
            onImageClick={setSelectedImage}
          />
          <InfiniteScrollRow
            images={galleryImages}
            direction="right"
            onImageClick={setSelectedImage}
          />
        </div>
      </section>

      <footer className="bg-[#030303] border-t border-white/10 pt-20 pb-10 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/footer_bg.png"
            alt="Footer Background"
            fill
            className="object-cover opacity-15 grayscale"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-yellow-400/[0.05] blur-[120px] pointer-events-none z-1" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <Image
                    src="/images/town.png"
                    alt="Brand Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-black text-white font-['Orbitron'] tracking-tighter">
                  TOWN<span className="text-yellow-400">HALL</span>
                </h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">
                Townhall is the{" "}
                <span className="text-yellow-400 font-bold">
                  annual flagship event
                </span>{" "}
                of Coding Club NIT Silchar. A premier technical symposium
                pushing the boundaries of innovation and competitive excellence.
              </p>
              <div className="flex gap-4">
                {[
                  {
                    icon: Instagram,
                    href: "https://instagram.com/codingclubnits",
                    label: "Instagram",
                  },
                  {
                    icon: Facebook,
                    href: "https://facebook.com/codingclubnits",
                    label: "Facebook",
                  },
                  {
                    icon: Linkedin,
                    href: "https://linkedin.com/company/coding-club-nit-silchar",
                    label: "LinkedIn",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-gray-300 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase font-['Orbitron'] text-sm tracking-widest border-l-4 border-yellow-400 pl-4">
                Navigation
              </h4>
              <ul className="space-y-4 text-gray-300 text-sm font-bold">
                {["Events", "Register", "Cauldron", "Announcements"].map(
                  (item) => (
                    <li key={item} className="group">
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        {item}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase font-['Orbitron'] text-sm tracking-widest border-l-4 border-yellow-400 pl-4">
                Connect
              </h4>
              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-yellow-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      Email
                    </p>
                    <p className="text-gray-200 font-bold group-hover:text-yellow-400 transition-colors">
                      codingclub@nits.ac.in
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-yellow-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                      Location
                    </p>
                    <p className="text-gray-200 font-bold leading-snug">
                      NIT Silchar, Assam, 788010
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-yellow-400/20 transition-all duration-500" />
                <h4 className="text-white font-black text-lg mb-2">
                  Join the Chaos
                </h4>
                <p className="text-gray-400 text-sm font-medium mb-5">
                  Step into the arena. Registrations for TownHall 2026 are now
                  live.
                </p>
                <Link href="/events">
                  <button className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black uppercase text-xs tracking-widest rounded-lg transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-yellow-400/50">
                    Register Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col items-center gap-2">
            <p className="text-gray-400 text-[11px] uppercase font-black tracking-[0.25em] text-center">
              © 2026 CODING CLUB NIT SILCHAR. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-2">
              <div className="h-1 w-8 bg-yellow-400/50 rounded-full" />
              <div className="h-1 w-4 bg-yellow-400/20 rounded-full" />
            </div>
          </div>
        </div>
      </footer>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="relative max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img src={selectedImage} alt="Enlarged" className="w-full h-auto" />
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
