"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  History,
  LogOut,
  ShieldAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Pastikan path ini benar

// Definisikan tipe props yang diterima komponen
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay gelap di belakang sidebar saat terbuka di mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar Utama */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40",
          "transition-transform duration-300 ease-in-out",
          "md:relative md:translate-x-0 md:flex-shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-20 border-b px-4">
            <div className="flex items-center">
              <ShieldAlert className="h-10 w-10 text-red-500" />
              <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">
                FireDetec
              </h1>
            </div>
            {/* Tombol close (X) di dalam sidebar untuk mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" passHref>
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setIsOpen(false)} // Tutup saat link diklik
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/history" passHref>
              <Button
                variant={
                  pathname === "/dashboard/history" ? "secondary" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => setIsOpen(false)} // Tutup saat link diklik
              >
                <History className="mr-2 h-4 w-4" />
                Log & History
              </Button>
            </Link>
          </nav>

          <div className="px-4 py-6 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
