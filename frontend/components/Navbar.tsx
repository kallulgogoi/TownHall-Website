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
  Target,
  User,
  Swords,
  Globe,
} from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/auth";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto h-20 bg-black/60 backdrop-blur-xl border border-white/50 rounded-full px-6 flex items-center justify-between shadow-2xl shadow-black/50">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group min-w-[140px]"
          >
            <div className="relative">
              <div className="w-8 h-8 border-2 border-yellow-400/20 rounded-full animate-spin-slow absolute inset-0" />
              <Target className="w-8 h-8 text-yellow-400 p-1.5" />
            </div>
            <span className="font-['Orbitron'] font-black text-lg tracking-tighter text-white hidden sm:block">
              TOWN<span className="text-yellow-400">HALL</span>
            </span>
          </Link>

          {/*Navigation */}
          <div className="hidden md:flex items-center bg-white/10 border border-white/30 rounded-full p-1 gap-1">
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

          {/*User Actions */}
          <div className="flex items-center gap-4 min-w-[140px] justify-end">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 p-1.5 pl-3 rounded-full transition-all group"
              >
                <Menu className="w-4 h-4 text-white group-hover:text-yellow-400 transition-colors" />
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-black" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-xl"
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
      <div className="h-24 bg-black" />

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  );
}

function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
        active
          ? "bg-yellow-400 text-black shadow-lg"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

function DropdownItem({ href, icon: Icon, label, bold }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl hover:bg-yellow-400/10 hover:text-yellow-400 ${
        bold ? "font-bold text-white" : "text-white/60"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
