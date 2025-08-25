// File: app/dashboard/components/SmokeSensorChart.tsx
// Komponen untuk menampilkan chart sensor asap.
// Pastikan kamu sudah install recharts: pnpm add recharts

"use client"; // Tambahkan ini karena recharts adalah client component

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "08:00", smoke: 4 },
  { name: "09:00", smoke: 10 },
  { name: "10:00", smoke: 20 },
  { name: "11:00", smoke: 27 },
  { name: "12:00", smoke: 18 },
  { name: "13:00", smoke: 23 },
];

const SmokeSensorChart = () => {
  return (
    <Card className="lg:col-span-1 rounded-lg shadow">
      <CardHeader>
        <CardTitle>Smoke Sensor Overall</CardTitle>
        <CardDescription>30 ppm</CardDescription>
        <p className="text-xs text-gray-500">Smoke level</p>
      </CardHeader>
      <CardContent>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="smoke"
                stroke="#ef4444"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmokeSensorChart;
