export interface DroneData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      serial: string;
      registration: string;
      Name: string;
      altitude: number;
      pilot: string;
      organization: string;
      yaw: number;
    };
    geometry: {
      coordinates: [number, number];
      type: string;
    };
  }>;
  flightStartTime: number;
}