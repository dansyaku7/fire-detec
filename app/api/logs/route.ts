import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi GET untuk mengambil semua data log
export async function GET() {
  try {
    const logs = await prisma.log.findMany({
      // Sertakan nama ruangan di setiap log
      include: {
        room: {
          select: {
            name: true,
          },
        },
      },
      // Urutkan dari yang paling baru
      orderBy: {
        timestamp: "desc",
      },
    });
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
