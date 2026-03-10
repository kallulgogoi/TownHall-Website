"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  User,
  Hash,
  Phone,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    scholarId: "",
    branch: "CSE",
    year: "1",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/auth/onboarding", { ...form, year: Number(form.year) });
      router.push("/events");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  const branches = ["CSE", "ECE", "EE", "ME", "CE", "EI"];

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background decorative element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        {/* Decorative corner elements */}
        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-yellow-400/40"></div>
        <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-yellow-400/40"></div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-yellow-400/40"></div>
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-yellow-400/40"></div>

        <div className="bg-[#111111] border border-yellow-400/20 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-8 pb-6 border-b border-yellow-400/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                <User className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Complete Your Profile
                </h1>
                <p className="text-sm text-white/40 mt-1">
                  One last step before you enter
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
            {/* Scholar ID */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white/60">
                <Hash className="w-4 h-4" />
                <span>Scholar ID</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g., 2023CSB1101"
                value={form.scholarId}
                onChange={(e) =>
                  setForm({ ...form, scholarId: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-yellow-400/20 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:border-yellow-400/40 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-white/20 mt-1">
                Enter your NITS scholar ID
              </p>
            </div>

            {/* Branch & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-white/60">
                  <BookOpen className="w-4 h-4" />
                  <span>Branch</span>
                </label>
                <select
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-yellow-400/20 rounded-xl px-5 py-4 text-white focus:border-yellow-400/40 focus:outline-none appearance-none cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b} value={b} className="bg-[#0a0a0a]">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-white/60">
                  <GraduationCap className="w-4 h-4" />
                  <span>Year</span>
                </label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-yellow-400/20 rounded-xl px-5 py-4 text-white focus:border-yellow-400/40 focus:outline-none appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y} className="bg-[#0a0a0a]">
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </label>
              <input
                required
                type="tel"
                placeholder="e.g.,8011885784"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-yellow-400/20 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:border-yellow-400/40 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-white/20 mt-1">
                Enter your 10-digit mobile number
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div
                className={`relative px-8 py-4 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <span>COMPLETE PROFILE</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            {/* Note */}
            <p className="text-center text-[10px] text-white/20 mt-4">
              This information helps us verify your identity
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
