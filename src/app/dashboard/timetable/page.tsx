export const metadata = {
  title: "Siakad | Jadwal Pelajaran",
};

export default function TimetablePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-lg px-8 py-12 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Jadwal Pelajaran</h1>
        <p className="text-gray-700 text-lg">Halaman jadwal pelajaran untuk guru dan karyawan.</p>
      </div>
    </div>
  );
}
