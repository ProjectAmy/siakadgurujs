"use client";
import { useKaryawanProfile } from "@/app/components/useKaryawanProfile";

export default function ProfilePage() {
  const { profile, loading, error } = useKaryawanProfile();

  return (
    <div className="rounded-2xl min-h-screen flex flex-col bg-white">
      <div className="pt-8 px-6">
        <h1 className="text-3xl font-regular mb-12 text-blue-900">
          {profile ? `Profil ${
            (profile.editable?.[0]?.panggilan || (profile.panggilan && profile.panggilan !== 'Tidak ada panggilan khusus' ? profile.panggilan : ''))
          } ${profile.editable?.[0]?.nama_singkat || profile.nama_lengkap}` : 'Profil'}
        </h1>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : profile ? (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full max-w-4xl">
            {/* Foto Profil Kiri */}
            <div className="w-48 h-48 bg-white flex-shrink-0 flex items-center justify-center overflow-hidden shadow rounded-lg mb-4 md:mb-0 md:ml-0 self-start">
              <img
                src={profile.jenis_kelamin === "P" ? "/images/putri.png" : "/images/putra.png"}
                alt="Profile"
                width={192}
                height={192}
                className="w-full h-full object-contain"
                style={{objectPosition: 'center'}}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                {/* Data Pribadi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:col-span-2 border-t border-gray-200 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Tempat, Tanggal Lahir</span>
                    <span className="font-medium text-blue-800">
                      {[profile.tempat_lahir, profile.tanggal_lahir ? new Date(profile.tanggal_lahir).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : ''].filter(Boolean).join(', ') || '-'}
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

                {/* Data Kepegawaian */}
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
