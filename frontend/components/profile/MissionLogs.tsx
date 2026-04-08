"use client";
import {
  User,
  Users,
  Calendar,
  ExternalLink,
  Inbox,
  UsersRound,
  Hash,
  Mail,
  Phone,
  Award,
  Code,
} from "lucide-react";
import { motion } from "framer-motion";

export default function MissionLogs({
  activeSubTab,
  setActiveSubTab,
  data,
}: any) {
  const hasData = data.solo?.length > 0 || data.team?.length > 0;

  const counts = {
    all: (data.solo?.length || 0) + (data.team?.length || 0),
    solo: data.solo?.length || 0,
    team: data.team?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] rounded-xl border border-gray-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">My Registrations</h2>

          {/* Tabs */}
          <div className="flex bg-[#0a0a0a] p-1 rounded-lg border border-gray-800">
            {[
              { key: "all", label: "All", count: counts.all },
              { key: "solo", label: "Solo", count: counts.solo },
              { key: "team", label: "Team", count: counts.team },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  activeSubTab === tab.key
                    ? "bg-yellow-400 text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      activeSubTab === tab.key
                        ? "bg-black/20"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {(activeSubTab === "all" || activeSubTab === "solo") &&
          data.solo?.map((reg: any, idx: number) => (
            <RegistrationCard
              key={reg._id}
              reg={reg}
              type="solo"
              index={idx}
              userProfile={data.profile}
            />
          ))}

        {(activeSubTab === "all" || activeSubTab === "team") &&
          data.team?.map((reg: any, idx: number) => (
            <RegistrationCard
              key={reg._id}
              reg={reg}
              type="team"
              index={idx}
              userProfile={data.profile}
            />
          ))}

        {!hasData && <EmptyState />}
      </div>
    </div>
  );
}

function RegistrationCard({ reg, type, index, userProfile }: any) {
  const eventData = reg.event || {};
  const displayUser =
    typeof reg.user === "object" && reg.user !== null ? reg.user : userProfile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-2.5 rounded-lg ${
              type === "solo" ? "bg-yellow-400/10" : "bg-blue-400/10"
            }`}
          >
            {type === "solo" ? (
              <User size={18} className="text-yellow-400" />
            ) : (
              <Users size={18} className="text-blue-400" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {eventData.title || "Event Registration"}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  type === "solo"
                    ? "bg-yellow-400/10 text-yellow-400"
                    : "bg-blue-400/10 text-blue-400"
                }`}
              >
                {type === "solo" ? "Individual" : "Team Event"}
              </span>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <Calendar size={12} />
                {reg.createdAt
                  ? new Date(reg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Pending"}
              </div>
            </div>
          </div>
        </div>

        {eventData.whatsappGroupLink && (
          <a
            href={eventData.whatsappGroupLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600/10 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <ExternalLink size={14} />
            Join Group
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Registration Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Participant Details
          </h4>

          <div className="space-y-3">
            <DetailItem icon={User} label="Name" value={displayUser?.name} />

            {type === "solo" ? (
              <DetailItem
                icon={Hash}
                label="Scholar ID"
                value={displayUser?.scholarId}
              />
            ) : (
              <DetailItem
                icon={Mail}
                label="Email"
                value={displayUser?.email}
              />
            )}

            {/* ONLY RENDER IF CF EXISTS ON THE TICKET */}
            {(reg.codeforcesHandle || reg.leaderCodeforcesHandle) && (
              <DetailItem
                icon={Code}
                label="Codeforces"
                value={
                  type === "solo"
                    ? reg.codeforcesHandle
                    : reg.leaderCodeforcesHandle
                }
              />
            )}

            <DetailItem
              icon={Phone}
              label="Contact"
              value={displayUser?.phone}
            />
          </div>
        </div>

        {/* Right Column - Team Members (for team events) */}
        {type === "team" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Members
              </h4>
              <span className="text-xs px-2 py-0.5 bg-blue-400/10 text-blue-400 rounded-full">
                {reg.members?.length || 0} members
              </span>
            </div>

            {reg.teamName && (
              <div className="mb-3 p-3 bg-blue-400/5 border border-blue-400/10 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Team Name</p>
                <p className="text-sm font-medium text-white">{reg.teamName}</p>
              </div>
            )}

            <div className="space-y-2">
              {reg.members?.map((member: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-gray-800 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {member.name || `Member ${i + 1}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.scholarId || "ID pending"}
                    </p>
                    {/* SHOW MEMBER CF HANDLE IF IT EXISTS IN THE TICKET */}
                    {reg.memberCodeforcesHandles?.[i] && (
                      <p className="text-xs text-yellow-400 mt-0.5">
                        CF: {reg.memberCodeforcesHandles[i]}
                      </p>
                    )}
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] flex items-center justify-center text-gray-500">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-white truncate max-w-[200px]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-800 rounded-xl bg-[#0a0a0a]">
      <div className="p-4 bg-gray-800/50 rounded-full mb-4">
        <Inbox size={32} className="text-gray-600" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">
        No registrations yet
      </h3>
      <p className="text-gray-500 text-sm text-center max-w-sm">
        You haven't registered for any events. Browse events and start your
        journey!
      </p>
    </div>
  );
}
