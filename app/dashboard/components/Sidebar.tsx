"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // Impor fungsi signOut
import {
  LayoutDashboard,
  History,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-md hidden md:block">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-20 border-b">
          <ShieldAlert className="h-10 w-10 text-red-500" />
          <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">
            FireDetec
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" passHref>
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/history" passHref>
            <Button
              variant={pathname === "/dashboard/history" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <History className="mr-2 h-4 w-4" />
              Log & History
            </Button>
          </Link>
        </nav>
        <div className="px-4 py-6 border-t">
          {/* Tombol Settings dihapus */}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600"
            // Tambahkan onClick untuk logout
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
