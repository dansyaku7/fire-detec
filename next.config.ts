import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menambahkan konfigurasi untuk mengabaikan error saat build
  typescript: {
    // Mencegah build gagal jika ada error TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Mencegah build gagal jika ada error ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
