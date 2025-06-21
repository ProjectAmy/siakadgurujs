import React from "react";
import Link from "next/link";

export default function SidebarMenu() {
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col min-h-full p-4 rounded-r-3xl">
      {/* User Profile */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <span className="material-icons text-blue-600 text-4xl">person</span>
        </div>
        <div className="font-semibold text-gray-800">Adele Cassin</div>
        <div className="text-xs text-gray-400 mb-2">crew</div>
        <button className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition">Log out <span className="material-icons text-sm align-middle">logout</span></button>
      </div>
      {/* Main Menu */}
      <nav className="flex-1">
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-1">Guru</div>
          <ul className="space-y-1">
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">menu_book</span>Buku absen</Link></li>
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">assignment</span>Exam</Link></li>
          </ul>
        </div>
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-1">Wali kelas 10. A</div>
          <ul className="space-y-1">
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700 bg-blue-100"><span className="material-icons text-base">bar_chart</span>Statistik siswa</Link></li>
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">people</span>Data siswa</Link></li>
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">description</span>Laporan siswa</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Lainnya</div>
          <ul className="space-y-1">
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">local_library</span>Perpustakaan</Link></li>
            <li><Link href="#" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-gray-700"><span className="material-icons text-base">domain</span>Sarpras</Link></li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
