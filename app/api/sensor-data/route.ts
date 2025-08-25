import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LogLevel } from "@prisma/client"; // Impor enum LogLevel

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { macAddress, value, sensorType } = body;

    if (!macAddress || value === undefined || !sensorType) {
      return NextResponse.json({ message: "macAddress, value, and sensorType are required" }, { status: 400 });
    }

    const sensor = await prisma.sensor.findUnique({
      where: { macAddress: macAddress },
      include: { room: true }, // Sertakan info ruangan
    });

    if (!sensor) {
      return NextResponse.json({ message: "Device not registered" }, { status: 404 });
    }

    const newSensorData = await prisma.sensorData.create({
      data: {
        value: parseFloat(value),
        sensorId: sensor.id,
      },
    });

    let newStatus = "Normal";
    let isAlarm = false;
    let alarmMessage = "";

    if (sensorType === "HEAT" && parseFloat(value) > 60) {
      newStatus = "High";
      isAlarm = true;
      alarmMessage = `High temperature detected (${parseFloat(value).toFixed(1)}°C)`;
    } else if (sensorType === "SMOKE" && parseFloat(value) > 300) {
      newStatus = "High";
      isAlarm = true;
      alarmMessage = `High smoke level detected (${Math.round(parseFloat(value))} PPM)`;
    } else if (sensorType === "BREAKING_GLASS" && parseFloat(value) === 1) {
      newStatus = "Triggered";
      isAlarm = true;
      alarmMessage = "Glass break detected";
    }

    // Jika status berubah DAN merupakan kondisi alarm
    if (sensor.status !== newStatus && isAlarm) {
      // 1. Update status sensor
      await prisma.sensor.update({
        where: { id: sensor.id },
        data: { status: newStatus },
      });

      // 2. Buat entri log baru
      await prisma.log.create({
        data: {
          level: LogLevel.WARNING, // atau CRITICAL sesuai kebutuhan
          message: `${alarmMessage} in ${sensor.room.name}`,
          information: `Sensor MAC: ${macAddress}`,
          roomId: sensor.roomId,
        },
      });
    }
    
    return NextResponse.json(newSensorData, { status: 200 });

  } catch (error) {
    console.error("Error receiving sensor data:", error);
    return NextResponse.json({ message: "Failed to process sensor data" }, { status: 500 });
  }
}
