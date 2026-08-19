import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 text-slate-300 text-xs leading-relaxed">
      
      <Link to="/" className="inline-flex items-center gap-1.5 text-cyan-400 font-bold hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Homepage
      </Link>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> ClimaShield Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          How we collect, protect, and handle gig worker telemetry & location data.
        </p>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase">1. Location & Telemetry Data</h2>
        <p>
          ClimaShield collects browser geolocation and GPS speed telemetry ONLY when a rider opts in and turns on shift duty. We do NOT continuously track riders off shift.
        </p>

        <h2 className="text-sm font-bold text-white uppercase">2. Security & Credentials</h2>
        <p>
          All account passwords are encrypted using SHA-256 standard hashing prior to storage. Plaintext passwords are never saved.
        </p>

        <h2 className="text-sm font-bold text-white uppercase">3. Data Sharing</h2>
        <p>
          Rider personal data is used exclusively to evaluate weather hazard risks and execute UPI compensation claims. Data is never sold to third-party advertisers.
        </p>
      </div>
    </div>
  );
};
