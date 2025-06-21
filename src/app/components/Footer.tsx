import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-white shadow text-center py-3 text-xs text-gray-500 mt-auto">
      &copy; {new Date().getFullYear()} SMARTSCHOOL. All rights reserved.
    </footer>
  );
}
