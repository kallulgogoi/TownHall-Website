"use client";
import {
  Edit3,
  Hash,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  Award,
  X,
  Save,
} from "lucide-react";
import Image from "next/image";

export default function ProfileCard({
  data,
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  handleUpdate,
  branches,
}: any) {
  return (
    <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
      {/* Cover Photo */}
      <div className="h-24 bg-gradient-to-r from-yellow-400/20 to-gray-800 relative">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-yellow-400 hover:text-black rounded-lg transition-colors backdrop-blur-sm"
            title="Edit profile"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-12 mb-6">
          <div className="relative w-20 h-20">
            <Image
              src={
                data.profile?.profilePicture ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${data.profile?.name || "User"}`
              }
              className="w-full h-full rounded-xl border-4 border-[#111111] object-cover bg-[#0a0a0a]"
              height={80}
              width={80}
              alt="Profile"
            />
          </div>
        </div>

        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                {data.profile?.name || "User Name"}
              </h2>
              <p className="text-sm text-yellow-400/80">Student</p>
            </div>

            <div className="space-y-4">
              <ProfileInfoRow
                icon={Hash}
                label="Scholar ID"
                value={data.profile?.scholarId}
              />

              <ProfileInfoRow
                icon={MapPin}
                label="Branch"
                value={data.profile?.branch}
              />

              <ProfileInfoRow
                icon={GraduationCap}
                label="Year"
                value={data.profile?.year ? `Year ${data.profile.year}` : null}
              />

              <ProfileInfoRow
                icon={Phone}
                label="Phone"
                value={data.profile?.phone}
              />

              <ProfileInfoRow
                icon={Mail}
                label="Email"
                value={data.profile?.email}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="text-2xl font-semibold text-white">
                  {data.solo?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Solo Events</p>
              </div>
              <div className="p-3 bg-[#0a0a0a] rounded-lg">
                <p className="text-2xl font-semibold text-white">
                  {data.team?.length || 0}
                </p>
                <p className="text-xs text-gray-500">Team Events</p>
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <input
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Scholar ID
              </label>
              <input
                required
                value={editForm.scholarId}
                onChange={(e) =>
                  setEditForm({ ...editForm, scholarId: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                placeholder="Enter scholar ID"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Branch
                </label>
                <select
                  value={editForm.branch}
                  onChange={(e) =>
                    setEditForm({ ...editForm, branch: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                >
                  <option value="">Select Branch</option>
                  {branches.map((b: string) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Year
                </label>
                <select
                  value={editForm.year}
                  onChange={(e) =>
                    setEditForm({ ...editForm, year: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                >
                  <option value="">Select Year</option>
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                required
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:border-yellow-400/50 focus:outline-none"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 border border-gray-800 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProfileInfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#0a0a0a] flex items-center justify-center text-gray-500">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-white truncate max-w-[180px]">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
