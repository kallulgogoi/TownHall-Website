"use client";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, Info, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

function TechLoader() {
  return (
    <div className="relative flex items-center justify-center h-16 w-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="absolute inset-0 border-2 border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full"
      />
      <Lock size={20} className="text-yellow-400" />
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
      toast.success("Logged in successfully", {
        icon: <CheckCircle2 size={18} className="text-green-400" />,
      });
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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex flex-col items-center text-center">
              {/* Logo / Icon */}
              <div className="mb-6">
                {isLoading ? (
                  <TechLoader />
                ) : (
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <Shield size={24} className="text-yellow-400" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-semibold text-white mb-1">
                Welcome back
              </h1>
              <p className="text-white/50 text-sm mb-6">
                Sign in with your NITS email
              </p>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2"
                  >
                    <Info size={14} className="text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Google Login Button */}
              <div className="w-full flex justify-center">
                {!isLoading && (
                  <div className="w-full transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() =>
                        setError("Unable to connect to Google Services")
                      }
                      theme="filled_black"
                      shape="pill"
                      width="100%"
                      text="continue_with"
                      containerProps={{
                        style: { width: "100%", justifyContent: "center" },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 w-full">
                <p className="text-white/40 text-xs">
                  Only NITS students can sign in
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
