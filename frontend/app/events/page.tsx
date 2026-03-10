"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Eye,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Custom spinner
  const LoadingSpinner = () => (
    <div className="relative">
      <div className="w-16 h-16 border-3 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400/40 rounded-full animate-ping"></div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-white/50 font-medium uppercase tracking-wider">
          Loading Events
        </p>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Simple Header - No Background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-6xl font-bold text-white tracking-tight">
              Events
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Browse and register for upcoming tournaments
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 border border-yellow-400/20 rounded-2xl bg-[#111111]">
              <Trophy className="w-12 h-12 text-yellow-400/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg font-medium">
                No active events
              </p>
              <p className="text-white/30 text-sm mt-2">
                Check back later for new tournaments
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-[#111111] border border-yellow-400/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/5"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-black">
                  <Image
                    src={event.posterUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    width={400}
                    height={200}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md ${
                        event.registrationStatus === "open"
                          ? "bg-yellow-400 text-black"
                          : "bg-red-500/10 text-red-500 border border-red-500/30"
                      }`}
                    >
                      {event.registrationStatus === "open" ? "Open" : "Closed"}
                    </span>
                  </div>

                  {/* Mode Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-yellow-400/30 rounded-md text-yellow-400 text-xs font-bold uppercase tracking-wider">
                      {event.mode === "solo"
                        ? "Solo"
                        : `Team (${event.maxTeamSize})`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {event.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-yellow-400/60" />
                      <span className="font-medium">
                        {new Date(event.startDateIST).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-yellow-400/60" />
                        <span className="font-medium line-clamp-1">
                          {event.location}
                        </span>
                      </div>
                    )}

                    {event.participants && (
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Users className="w-3.5 h-3.5 text-yellow-400/60" />
                        <span className="font-medium">
                          {event.participants.length} participant
                          {event.participants.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push(`/events/${event._id}`)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-transparent border border-yellow-400/30 rounded-lg hover:bg-yellow-400/5 transition-all duration-300 group/btn"
                  >
                    <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
                      View Details
                    </span>
                    <ChevronRight className="w-4 h-4 text-yellow-400/60 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
