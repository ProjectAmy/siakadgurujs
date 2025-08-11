"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import Image from "next/image";

interface KaryawanProfile {
  id: string;
  nama_lengkap: string;
  nama_singkat?: string;
  panggilan?: string;
  title?: string;
  jenis_kelamin?: string;
  keterangan?: string;
  unit_sekolah?: string;
  status_kepegawaian?: string;
  jabatan_karyawan?: string;
  jabatan?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  alamat_lengkap?: string;
  nomor_ktp?: string;
  nomor_kk?: string;
  status_pernikahan?: string;
  email_address?: string;
  nomor_whatsapp?: string;
  pendidikan_terakhir?: string;
  almamater?: string;
  bergabung?: string;
  posisi?: string;
  keluar?: string;
  sebab?: string;
}

interface Props {
  params: { id: string }
}

export default function Page({ params }: Props) {
  const [profile, setProfile] = useState<KaryawanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from("karyawan")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  return (
    <div className="rounded-2xl min-h-screen flex flex-col bg-white">
      <div className="pt-8 px-6">
        <h1 className="text-3xl font-regular mb-12 text-blue-900">
          {profile ? `Profil ${profile.panggilan && profile.panggilan !== 'Tidak ada panggilan khusus' ? ` ${profile.panggilan}` : ''} ${profile.nama_singkat || profile.nama_lengkap}` : 'Profil'}
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
              {profile.keterangan && (
                <div className="font-medium text-blue-800 text-base text-center md:text-left">
                  {profile.keterangan}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Tempat, Tanggal Lahir</span>
                    <span className="font-medium text-blue-800">
                      {[profile.tempat_lahir, profile.tanggal_lahir ? new Date(profile.tanggal_lahir).toLocaleDateString('id-ID') : '']
                        .filter(Boolean).join(', ') || '-'}
                    </span>
                  </div>
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-xs text-gray-500">Alamat Lengkap</span>
                    <span className="font-medium text-blue-800">{profile.alamat_lengkap || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">No. KTP</span>
                    <span className="font-medium text-blue-800">{profile.nomor_ktp || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">No. KK</span>
                    <span className="font-medium text-blue-800">{profile.nomor_kk || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Status Pernikahan</span>
                    <span className="font-medium text-blue-800">{profile.status_pernikahan || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Email</span>
                    <span className="font-medium text-blue-800">{profile.email_address || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">No. WhatsApp</span>
                    {profile.nomor_whatsapp ? (
                      <a 
                        href={`https://wa.me/62${profile.nomor_whatsapp.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-800 hover:underline"
                      >
                        0{profile.nomor_whatsapp}
                      </a>
                    ) : (
                      <span className="font-medium text-blue-800">-</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Pendidikan Terakhir</span>
                    <span className="font-medium text-blue-800">{profile.pendidikan_terakhir || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Almamater</span>
                    <span className="font-medium text-blue-800">{profile.almamater || '-'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Bergabung</span>
                    <span className="font-medium text-blue-800">{profile.bergabung ? new Date(profile.bergabung).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Posisi</span>
                    <span className="font-medium text-blue-800">{profile.posisi || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Keterangan</span>
                    <span className="font-medium text-blue-800">{profile.keterangan || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Unit Sekolah</span>
                    <span className="font-medium text-blue-800">{profile.unit_sekolah || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Status Kepegawaian</span>
                    <span className="font-medium text-blue-800">{profile.status_kepegawaian || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Jabatan</span>
                    <span className="font-medium text-blue-800">{profile.jabatan_karyawan || profile.jabatan || '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Keluar</span>
                    <span className="font-medium text-blue-800">{profile.keluar ? new Date(profile.keluar).toLocaleDateString('id-ID') : '-'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Sebab</span>
                    <span className="font-medium text-blue-800">{profile.sebab || '-'}</span>
                  </div>
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