import { getPageMetadata } from "@/utils/metadata";

export const metadata = getPageMetadata("Dashboard");

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50">
      <div className="bg-white rounded-lg shadow-lg px-8 py-12 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Selamat Datang di Dashboard</h1>
        <p className="text-gray-700 text-lg">Anda berhasil login! Silakan lanjutkan aktivitas Anda.</p>
      </div>
    </div>
  );
}
