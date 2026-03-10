import {
  Edit3,
  Hash,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Camera,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";

export default function ProfileCard({
  data,
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  handleUpdate,
  setEditFile,
  editFile,
  branches,
}: any) {
  const handleEditClick = () => {
    setEditForm({
      name: data.profile.name,
      scholarId: data.profile.scholarId,
      branch: data.profile.branch,
      year: data.profile.year.toString(),
      phone: data.profile.phone,
    });
    setIsEditing(true);
  };

  return (
    /* FIXED: Changed 'sticky' to 'lg:sticky' to prevent it from sticking and blocking content on mobile */
    <div className="bg-[#111111] border border-yellow-400/20 rounded-xl overflow-hidden lg:sticky lg:top-24">
      <div className="relative h-24 bg-gradient-to-r from-yellow-400/20 to-transparent">
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="absolute bottom-4 right-4 p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>

      <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
        <Image
          src={
            data.profile?.profilePicture ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${data.profile?.name}`
          }
          className="w-24 h-24 rounded-xl border-2 border-yellow-400 object-cover relative z-10 bg-[#0a0a0a]"
          height={60}
          width={60}
          alt="PFP"
        />

        {!isEditing ? (
          <>
            <h2 className="text-xl font-bold mt-4">{data.profile?.name}</h2>
            <p className="text-yellow-400 text-xs font-medium mb-6 uppercase tracking-widest">
              User
            </p>
            <div className="w-full space-y-3">
              <ProfileRow
                icon={Hash}
                label="Scholar ID"
                value={data.profile?.scholarId}
              />
              <ProfileRow
                icon={MapPin}
                label="Branch"
                value={data.profile?.branch}
              />
              <ProfileRow
                icon={GraduationCap}
                label="Year"
                value={`Year ${data.profile?.year}`}
              />
              <ProfileRow
                icon={Phone}
                label="Phone"
                value={data.profile?.phone}
              />
              <ProfileRow
                icon={Mail}
                label="Email"
                value={data.profile?.email}
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="w-full mt-6 space-y-4">
            <input
              required
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm"
              placeholder="Full Name"
            />
            <input
              required
              value={editForm.scholarId}
              onChange={(e) =>
                setEditForm({ ...editForm, scholarId: e.target.value })
              }
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm"
              placeholder="Scholar ID"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={editForm.branch}
                onChange={(e) =>
                  setEditForm({ ...editForm, branch: e.target.value })
                }
                className="bg-[#0a0a0a] border border-white/10 rounded-lg px-2 py-2 text-sm"
              >
                {branches.map((b: string) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                value={editForm.year}
                onChange={(e) =>
                  setEditForm({ ...editForm, year: e.target.value })
                }
                className="bg-[#0a0a0a] border border-white/10 rounded-lg px-2 py-2 text-sm"
              >
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
            <input
              required
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-sm"
              placeholder="Phone"
            />
            <label className="flex items-center gap-2 p-3 border border-dashed border-white/10 rounded-lg cursor-pointer text-xs text-white/40">
              <Camera size={14} /> {editFile ? editFile.name : "Upload Photo"}
              <input
                type="file"
                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 border border-white/10 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-yellow-400 text-black rounded-lg text-xs font-bold"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 text-left">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-yellow-400/60" />
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <span className="text-sm font-medium text-white">{value || "—"}</span>
    </div>
  );
}
