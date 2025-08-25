import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Pastikan path ini benar

// --- FUNGSI GET DIPERBARUI DI SINI ---
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        sensors: {
          // Sertakan juga data dari setiap sensor
          include: {
            data: {
              // Urutkan data berdasarkan waktu, dari yang paling baru
              orderBy: {
                timestamp: "desc",
              },
              // Ambil hanya 1 data teratas (yang paling baru)
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { message: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}

// Fungsi POST untuk membuat ruangan baru (tidak ada perubahan)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, floor } = body;

    // Validasi input
    if (!name || !floor) {
      return NextResponse.json(
        { message: "Name and floor are required" },
        { status: 400 }
      );
    }

    // Buat entri ruangan baru di database
    const newRoom = await prisma.room.create({
      data: {
        name: name,
        floor: floor,
      },
    });

    return NextResponse.json(newRoom, { status: 201 }); // 201 = Created

  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { message: "Failed to create room" },
      { status: 500 }
    );
  }
}
