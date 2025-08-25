import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { macAddress, roomId, type } = await req.json();

    if (!macAddress || !roomId || !type) {
      return NextResponse.json({ message: 'macAddress, roomId, and type are required' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.sensor.create({
        data: {
          macAddress,
          roomId,
          type,
        },
      });

      await tx.unassignedDevice.delete({
        where: { macAddress },
      });
    });

    return NextResponse.json({ message: 'Device assigned successfully' }, { status: 200 });

  } catch (error) {
    // FIXED: Tambahkan pengecekan tipe error sebelum mengakses properti .code
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
       return NextResponse.json({ message: 'This MAC address is already assigned.' }, { status: 409 });
    }
    console.error('Error assigning device:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
