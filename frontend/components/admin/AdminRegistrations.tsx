"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Download,
  User,
  Users,
  Mail,
  Hash,
  MapPin,
  Phone,
  ChevronRight,
  Filter,
  X,
  Calendar,
  Info,
  Code,
} from "lucide-react";

export default function AdminRegistrations({ events }: any) {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [regs, setRegs] = useState([]);
  const [viewingReg, setViewingReg] = useState<any>(null);

  const fetchRegs = async (id: string) => {
    if (!id) {
      setSelectedEvent("");
      setRegs([]);
      setViewingReg(null);
      return;
    }
    setSelectedEvent(id);
    const ev: any = events.find((e: any) => e._id === id);
    if (ev) {
      const loadingToast = toast.loading("Loading registration data...");
      try {
        const res = await api.get(`/registrations/${ev.mode}/event/${id}`);
        setRegs(res.data);
        toast.success(`${res.data.length} registrations loaded`, {
          id: loadingToast,
        });
      } catch (err) {
        toast.error("Failed to load registrations", { id: loadingToast });
      }
    }
  };

  return (
    <div className="space-y-6 font-custom relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Registration Management
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
            View and export event participants
          </p>
        </div>
      </div>

      {/* Event Selection */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="block text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2 pl-1">
            Select Event
          </label>
          <div className="relative">
            <select
              onChange={(e) => fetchRegs(e.target.value)}
              value={selectedEvent}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-400/40 outline-none appearance-none cursor-pointer"
            >
              <option value="">Choose an event</option>
              {events.map((e: any) => (
                <option key={e._id} value={e._id}>
                  {e.title}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <Filter size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {selectedEvent && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Participant / Team
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Email Address
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                    Scholar ID
                  </th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {regs.map((reg: any, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-bold uppercase tracking-tight">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            reg.teamName
                              ? "bg-cyan-500/10 text-cyan-400"
                              : "bg-yellow-400/10 text-yellow-400"
                          }`}
                        >
                          {reg.teamName ? (
                            <Users size={16} />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        {reg.teamName || reg.user?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">
                      {reg.user?.email || reg.teamLeader?.email}
                    </td>
                    <td className="px-6 py-4 text-white/40 font-mono text-xs">
                      {reg.user?.scholarId ||
                        reg.teamLeader?.scholarId ||
                        "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setViewingReg(reg)}
                        className="px-4 py-1.5 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer Animation */}
      <AnimatePresence>
        {viewingReg && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingReg(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-white/10 z-[120] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                    Participant Details
                  </h3>
                  <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mt-1">
                    Registration Information
                  </p>
                </div>
                <button
                  onClick={() => setViewingReg(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* User Section */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/10 pb-2">
                    Personal Information
                  </h4>
                  <div className="space-y-5">
                    <DetailRow
                      icon={User}
                      label="Full Name"
                      value={
                        viewingReg.user?.name || viewingReg.teamLeader?.name
                      }
                    />
                    <DetailRow
                      icon={Mail}
                      label="Email Address"
                      value={
                        viewingReg.user?.email || viewingReg.teamLeader?.email
                      }
                    />
                    <DetailRow
                      icon={Hash}
                      label="Scholar ID"
                      value={
                        viewingReg.user?.scholarId ||
                        viewingReg.teamLeader?.scholarId
                      }
                    />

                    {/* ONLY RENDER IF CF EXISTS ON THE REGISTRATION TICKET */}
                    {(viewingReg.codeforcesHandle ||
                      viewingReg.leaderCodeforcesHandle) && (
                      <DetailRow
                        icon={Code}
                        label="Codeforces Handle"
                        value={
                          viewingReg.codeforcesHandle ||
                          viewingReg.leaderCodeforcesHandle
                        }
                      />
                    )}

                    <DetailRow
                      icon={MapPin}
                      label="Branch"
                      value={
                        viewingReg.user?.branch || viewingReg.teamLeader?.branch
                      }
                    />
                    <DetailRow
                      icon={Phone}
                      label="Phone Number"
                      value={
                        viewingReg.user?.phone || viewingReg.teamLeader?.phone
                      }
                    />
                  </div>
                </div>

                {/* Team Roster */}
                {viewingReg.teamName && viewingReg.members && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                        Team Members
                      </h4>
                      <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-400/5">
                        {viewingReg.members.length} Members
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {viewingReg.members.map((m: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">
                              {m.name}
                            </p>
                            <p className="text-[10px] text-white/30 font-mono mt-0.5">
                              {m.scholarId}
                            </p>
                            {/* RENDER MEMBER CF HANDLES IF THEY EXIST */}
                            {viewingReg.memberCodeforcesHandles?.[idx] && (
                              <p className="text-[10px] text-yellow-400 font-mono mt-1">
                                CF: {viewingReg.memberCodeforcesHandles[idx]}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-white/10 bg-black/40">
                <div className="flex items-center gap-3 text-white/40">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Registered on:{" "}
                    {new Date(viewingReg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
        <Icon className="w-4 h-4 text-yellow-400/70" />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1 leading-none">
          {label}
        </p>
        <p className="text-base font-bold text-white tracking-tight break-all leading-tight">
          {value || "Not Provided"}
        </p>
      </div>
    </div>
  );
}
