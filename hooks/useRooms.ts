import useSWR from 'swr';

// --- DEFINISIKAN TIPE DATA DI SINI ---
// Kita tetap definisikan di sini agar kode ini mandiri.
export interface Sensor {
  id: string;
  macAddress: string;
  type: 'SMOKE' | 'HEAT' | 'BREAKING_GLASS';
  status: string;
  roomId: string;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  sensors: Sensor[];
  // Properti ini akan kita hitung secara dinamis
  overallStatus: string;
  information: string;
}
// -----------------------------------------

// Fungsi fetcher standar untuk SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRooms() {
  const { data, error, isLoading, mutate } = useSWR<Room[]>('/api/rooms', fetcher, {
    // Secara otomatis mengambil ulang data setiap 3 detik
    refreshInterval: 3000 
  });

  // --- LOGIKA PEMROSESAN DATA (DIPERBAIKI) ---
  // Logika ini sekarang menangani semua tipe sensor dan kembali ke normal.
  const processedRooms = data?.map((room): Room => {
    let overallStatus = "Normal";
    const activeAlerts: string[] = []; // Array untuk menampung semua info alarm

    const smokeSensor = room.sensors.find((s) => s.type === "SMOKE");
    const heatSensor = room.sensors.find((s) => s.type === "HEAT");
    const glassSensor = room.sensors.find((s) => s.type === "BREAKING_GLASS");

    // Cek setiap sensor untuk kondisi alarm
    if (smokeSensor?.status === "High") {
      activeAlerts.push("Smoke Detected");
    }
    if (heatSensor?.status === "High") {
      activeAlerts.push("Heat Detected");
    }
    if (glassSensor?.status === "Triggered") {
      activeAlerts.push("Glass Break");
    }

    // Jika ada setidaknya satu alarm aktif
    if (activeAlerts.length > 0) {
      overallStatus = "Wildfire"; // Atau "Alert", sesuai keinginanmu
      // Gabungkan semua pesan alarm menjadi satu string
      // Contoh: "Smoke Detected, Glass Break"
      return { ...room, overallStatus, information: activeAlerts.join(', ') };
    }
    
    // Jika tidak ada alarm sama sekali, kembalikan status Normal
    return { ...room, overallStatus: "Normal", information: "-" };
  });

  return {
    rooms: processedRooms || [], // Kembalikan data yang sudah diproses
    isLoading,
    error: error ? error.message : null,
    // 'mutate' adalah versi SWR dari 'fetchRooms' untuk refresh manual
    mutate 
  };
}
