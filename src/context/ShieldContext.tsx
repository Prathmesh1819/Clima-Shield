import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { WeatherState, TelemetryData, RiderPolicy, ClaimRecord, UnderwriterLedger, GeofenceZone, HazardType } from '../types';

interface ShieldContextType {
  // Weather Oracle
  weather: WeatherState;
  setTemperature: (temp: number) => void;
  setHumidity: (humidity: number) => void;
  setRain: (rain: number) => void;
  triggerDisaster: (title?: string) => void;
  resetWeather: () => void;

  // Rider
  isOnShift: boolean;
  setIsOnShift: (on: boolean) => void;
  telemetry: TelemetryData;
  policy: RiderPolicy;

  // Underwriter & Ledger
  ledger: UnderwriterLedger;
  claimsHistory: ClaimRecord[];

  // Modal State
  activeClaimModal: ClaimRecord | null;
  dismissClaimModal: () => void;
  
  // Geofences
  geofenceZones: GeofenceZone[];
}

const initialPolicy: RiderPolicy = {
  policyId: "CS-POL-88492",
  planName: "Parametric Gig Shield Gold",
  maxDailyProtection: 300,
  payoutAmount: 250,
  claimsTodayCount: 0,
  shieldLevel: "Max Shield",
  status: "ACTIVE"
};

const initialLedger: UnderwriterLedger = {
  capitalPool: 500000,
  claimsPaidCount: 0,
  totalPayoutsAmount: 0,
  activeCoveredWorkers: 1420,
  solvencyRatio: 412,
  reserveStatus: "HEALTHY"
};

const initialGeofenceZones: GeofenceZone[] = [
  { id: "Z-1", name: "Indiranagar Hub", lat: 12.9784, lng: 77.6408, radius: 1200, riskLevel: "SAFE", activeWorkers: 320 },
  { id: "Z-2", name: "Koramangala Commercial", lat: 12.9352, lng: 77.6245, radius: 1500, riskLevel: "SAFE", activeWorkers: 450 },
  { id: "Z-3", name: "MG Road Transit Zone", lat: 12.9716, lng: 77.5946, radius: 1000, riskLevel: "SAFE", activeWorkers: 280 },
  { id: "Z-4", name: "Whitefield Tech Park", lat: 12.9698, lng: 77.7500, radius: 1800, riskLevel: "SAFE", activeWorkers: 370 },
];

// Helper to calculate NOAA Heat Index in Celsius
function calculateHeatIndex(tempC: number, humidity: number): number {
  const tempF = tempC * 1.8 + 32;
  
  let hiF = 0.5 * (tempF + 61.0 + ((tempF - 68.0) * 1.2) + (humidity * 0.094));
  
  if (hiF >= 80) {
    hiF = -42.379 +
      2.04901523 * tempF +
      10.14333127 * humidity -
      0.22475541 * tempF * humidity -
      0.00683783 * tempF * tempF -
      0.05481717 * humidity * humidity +
      0.00122874 * tempF * tempF * humidity +
      0.00085282 * tempF * humidity * humidity -
      0.00000199 * tempF * tempF * humidity * humidity;
  }

  const hiC = (hiF - 32) / 1.8;
  return Math.round(hiC * 10) / 10;
}

const ShieldContext = createContext<ShieldContextType | undefined>(undefined);

