import React from 'react';
import { 
  ShieldCheck, Check, Zap, Thermometer, CloudRain, 
  Flame, Award, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PlanPage: React.FC = () => {
  const { riderProfile } = useAuth();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" /> My Protection Plan & Coverage Rules
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Parametric coverage terms, micro-climate trigger limits, and daily premium structure.
        </p>
      </div>

      {/* ACTIVE PLAN CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/70 rounded-3xl p-6 border-2 border-cyan-500/40 shadow-2xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                ACTIVE PLAN
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: PLAN-GOLD-300</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Parametric Gig Shield Gold</h2>
            <p className="text-xs text-slate-300">Customized for active delivery partners & driver partners.</p>
          </div>

          <div className="text-left sm:text-right bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Daily Premium</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">₹15 <span className="text-xs font-normal text-slate-400">/ day</span></span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Payout Rate / Trigger</span>
            <span className="text-lg font-black text-white font-mono">₹250</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Daily Protection Quota</span>
            <span className="text-lg font-black text-emerald-400 font-mono">₹300</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Monthly Max Limit</span>
            <span className="text-lg font-black text-white font-mono">₹3,500</span>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Coverage Period</span>
            <span className="text-xs font-bold text-cyan-400 mt-1 block">30 Days (Auto-Renew)</span>
          </div>
        </div>

        {/* COVERED PARAMETRIC TRIGGERS LIST */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Supported Parametric Hazard Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Thermometer className="w-4 h-4 text-amber-400" /> Extreme Heatwave
              </div>
              <p className="text-[11px] text-slate-400">
                Triggers when NOAA Wet-Bulb Heat Index exceeds <strong>43.0°C</strong> in your registered work zone.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-300">
                <CloudRain className="w-4 h-4 text-blue-400" /> Torrential Rainfall
              </div>
              <p className="text-[11px] text-slate-400">
                Triggers when precipitation rate exceeds <strong>30 mm/hr</strong> causing localized flooding.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <Flame className="w-4 h-4 text-rose-500" /> Red Alert Emergency
              </div>
              <p className="text-[11px] text-slate-400">
                Triggers when government issues Red Category weather alert for your working district.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* PLAN UPGRADE COMPARISON */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Available Plan Tier Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Basic */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Starter Shield</span>
              <h3 className="text-lg font-bold text-white mt-1">ClimaShield Basic</h3>
              <div className="text-xl font-black text-white font-mono my-2">₹10 <span className="text-xs font-normal text-slate-400">/ day</span></div>
              <ul className="space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> ₹150 Payout / Trigger</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Heat Index &gt; 44°C</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Max ₹2,000 / month</li>
              </ul>
            </div>
            <button className="w-full py-2 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs cursor-not-allowed">
              Current Tier Lower
            </button>
          </div>

          {/* Gold (Active) */}
          <div className="bg-slate-900/90 p-5 rounded-3xl border-2 border-cyan-500 space-y-3 relative flex flex-col justify-between shadow-lg shadow-cyan-950/40">
            <span className="absolute -top-3 right-4 bg-cyan-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Your Active Plan
            </span>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase">Most Popular</span>
              <h3 className="text-lg font-black text-white mt-1">Gig Shield Gold</h3>
              <div className="text-xl font-black text-emerald-400 font-mono my-2">₹15 <span className="text-xs font-normal text-slate-400">/ day</span></div>
              <ul className="space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> ₹250 Payout / Trigger</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Heat Index &gt; 43°C & Rain &gt; 30mm</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Max ₹3,500 / month</li>
              </ul>
            </div>
            <button className="w-full py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30">
              Active Protection
            </button>
          </div>

          {/* Platinum */}
          <div className="bg-slate-900/80 p-5 rounded-3xl border border-purple-500/40 space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase">Maximum Protection</span>
              <h3 className="text-lg font-black text-white mt-1">Gig Shield Pro Max</h3>
              <div className="text-xl font-black text-purple-300 font-mono my-2">₹25 <span className="text-xs font-normal text-slate-400">/ day</span></div>
              <ul className="space-y-1.5 text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> ₹400 Payout / Trigger</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Heat Index &gt; 41°C & Rain &gt; 22mm</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Max ₹6,000 / month</li>
              </ul>
            </div>
            <button 
              onClick={() => alert('Plan Upgrade Request Submitted! ClimaShield team will activate Pro Max tier.')}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Upgrade to Pro Max →
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
