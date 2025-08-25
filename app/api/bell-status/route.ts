import { NextResponse } from 'next/server';

// Gunakan variabel sederhana untuk menyimpan status bell yang berbunyi
// Untuk production, ini sebaiknya disimpan di database atau Redis
const ringingBells = new Set<number>();

/**
 * @description Menerima laporan status dari Panel Kontrol
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bell_id, is_ringing } = body;

    if (bell_id === undefined || is_ringing === undefined) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    if (is_ringing) {
      ringingBells.add(bell_id);
    } else {
      ringingBells.delete(bell_id);
    }
    
    console.log('Status Bell Terbaru:', Array.from(ringingBells));
    return NextResponse.json({ message: 'Status bell diupdate' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * @description Memberikan data bell yang berbunyi ke Dashboard
 */
export async function GET() {
  return NextResponse.json({ ringingBells: Array.from(ringingBells) }, { status: 200 });
}