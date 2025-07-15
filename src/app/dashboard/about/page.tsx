import { getPageMetadata } from "@/utils/metadata";

export const metadata = getPageMetadata("Tentang");

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <div className="bg-white rounded-lg shadow-lg px-8 py-12 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">About Project Amy</h1>
        <p className="text-gray-700 text-lg mb-2">This dashboard was created for Wali Murid and Guru as part of Project Amy.</p>
        <p className="text-gray-600 text-sm">Version 1.0 &mdash; &copy; {new Date().getFullYear()} Project Amy.</p>
      </div>
    </div>
  );
}
