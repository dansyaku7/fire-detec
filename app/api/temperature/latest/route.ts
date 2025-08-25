import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const latestHeatData = await prisma.sensorData.findFirst({
      where: {
        sensor: {
          type: "HEAT",
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (!latestHeatData) {
      return NextResponse.json({ value: 0 });
    }

    return NextResponse.json(latestHeatData);
  } catch (error) {
    console.error("Error fetching latest temperature:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
