import {
  User,
  Hash,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Clock,
  Target,
  Users,
  ExternalLink,
  X,
  ShieldCheck,
  Sword,
} from "lucide-react";

export default function MissionModal({ mission, userProfile, onClose }: any) {
  const combatant = {
    name: mission.user?.name || userProfile?.name,
    scholarId: mission.user?.scholarId || userProfile?.scholarId,
    branch: mission.user?.branch || userProfile?.branch,
    year: mission.user?.year || userProfile?.year,
    phone: mission.user?.phone || userProfile?.phone,
    email: mission.user?.email || userProfile?.email,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#0d0d0d] border border-yellow-400/40 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in duration-300">
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-[#161616]">
          <div>
            <p className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em] mb-1">
              Registration Record
            </p>
            <h3 className="text-2xl font-black text-white uppercase font-['Orbitron'] tracking-tight leading-none">
              {mission.event?.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#0d0d0d]">
          {/* Participant Section */}
          <div className="space-y-5">
            <h4 className="text-xs font-black text-white uppercase border-b border-yellow-400/20 pb-2 flex items-center gap-2">
              <User size={14} className="text-yellow-400" /> Participant Info
            </h4>
            <div className="space-y-5">
              <DetailRow icon={User} label="Full Name" value={combatant.name} />
              <DetailRow
                icon={Hash}
                label="Scholar ID"
                value={combatant.scholarId}
              />
              <DetailRow
                icon={MapPin}
                label="Branch / Dept"
                value={combatant.branch}
              />
              <DetailRow
                icon={GraduationCap}
                label="Academic Year"
                value={combatant.year ? `Year ${combatant.year}` : null}
              />
              <DetailRow
                icon={Phone}
                label="Phone Number"
                value={combatant.phone}
              />
              <DetailRow
                icon={Mail}
                label="Email Address"
                value={combatant.email}
              />
            </div>
          </div>

          {/* Event Section */}
          <div className="space-y-5">
            <h4 className="text-xs font-black text-white uppercase border-b border-yellow-400/20 pb-2 flex items-center gap-2">
              <Sword size={14} className="text-yellow-400" /> Registration Info
            </h4>
            <div className="space-y-5">
              <DetailRow
                icon={Clock}
                label="Registered On"
                value={new Date(mission.createdAt).toLocaleDateString(
                  undefined,
                  { dateStyle: "long" },
                )}
              />
              <DetailRow
                icon={Target}
                label="Participation"
                value={mission.type?.toUpperCase()}
              />

              {mission.type === "team" && (
                <div className="bg-[#161616] p-4 rounded-xl border border-white/10 mt-2 shadow-inner">
                  <div className="flex items-center gap-2 mb-3 text-cyan-400 font-black">
                    <Users size={16} />
                    <span className="text-xs uppercase tracking-tighter">
                      Team: {mission.teamName}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {mission.members?.map((m: any, i: number) => (
                      <div
                        key={i}
                        className="text-xs text-gray-200 flex justify-between bg-white/5 p-2 rounded border border-white/5"
                      >
                        <span className="font-bold uppercase tracking-tight">
                          {m.name || m}
                        </span>
                        <span className="opacity-50 font-mono text-[10px]">
                          {m.scholarId || "ID: -"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mission.event?.whatsappGroupLink && (
                <a
                  href={mission.event.whatsappGroupLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 mt-4 p-4 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-green-900/20"
                >
                  <ExternalLink size={16} /> Join WhatsApp Group
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-9 h-9 rounded-lg bg-yellow-400/10 flex items-center justify-center text-yellow-400 shrink-0 border border-yellow-400/10">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1 tracking-wider">
          {label}
        </p>
        <p className="text-sm text-white font-bold tracking-tight">
          {value || "Not Found"}
        </p>
      </div>
    </div>
  );
}