export const ShieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Weather state
  const [temp, setTemp] = useState<number>(34);
  const [humidity, setHum] = useState<number>(55);
  const [rain, setRainVal] = useState<number>(4);
  const [isDisaster, setIsDisaster] = useState<boolean>(false);
  const [disasterName, setDisasterName] = useState<string>('');

  // Rider state
  const [isOnShift, setIsOnShift] = useState<boolean>(true);
  const [policy, setPolicy] = useState<RiderPolicy>(initialPolicy);
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    gpsSpeed: 24.5,
    gForce: 1.02,
    locationName: "Indiranagar 100ft Rd, Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    movementStatus: "In Transit",
    battery: 88
  });

  // Ledger & Claims
  const [ledger, setLedger] = useState<UnderwriterLedger>(initialLedger);
  const [claimsHistory, setClaimsHistory] = useState<ClaimRecord[]>([]);
  const [activeClaimModal, setActiveClaimModal] = useState<ClaimRecord | null>(null);
  const [hasTriggeredForCurrentHazard, setHasTriggeredForCurrentHazard] = useState<boolean>(false);

  // Compute Heat Index and Hazard state
  const heatIndex = calculateHeatIndex(temp, humidity);

  let hazardType: HazardType = 'none';
  if (isDisaster) {
    hazardType = 'disaster';
  } else if (heatIndex > 43.0) {
    hazardType = 'heat';
  } else if (rain > 30.0) {
    hazardType = 'rain';
  }

  const isHazardous = hazardType !== 'none';

  // Compute dynamic geofence risks
  const geofenceZones = initialGeofenceZones.map(zone => {
    let riskLevel: 'SAFE' | 'WARNING' | 'HAZARD' = 'SAFE';
    if (isHazardous) {
      riskLevel = 'HAZARD';
    } else if (heatIndex > 38 || rain > 18) {
      riskLevel = 'WARNING';
    }
    return { ...zone, riskLevel };
  });

  // Execute Payout logic
  const executePayout = useCallback((reason: string, tC: number, hum: number, r: number) => {
    const randomTx = `UPI/2026/CS-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomId = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeString = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullDateString = `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${timeString}`;

    const newClaim: ClaimRecord = {
      id: randomId,
      timestamp: fullDateString,
      amount: 250,
      upiTransactionId: randomTx,
      triggerReason: reason,
      temperature: tC,
      humidity: hum,
      rain: r,
      status: 'INSTANT_CREDITED',
      geofenceZone: 'Indiranagar Hub (Zone Z-1)'
    };

    // Update Rider Policy
    setPolicy(prev => ({
      ...prev,
      claimsTodayCount: prev.claimsTodayCount + 1
    }));

    // Update Underwriter Ledger
    setLedger(prev => {
      const newPaidCount = prev.claimsPaidCount + 1;
      const newPaidTotal = prev.totalPayoutsAmount + 250;
      const newPool = Math.max(0, prev.capitalPool - 250);
      const newSolvency = Math.round((newPool / 120000) * 100);
      return {
        ...prev,
        capitalPool: newPool,
        claimsPaidCount: newPaidCount,
        totalPayoutsAmount: newPaidTotal,
        solvencyRatio: newSolvency,
        reserveStatus: newSolvency < 200 ? 'STRESSED' : 'HEALTHY'
      };
    });

    // Add to history and show modal
    setClaimsHistory(prev => [newClaim, ...prev]);
    setActiveClaimModal(newClaim);

    // Fire Confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b']
      });
    } catch (e) {
      console.log('Confetti effect fired:', e);
    }
  }, []);

  // Monitor hazard state and trigger payout when on shift
  useEffect(() => {
    if (isHazardous && isOnShift && !hasTriggeredForCurrentHazard) {
      setHasTriggeredForCurrentHazard(true);

      let reason = "";
      if (hazardType === 'disaster') {
        reason = disasterName || "Extreme Climate Disaster Alert (Emergency Red Zone)";
      } else if (hazardType === 'heat') {
        reason = `Parametric Heat Trigger - Wet Bulb Index ${heatIndex}°C (> 43°C)`;
      } else if (hazardType === 'rain') {
        reason = `Parametric Rainfall Trigger - Rain Rate ${rain} mm/hr (> 30 mm/hr)`;
      }

      executePayout(reason, temp, humidity, rain);
    } else if (!isHazardous) {
      setHasTriggeredForCurrentHazard(false);
    }
  }, [isHazardous, isOnShift, hasTriggeredForCurrentHazard, hazardType, heatIndex, rain, temp, humidity, disasterName, executePayout]);

  // Telemetry simulation update tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnShift) {
        setTelemetry(prev => ({
          ...prev,
          gpsSpeed: Math.max(12, Math.round((22 + (Math.random() * 8 - 4)) * 10) / 10),
          gForce: Math.round((1.0 + (Math.random() * 0.15 - 0.07)) * 100) / 100,
          movementStatus: "In Transit"
        }));
      } else {
        setTelemetry(prev => ({
          ...prev,
          gpsSpeed: 0,
          gForce: 1.0,
          movementStatus: "Offline"
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isOnShift]);

  // Handlers for controls
  const setTemperature = (t: number) => {
    setIsDisaster(false);
    setTemp(t);
  };

  const setHumidity = (h: number) => {
    setIsDisaster(false);
    setHum(h);
  };

  const setRain = (r: number) => {
    setIsDisaster(false);
    setRainVal(r);
  };

  const triggerDisaster = (title = "Catastrophic Wet-Bulb & Flood Event") => {
    setIsDisaster(true);
    setDisasterName(title);
    setTemp(47);
    setHum(85);
    setRainVal(52);
    setHasTriggeredForCurrentHazard(false); // Force fresh payout trigger
  };

  const resetWeather = () => {
    setIsDisaster(false);
    setDisasterName('');
    setTemp(32);
    setHum(50);
    setRainVal(2);
    setHasTriggeredForCurrentHazard(false);
  };

  const dismissClaimModal = () => {
    setActiveClaimModal(null);
  };

  return (
    <ShieldContext.Provider value={{
      weather: {
        temperature: temp,
        humidity,
        rain,
        heatIndex,
        isHazardous,
        hazardType,
        disasterTitle: disasterName
      },
      setTemperature,
      setHumidity,
      setRain,
      triggerDisaster,
      resetWeather,
      isOnShift,
      setIsOnShift,
      telemetry,
      policy,
      ledger,
      claimsHistory,
      activeClaimModal,
      dismissClaimModal,
      geofenceZones
    }}>
      {children}
    </ShieldContext.Provider>
  );
};

export const useShield = () => {
  const context = useContext(ShieldContext);
  if (!context) {
    throw new Error('useShield must be used within a ShieldProvider');
  }
  return context;
};
