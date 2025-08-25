import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const devices = await prisma.unassignedDevice.findMany();
  return NextResponse.json(devices);
}