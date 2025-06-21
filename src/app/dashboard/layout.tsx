"use client";

import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";

import React, { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Handler untuk toggle menu
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#bddaff]">
      {/* Sembunyikan header di mobile ketika menu terbuka */}
      {!(menuOpen) || typeof window === 'undefined' ? (
        <Header onBurgerClick={handleMenuToggle} isMenuOpen={menuOpen} />
      ) : (
        <div className="hidden md:block">
          <Header onBurgerClick={handleMenuToggle} isMenuOpen={menuOpen} />
        </div>
      )}
      <div className="flex flex-1 relative">
        {/* SidebarMenu: tampil sebagai sidebar di desktop, drawer di mobile, dan bisa scroll */}
        <SidebarMenu isOpen={menuOpen} onClose={handleMenuClose} />
        {/* Overlay biru untuk mobile menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-blue-400 bg-opacity-40 z-30 md:hidden"
            onClick={handleMenuClose}
          />
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
      {/* Tambahkan styling responsif global jika perlu */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .sidebar-mobile {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 80vw;
            max-width: 320px;
            background: white;
            z-index: 40;
            box-shadow: 2px 0 8px rgba(0,0,0,0.1);
            transform: translateX(-100%);
            transition: transform 0.3s;
          }
          .sidebar-mobile.open {
            transform: translateX(0);
          }
          .sidebar-desktop {
            display: none;
          }
        }
        @media (min-width: 769px) {
          .sidebar-mobile {
            display: none;
          }
          .sidebar-desktop {
            display: block;
            min-width: 260px;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
}
