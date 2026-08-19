import React from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ShieldAlert, Layers } from 'lucide-react';
import { useShield } from '../../context/ShieldContext';

// Fix for default leaflet marker icon paths in Vite
const riderIcon = L.divIcon({
  className: 'custom-rider-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/50 border-2 border-white animate-bounce">
        🏍️
      </div>
      <div class="absolute -bottom-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export const GeofenceMap: React.FC = () => {
  const { geofenceZones, telemetry, weather, isOnShift } = useShield();

  const center: [number, number] = [12.9650, 77.6200];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" /> Geofence & Delivery Hub Oracle Map
          </h3>
          <p className="text-xs text-slate-400">
            Real-time delivery micro-zones showing parametric climate hazard status.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Safe Zone
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Hazard Alert
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[320px] rounded-xl overflow-hidden border border-slate-800 relative z-10">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* Dark map tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Render Geofence Zones */}
          {geofenceZones.map(zone => {
            const isHazard = zone.riskLevel === 'HAZARD';
            const isWarning = zone.riskLevel === 'WARNING';
            
            const strokeColor = isHazard ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';
            const fillColor = isHazard ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';

            return (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: strokeColor,
                  fillColor: fillColor,
                  fillOpacity: isHazard ? 0.35 : 0.15,
                  weight: isHazard ? 3 : 1.5,
                  dashArray: isHazard ? '6, 6' : undefined
                }}
              >
                <Tooltip permanent={false} direction="top">
                  <div className="text-xs font-sans">
                    <strong>{zone.name}</strong> ({zone.id})<br />
                    Status: <span style={{ color: strokeColor }}>{zone.riskLevel}</span><br />
                    Active Workers: {zone.activeWorkers}
                  </div>
                </Tooltip>
              </Circle>
            );
          })}

          {/* Rider Marker */}
          {isOnShift && (
            <Marker position={[telemetry.lat, telemetry.lng]} icon={riderIcon}>
              <Popup>
                <div className="text-xs font-sans text-slate-900 p-1">
                  <strong className="text-cyan-700">Rider #CS-8821 (Ramesh)</strong><br />
                  Speed: {telemetry.gpsSpeed} km/h<br />
                  Status: Protected by ClimaShield<br />
                  Wet-Bulb Temp: {weather.heatIndex}°C
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Map Overlay Badge */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Hub: <strong className="text-white">Bengaluru Central</strong></span>
          <span className="text-slate-500">|</span>
          <span>Workers Tracked: <strong className="text-emerald-400">1,420</strong></span>
        </div>
      </div>
    </div>
  );
};
