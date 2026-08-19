import React, { useState } from 'react';
import { ShieldProvider } from './context/ShieldContext';
import { Navbar } from './components/Navbar';
import { RiderPhoneMockup } from './components/RiderApp/RiderPhoneMockup';
import { OracleControls } from './components/UnderwriterConsole/OracleControls';
import { GeofenceMap } from './components/UnderwriterConsole/GeofenceMap';
import { SolvencyLedger } from './components/UnderwriterConsole/SolvencyLedger';
import { Shield, Sparkles, Cpu, Award } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rider' | 'oracle'>('rider');

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Rider Mobile App Simulator (lg:col-span-5) */}
        <section className={`lg:block ${activeTab === 'rider' ? 'block' : 'hidden'} lg:col-span-5 sticky lg:top-20`}>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Rider Mobile Interface (Dark Mode)
            </span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              Interactive Phone Simulator
            </span>
          </div>

          <RiderPhoneMockup />
        </section>

        {/* RIGHT COLUMN: Weather Oracle & Underwriter Console (lg:col-span-7) */}
        <section className={`lg:block ${activeTab === 'oracle' ? 'block' : 'hidden'} lg:col-span-7 space-y-6`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Oracle & Underwriter Simulation Console
            </span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              Parametric Trigger Engine
            </span>
          </div>

          {/* Weather Sliders & Disaster Control */}
          <OracleControls />

          {/* Interactive Delivery Zone Map */}
          <GeofenceMap />

          {/* Financial Solvency & Claims Ledger */}
          <SolvencyLedger />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 bg-slate-900/40 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">ClimaShield SIH 2026 Prototype</span>
            <span className="text-slate-600">|</span>
            <span>Parametric Climate Wage-Loss Protection for Delivery Partners</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-300"><Award className="w-3.5 h-3.5 text-amber-400" /> Developed by team 18</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ShieldProvider>
      <AppContent />
    </ShieldProvider>
  );
}

export default App;
