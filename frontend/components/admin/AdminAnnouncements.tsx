import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Megaphone, Edit, Trash2 } from "lucide-react";

export default function AdminAnnouncements({ announcements, fetchData }: any) {
  const [annForm, setAnnForm] = useState({ title: "", message: "" });
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  const handleAnnSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingAnnId) {
        await api.put(`/announcements/${editingAnnId}`, annForm);
        toast.success("Announcement updated");
      } else {
        await api.post("/announcements", annForm);
        toast.success("Announcement posted");
      }
      setAnnForm({ title: "", message: "" });
      setEditingAnnId(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to post announcement");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#111111] border border-yellow-400/20 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-yellow-400" />{" "}
          {editingAnnId ? "Edit Announcement" : "New Announcement"}
        </h3>
        <form onSubmit={handleAnnSubmit} className="space-y-4">
          <input
            required
            placeholder="Announcement title"
            value={annForm.title}
            onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
          />
          <textarea
            required
            placeholder="Announcement message"
            value={annForm.message}
            onChange={(e) =>
              setAnnForm({ ...annForm, message: e.target.value })
            }
            rows={4}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
          />
          <div className="flex justify-end gap-3">
            {editingAnnId && (
              <button
                type="button"
                onClick={() => {
                  setEditingAnnId(null);
                  setAnnForm({ title: "", message: "" });
                }}
                className="px-4 py-2 border border-white/10 rounded-lg text-white/60 hover:text-white"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-300"
            >
              {editingAnnId ? "Update" : "Post"}
            </button>
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {announcements.map((ann: any) => (
          <div
            key={ann._id}
            className="bg-[#111111] border border-white/10 rounded-xl p-5 hover:border-yellow-400/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">
                  {ann.title}
                </h3>
                <p className="text-white/60 text-sm mb-3">{ann.message}</p>
                <span className="text-white/30 text-xs">
                  {new Date(ann.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingAnnId(ann._id);
                    setAnnForm({ title: ann.title, message: ann.message });
                  }}
                  className="p-2 bg-white/5 rounded-lg hover:bg-yellow-400/20 text-white/60 hover:text-yellow-400"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Delete this announcement?")) {
                      await api.delete(`/announcements/${ann._id}`);
                      fetchData();
                      toast.success("Announcement deleted");
                    }
                  }}
                  className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
