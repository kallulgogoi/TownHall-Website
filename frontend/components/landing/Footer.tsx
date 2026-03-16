"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#030303] pt-20 pb-10 px-6 relative overflow-hidden">
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
              <h3 className="text-2xl font-black text-white font-custom tracking-tighter">
                TOWN<span className="text-yellow-400">HALL</span>
              </h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed font-medium">
              Townhall is the{" "}
              <span className="text-yellow-400 font-bold">
                annual flagship event
              </span>{" "}
              of Coding Club NIT Silchar. A premier technical symposium pushing
              the boundaries of innovation and competitive excellence.
            </p>
            <div className="flex gap-4">
              {[
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/coding_club_nits/",
                },
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/groups/CodingClub.NITSilchar",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/coding-club-nit-silchar/",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-gray-300 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300 group"
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase font-custom text-sm tracking-widest border-l-4 border-yellow-400 pl-4">
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
            <h4 className="text-white font-bold uppercase font-custom text-sm tracking-widest border-l-4 border-yellow-400 pl-4">
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
  );
}
