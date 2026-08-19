import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiderPhoneMockup } from '../components/RiderApp/RiderPhoneMockup';
import { OracleControls } from '../components/UnderwriterConsole/OracleControls';
import { GeofenceMap } from '../components/UnderwriterConsole/GeofenceMap';
import { SolvencyLedger } from '../components/UnderwriterConsole/SolvencyLedger';
import { 
  ShieldCheck, UserPlus, LogIn, Sparkles, Cpu, 
  ArrowRight, Shield, Zap, CheckCircle2, Flame, Droplets, Thermometer 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'rider' | 'oracle'>('rider');

  return (
    <div className="space-y-8 pb-12">
      
      {/* HERO PROMOTION BANNER */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800/80 px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Parametric Wage-Loss Protection for Gig Workers
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Instant Wage Protection When <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">Extreme Weather</span> Strikes.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              ClimaShield monitors real-time NOAA wet-bulb heat indices and heavy precipitation rates. When hazards cross safety limits while you're on shift, compensation is automatically disbursed straight to your UPI account.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Register as a Rider</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Already Registered? Login</span>
                  </Link>
                </>
              ) : (
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Go to My {user?.role === 'admin' ? 'Admin' : 'Rider'} Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs text-left max-w-lg mx-auto md:mx-0">
              <div>
                <span className="text-slate-400 text-[10px] block">Wet-Bulb Limit</span>
                <span className="font-extrabold text-amber-400 text-sm font-mono">&gt; 43.0°C</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Rain Limit</span>
                <span className="font-extrabold text-cyan-400 text-sm font-mono">&gt; 30 mm/hr</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Disbursal Time</span>
                <span className="font-extrabold text-emerald-400 text-sm font-mono">Instant UPI</span>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="w-full max-w-md bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> How ClimaShield Works
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">
                0-MANUAL CLAIMS
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <strong className="text-white block">Register & Start Shift</strong>
                  <p className="text-slate-400 text-[11px]">Rider registers profile and turns on shift status when on delivery duty.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <strong className="text-white block">Weather Oracle Monitoring</strong>
                  <p className="text-slate-400 text-[11px]">Oracle continuously monitors heat index and rainfall in delivery geofences.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <strong className="text-white block">Instant Parametric Payout</strong>
                  <p className="text-slate-400 text-[11px]">When limits cross, ₹250 is instantly transferred via UPI to rider's bank.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EXISTING SPLIT-SCREEN SHOWCASE (Rider Phone Mockup + Weather Oracle Console) */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Rider Mobile App Simulator (lg:col-span-5) */}
        <div className={`lg:block ${activeTab === 'rider' ? 'block' : 'hidden'} lg:col-span-5 sticky lg:top-20`}>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live Interactive Rider Phone Showcase
            </span>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              Interactive Simulator
            </span>
          </div>

          <RiderPhoneMockup />
        </div>

        {/* RIGHT COLUMN: Weather Oracle & Underwriter Console (lg:col-span-7) */}
        <div className={`lg:block ${activeTab === 'oracle' ? 'block' : 'hidden'} lg:col-span-7 space-y-6`}>
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
        </div>

      </section>

    </div>
  );
};
