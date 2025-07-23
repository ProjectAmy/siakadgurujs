"use client";
import DashboardFragmentCleanup from "./DashboardFragmentCleanup";

import { useKaryawanProfile } from "../components/useKaryawanProfile";
import { useAllKaryawanTableData, KaryawanTableRow } from "../components/useAllKaryawanEmails";

export default function Dashboard() {
  const { profile, loading, error, role } = useKaryawanProfile();
  const { karyawan, loading: loadingKaryawan, error: errorKaryawan } = useAllKaryawanTableData();
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
        {role === "admin" && (
          <div className="pt-4 px-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2 text-blue-800 w-full max-w-3xl text-left">Tabel Data Karyawan</h2>
            {loadingKaryawan ? (
              <span className="animate-pulse text-gray-400">Memuat data karyawan...</span>
            ) : errorKaryawan ? (
              <span className="text-red-500">{errorKaryawan}</span>
            ) : (
              <>
                {/* Tabel untuk layar sm ke atas */}
                <div className="overflow-x-auto w-full max-w-3xl hidden sm:block">
                <table className="w-full border border-blue-200 rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="py-2 px-3 border-b text-center text-blue-900 font-bold">No</th>
                      <th className="py-2 px-3 border-b text-left text-blue-900 font-bold">Nama Lengkap</th>
                      <th className="py-2 px-6 border-b text-center text-blue-900 font-bold">Status</th>
                      <th className="py-2 px-3 border-b text-left text-blue-900 font-bold">Nomor Whatsapp</th>
                      <th className="py-2 px-3 border-b text-left text-blue-900 font-bold">Unit Sekolah</th>
                      <th className="py-2 px-3 border-b text-center text-blue-900 font-bold">Umur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karyawan
                      .slice()
                      .sort((a, b) => {
                        const order = ["Non-unit", "TK", "SD", "SMP"];
                        const idxA = order.indexOf((a.unit_sekolah || "Non-unit").trim()) === -1 ? 0 : order.indexOf((a.unit_sekolah || "Non-unit").trim());
                        const idxB = order.indexOf((b.unit_sekolah || "Non-unit").trim()) === -1 ? 0 : order.indexOf((b.unit_sekolah || "Non-unit").trim());
                        return idxA - idxB;
                      })
                      .map((item: KaryawanTableRow, idx: number) => {
                        let umur = "-";
                        if (item.tanggal_lahir) {
                          const birth = new Date(item.tanggal_lahir);
                          const now = new Date();
                          let age = now.getFullYear() - birth.getFullYear();
                          const m = now.getMonth() - birth.getMonth();
                          if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                            age--;
                          }
                          umur = age.toString();
                        }
                        return (
                          <tr key={item.nomor_whatsapp + idx} className="even:bg-blue-50">
                            <td className="py-2 px-3 border-b text-blue-900 font-medium text-center">{idx + 1}</td>
                            <td className="py-2 px-3 border-b text-blue-900 font-medium">{item.nama_lengkap}</td>
                            <td className="py-2 px-6 border-b text-blue-900 font-medium text-center whitespace-nowrap">{item.status_kepegawaian || '-'}</td>
                            <td className="py-2 px-3 border-b text-blue-900">
                              {item.nomor_whatsapp ? (
                                <a
                                  href={`https://wa.me/+62${item.nomor_whatsapp}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-700 font-semibold underline hover:text-green-900"
                                >
                                  {`0${item.nomor_whatsapp}`}
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="py-2 px-3 border-b text-blue-900 font-medium">{item.unit_sekolah}</td>
                            <td className="py-2 px-3 border-b text-blue-900 font-medium text-center">{umur}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              {/* Tabel untuk layar mobile */}
              <div className="block sm:hidden w-full max-w-3xl">
                {karyawan
                  .slice()
                  .sort((a, b) => {
                    const order = ["Non-unit", "TK", "SD", "SMP"];
                    const idxA = order.indexOf((a.unit_sekolah || "Non-unit").trim()) === -1 ? 0 : order.indexOf((a.unit_sekolah || "Non-unit").trim());
                    const idxB = order.indexOf((b.unit_sekolah || "Non-unit").trim()) === -1 ? 0 : order.indexOf((b.unit_sekolah || "Non-unit").trim());
                    return idxA - idxB;
                  })
                  .map((item: KaryawanTableRow, idx: number) => {
                    let umur = "-";
                    if (item.tanggal_lahir) {
                      const birth = new Date(item.tanggal_lahir);
                      const now = new Date();
                      let age = now.getFullYear() - birth.getFullYear();
                      const m = now.getMonth() - birth.getMonth();
                      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                        age--;
                      }
                      umur = age.toString();
                    }
                    return (
                      <div key={item.nomor_whatsapp + idx} className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm p-4 flex flex-col gap-2">
                        {/* <div className="flex justify-between">
                          <span className="font-bold text-blue-900">No</span>
                          <span className="text-blue-900 font-medium">{idx + 1}</span>
                        </div> */}
                        <div className="flex justify-between">
                          <span className="font-bold text-blue-900">Nama</span>
                          <span className="text-blue-900 font-medium text-right">{item.nama_lengkap}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-blue-900">Whatsapp</span>
                          {item.nomor_whatsapp ? (
                            <a
                              href={`https://wa.me/+62${item.nomor_whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 font-semibold underline hover:text-green-900 text-right"
                            >
                              {`0${item.nomor_whatsapp}`}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-blue-900">Unit</span>
                          <span className="text-blue-900 font-medium text-right">{item.unit_sekolah}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-blue-900">Umur</span>
                          <span className="text-blue-900 font-medium text-right">{umur}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
