export interface Sensor {
  id: string;
  type: "SMOKE" | "HEAT" | "BREAKING_GLASS";
  status: string;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  sensors: Sensor[];
  overallStatus: string;
  information: string;
}
