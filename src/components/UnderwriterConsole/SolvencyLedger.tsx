import React from 'react';
import { Landmark, TrendingUp, ShieldCheck, FileCheck, Layers, ArrowUpRight } from 'lucide-react';
import { useShield } from '../../context/ShieldContext';

export const SolvencyLedger: React.FC = () => {
  const { ledger, claimsHistory } = useShield();

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-400" /> Underwriter Capital Pool & Solvency Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Real-time balance reserve and automated smart contract parametric execution audit log.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> RESERVE: {ledger.reserveStatus}
          </span>
        </div>
      </div>

      {/* Financial Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Capital Pool */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Capital Reserve Pool</span>
          <span className="text-lg font-black text-white font-mono mt-1 block">
            ₹{ledger.capitalPool.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-0.5 font-semibold">
            <TrendingUp className="w-3 h-3" /> SIH InsurTech Vault
          </span>
        </div>

        {/* Total Claims Paid */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Claims Disbursed</span>
          <span className="text-lg font-black text-cyan-400 font-mono mt-1 block">
            ₹{ledger.totalPayoutsAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] text-slate-400 mt-1 block">
            Count: <strong className="text-white">{ledger.claimsPaidCount}</strong> payouts
          </span>
        </div>

        {/* Solvency Ratio */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Solvency Ratio</span>
          <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">
            {ledger.solvencyRatio}%
          </span>
          <span className="text-[9px] text-slate-400 mt-1 block">
            Min Requirement: <strong className="text-slate-300">150%</strong>
          </span>
        </div>

        {/* Active Covered Workers */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Covered Workers</span>
          <span className="text-lg font-black text-white font-mono mt-1 block">
            {ledger.activeCoveredWorkers.toLocaleString('en-IN')}
          </span>
          <span className="text-[9px] text-emerald-400 mt-1 block font-semibold">
            Active Gig Shield
          </span>
        </div>
      </div>

      {/* Parametric Claims Audit Log Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-cyan-400" /> Automated Smart-Contract Execution Ledger
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            UPDATES IN REAL-TIME
          </span>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          {claimsHistory.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 italic">
              No claims executed yet in this session. Move weather sliders or press "Trigger Extreme Disaster" to test.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Claim ID</th>
                    <th className="py-2.5 px-3">Zone</th>
                    <th className="py-2.5 px-3">Trigger Reason</th>
                    <th className="py-2.5 px-3">UPI Tx Ref</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {claimsHistory.map(claim => (
                    <tr key={claim.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-400 text-[10px] whitespace-nowrap">{claim.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold text-cyan-400 whitespace-nowrap">{claim.id}</td>
                      <td className="py-2.5 px-3 text-slate-300 whitespace-nowrap">{claim.geofenceZone}</td>
                      <td className="py-2.5 px-3 text-rose-300 font-sans max-w-[200px] truncate">{claim.triggerReason}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-bold whitespace-nowrap">{claim.upiTransactionId}</td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-400 whitespace-nowrap">₹{claim.amount}</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          AUTO_SETTLED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
