"use client";
import DashboardFragmentCleanup from "./DashboardFragmentCleanup";

import { useKaryawanProfile } from "../components/useKaryawanProfile";
import { useAllKaryawanEmails } from "../components/useAllKaryawanEmails";

export default function Dashboard() {
  const { profile, loading, error } = useKaryawanProfile();
  const { emails, loading: loadingEmails, error: errorEmails } = useAllKaryawanEmails();
  return (
    <>
      <DashboardFragmentCleanup />
      <div className="rounded-2xl min-h-screen flex flex-col bg-white">
        <div className="pt-8 px-6">
          {loading ? (
            <span className="animate-pulse text-gray-400">Loading...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : !profile ? (
            <span className="text-red-500">Profil tidak ditemukan</span>
          ) : (
            <span className="text-xl md:text-2xl font-regular text-blue-900 text-center block">
              Ahlan Wa Sahlan, {profile.panggilan} {profile.nama_singkat}!
            </span>
          )}
        </div>
        <div className="pt-4 px-6">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Daftar Email Karyawan</h2>
          {loadingEmails ? (
            <span className="animate-pulse text-gray-400">Memuat daftar email...</span>
          ) : errorEmails ? (
            <span className="text-red-500">{errorEmails}</span>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {emails.map((item, idx) => (
                <li key={item.email_address || idx} className="text-blue-700 text-sm">
                  {item.email_address}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

