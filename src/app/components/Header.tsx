import React from "react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onBurgerClick?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onBurgerClick }: HeaderProps) {
  // Fungsi untuk mendapatkan tanggal lokal dalam format: hari, tanggal bulan tahun
  function getFormattedDate() {
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const now = new Date();
    const namaHari = hari[now.getDay()];
    const tanggal = now.getDate();
    const namaBulan = bulan[now.getMonth()];
    const tahun = now.getFullYear();
    return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
  }
  return (
    <header className="w-full px-4 py-2 pl-4 md:pl-8 flex items-center justify-between bg-transparent relative z-40">
  {/* Kiri: Burger menu, logo, judul kiri */}
  <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
    <button
      className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Open menu"
      onClick={onBurgerClick}
      type="button"
    >
      <span className="material-icons text-3xl text-blue-900">menu</span>
    </button>
    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <Image 
        src="/images/logo.png" 
        alt="Logo" 
        width={48} 
        height={48} 
        className="h-10 w-10 md:h-12 md:w-12 object-contain ml-2" 
      />
      <span className="font-regular text-blue-900 text-lg md:text-xl leading-tight truncate font-sans">
        Siakad Al Irsyad
      </span>
    </Link>
  </div>
  {/* Tengah: Judul Dashboard Karyawan, hanya desktop */}
  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    <span className="font-medium text-blue-900 text-xl md:text-2xl text-center leading-tight">Dashboard Karyawan</span>
  </div>
  {/* Kanan: Tanggal */}
  <span className="text-xs md:text-base text-blue-900 font-regular whitespace-nowrap flex-shrink-0">{getFormattedDate()}</span>
  <style jsx>{`
    header {
      box-sizing: border-box;
    }
    @media (max-width: 768px) {
      header {
        padding-left: 8px;
        padding-right: 8px;
        height: 56px;
      }
    }
  `}</style>
</header>
  );
}
