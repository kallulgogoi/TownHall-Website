"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Trophy,
  Shield,
  UserPlus,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function EventDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [teamName, setTeamName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEvent(res.data));
  }, [id]);

  const isUserRegistered = event?.participants?.some(
    (p: any) => (p._id || p) === user?._id,
  );

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) return router.push("/auth");
    if (isUserRegistered) return;

    const loadingToast = toast.loading("Processing registration...");
    setIsRegistering(true);
    try {
      if (event.mode === "solo") {
        await api.post(`/registrations/solo/${id}`);
      } else {
        await api.post(`/registrations/team/${id}`, {
          teamName,
          members: emails.filter((e) => e.trim() !== ""),
        });
      }
      toast.success("Successfully registered!", { id: loadingToast });
      router.push("/profile");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed", {
        id: loadingToast,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-custom">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border border-yellow-400/40 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  const isOpen = event.registrationStatus === "open";

  return (
    <main className="min-h-screen bg-[#0a0a0a] font-custom">
      <div className="border-b border-yellow-400/20 bg-[#111111] sticky top-0 z-30 font-custom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.push("/events")}
              className="flex items-center gap-2 text-white/60 hover:text-yellow-400 transition-colors text-sm font-medium uppercase tracking-wider group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>BACK TO EVENTS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
            <span className="text-white">{event.title}</span>
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-1 w-16 bg-yellow-400"></div>
            <span className="text-yellow-400/80 text-sm font-bold uppercase tracking-wider">
              Event Details
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 font-custom">
          <div className="lg:col-span-1">
            <div className="relative group sticky top-24">
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-yellow-400/40 z-10"></div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-yellow-400/40 z-10"></div>

              <div className="relative overflow-hidden rounded-xl border-2 border-yellow-400/30 bg-black shadow-2xl">
                <img
                  src={event.posterUrl}
                  alt={event.title}
                  className="w-full h-auto object-cover opacity-90"
                />
                <div
                  className={`absolute top-4 right-4 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg border-2 z-20 ${
                    isOpen
                      ? "bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20"
                      : "bg-red-500/10 text-red-500 border-red-500/30"
                  }`}
                >
                  {isOpen ? "● OPEN" : "● CLOSED"}
                </div>

                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-yellow-400/30 rounded-lg z-20">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">
                    {event.mode === "solo" ? "SOLO BATTLE" : "TEAM BATTLE"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#111111] border border-yellow-400/20 rounded-lg p-4">
                <Calendar className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white/60 text-[10px] font-bold mb-1 uppercase tracking-widest">
                  DATE
                </p>
                <p className="text-white font-bold text-sm">
                  {new Date(event.startDateIST).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-[#111111] border border-yellow-400/20 rounded-lg p-4">
                <Clock className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white/60 text-[10px] font-bold mb-1 uppercase tracking-widest">
                  TIME
                </p>
                <p className="text-white font-bold text-sm">
                  {new Date(event.startDateIST).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="bg-[#111111] border border-yellow-400/20 rounded-lg p-4">
                <Users className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white/60 text-[10px] font-bold mb-1 uppercase tracking-widest">
                  FORMAT
                </p>
                <p className="text-white font-bold text-sm uppercase">
                  {event.mode}{" "}
                  {event.mode === "team" && `(${event.maxTeamSize})`}
                </p>
              </div>
              <div className="bg-[#111111] border border-yellow-400/20 rounded-lg p-4">
                <MapPin className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-white/60 text-[10px] font-bold mb-1 uppercase tracking-widest">
                  VENUE
                </p>
                <p className="text-white font-bold text-sm truncate uppercase">
                  {event.location || "Online"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-white font-bold text-base uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>EVENT DESCRIPTION</span>
              </h2>
              <div className="bg-[#111111] border border-yellow-400/20 rounded-xl p-6">
                <p className="text-white/80 text-base leading-relaxed whitespace-pre-wrap font-custom">
                  {event.description}
                </p>
              </div>
            </div>

            {!isOpen ? (
              <div className="bg-[#111111] border-2 border-red-500/20 rounded-xl p-8 text-center">
                <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-red-500 text-2xl font-black uppercase tracking-wider mb-2">
                  Registration Closed
                </h3>
                <p className="text-white/60 text-sm">
                  This operation has concluded its recruitment phase.
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-b from-[#111111] to-[#0a0a0a] border-2 border-yellow-400/20 rounded-xl p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-8">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                    {event.mode === "solo" ? (
                      <UserPlus className="w-7 h-7 text-yellow-400" />
                    ) : (
                      <Users className="w-7 h-7 text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-yellow-400 text-2xl font-black uppercase tracking-wider mb-1">
                      {isUserRegistered
                        ? "Mission Secured"
                        : event.mode === "solo"
                          ? "Solo Entry"
                          : "Team Entry"}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {isUserRegistered
                        ? "You are already listed in the deployment roster."
                        : event.mode === "solo"
                          ? "Register for this operation as a solo combatant."
                          : `Form your squad (max ${event.maxTeamSize} members)`}
                    </p>
                  </div>
                </div>

                {event.mode === "team" && !isUserRegistered && (
                  <form className="space-y-5 mb-8">
                    <input
                      required
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="TEAM NAME"
                      className="w-full bg-black border-2 border-yellow-400/20 rounded-xl px-5 py-4 text-white focus:border-yellow-400/60 outline-none"
                    />
                    <div className="space-y-3">
                      {emails.map((email, index) => (
                        <input
                          key={index}
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...emails];
                            newEmails[index] = e.target.value;
                            setEmails(newEmails);
                          }}
                          placeholder={`MEMBER ${index + 1} EMAIL`}
                          className="w-full bg-black border-2 border-yellow-400/20 rounded-xl px-5 py-4 text-white focus:border-yellow-400/60 outline-none"
                        />
                      ))}
                      {emails.length < event.maxTeamSize && (
                        <button
                          type="button"
                          onClick={() => setEmails([...emails, ""])}
                          className="text-yellow-400 text-xs font-black tracking-widest"
                        >
                          + ADD MEMBER
                        </button>
                      )}
                    </div>
                  </form>
                )}

                <button
                  onClick={
                    event.mode === "solo"
                      ? () => handleRegister()
                      : (e) => handleRegister(e)
                  }
                  disabled={isRegistering || isUserRegistered}
                  className="w-full relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div
                    className={`relative px-8 py-5 rounded-xl transition-all font-black text-black uppercase tracking-widest flex items-center justify-center gap-3 ${isUserRegistered ? "bg-green-500/20 text-green-500 border-2 border-green-500/30" : "bg-yellow-400 hover:bg-yellow-300 shadow-lg shadow-yellow-400/10"} ${isRegistering ? "opacity-50" : ""}`}
                  >
                    {isUserRegistered ? (
                      <>
                        <CheckCircle size={20} />
                        REGISTERED
                      </>
                    ) : isRegistering ? (
                      "PROCESSING..."
                    ) : (
                      "CONFIRM REGISTRATION →"
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
