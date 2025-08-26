import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./components/DashboardClientLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Jika tidak ada sesi (belum login), tendang kembali ke halaman login
  if (!session) {
    redirect("/");
  }

  return (
    // Kita bungkus semuanya dengan komponen client baru
    // yang akan menangani state dan interaksi.
    <DashboardClientLayout>{children}</DashboardClientLayout>
  );
}
