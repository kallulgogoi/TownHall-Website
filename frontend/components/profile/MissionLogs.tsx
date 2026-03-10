import { User, Users, ChevronRight, Calendar } from "lucide-react";

export default function MissionLogs({
  activeSubTab,
  setActiveSubTab,
  data,
  onSelectMission,
}: any) {
  return (
    <div className="bg-[#111111] border border-yellow-400/30 rounded-xl overflow-hidden min-h-[500px] shadow-2xl">
      {/* Tab Header */}
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161616]">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white">
          My Events
        </h2>

        <div className="flex bg-[#0a0a0a] p-1 rounded-lg border border-white/20">
          {["all", "solo", "team"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveSubTab(t)}
              className={`px-5 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                activeSubTab === t
                  ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4">
        {(activeSubTab === "all" || activeSubTab === "solo") &&
          data.solo.map((reg: any) => (
            <RegistrationItem
              key={reg._id}
              reg={reg}
              type="solo"
              onClick={() => onSelectMission({ ...reg, type: "solo" })}
            />
          ))}
        {(activeSubTab === "all" || activeSubTab === "team") &&
          data.team.map((reg: any) => (
            <RegistrationItem
              key={reg._id}
              reg={reg}
              type="team"
              onClick={() => onSelectMission({ ...reg, type: "team" })}
            />
          ))}

        {data.solo.length === 0 && data.team.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-white/5 rounded-xl">
            <p className="text-gray-500 uppercase font-black tracking-widest text-sm">
              No Events Registered
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RegistrationItem({ reg, type, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="group p-5 bg-[#1a1a1a] border border-white/10 rounded-xl hover:border-yellow-400/50 hover:bg-[#222222] transition-all cursor-pointer shadow-sm flex items-center justify-between"
    >
      <div className="flex items-center gap-5">
        {/* Category Icon */}
        <div
          className={`p-3 rounded-lg shadow-inner ${
            type === "solo"
              ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/30"
              : "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30"
          }`}
        >
          {type === "solo" ? <User size={22} /> : <Users size={22} />}
        </div>

        {/* Event Info */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors leading-tight">
            {reg.event?.title || "Untitled Event"}
          </h3>

          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                type === "solo"
                  ? "bg-yellow-400 text-black font-black"
                  : "bg-cyan-500 text-black font-black"
              }`}
            >
              {type}
            </span>
            <div className="flex items-center gap-1.5 text-gray-300 font-medium">
              <Calendar size={13} className="text-yellow-400/70" />
              <span className="text-xs">
                {new Date(reg.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-400 group-hover:text-yellow-400 transition-colors font-bold">
        <span className="text-[10px] uppercase tracking-widest hidden sm:inline">
          View Details
        </span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
