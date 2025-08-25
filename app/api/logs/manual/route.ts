import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LogLevel } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { event } = await request.json(); // event bisa "ACTIVATED" atau "DEACTIVATED"

    // Kita butuh setidaknya satu ruangan untuk mengaitkan log.
    // Kita ambil saja ruangan pertama yang ada di database.
    const firstRoom = await prisma.room.findFirst();

    if (!firstRoom) {
      return NextResponse.json(
        { message: "No rooms exist to associate the log with." },
        { status: 404 }
      );
    }

    const message =
      event === "ACTIVATED"
        ? "System alarm manually ACTIVATED from Control Panel"
        : "System alarm manually DEACTIVATED from Control Panel";

    await prisma.log.create({
      data: {
        level: LogLevel.MANUAL,
        message: message,
        roomId: firstRoom.id, // Kaitkan dengan ruangan pertama
      },
    });

    return NextResponse.json({ message: "Manual log created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating manual log:", error);
    return NextResponse.json(
      { message: "Failed to create manual log" },
      { status: 500 }
    );
  }
}
