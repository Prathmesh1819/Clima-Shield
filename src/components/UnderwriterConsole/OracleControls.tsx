import React from 'react';
import { Thermometer, Droplets, CloudRain, Flame, Zap, AlertTriangle, RotateCcw } from 'lucide-react';
import { useShield } from '../../context/ShieldContext';

export const OracleControls: React.FC = () => {
  const { 
    weather, setTemperature, setHumidity, setRain, 
    triggerDisaster, resetWeather 
  } = useShield();

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl space-y-4">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400" /> Weather Oracle Simulation Console
          </h3>
          <p className="text-xs text-slate-400">
            Adjust micro-climate conditions to test parametric contract trigger conditions.
          </p>
        </div>

        <button
          onClick={resetWeather}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Extreme Disaster Red Button */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/50 shadow-lg shadow-rose-950/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" /> Red Alert Override
            </span>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Instantly simulate a catastrophic climate event (&gt;46°C / 85% RH / 50mm/hr Rain)
            </p>
          </div>

          <button
            onClick={() => triggerDisaster("Severe Catastrophic Heat & Torrential Flood Warning")}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer animate-pulse"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>TRIGGER EXTREME DISASTER</span>
          </button>
        </div>
      </div>

      {/* Interactive Weather Sliders */}
      <div className="space-y-3.5 text-xs">
        
        {/* TEMPERATURE SLIDER */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" /> Temperature:
            </label>
            <span className="font-mono text-sm font-extrabold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20">
              {weather.temperature}°C
            </span>
          </div>

          <input
            type="range"
            min={25}
            max={50}
            step={1}
            value={weather.temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>25°C (Mild)</span>
            <span className="text-rose-400 font-bold">Limit: 43°C</span>
            <span>50°C (Extreme)</span>
          </div>
        </div>

        {/* HUMIDITY SLIDER */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" /> Relative Humidity:
            </label>
            <span className="font-mono text-sm font-extrabold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
              {weather.humidity}%
            </span>
          </div>

          <input
            type="range"
            min={20}
            max={95}
            step={1}
            value={weather.humidity}
            onChange={(e) => setHumidity(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>20% (Dry)</span>
            <span>55% (Moderate)</span>
            <span>95% (Extreme Wet)</span>
          </div>
        </div>

        {/* RAIN RATE SLIDER */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-200 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-400" /> Precipitation Rate:
            </label>
            <span className={`font-mono text-sm font-extrabold px-2 py-0.5 rounded border ${
              weather.rain > 30 
                ? 'text-rose-400 bg-rose-950/50 border-rose-500/30' 
                : 'text-blue-400 bg-blue-950/50 border-blue-500/20'
            }`}>
              {weather.rain} mm/hr
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={60}
            step={1}
            value={weather.rain}
            onChange={(e) => setRain(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 mm/hr (Dry)</span>
            <span className="text-rose-400 font-bold">Limit: 30 mm/hr</span>
            <span>60 mm/hr (Downpour)</span>
          </div>
        </div>

      </div>

      {/* QUICK PRESETS */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">
          Quick Simulation Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
          <button
            onClick={() => { setTemperature(28); setHumidity(45); setRain(0); }}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-center transition-all"
          >
            ☀️ Clear (28°C)
          </button>
          <button
            onClick={() => { setTemperature(35); setHumidity(60); setRain(15); }}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-center transition-all"
          >
            🌦️ Mild Rain (15mm)
          </button>
          <button
            onClick={() => { setTemperature(44); setHumidity(50); setRain(5); }}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-center transition-all"
          >
            🔥 Severe Heat (44°C)
          </button>
          <button
            onClick={() => { setTemperature(30); setHumidity(85); setRain(35); }}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-blue-500/30 text-blue-300 text-center transition-all"
          >
            🌧️ Storm (35mm)
          </button>
        </div>
      </div>
    </div>
  );
};
