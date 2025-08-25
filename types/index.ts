// FIXED: Pastikan semua interface/type yang dibutuhkan di-export

export interface SensorData {
  id: string;
  value: number;
  timestamp: string; // atau bisa juga Date
  // properti lain jika ada...
}

export interface Sensor {
  id: string;
  macAddress: string;
  type: "SMOKE" | "HEAT" | "BREAKING_GLASS";
  status: string;
  roomId: string;
  data?: SensorData[]; // FIXED: Tambahkan properti 'data' yang opsional
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  sensors: Sensor[];
  overallStatus: string;
  information: string;
}
