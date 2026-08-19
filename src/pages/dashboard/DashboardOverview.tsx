import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, Thermometer, CloudRain, Zap, 
  CheckCircle2, DollarSign, Calendar, MapPin, ArrowRight, UserCheck, Activity, Award 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShield } from '../../context/ShieldContext';

export const DashboardOverview: React.FC = () => {
  const { riderProfile } = useAuth();
  const { weather, claimsHistory, isOnShift } = useShield();

  const name = riderProfile?.fullName ? riderProfile.fullName.split(' ')[0] : 'Ramesh';
  const totalProtected = claimsHistory.reduce((acc, curr) => acc + curr.amount, 0) + 3250; // Total includes past historical protections

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Good day, {name} 👋
            </h1>
            <span className="text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              ID: {riderProfile?.riderId || 'CS-RDR-10248'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Here's your live ClimaShield parametric wage protection overview for <strong className="text-white">{riderProfile?.city || 'Bengaluru'} ({riderProfile?.area || 'Indiranagar Zone Z-1'})</strong>.
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          <Zap className="w-4 h-4 fill-cyan-400" />
          <span>Launch Live Simulator</span>
        </Link>
      </div>

      {/* THREE MAIN DASHBOARD CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: PROTECTION STATUS */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Protection Status
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-lg font-black text-white">
                {riderProfile?.planId === 'PLAN-GOLD-300' ? 'Parametric Gig Shield Gold' : 'ClimaShield Basic'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily Coverage Quota: <strong className="text-emerald-400">₹300 / day</strong>
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span className="font-sans">Shift Duty:</span>
              <span className={isOnShift ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {isOnShift ? 'ON SHIFT (PROTECTED)' : 'OFF SHIFT'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="font-sans">Validity:</span>
              <span className="text-slate-200">31 Aug 2026</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="font-sans">Auto-Renewal:</span>
              <span className="text-cyan-400">₹15 / Day</span>
            </div>
          </div>

          <Link
            to="/dashboard/plan"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-slate-700 block transition-all"
          >
            Manage Protection Plan →
          </Link>
        </div>

        {/* CARD 2: CURRENT WEATHER RISK */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" /> Current Weather Risk
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                weather.isHazardous ? 'bg-rose-500 text-slate-950 animate-pulse' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              }`}>
                {weather.isHazardous ? 'HAZARD TRIGGERED' : 'MODERATE RISK'}
              </span>
            </div>

            <div className="pt-2 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-white font-mono">{weather.heatIndex}°C</span>
                <span className="text-xs text-slate-400 block font-sans">NOAA Wet-Bulb Heat Index</span>
              </div>
              <div className="text-right text-xs text-slate-300 font-mono">
                <div>Temp: <strong>{weather.temperature}°C</strong></div>
                <div>Rain: <strong>{weather.rain} mm/hr</strong></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span>Working Zone:</span>
              <span className="font-semibold text-slate-200">{riderProfile?.area || 'Indiranagar Zone Z-1'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Heatwave Alert:</span>
              <span className={weather.heatIndex > 43 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {weather.heatIndex > 43 ? 'CRITICAL ALERT' : 'Normal Boundaries'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              * Live NOAA Weather Oracle Feed (Updated 2 mins ago)
            </div>
          </div>

          <Link
            to="/"
            className="w-full py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold text-center border border-cyan-500/30 block transition-all"
          >
            Adjust Micro-Climate Sliders →
          </Link>
        </div>

        {/* CARD 3: EARNINGS PROTECTED */}
        <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Income Protected
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                VERIFIED PAYOUTS
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-3xl font-black text-emerald-400 font-mono">
                ₹{totalProtected.toLocaleString('en-IN')}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total Parametric Disbursals Received
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 font-sans block">Claims Received</span>
              <span className="font-extrabold text-white text-base">{claimsHistory.length + 12}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 font-mono">
              <span className="text-[10px] text-slate-400 font-sans block">Protected Days</span>
              <span className="font-extrabold text-cyan-400 text-base">14 Days</span>
            </div>
          </div>

          <Link
            to="/dashboard/claims"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-slate-700 block transition-all"
          >
            View Complete Claims History →
          </Link>
        </div>

      </div>

      {/* QUICK WORK PROFILE SUMMARY & RECENT CLAIM LOG */}
      <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Recent Automated Disbursals Log
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            UPDATED REAL-TIME
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {claimsHistory.slice(0, 3).map(claim => (
            <div key={claim.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
                  ₹{claim.amount}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{claim.id}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{claim.upiTransactionId}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{claim.triggerReason}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  INSTANT CREDITED
                </span>
                <span className="block text-[10px] text-slate-500 mt-1 font-mono">{claim.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
