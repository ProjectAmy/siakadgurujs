import React from "react";

export default function Header() {
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
    <header className="w-full flex items-center px-6 h-16 justify-between" style={{background: 'transparent'}} >
      <div className="flex items-center gap-2">
        <img src="/images/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
        <span className="font-bold text-lg text-blue-700 tracking-wide">Dashboard Guru dan Karyawan</span>
      </div>
      <div className="ml-auto text-right">
        <span className="text-base text-blue-900 font-medium">{getFormattedDate()}</span>
      </div>
    </header>
  );
}
