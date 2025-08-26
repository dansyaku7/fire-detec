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
      {/* Sidebar sekarang menerima state untuk mengontrol visibilitasnya */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header ini hanya akan muncul di layar kecil (mobile) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
          {/* Tombol "Hamburger" untuk membuka sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Judul di header mobile */}
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">
              FireDetec
            </h1>
          </div>

          {/* Spacer untuk menyeimbangkan judul di tengah */}
          <div className="w-8"></div>
        </header>

        {/* Di sinilah konten halamanmu (dari page.tsx) akan ditampilkan */}
        {children}
      </div>
    </div>
  );
}
