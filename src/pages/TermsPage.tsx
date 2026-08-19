import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 text-slate-300 text-xs leading-relaxed">
      
      <Link to="/" className="inline-flex items-center gap-1.5 text-cyan-400 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Homepage
      </Link>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" /> ClimaShield Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Last Updated: 19 August 2026 • SIH 2026 Parametric Wage Loss Protection Prototype
        </p>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase">1. Platform Scope & Purpose</h2>
        <p>
          ClimaShield is a parametric wage-loss protection prototype designed for gig delivery workers and driver partners. It automatically disburses financial compensation when verified weather oracle sensors record micro-climate conditions crossing safety limits.
        </p>

        <h2 className="text-sm font-bold text-white uppercase">2. Parametric Trigger Conditions</h2>
        <p>
          Disbursals occur automatically based on pre-set parameters:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Extreme Heatwave:</strong> NOAA Wet-Bulb Heat Index exceeding 43.0°C.</li>
          <li><strong>Torrential Rain:</strong> Precipitation rate exceeding 30.0 mm/hr.</li>
          <li><strong>Red Alert:</strong> Government or regional meteorological emergency alerts.</li>
        </ul>

        <h2 className="text-sm font-bold text-white uppercase">3. Prototype Disclaimer</h2>
        <p>
          This application is a student prototype built for hackathon demonstration. Financial transactions shown as demo data or simulation modes are for verification of smart-contract execution logic.
        </p>
      </div>
    </div>
  );
};
