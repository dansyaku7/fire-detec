"use client";

import React from "react";
// Hapus import yang tidak lagi digunakan
// import { Bell, ChevronDown } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    // Ubah justify-between menjadi justify-center
    <header className="flex items-center justify-center bg-white dark:bg-gray-800 p-4 shadow-md h-20 border-b">
      {/* Ganti judulnya */}
      <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
        Fire Detection Monitoring
      </h1>
      {/* Hapus semua elemen di sebelah kanan */}
    </header>
  );
};

export default Header;
