"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { User } from "lucide-react";

// Component Imports
import ProfileCard from "@/components/profile/ProfileCard";
import MissionLogs from "@/components/profile/MissionLogs";
import MissionModal from "@/components/profile/MissionModal";

export default function ProfilePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
  const [data, setData] = useState<any>({ profile: null, solo: [], team: [] });
  const [editForm, setEditForm] = useState({
    name: "",
    scholarId: "",
    branch: "",
    year: "",
    phone: "",
  });
  const [editFile, setEditFile] = useState<File | null>(null);

  const branches = ["CSE", "ECE", "EE", "ME", "CE", "EI"];

  const fetchProfileData = async () => {
    if (isAuthenticated) {
      try {
        const [me, s, t] = await Promise.all([
          api.get("/auth/me"),
          api.get("/registrations/solo/my"),
          api.get("/registrations/team/my"),
        ]);
        setData({ profile: me.data, solo: s.data, team: t.data });
      } catch (err) {
        toast.error("Failed to sync profile data");
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [isAuthenticated]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
    if (editFile) formData.append("profilePicture", editFile);

    const loadingToast = toast.loading("Updating profile...");
    try {
      await api.put("/auth/profile", formData);
      toast.success("Profile updated", { id: loadingToast });
      setIsEditing(false);
      fetchProfileData();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Update failed";
      toast.error(msg, { id: loadingToast });
    }
  };

  if (authLoading || !data.profile)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-t-2 border-yellow-400 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-['Rajdhani']">
      <Toaster position="top-right" />

      <header className="border-b border-yellow-400/20 bg-[#111111] p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <User className="text-yellow-400" />
          <h1 className="text-xl font-bold uppercase tracking-tight">
            Profile Dashboard
          </h1>
        </div>
      </header>

      {selectedMission && (
        <MissionModal
          mission={selectedMission}
          userProfile={data.profile}
          onClose={() => setSelectedMission(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProfileCard
          data={data}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleUpdate={handleUpdate}
          setEditFile={setEditFile}
          editFile={editFile}
          branches={branches}
        />

        <div className="lg:col-span-2">
          <MissionLogs
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
            data={data}
            onSelectMission={setSelectedMission}
          />
        </div>
      </div>
    </main>
  );
}
