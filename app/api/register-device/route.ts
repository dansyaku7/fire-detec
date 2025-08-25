import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { macAddress } = await req.json();

    if (!macAddress) {
      return NextResponse.json({ message: 'MAC address is required' }, { status: 400 });
    }

    // Gunakan upsert: buat baru jika belum ada, atau tidak lakukan apa-apa jika sudah ada.
    // Ini mencegah duplikasi jika gateway mengirim permintaan beberapa kali.
    await prisma.unassignedDevice.upsert({
      where: { macAddress },
      update: {}, 
      create: { macAddress },
    });

    return NextResponse.json({ message: 'Device acknowledged and awaiting assignment' }, { status: 201 });

  } catch (error) {
    console.error('Error registering new device:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}