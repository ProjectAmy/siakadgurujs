import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SidebarMenu() {
  const router = useRouter();
  return (
    <aside className="m-10">
      {/* User Profile */}
      <div className="w-full bg-white rounded-2xl shadow p-8 flex flex-col items-center mb-6">
        <div className="mb-8 w-24 h-24 rounded-full bg-white flex items-center justify-center mb-2 overflow-hidden">
          <img src="/images/putra.png" alt="Profile" className="w-full h-full object-cover" />
        </div>
        <Link href="/dashboard/profile" className="font-semibold text-gray-800 hover:underline">Amy Sidra</Link>
        <div className="mb-8 text-xs text-gray-400">Staff IT</div>
        <Link href="/dashboard" className="flex w-full gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 justify-start items-start">
          <span className="material-icons text-base">home</span>Home
        </Link>
        <Link href="/dashboard/settings" className="flex w-full gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 justify-start items-start">
          <span className="material-icons text-base">settings</span>Pengaturan
        </Link>
        <button
          className="m-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700 transition"
          onClick={() => {
            // TODO: Tambahkan logic clear session/logout di sini jika ada
            router.push("/");
          }}
        >
          Log out <span className="material-icons text-sm align-middle">power_settings_new</span>
        </button>
      </div>
      {/* Main Menu */}
      <div className="w-full bg-white rounded-2xl shadow p-8 flex flex-col">
        <nav className="flex-1">
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-1">Guru</div>
            <ul className="space-y-1">
              <li><Link href="/dashboard/timetable" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">menu_book</span>Jadwal Pelajaran</Link></li>
              <li><Link href="/dashboard/assessment" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">assignment</span>Ujian</Link></li>
              <li><Link href="/dashboard/grades-input" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">edit</span>Input Nilai</Link></li>
            </ul>
          </div>
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-1">Wali kelas 6.B</div>
            <ul className="space-y-1">
              <li><Link href="/dashboard/stats" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">bar_chart</span>Statistik</Link></li>
              <li><Link href="/dashboard/data" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">people</span>Data Siswa</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Lainnya</div>
            <ul className="space-y-1">
              <li><Link href="/dashboard/complain" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">report</span>Laporan</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
