import { NextResponse } from 'next/server';

// NOTE: Karena Next.js API Route bersifat stateless, kita tidak bisa menjaga koneksi MQTT tetap hidup.
// Cara paling umum adalah dengan menggunakan service lain atau database sebagai perantara.
// Untuk kesederhanaan, kita akan simulasikan dengan menyimpan perintah di database.
// Panel ESP32 nantinya akan mengambil perintah ini.
// ALTERNATIF LEBIH BAIK: Gunakan service seperti Vercel KV (Redis) atau database biasa.

import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // Simpan perintah 'SILENCE' ke dalam tabel command atau tabel setting.
    // Ini adalah contoh sederhana menggunakan tabel Setting
    await prisma.setting.upsert({
      where: { key: 'alarm_command' },
      update: { value: 'SILENCE' },
      create: { key: 'alarm_command', value: 'SILENCE' },
    });

    // Kita juga bisa menambahkan timestamp untuk menandai kapan perintah terakhir dikirim
    await prisma.setting.upsert({
        where: { key: 'alarm_command_timestamp' },
        update: { value: new Date().toISOString() },
        create: { key: 'alarm_command_timestamp', value: new Date().toISOString() },
    });

    return NextResponse.json({ message: 'Perintah Silence Terkirim' }, { status: 200 });
  } catch (error) {
    console.error("Error sending silence command:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Buat juga endpoint GET untuk ESP32 mengambil perintah
export async function GET() {
    try {
        const command = await prisma.setting.findUnique({
            where: { key: 'alarm_command' },
        });

        if (command && command.value === 'SILENCE') {
            // Setelah perintah diambil oleh ESP32, hapus atau reset perintahnya
            await prisma.setting.update({
                where: { key: 'alarm_command' },
                data: { value: 'NONE' },
            });
            return NextResponse.json({ command: 'SILENCE' }, { status: 200 });
        }

        return NextResponse.json({ command: 'NONE' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}