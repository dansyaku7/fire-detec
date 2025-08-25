import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Gunakan updateMany untuk mengubah semua entri di tabel Sensor
    await prisma.sensor.updateMany({
      where: {}, // Kondisi kosong berarti "semua sensor"
      data: {
        status: "Normal", // Set status kembali ke Normal
      },
    });

    return NextResponse.json(
      { message: "All sensor statuses have been reset to Normal." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting sensor statuses:", error);
    return NextResponse.json(
      { message: "Failed to reset sensor statuses" },
      { status: 500 }
    );
  }
}
