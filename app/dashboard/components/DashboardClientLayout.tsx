"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, ShieldAlert } from "lucide-react";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Wrapper utama untuk konten, tidak lagi menyembunyikan overflow */}
      <div className="flex-1 flex flex-col">
        {/* Header ini hanya akan muncul di layar kecil (mobile) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">
              FireDetec
            </h1>
          </div>
          
          {/* Spacer untuk menyeimbangkan judul di tengah */}
          <div className="w-8"></div>
        </header>

        {/* PERUBAHAN UTAMA DI SINI:
          Kita bungkus {children} dengan tag <main> yang memiliki:
          - flex-1: Agar mengisi sisa ruang vertikal.
          - overflow-y-auto: Agar scrollbar vertikal muncul OTOMATIS saat kontennya panjang.
          - p-6: Memberi padding (jarak) di sekeliling konten halamanmu.
        */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
