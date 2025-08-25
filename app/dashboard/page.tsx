"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Bell, Thermometer, Loader2, Building2, PlusCircle, RefreshCw } from "lucide-react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import MonitoringTable from "./components/MonitoringTable";
import SmokeSensorChart from "./components/SmokeSensorChart";
import { useRooms } from "@/hooks/useRooms";
// --- Hapus import useTemperature ---
// import { useTemperature } from "@/hooks/useTemperature";
import AssignDeviceModal from "./components/AssignDeviceModal";

const DashboardPage = () => {
  const { rooms, isLoading: isRoomsLoading, error, mutate } = useRooms(); 
  // --- Hapus penggunaan hook useTemperature ---
  // const { temperature, isLoading: isTempLoading } = useTemperature();
  
  const [ringingBells, setRingingBells] = useState<number[]>([]);
  const [isSilencing, setIsSilencing] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBellStatus = async () => {
    try {
      const response = await fetch('/api/bell-status');
      if (!response.ok) return;
      const data = await response.json();
      setRingingBells(data.ringingBells || []);
    } catch (error) {
      console.error('Gagal mengambil status bell:', error);
    }
  };
  
  useEffect(() => {
    fetchBellStatus();
    const intervalId = setInterval(fetchBellStatus, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSilenceAlarm = async () => {
    setIsSilencing(true);
    try {
      await fetch('/api/silence-alarm', { method: 'POST' });
      mutate();
      setRingingBells([]); 
    } catch (error) {
      console.error('Error saat silence alarm:', error);
    } finally {
      setIsSilencing(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/reset-status', { method: 'POST' });
      mutate();
    } catch (error) {
      console.error('Error saat refresh status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const isAlarmActive = ringingBells.length > 0;
  const smokeDetectorCount = rooms.flatMap(r => r.sensors).filter(s => s.type === 'SMOKE').length;
  const heatDetectorCount = rooms.flatMap(r => r.sensors).filter(s => s.type === 'HEAT').length;
  const isSystemInAlert = rooms.some(room => room.overallStatus !== 'Normal');

  if (isRoomsLoading && rooms.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Header />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          <p className="ml-4 text-lg text-gray-600">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <Header />
        <div className="flex justify-center items-center h-64 bg-red-50 p-4 rounded-lg">
          <p className="text-lg text-red-600">Failed to load dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Header />

      {isAssignModalOpen && <AssignDeviceModal onClose={() => setAssignModalOpen(false)} />}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Rooms" value={rooms.length.toString()} icon={<Building2 className="h-6 w-6 text-gray-500" />} />
        <StatCard title="Smoke Detector" value={smokeDetectorCount.toString()} icon={<Flame className="h-6 w-6 text-gray-500" />} />
        <StatCard title="Heat Detector" value={heatDetectorCount.toString()} icon={<Thermometer className="h-6 w-6 text-gray-500" />} />
        <StatCard title="Bell" value="6" icon={<Bell className="h-6 w-6 text-gray-500" />} />
        
        <Card className={`col-span-1 flex flex-col items-center justify-center text-white rounded-lg shadow-lg transition-colors duration-500 ${isAlarmActive ? 'bg-red-500' : 'bg-green-500'}`}>
          <CardHeader className="flex flex-col items-center text-center p-4">
            {isAlarmActive ? <Flame className="h-12 w-12 mb-2 animate-pulse" /> : <Bell className="h-12 w-12 mb-2" />}
            <CardTitle className="text-xl font-bold">
              {isAlarmActive ? "Fire Detected!" : "System Normal"}
            </CardTitle>
            {isAlarmActive && (
              <p className="text-sm mt-1 font-semibold">
                Bell Aktif: {ringingBells.join(', ')}
              </p>
            )}
          </CardHeader>
          {isAlarmActive && (
            <CardContent className="p-4 pt-0">
              <Button
                variant="destructive"
                className="bg-white text-red-500 hover:bg-red-100"
                onClick={handleSilenceAlarm}
                disabled={isSilencing}
              >
                {isSilencing ? <Loader2 className="animate-spin" /> : "Silence Alarm"}
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="flex justify-end gap-2">
          <Button onClick={handleRefreshStatus} variant="outline" disabled={isRefreshing}>
              {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh Status
          </Button>
          <Button onClick={() => setAssignModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Assign New Sensor
          </Button>
      </div>

      <MonitoringTable 
        rooms={rooms} 
        isLoading={isRoomsLoading} 
        error={error} 
        onRefresh={mutate}
      />

      {/* --- Tata letak diubah agar grafik lebih lebar --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Grafik sekarang memakan 2 kolom di layar besar */}
        <div className="lg:col-span-2">
          <SmokeSensorChart />
        </div>

        {/* Kartu Temperatur dihapus */}

        <Card className="lg:col-span-1 rounded-lg shadow">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <CardTitle className="text-gray-500 font-medium">Status</CardTitle>
            <p className={`text-5xl font-bold mt-2 ${isSystemInAlert ? 'text-red-500' : 'text-green-500'}`}>
                {isSystemInAlert ? "ALERT" : "ON"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
