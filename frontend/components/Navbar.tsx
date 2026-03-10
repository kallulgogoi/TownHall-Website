"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import {
  Zap,
  Swords,
  Flame,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Megaphone,
  Target,
  Sparkles,
  User,
} from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/auth";
  };

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-[150] transition-all duration-500 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250, 204, 21, 0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
        onClick={() => setIsOpen(false)}
      />

      <nav className="fixed top-0 z-[160] w-full bg-gradient-to-b from-[#0a0a0a] to-black border-b border-yellow-400/10 px-4 md:px-8">
        {/* Animated scanline effect with your yellow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-scan" />
        </div>

        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between relative">
          {/* Beyblade Logo/Brand with your colors */}
          <Link href="/" className="flex items-center gap-3 group relative">
            {/* Rotating aura effect with your yellow */}
            <div className="absolute -inset-2 bg-yellow-400/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Beyblade-inspired icon with your colors */}
            <div className="relative">
              <div className="absolute inset-0 animate-spin-slow">
                <div className="w-5 h-5 border-2 border-yellow-400/30 rounded-full" />
              </div>
              <Target className="w-5 h-5 text-yellow-400 relative z-10" />
            </div>

            <div className="relative">
              <span className="font-['Orbitron'] font-black text-xl tracking-tighter text-white">
                TOWN<span className="text-yellow-400">HALL</span>
              </span>
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </Link>

          {/* Desktop Navigation - Battle Ready with your colors */}
          <div className="hidden lg:flex items-center h-full gap-1">
            <DesktopLink
              href="/events"
              icon={Swords}
              label="EVENTS"
              active={pathname === "/events"}
            />
            <DesktopLink
              href="/cauldron"
              icon={Flame}
              label="CAULDRON"
              active={pathname === "/cauldron"}
            />
            <DesktopLink
              href="/announcements"
              icon={Megaphone}
              label="NEWS"
              active={pathname === "/announcements"}
            />

            {!loading && isAuthenticated && (
              <>
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent mx-2" />
                <DesktopLink
                  href="/profile"
                  icon={LayoutDashboard}
                  label="DASHBOARD"
                  active={pathname === "/profile"}
                />
                {isAdmin && (
                  <DesktopLink
                    href="/admin"
                    icon={ShieldAlert}
                    label="ADMIN"
                    active={pathname === "/admin"}
                  />
                )}
              </>
            )}
          </div>

          {/* Auth Actions with your colors */}
          <div className="flex items-center gap-3">
            {!loading &&
              (isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-white/40 hover:text-yellow-400 transition-colors rounded-lg border border-white/10 hover:border-yellow-400/30 hover:bg-yellow-400/5 group"
                >
                  <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    LOGOUT
                  </span>
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="hidden sm:flex items-center gap-2 px-5 py-2 bg-yellow-400 text-black text-sm font-bold rounded-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/25 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shimmer" />
                  <User className="w-4 h-4" />
                  <span className="tracking-wider uppercase">LOGIN</span>
                </Link>
              ))}

            {/* Mobile menu button with your colors */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-yellow-400" />
              ) : (
                <Menu className="w-5 h-5 text-white/60" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer - Beyblade Edition with your colors */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-[#0a0a0a] to-black shadow-2xl shadow-yellow-400/5 z-[200] border-l border-yellow-400/10 transform transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] lg:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Decorative elements with your yellow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 -right-10 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 -left-10 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250, 204, 21, 0.05) 1px, transparent 0)`,
                backgroundSize: "30px 30px",
              }}
            />
          </div>

          <div className="p-6 flex flex-col h-full relative">
            {/* Drawer header with Beyblade motif - your colors */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-yellow-400/30 rounded-full animate-spin-slow" />
                  <Target className="w-4 h-4 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div>
                  <span className="text-xs text-yellow-400/60 tracking-wider uppercase">
                    TOWNHALL
                  </span>
                  <h2 className="font-['Orbitron'] font-bold text-white">
                    SYSTEM MENU
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/10"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 space-y-2">
              <MobileLink
                href="/events"
                icon={Swords}
                label="EVENTS"
                active={pathname === "/events"}
              />
              <MobileLink
                href="/cauldron"
                icon={Flame}
                label="CAULDRON"
                active={pathname === "/cauldron"}
              />
              <MobileLink
                href="/announcements"
                icon={Megaphone}
                label="ANNOUNCEMENTS"
                active={pathname === "/announcements"}
              />

              {isAuthenticated && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent my-4" />
                  <MobileLink
                    href="/profile"
                    icon={LayoutDashboard}
                    label="PROFILE"
                    active={pathname === "/profile"}
                  />
                  {isAdmin && (
                    <MobileLink
                      href="/admin"
                      icon={ShieldAlert}
                      label="ADMIN"
                      active={pathname === "/admin"}
                    />
                  )}
                </>
              )}
            </div>

            {/* Auth section with Beyblade theme - your colors */}
            <div className="pt-6 mt-6 border-t border-yellow-400/10">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/5 rounded-lg transition-all group border border-yellow-400/20"
                >
                  <span className="text-sm font-bold uppercase tracking-wider">
                    LOGOUT
                  </span>
                  <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center justify-between px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-all group relative overflow-hidden"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shimmer" />
                  <span className="font-bold uppercase tracking-wider relative">
                    LOGIN
                  </span>
                  <Target className="w-4 h-4 relative group-hover:rotate-180 transition-transform duration-500" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(1000%);
          }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}

// Desktop link component - Beyblade themed with your colors
function DesktopLink({ href, icon: Icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-300 group ${
        active ? "text-yellow-400" : "text-white/40 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`w-4 h-4 transition-all duration-300 ${
            active
              ? "text-yellow-400"
              : "text-white/20 group-hover:text-yellow-400"
          }`}
        />
        <span className="relative">
          {label}
          {/* Animated underline with your yellow */}
          <span
            className={`absolute -bottom-1 left-0 w-full h-[2px] bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
              active ? "scale-x-100" : ""
            }`}
          />
        </span>
      </div>

      {/* Active glow effect with your yellow */}
      {active && (
        <div className="absolute inset-0 bg-yellow-400/5 rounded-lg blur-sm" />
      )}
    </Link>
  );
}

// Mobile link component - Beyblade themed with your colors
function MobileLink({ href, icon: Icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${
        active
          ? "bg-gradient-to-r from-yellow-400/10 to-transparent text-yellow-400 border-l-2 border-yellow-400"
          : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      {/* Background pattern with your yellow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250, 204, 21, 0.05) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="flex items-center gap-3 relative">
        <div className="relative">
          <Icon
            className={`w-5 h-5 transition-all duration-300 ${
              active
                ? "text-yellow-400"
                : "text-white/20 group-hover:text-yellow-400"
            }`}
          />
          {active && (
            <div className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-sm" />
          )}
        </div>
        <span className="text-sm font-['Orbitron'] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      {active ? (
        <div className="w-1 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
      ) : (
        <div className="w-1 h-6 bg-transparent group-hover:bg-yellow-400/30 rounded-full transition-all" />
      )}
    </Link>
  );
}
