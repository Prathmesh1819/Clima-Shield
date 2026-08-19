import React from 'react';
import { ShieldCheck, Activity, Radio, Smartphone, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useShield } from '../context/ShieldContext';

interface NavbarProps {
  activeTab: 'rider' | 'oracle';
  setActiveTab: (tab: 'rider' | 'oracle') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isOnShift, weather, ledger, resetWeather } = useShield();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Clima<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Shield</span>
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  SIH 2026 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Parametric Wage-Loss Insurance Engine for Delivery Partners
              </p>
            </div>
          </div>

          {/* Mobile Tab Toggle */}
          <div className="flex md:hidden bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('rider')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'rider' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Rider
            </button>
            <button
              onClick={() => setActiveTab('oracle')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'oracle' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Oracle
            </button>
          </div>
        </div>

        {/* Live Metrics & Quick Reset */}
        <div className="flex items-center gap-3 text-xs w-full md:w-auto justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Oracle:</span>
            <span className="font-mono font-bold text-emerald-400">ONLINE</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Heat Index:</span>
            <span className={`font-mono font-bold ${weather.heatIndex > 43 ? 'text-rose-400' : 'text-cyan-400'}`}>
              {weather.heatIndex}°C
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300">
            <span className="text-slate-400">Capital Pool:</span>
            <span className="font-mono font-bold text-emerald-400">₹{(ledger.capitalPool).toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={resetWeather}
            title="Reset Simulation Weather"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
