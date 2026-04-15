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
  Bell,
  X,
  CheckCheck,
  Inbox,
} from "lucide-react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";
import api from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();

  // Menus State
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/notifications")
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error("Failed to fetch notifications", err));
    }
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      await markAsRead(n._id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    Cookies.remove("token");
    toast.success("Logged out successfully", {
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

  // Prevent background scrolling when large modal is open
  useEffect(() => {
    if (showNotifications) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNotifications]);

  // Handle clicking outside to close profile dropdown
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
            className="flex items-center gap-2 group min-w-[120px]"
          >
            <div className="relative flex items-center gap-4 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo1.png"
                width={40}
                height={30}
                alt="Logo"
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              />

              {/* Hidden on mobile, visible from sm screens */}
              <h2 className="hidden sm:block text-2xl font-semibold tracking-wide">
                Town
                <span className="text-yellow-400">Hall</span>
              </h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
              disabled
            />
            <NavLink
              href="/announcements"
              label="News"
              active={pathname === "/announcements"}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 min-w-[140px] justify-end">
            {/* NOTIFICATIONS TRIGGER */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false); // Close other menu
                  }}
                  className="relative p-2.5 bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-yellow-400 group shadow-lg"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-black animate-pulse" />
                  )}
                </button>
              </div>
            )}

            {/* PROFILE MENU DROPDOWN */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false); // Close other menu
                }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-yellow-400/50 hover:bg-white/10 p-1.5 pl-3 rounded-full transition-all group shadow-lg"
              >
                <Menu className="w-4 h-4 text-white/70 group-hover:text-yellow-400" />
                <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-64 bg-[#0d0d0d]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg">
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

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                      <DropdownItem
                        href="/events"
                        icon={Swords}
                        label="Explore Events"
                      />

                      <button
                        onClick={() => {
                          toast.dismiss();
                          toast("Coming Soon", {
                            id: "coming-soon",
                          });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/40 cursor-not-allowed"
                      >
                        <Flame className="w-4 h-4" />
                        The Cauldron
                      </button>

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
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl font-bold"
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

      {/* FULL SCREEN NOTIFICATION MODAL */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6 font-custom">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl max-h-[85vh] bg-[#0d0d0d] border border-white/10 rounded-2xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden"
            >
              {/* Top Decorative Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm" />

              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-400/10 rounded-xl border border-yellow-400/20">
                    <Bell className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-wider text-white leading-none">
                      Notifications
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs text-white/60 hover:text-white transition-colors uppercase font-bold tracking-wider"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark All Read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 border border-white/5 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 bg-[#050505]">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                    <Inbox className="w-20 h-20 text-white/20 mb-6" />
                    <p className="text-white/60 text-base font-bold uppercase tracking-widest">
                      No notications at the moment
                    </p>
                    <p className="text-white/30 text-sm mt-2 max-w-sm">
                      You have no new alerts at this time. All systems are
                      operating normally.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && markAsRead(n._id)}
                      className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                        n.isRead
                          ? "bg-[#0a0a0a] border-white/50 opacity-60"
                          : "bg-[#111111] border-yellow-400/30 hover:border-yellow-400/60 cursor-pointer shadow-lg shadow-yellow-400/5 hover:shadow-yellow-400/10"
                      }`}
                    >
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                      )}

                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4
                          className={`text-lg sm:text-xl font-black uppercase tracking-tight ${
                            n.isRead ? "text-gray-200" : "text-white"
                          }`}
                        >
                          {n.title}
                        </h4>

                        <span className="shrink-0 text-xs text-white/30 font-mono uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          n.isRead ? "text-gray-200" : "text-white/80"
                        }`}
                      >
                        {n.message}
                      </p>

                      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-white/90 font-bold uppercase tracking-widest">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {!n.isRead && (
                          <span className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            New Alert
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="h-28 bg-black" />
    </>
  );
}

/* NavLink */
function NavLink({
  href,
  label,
  active,
  disabled,
}: {
  href: string;
  label: string;
  active: boolean;
  disabled?: boolean;
}) {
  return (
    <Link
      href={disabled ? "#" : href}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          toast.dismiss();
          toast("Coming Soon", {
            id: "coming-soon",
          });
        }
      }}
      className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
        disabled
          ? "text-white/20 cursor-not-allowed"
          : active
            ? "bg-yellow-400 text-black"
            : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );
}

/* DropdownItem */
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
      className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-yellow-400/10 hover:text-yellow-400 ${
        bold
          ? "font-black text-white uppercase tracking-wider"
          : "font-medium text-white/60"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
