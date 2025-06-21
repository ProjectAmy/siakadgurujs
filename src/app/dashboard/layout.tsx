"use client";

import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#bddaff]">
      <Header />
      <div className="flex flex-1">
        <SidebarMenu />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
