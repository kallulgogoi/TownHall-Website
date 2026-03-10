"use client";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Info, CheckCircle2 } from "lucide-react";

// --- MINIMAL TECH LOADER ---
function TechLoader() {
  return (
    <div className="relative flex items-center justify-center h-24">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute w-20 h-20 border-2 border-dashed border-yellow-400/30 rounded-full"
      />
      {/* Pulse Effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute w-12 h-12 bg-yellow-400/20 rounded-full blur-xl"
      />
      <Lock size={28} className="text-yellow-400 relative z-10" />
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const res = await api.post("/auth/google", {
        googleId: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        profilePicture: decoded.picture,
      });

      const { token, user } = res.data;
      Cookies.set("token", token, { expires: 7 });
      router.push(user.profileCompleted ? "/events" : "/onboarding");
    } catch (err: any) {
      setIsLoading(false);
      setError(
        err.response?.data?.message ||
          "Verification failed. Please use your official university email.",
      );
    }
  };

  if (!mounted) return null;

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
    >
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-['Rajdhani']">
        {/* Background Sophistication */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#facc1503,transparent_70%)]" />
          {/* Subtle noise/grid pattern */}
          <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[440px]"
        >
          <div className="bg-[#121212]/90 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Elegant Top Progress Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

            <div className="flex flex-col items-center">
              {/* Icon Container */}
              <div className="mb-8">
                {isLoading ? (
                  <TechLoader />
                ) : (
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                    <Shield size={32} className="text-yellow-400" />
                  </div>
                )}
              </div>

              {/* Title Header */}
              <div className="text-center space-y-3 mb-10">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Connect to <span className="text-yellow-400">Arena</span>
                </h1>
                <p className="text-white/40 text-sm font-medium tracking-wide">
                  Sign in with your college email ID
                </p>
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3"
                  >
                    <Info size={18} className="text-red-500 shrink-0" />
                    <p className="text-red-400 text-xs font-semibold leading-snug">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Button Container */}
              <div className="w-full flex justify-center min-h-[44px]">
                {!isLoading && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex justify-center"
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() =>
                        setError("Unable to connect to Google Services")
                      }
                      theme="filled_black"
                      shape="pill"
                      width="340"
                      text="continue_with"
                    />
                  </motion.div>
                )}
              </div>

              {/* Secure Footer */}
              <div className="mt-1 pt-8 border-t border-white/5 w-full flex flex-col items-center gap-4">
                <p className="text-white/90 text-[16px] font-medium ">
                  Only NITS students can sign in
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Accent */}
          <div className="mt-8 flex justify-center">
            <div className="h-[2px] w-8 bg-white/80 rounded-full" />
          </div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}
