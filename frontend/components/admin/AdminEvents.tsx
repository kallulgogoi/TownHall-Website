"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Edit,
  Trash2,
  Plus,
  X,
  Upload,
  Calendar,
  Users,
  Power,
  MessageCircle,
  Clock,
  FileText,
  Loader2,
  Code,
} from "lucide-react";

export default function AdminEvents({ events, fetchData }: any) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [evFile, setEvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evForm, setEvForm] = useState({
    title: "",
    description: "",
    startDateIST: "",
    endDateIST: "",
    mode: "solo",
    maxTeamSize: "1",
    whatsappGroupLink: "",
    requiresCodeforces: false,
  });

  const handleEventSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fd = new FormData();
    Object.entries(evForm).forEach(([k, v]) => fd.append(k, v.toString()));
    if (evFile) fd.append("poster", evFile);

    const loadingToast = toast.loading(
      editingEventId ? "Updating event..." : "Creating event...",
    );

    try {
      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event updated successfully", { id: loadingToast });
      } else {
        if (!evFile) {
          setIsSubmitting(false);
          return toast.error("Event poster is required", { id: loadingToast });
        }
        await api.post("/events", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event created successfully", { id: loadingToast });
      }
      fetchData();
      closeDrawer();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCreate = () => {
    setEditingEventId(null);
    setEvForm({
      title: "",
      description: "",
      startDateIST: "",
      endDateIST: "",
      mode: "solo",
      maxTeamSize: "1",
      whatsappGroupLink: "",
      requiresCodeforces: false,
    });
    setEvFile(null);
    setShowDrawer(true);
  };

  const openEdit = (ev: any) => {
    setEditingEventId(ev._id);
    setEvForm({
      title: ev.title,
      description: ev.description,
      startDateIST: new Date(ev.startDateIST).toISOString().slice(0, 16),
      endDateIST: new Date(ev.endDateIST).toISOString().slice(0, 16),
      mode: ev.mode,
      maxTeamSize: ev.maxTeamSize.toString(),
      whatsappGroupLink: ev.whatsappGroupLink || "",
      requiresCodeforces: ev.requiresCodeforces || false,
    });
    setEvFile(null);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    if (isSubmitting) return;
    setShowDrawer(false);
    setEditingEventId(null);
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "open" ? "closed" : "open";
    try {
      await api.put(`/events/${id}/registration-status`, {
        registrationStatus: next,
      });
      toast.success(`Registration is now ${next.toUpperCase()}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8 font-custom relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Event Management
          </h2>
          <p className="text-white/40 text-xs uppercase tracking-widest font-bold">
            Organize and monitor event registrations
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-yellow-400/20"
        >
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((ev: any) => (
          <div
            key={ev._id}
            className="group bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-400/40 transition-all duration-300 shadow-xl flex flex-col"
          >
            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    ev.registrationStatus === "open"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {ev.registrationStatus}
                </div>
                <div className="flex gap-2">
                  {ev.whatsappGroupLink && (
                    <a
                      href={ev.whatsappGroupLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                    >
                      <MessageCircle size={14} />
                    </a>
                  )}
                  <button
                    onClick={() => openEdit(ev)}
                    className="p-2 bg-white/5 text-white/40 rounded-lg hover:bg-yellow-400 hover:text-black transition-colors border border-white/5"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-yellow-400 transition-colors line-clamp-1">
                {ev.title}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> Date
                  </p>
                  <p className="text-xs font-bold text-white/80">
                    {new Date(ev.startDateIST).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1">
                    <Users size={10} /> Mode
                  </p>
                  <p className="text-xs font-bold text-white/80 uppercase">
                    {ev.mode} {ev.mode === "team" && `(${ev.maxTeamSize})`}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-3">
              <button
                onClick={() => toggleStatus(ev._id, ev.registrationStatus)}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  ev.registrationStatus === "open"
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                    : "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                }`}
              >
                <Power size={12} />{" "}
                {ev.registrationStatus === "open" ? "Close Reg" : "Open Reg"}
              </button>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this event?")) {
                    await api.delete(`/events/${ev._id}`);
                    fetchData();
                    toast.success("Event deleted");
                  }
                }}
                className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-red-600 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Side Drawer for Form */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0d0d0d] border-l border-white/10 z-[120] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                    {editingEventId ? "Edit Event" : "Add New Event"}
                  </h3>
                  <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mt-1">
                    Provide event details below
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleEventSubmit}
                className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
              >
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <FileText size={14} />
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Basic Information
                    </label>
                  </div>
                  <input
                    required
                    value={evForm.title}
                    onChange={(e) =>
                      setEvForm({ ...evForm, title: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50 disabled:opacity-50"
                    placeholder="Event Title"
                  />
                  <textarea
                    required
                    rows={4}
                    value={evForm.description}
                    onChange={(e) =>
                      setEvForm({ ...evForm, description: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50 resize-none disabled:opacity-50"
                    placeholder="Event Description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Registration Logic */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                      <Users size={14} />
                      <label className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Participation
                      </label>
                    </div>
                    <select
                      value={evForm.mode}
                      onChange={(e) =>
                        setEvForm({ ...evForm, mode: e.target.value })
                      }
                      disabled={isSubmitting}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50 appearance-none disabled:opacity-50"
                    >
                      <option value="solo">Solo Participation</option>
                      <option value="team">Team Participation</option>
                    </select>
                    <input
                      type="number"
                      min="1"
                      disabled={evForm.mode === "solo" || isSubmitting}
                      value={evForm.maxTeamSize}
                      onChange={(e) =>
                        setEvForm({ ...evForm, maxTeamSize: e.target.value })
                      }
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50 disabled:opacity-20"
                      placeholder="Max Team Size"
                    />
                  </div>
                  {/* Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/40 mb-2">
                      <Calendar size={14} />
                      <label className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Schedule (IST)
                      </label>
                    </div>
                    <input
                      required
                      type="datetime-local"
                      value={evForm.startDateIST}
                      onChange={(e) =>
                        setEvForm({ ...evForm, startDateIST: e.target.value })
                      }
                      disabled={isSubmitting}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none disabled:opacity-50"
                    />
                    <input
                      required
                      type="datetime-local"
                      value={evForm.endDateIST}
                      onChange={(e) =>
                        setEvForm({ ...evForm, endDateIST: e.target.value })
                      }
                      disabled={isSubmitting}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* WhatsApp Link */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-500/60 mb-2">
                    <MessageCircle size={14} />
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Communication
                    </label>
                  </div>
                  <input
                    value={evForm.whatsappGroupLink}
                    onChange={(e) =>
                      setEvForm({
                        ...evForm,
                        whatsappGroupLink: e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-green-400 outline-none border-green-500/10 focus:border-green-500/40 disabled:opacity-50"
                    placeholder="WhatsApp Group Link"
                  />
                </div>

                {/* REQUIRE CODEFORCES TOGGLE */}
                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 hover:border-yellow-400/30 transition-colors">
                  <div className="flex items-center justify-center p-2 rounded-lg bg-yellow-400/10 text-yellow-400">
                    <Code size={18} />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="requiresCodeforces"
                      className="text-sm font-bold text-white cursor-pointer block"
                    >
                      Require Codeforces Handle
                    </label>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                      Participants must provide CF ID to register
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="requiresCodeforces"
                    checked={evForm.requiresCodeforces}
                    onChange={(e) =>
                      setEvForm({
                        ...evForm,
                        requiresCodeforces: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-yellow-400 cursor-pointer"
                  />
                </div>

                {/* Poster Upload */}
                <div className="space-y-4 pb-10">
                  <div className="flex items-center gap-2 text-white/40 mb-2">
                    <Upload size={14} />
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Event Poster {!editingEventId && "*"}
                    </label>
                  </div>
                  <label
                    className={`block cursor-pointer group ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center group-hover:border-yellow-400/40 transition-all bg-white/[0.02]">
                      <Upload className="w-6 h-6 text-yellow-400/60 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                        {evFile ? evFile.name : "Click to select image file"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEvFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </form>

              <div className="p-8 border-t border-white/10 bg-[#0a0a0a]">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleEventSubmit}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 disabled:cursor-not-allowed text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : editingEventId ? (
                    "Save Changes"
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
