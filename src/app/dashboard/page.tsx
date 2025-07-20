"use client";
import { getPageMetadata } from "@/utils/metadata";
import DashboardFragmentCleanup from "./DashboardFragmentCleanup";

import { useKaryawanProfile } from "../components/useKaryawanProfile";

export default function Dashboard() {
  return (
    <>
      <DashboardFragmentCleanup />
      <div className="min-h-screen flex flex-col bg-white">
        <div className="p-6">
          {(() => {
            const { profile, loading, error } = useKaryawanProfile();
            if (loading) return <span className="animate-pulse text-gray-400">Loading...</span>;
            if (error) return <span className="text-red-500">{error}</span>;
            if (!profile) return <span className="text-red-500">Profil tidak ditemukan</span>;
            return (
              <span className="text-xl font-semibold text-green-700">
                Ahlan Wa Sahlan, {profile.panggilan} {profile.nama_singkat}!
              </span>
            );
          })()}
        </div>
      </div>
    </>
  );
}
