"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { LayoutDashboard, Calendar, Megaphone, Users } from "lucide-react";

import AdminEvents from "@/components/admin/AdminEvents";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminRegistrations from "@/components/admin/AdminRegistrations";

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("events");
  const [data, setData] = useState({ events: [], ann: [] });

  const fetchData = async () => {
    try {
      const [e, a] = await Promise.all([
        api.get("/events"),
        api.get("/announcements"),
      ]);
      setData({ events: e.data, ann: a.data });
    } catch (err) {
      toast.error("Failed to sync data");
    }
  };

  useEffect(() => {
    if (!loading && !isAdmin) router.push("/events");
    else if (isAdmin) fetchData();
  }, [loading, isAdmin]);

  if (loading || !isAdmin)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-3 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-400/40 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-[10px] text-white/40">
                  Coding Club NIT Silchar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-lg border border-white/10">
              {[
                { id: "events", label: "Events", icon: Calendar },
                {
                  id: "announcements",
                  label: "Announcements",
                  icon: Megaphone,
                },
                { id: "registrations", label: "Registrations", icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                    tab === item.id
                      ? "bg-yellow-400 text-black"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "events" && (
          <AdminEvents events={data.events} fetchData={fetchData} />
        )}
        {tab === "announcements" && (
          <AdminAnnouncements announcements={data.ann} fetchData={fetchData} />
        )}
        {tab === "registrations" && <AdminRegistrations events={data.events} />}
      </div>
    </main>
  );
}
