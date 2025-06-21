import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Siakad",
  description: "Sistem Informasi Akademik dan Database",
};

import Header from "./components/Header";
import SidebarMenu from "./components/SidebarMenu";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col bg-[#bddaff]">
          <Header />
          <div className="flex flex-1">
            <SidebarMenu />
            <main className="flex-1 p-6">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
