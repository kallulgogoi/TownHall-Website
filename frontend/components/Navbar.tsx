"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Menu,
  Megaphone,
  User,
  Swords,
  Globe,
} from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    Cookies.remove("token");
    toast.success("Logged out successfully", {
      icon: "👋",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-5 sm:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-12 bg-yellow-400/10 blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto h-20 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-full px-6 flex items-center justify-between shadow-2xl relative animate-border-glow">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group min-w-[140px]"
          >
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                width={140}
                height={70}
                alt="Logo"
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              />
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1 shadow-inner">
            <NavLink
              href="/events"
              label="Events"
              active={pathname === "/events"}
            />
            <NavLink
              href="/cauldron"
              label="Cauldron"
              active={pathname === "/cauldron"}
            />
            <NavLink
              href="/announcements"
              label="News"
              active={pathname === "/announcements"}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 min-w-[140px] justify-end">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 p-1.5 pl-3 rounded-full transition-all group shadow-lg"
              >
                <Menu className="w-4 h-4 text-white/70 group-hover:text-yellow-400 transition-colors" />
                <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)] group-hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] transition-all">
                  <User className="w-5 h-5 text-black" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200">
                  <div className="p-2 space-y-1">
                    {!isAuthenticated ? (
                      <DropdownItem
                        href="/auth"
                        icon={Globe}
                        label="Login / Register"
                        bold
                      />
                    ) : (
                      <>
                        <DropdownItem
                          href="/profile"
                          icon={LayoutDashboard}
                          label="Dashboard"
                        />
                        {isAdmin && (
                          <DropdownItem
                            href="/admin"
                            icon={ShieldAlert}
                            label="Admin Console"
                          />
                        )}
                      </>
                    )}
                    <div className="h-px bg-white/5 my-2" />
                    <div className="md:hidden">
                      <DropdownItem
                        href="/events"
                        icon={Swords}
                        label="Explore Events"
                      />
                      <DropdownItem
                        href="/cauldron"
                        icon={Flame}
                        label="The Cauldron"
                      />
                      <DropdownItem
                        href="/announcements"
                        icon={Megaphone}
                        label="Announcements"
                      />
                      <div className="h-px bg-white/5 my-2" />
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-xl font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout Account
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-28 bg-black" />

      <style jsx global>{`
        @keyframes border-glow {
          0%,
          100% {
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
          }
          50% {
            border-color: rgba(250, 204, 21, 0.4);
            box-shadow: 0 0 30px rgba(250, 204, 21, 0.1);
          }
        }
        .animate-border-glow {
          animation: border-glow 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
        active
          ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

function DropdownItem({
  href,
  icon: Icon,
  label,
  bold,
}: {
  href: string;
  icon: any;
  label: string;
  bold?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl hover:bg-yellow-400/10 hover:text-yellow-400 group ${
        bold
          ? "font-black text-white uppercase tracking-wider"
          : "font-medium text-white/60"
      }`}
    >
      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
      {label}
    </Link>
  );
}
