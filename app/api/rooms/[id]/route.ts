import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// --- FUNGSI UNTUK MENGEDIT RUANGAN (UPDATE) ---
// --- (Fungsi PUT tidak perlu diubah, biarkan seperti semula) ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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

// --- FUNGSI UNTUK MENGHAPUS RUANGAN (SUDAH DIPERBAIKI) ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id:string } }
) {
  const { id: roomId } = params;

  if (!roomId) {
    return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
  }

  try {
    // Kita gunakan transaction untuk memastikan semua proses berjalan atau tidak sama sekali
    await prisma.$transaction(async (tx) => {
      // 1. Cari semua sensor yang terhubung dengan room yang akan dihapus
      const sensorsInRoom = await tx.sensor.findMany({
        where: { roomId: roomId },
      });

      // 2. Jika ada sensor di dalam room tersebut...
      if (sensorsInRoom.length > 0) {
        // Ambil semua macAddress dari sensor-sensor itu
        const macAddresses = sensorsInRoom.map(sensor => ({
          macAddress: sensor.macAddress,
        }));

        // 3. Daftarkan kembali macAddress tersebut ke tabel UnassignedDevice
        // `skipDuplicates: true` akan mencegah error jika data sudah ada
        await tx.unassignedDevice.createMany({
          data: macAddresses,
          skipDuplicates: true,
        });
      }

      // 4. Setelah data sensor "diselamatkan", baru hapus room-nya.
      // `onDelete: Cascade` akan otomatis menghapus sensor dari tabel `Sensor`
      // tapi karena sudah kita daftarkan lagi di `UnassignedDevice`, datanya aman.
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