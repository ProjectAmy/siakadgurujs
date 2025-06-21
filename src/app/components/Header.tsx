import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-white shadow flex items-center px-6 h-16 justify-between">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-blue-700 tracking-wide">SMARTSCHOOL</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <span className="material-icons text-gray-500 text-2xl">notifications_none</span>
        </button>
        <button className="relative">
          <span className="material-icons text-gray-500 text-2xl">account_circle</span>
        </button>
      </div>
    </header>
  );
}
