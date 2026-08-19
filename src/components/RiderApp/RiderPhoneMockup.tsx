import React from 'react';
import { 
  ShieldAlert, ShieldCheck, Navigation, Gauge, CloudRain, Thermometer, 
  CheckCircle2, AlertTriangle, Zap, UserCheck, DollarSign, Wifi, Battery, Clock 
} from 'lucide-react';
import { useShield } from '../../context/ShieldContext';
import { UpiPayoutModal } from './UpiPayoutModal';

export const RiderPhoneMockup: React.FC = () => {
  const { 
    isOnShift, setIsOnShift, weather, telemetry, policy, 
    claimsHistory, activeClaimModal, dismissClaimModal 
  } = useShield();

  const timeString = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative flex justify-center items-center py-2">
      {/* Smartphone Frame Outer shell */}
      <div className="w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[48px] p-3 border-4 border-slate-700/80 shadow-2xl shadow-cyan-950/40 relative flex flex-col justify-between overflow-hidden">
        
        {/* Phone Notch & Hardware Features */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-slate-950 rounded-b-2xl z-30 flex items-center justify-center gap-2">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
        </div>

        {/* Screen Content Container */}
        <div className="w-full h-full bg-slate-950 rounded-[38px] flex flex-col overflow-hidden relative border border-slate-800/80">
          
          {/* Top Status Bar */}
          <div className="pt-2 px-5 pb-1 flex justify-between items-center text-[11px] font-semibold text-slate-400 z-20">
            <span>{timeString}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-400 px-1 rounded">5G</span>
              <Wifi className="w-3 h-3 text-slate-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">{telemetry.battery}%</span>
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          </div>

          {/* App Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-3.5 no-scrollbar z-10 pb-6">
            
            {/* App Header & Shift Toggle */}
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white leading-tight">Gig Partner App</h2>
                    <p className="text-[10px] text-slate-400">ID: CS-RIDER-8821 • Ramesh K.</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] bg-slate-800 text-emerald-400 font-semibold px-2 py-1 rounded-full border border-emerald-500/20">
                  <UserCheck className="w-3 h-3" /> 4.92 ★
                </div>
              </div>

              {/* SHIFT TOGGLE SWITCH */}
              <div className={`p-2.5 rounded-xl transition-all border ${
                isOnShift 
                  ? 'bg-emerald-950/40 border-emerald-500/30' 
                  : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Delivery Shift Status</span>
                    <span className={`text-sm font-black flex items-center gap-1.5 ${
                      isOnShift ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isOnShift ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                      {isOnShift ? 'ON SHIFT (PROTECTED)' : 'OFF SHIFT (INACTIVE)'}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsOnShift(!isOnShift)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1 ${
                      isOnShift
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {isOnShift ? 'End Shift' : 'Start Shift'}
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE TELEMETRY SIMULATOR */}
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-bold text-[11px] text-slate-300 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" /> Rider Telemetry (GPS / G-Sensor)
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/20">
                  LIVE
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">GPS Speed</span>
                  <span className="text-sm font-extrabold text-white font-mono">{telemetry.gpsSpeed} <span className="text-[10px] text-slate-400 font-normal">km/h</span></span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">G-Force</span>
                  <span className="text-sm font-extrabold text-white font-mono">{telemetry.gForce} <span className="text-[10px] text-slate-400 font-normal">G</span></span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Zone ID</span>
                  <span className="text-xs font-bold text-cyan-400 truncate block">Zone Z-1</span>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between px-1">
                <span className="truncate max-w-[200px]">📍 {telemetry.locationName}</span>
                <span className={`font-semibold ${isOnShift ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {telemetry.movementStatus}
                </span>
              </div>
            </div>

            {/* LIVE WEATHER & NOAA HEAT INDEX GAUGE */}
            <div className={`rounded-2xl p-3.5 border transition-all ${
              weather.isHazardous 
                ? 'bg-rose-950/40 border-rose-500/40 glow-rose' 
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Thermometer className={`w-4 h-4 ${weather.heatIndex > 43 ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                  NOAA Wet-Bulb Weather Index
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  weather.isHazardous 
                    ? 'bg-rose-500 text-slate-950 animate-pulse' 
                    : weather.heatIndex > 38 
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {weather.isHazardous ? '⚠️ HAZARD ALERT' : weather.heatIndex > 38 ? 'MODERATE RISK' : 'NORMAL'}
                </span>
              </div>

              {/* Dynamic Temperature & Heat Barometer */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-white font-mono">{weather.heatIndex}°C</span>
                    <span className="text-[11px] text-slate-400 ml-1.5">Wet-Bulb Index</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>Temp: <span className="text-slate-200 font-bold">{weather.temperature}°C</span></div>
                    <div>Humidity: <span className="text-slate-200 font-bold">{weather.humidity}%</span></div>
                  </div>
                </div>

                {/* Heat Index Visual Bar */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      weather.heatIndex > 43 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                        : weather.heatIndex > 38 
                        ? 'bg-gradient-to-r from-emerald-500 to-amber-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, ((weather.heatIndex - 25) / 25) * 100))}%` }}
                  />
                </div>

                {/* Rain Indicator */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Precipitation Rate:
                  </span>
                  <span className={`font-mono font-bold ${weather.rain > 30 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {weather.rain} mm/hr
                  </span>
                </div>
              </div>

              {/* HAZARD DANGER BANNER */}
              {weather.isHazardous && (
                <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs animate-pulse">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-400 leading-tight">
                        {weather.hazardType === 'heat' && 'Extreme Heat Index Exceeded (>43°C)'}
                        {weather.hazardType === 'rain' && 'Torrential Rain Hazard Exceeded (>30mm/hr)'}
                        {weather.hazardType === 'disaster' && (weather.disasterTitle || 'Emergency Extreme Weather Red Alert')}
                      </p>
                      <p className="text-[10px] text-rose-300/80 mt-0.5">
                        Wage loss compensation trigger condition met. Parametric payout auto-initiated!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVE POLICY PROTECTION CARD */}
            <div className="bg-gradient-to-br from-cyan-950/60 via-slate-900 to-slate-900 rounded-2xl p-3.5 border border-cyan-500/30 text-xs shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> ClimaShield Policy
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {policy.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300 my-2">
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Daily Protection Quota</span>
                  <span className="text-sm font-bold text-white">₹{policy.maxDailyProtection} / day</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Instant Payout Rate</span>
                  <span className="text-sm font-bold text-emerald-400">₹{policy.payoutAmount} / trigger</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-800">
                <span>Policy ID: <strong className="text-slate-200">{policy.policyId}</strong></span>
                <span>Claims Today: <strong className="text-cyan-400">{policy.claimsTodayCount}</strong></span>
              </div>
            </div>

            {/* RECENT CLAIM PAYOUT LOG (MINI) */}
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 text-xs">
              <span className="font-bold text-slate-300 block mb-2 text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Instant Claims Log
                </span>
                <span className="text-[10px] text-slate-500">{claimsHistory.length} total</span>
              </span>

              {claimsHistory.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic text-center py-3">
                  No payouts triggered yet. Simulate extreme weather on right console to test.
                </p>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar">
                  {claimsHistory.map(claim => (
                    <div key={claim.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ₹{claim.amount} UPI Credited
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{claim.upiTransactionId}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          INSTANT
                        </span>
                        <p className="text-[8px] text-slate-500 mt-0.5">{claim.timestamp.split(',')[1]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ANIMATED UPI PAYOUT SLIDE-IN MODAL OVERLAY */}
          {activeClaimModal && (
            <UpiPayoutModal claim={activeClaimModal} onClose={dismissClaimModal} />
          )}

        </div>
      </div>
    </div>
  );
};
