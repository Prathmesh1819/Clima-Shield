export type HazardType = 'none' | 'heat' | 'rain' | 'disaster';

export interface WeatherState {
  temperature: number; // 25 - 50 °C
  humidity: number;    // 20 - 95 %
  rain: number;        // 0 - 60 mm/hr
  heatIndex: number;   // Computed NOAA wet-bulb/heat index °C
  isHazardous: boolean;
  hazardType: HazardType;
  disasterTitle?: string;
}

export interface TelemetryData {
  gpsSpeed: number; // km/h
  gForce: number;   // Gs
  locationName: string;
  lat: number;
  lng: number;
  movementStatus: 'In Transit' | 'Waiting at Hub' | 'Offline';
  battery: number;
}

export interface RiderPolicy {
  policyId: string;
  planName: string;
  maxDailyProtection: number; // e.g. 300
  payoutAmount: number;       // e.g. 250 per trigger
  claimsTodayCount: number;
  shieldLevel: 'Pro Shield' | 'Max Shield';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ClaimRecord {
  id: string;
  timestamp: string;
  amount: number;
  upiTransactionId: string;
  triggerReason: string;
  temperature: number;
  humidity: number;
  rain: number;
  status: 'INSTANT_CREDITED' | 'RESERVE_LOCKED';
  geofenceZone: string;
}

export interface UnderwriterLedger {
  capitalPool: number;       // e.g. 5,00,000
  claimsPaidCount: number;
  totalPayoutsAmount: number;
  activeCoveredWorkers: number;
  solvencyRatio: number;     // e.g. 384%
  reserveStatus: 'HEALTHY' | 'STRESSED' | 'ALERT';
}

export interface GeofenceZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  riskLevel: 'SAFE' | 'WARNING' | 'HAZARD';
  activeWorkers: number;
}
