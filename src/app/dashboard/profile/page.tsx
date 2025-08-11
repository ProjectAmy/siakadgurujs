"use client";
import Image from "next/image";
import { useKaryawanProfile } from "@/app/components/useKaryawanProfile";

export default function ProfilePage() {
  const { profile, loading, error } = useKaryawanProfile();

  return (
    <div className="rounded-2xl min-h-screen flex flex-col bg-white">
      <div className="pt-8 px-6">
        <h1 className="text-3xl font-regular mb-12 text-blue-900">
          {profile ? `Profil ${profile.panggilan && profile.panggilan !== 'Tidak ada panggilan khusus' ? ` ${profile.panggilan}` : ''} ${profile.nama_singkat}` : 'Profil'}
        </h1>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : profile ? (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-2xl">
            {/* Foto Profil Kiri */}
            <div className="w-48 h-48 bg-white flex-shrink-0 flex items-center justify-center overflow-hidden shadow rounded-lg mb-4 md:mb-0 md:ml-0 self-start relative">
              <Image
                src={profile.jenis_kelamin === "P" ? "/images/putri.png" : "/images/putra.png"}
                alt={`Foto profil ${profile.nama_lengkap}`}
                width={192}
                height={192}
                className="object-contain"
                style={{ objectPosition: 'center' }}
                priority
              />
            </div>
            {/* Keterangan Kanan */}
            <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
              <div className="font-medium text-2xl text-blue-900 text-center md:text-left">
                {profile.nama_lengkap}{profile.title ? `, ${profile.title}` : ""}
              </div>
              <div className="font-medium text-blue-800 text-base text-center md:text-left">
                {profile.keterangan}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Unit</span>
                  <span className="font-medium text-blue-800">{profile.unit_sekolah || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className="font-medium text-blue-800">{profile.status_kepegawaian || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Jabatan</span>
                  <span className="font-medium text-blue-800">{profile.jabatan_karyawan || profile.jabatan || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Profil tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
