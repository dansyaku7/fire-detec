import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// --- FUNGSI UNTUK MENGEDIT RUANGAN (UPDATE) ---
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } } // Tetap gunakan tipe standar
) {
  try {
    // NOTE: Jika error 'Promise' masih muncul, coba hapus folder .next dan node_modules,
    // lalu jalankan 'pnpm install' lagi. Terkadang cache bisa menyebabkan error aneh.
    const { id } = context.params; 
    const { name, floor } = await request.json();

    if (!name || !floor) {
      return NextResponse.json(
        { message: "Name and floor are required" },
        { status: 400 }
      );
    }

    const updatedRoom = await prisma.room.update({
      where: { id: id },
      data: { name: name, floor: floor },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { message: "Failed to update room" },
      { status: 500 }
    );
  }
}

// --- FUNGSI UNTUK MENGHAPUS RUANGAN ---
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } } // Tetap gunakan tipe standar
) {
  try {
    const { id: roomId } = context.params;

    if (!roomId) {
      return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const sensorsInRoom = await tx.sensor.findMany({
        where: { roomId: roomId },
      });

      if (sensorsInRoom.length > 0) {
        const macAddresses = sensorsInRoom.map(sensor => ({
          macAddress: sensor.macAddress,
        }));

        await tx.unassignedDevice.createMany({
          data: macAddresses,
          skipDuplicates: true,
        });
      }

      await tx.room.delete({
        where: { id: roomId },
      });
    });

    return NextResponse.json(
      { message: "Room deleted and devices are now unassigned" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { message: "Failed to delete room" },
      { status: 500 }
    );
  }
}
