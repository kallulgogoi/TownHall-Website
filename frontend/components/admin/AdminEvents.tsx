import { useState } from "react";
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
  ExternalLink,
} from "lucide-react";

export default function AdminEvents({ events, fetchData }: any) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [evFile, setEvFile] = useState<File | null>(null);
  const [evForm, setEvForm] = useState({
    title: "",
    description: "",
    startDateIST: "",
    endDateIST: "",
    mode: "solo",
    maxTeamSize: "1",
    whatsappGroupLink: "",
  });

  const handleEventSubmit = async (e: any) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(evForm).forEach(([k, v]) => fd.append(k, v));
    if (evFile) fd.append("poster", evFile);
    try {
      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event updated successfully");
      } else {
        if (!evFile) return toast.error("Poster image is required");
        await api.post("/events", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event created successfully");
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setEditingEventId(null);
    setShowEventForm(false);
    setEvFile(null);
    setEvForm({
      title: "",
      description: "",
      startDateIST: "",
      endDateIST: "",
      mode: "solo",
      maxTeamSize: "1",
      whatsappGroupLink: "",
    });
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "open" ? "closed" : "open";
    try {
      await api.put(`/events/${id}/registration-status`, {
        registrationStatus: next,
      });
      toast.success(`Registration ${next}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Events Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowEventForm(!showEventForm);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors text-sm font-medium"
        >
          {showEventForm ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}{" "}
          {showEventForm ? "Cancel" : "New Event"}
        </button>
      </div>

      {showEventForm && (
        <div className="bg-[#111111] border border-yellow-400/20 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Edit className="w-4 h-4 text-yellow-400" />{" "}
            {editingEventId ? "Edit Event" : "Create New Event"}
          </h3>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-white/60 text-xs mb-1">
                  Event Title *
                </label>
                <input
                  required
                  value={evForm.title}
                  onChange={(e) =>
                    setEvForm({ ...evForm, title: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-white/60 text-xs mb-1">
                  WhatsApp Group Link
                </label>
                <input
                  value={evForm.whatsappGroupLink}
                  onChange={(e) =>
                    setEvForm({ ...evForm, whatsappGroupLink: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-400/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">
                  Mode *
                </label>
                <select
                  value={evForm.mode}
                  onChange={(e) =>
                    setEvForm({ ...evForm, mode: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
                >
                  <option value="solo">Solo</option>
                  <option value="team">Team</option>
                </select>
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">
                  Max Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  value={evForm.maxTeamSize}
                  onChange={(e) =>
                    setEvForm({ ...evForm, maxTeamSize: e.target.value })
                  }
                  disabled={evForm.mode === "solo"}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">
                  Start Date & Time *
                </label>
                <input
                  required
                  type="datetime-local"
                  value={evForm.startDateIST}
                  onChange={(e) =>
                    setEvForm({ ...evForm, startDateIST: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs mb-1">
                  End Date & Time *
                </label>
                <input
                  required
                  type="datetime-local"
                  value={evForm.endDateIST}
                  onChange={(e) =>
                    setEvForm({ ...evForm, endDateIST: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-white/60 text-xs mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={evForm.description}
                  onChange={(e) =>
                    setEvForm({ ...evForm, description: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-white/60 text-xs mb-1">
                  Poster Image {!editingEventId && "*"}
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-yellow-400/40 transition-colors">
                      <Upload className="w-5 h-5 text-yellow-400/60 mx-auto mb-2" />
                      <p className="text-white/40 text-xs">
                        {evFile ? evFile.name : "Click to upload poster"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEvFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {evFile && (
                    <button
                      type="button"
                      onClick={() => setEvFile(null)}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300 transition-colors"
            >
              {editingEventId ? "Update Event" : "Create Event"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev: any) => (
          <div
            key={ev._id}
            className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all"
          >
            <div className="p-5 pb-3">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-medium ${ev.registrationStatus === "open" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                >
                  {ev.registrationStatus.toUpperCase()}
                </div>
                {ev.whatsappGroupLink && (
                  <a
                    href={ev.whatsappGroupLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {ev.title}
              </h3>
              <div className="flex items-center gap-3 text-white/30 text-xs mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(ev.startDateIST).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {ev.mode === "solo" ? "Solo" : `Team (${ev.maxTeamSize})`}
                </span>
              </div>
            </div>
            <div className="p-5 pt-0 border-t border-white/5 mt-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => toggleStatus(ev._id, ev.registrationStatus)}
                  className={`p-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${ev.registrationStatus === "open" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setEditingEventId(ev._id);
                    setEvForm({
                      title: ev.title,
                      description: ev.description,
                      startDateIST: new Date(ev.startDateIST)
                        .toISOString()
                        .slice(0, 16),
                      endDateIST: new Date(ev.endDateIST)
                        .toISOString()
                        .slice(0, 16),
                      mode: ev.mode,
                      maxTeamSize: ev.maxTeamSize.toString(),
                      whatsappGroupLink: ev.whatsappGroupLink || "",
                    });
                    setShowEventForm(true);
                  }}
                  className="p-2 bg-white/5 rounded-lg hover:bg-yellow-400/20 text-white/60 hover:text-yellow-400 flex items-center justify-center"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure?")) {
                      await api.delete(`/events/${ev._id}`);
                      fetchData();
                      toast.success("Event deleted");
                    }
                  }}
                  className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-500 flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
