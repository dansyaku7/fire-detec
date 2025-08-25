import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// FIXED: Impor tipe 'Prisma' dari prisma client
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { macAddress, roomId, type } = await req.json();

    if (!macAddress || !roomId || !type) {
      return NextResponse.json({ message: 'macAddress, roomId, and type are required' }, { status: 400 });
    }

    // Gunakan transaksi: jika salah satu gagal, semua akan dibatalkan.
    // FIXED: Tambahkan tipe 'Prisma.TransactionClient' ke parameter 'tx'
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Buat sensor baru di tabel Sensor utama
      await tx.sensor.create({
        data: {
          macAddress,
          roomId,
          type,
        },
      });

      // 2. Hapus dari tabel UnassignedDevice
      await tx.unassignedDevice.delete({
        where: { macAddress },
      });
    });

    return NextResponse.json({ message: 'Device assigned successfully' }, { status: 200 });

  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
       return NextResponse.json({ message: 'This MAC address is already assigned.' }, { status: 409 });
    }
    console.error('Error assigning device:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
