import { useState } from "react";
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
  Eye,
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
    setViewingReg(null);
    const ev: any = events.find((e: any) => e._id === id);
    if (ev) {
      const loadingToast = toast.loading("Loading registrations...");
      try {
        const res = await api.get(`/registrations/${ev.mode}/event/${id}`);
        setRegs(res.data);
        toast.success(`${res.data.length} found`, { id: loadingToast });
      } catch (err) {
        toast.error("Failed", { id: loadingToast });
      }
    }
  };

  const downloadCSV = () => {
    if (!regs.length) return toast.error("No registrations");
    const event = events.find((e: any) => e._id === selectedEvent) as any;
    const isTeam = event?.mode === "team";
    let csv = isTeam
      ? "Team Name,Leader Name,Leader Email,Leader Scholar ID,Leader Branch\n"
      : "Name,Email,Scholar ID,Branch,Phone\n";
    regs.forEach((r: any) => {
      const u = r.user || r.teamLeader;
      csv += isTeam
        ? `"${r.teamName}","${u?.name}","${u?.email}","${u?.scholarId}","${u?.branch}"\n`
        : `"${u?.name}","${u?.email}","${u?.scholarId}","${u?.branch}","${u?.phone || ""}"\n`;
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `registrations_${event?.title}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Registrations</h2>
        {selectedEvent && regs.length > 0 && (
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>
      <div className="bg-[#111111] border border-white/10 rounded-xl p-5">
        <label className="block text-white/60 text-xs mb-2">Select Event</label>
        <select
          onChange={(e) => fetchRegs(e.target.value)}
          value={selectedEvent}
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-400/40 focus:outline-none"
        >
          <option value="">Choose an event</option>
          {events.map((e: any) => (
            <option key={e._id} value={e._id}>
              {e.title} ({e.mode})
            </option>
          ))}
        </select>
      </div>
      {selectedEvent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {regs.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">
                No registrations found
              </div>
            ) : (
              regs.map((reg: any, i) => (
                <div
                  key={i}
                  onClick={() => setViewingReg(reg)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${viewingReg === reg ? "bg-yellow-400/10 border-yellow-400/30" : "bg-[#111111] border-white/10 hover:border-white/20"}`}
                >
                  <p className="font-medium text-white">
                    {reg.teamName || reg.user?.name}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {reg.user?.scholarId || reg.teamLeader?.scholarId || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="lg:col-span-2">
            {viewingReg ? (
              <div className="bg-[#111111] border border-yellow-400/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {viewingReg.teamName || viewingReg.user?.name}
                    </h3>
                    <p className="text-sm text-white/40 mt-1">
                      {viewingReg.teamName
                        ? "Team Registration"
                        : "Solo Registration"}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-400/10 rounded-lg">
                    {viewingReg.teamName ? (
                      <Users className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <User className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <DetailItem
                        icon={User}
                        label="Name"
                        value={
                          viewingReg.user?.name || viewingReg.teamLeader?.name
                        }
                      />
                      <DetailItem
                        icon={Mail}
                        label="Email"
                        value={
                          viewingReg.user?.email || viewingReg.teamLeader?.email
                        }
                      />
                      <DetailItem
                        icon={Hash}
                        label="Scholar ID"
                        value={
                          viewingReg.user?.scholarId ||
                          viewingReg.teamLeader?.scholarId
                        }
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Branch"
                        value={
                          viewingReg.user?.branch ||
                          viewingReg.teamLeader?.branch
                        }
                      />
                      <DetailItem
                        icon={Phone}
                        label="Phone"
                        value={
                          viewingReg.user?.phone || viewingReg.teamLeader?.phone
                        }
                      />
                    </div>
                  </div>
                  {viewingReg.teamName && viewingReg.members && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        Team Members ({viewingReg.members.length})
                      </h4>
                      <div className="space-y-2">
                        {viewingReg.members.map((m: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-[#0a0a0a] border border-white/10 rounded-lg p-3"
                          >
                            <p className="text-sm font-medium text-white">
                              {m.name}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                              {m.scholarId}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-[#111111] border border-dashed border-white/10 rounded-xl p-12 text-center">
                <Eye className="w-12 h-12 text-white/20 mb-4" />
                <p className="text-white/40 text-sm">
                  Select a registration to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-yellow-400/60" />
      </div>
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-sm font-medium text-white">{value || "—"}</p>
      </div>
    </div>
  );
}
