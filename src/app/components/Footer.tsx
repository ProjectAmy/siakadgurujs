import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white shadow text-center py-3 text-xs text-gray-500 mt-auto">
      &copy; {new Date().getFullYear()} <a href="/dashboard/about" className="text-blue-600 hover:underline">Project Amy</a>. All rights reserved.
    </footer>
  );
}
