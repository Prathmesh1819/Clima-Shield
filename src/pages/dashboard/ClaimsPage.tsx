import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, AlertTriangle, ExternalLink, 
  Search, Filter, ShieldCheck, Zap, X, Calendar 
} from 'lucide-react';
import { useShield } from '../../context/ShieldContext';
import { ClaimRecord } from '../../types';

export const ClaimsPage: React.FC = () => {
  const { claimsHistory } = useShield();
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filtered claims
  const filtered = claimsHistory.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.upiTransactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.triggerReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" /> Claims History & Parametric Disbursals
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete record of automated wage-loss protection claims executed by ClimaShield smart contracts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
            Total Claims: <strong className="text-cyan-400">{claimsHistory.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Claim ID, Tx Ref, or Trigger..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'INSTANT_CREDITED', 'RESERVE_LOCKED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                statusFilter === st 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All Claims' : st === 'INSTANT_CREDITED' ? 'Paid (Instant)' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No claims matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Trigger Cause</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">UPI Reference</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filtered.map(claim => (
                  <tr key={claim.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">{claim.id}</td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{claim.timestamp}</td>
                    <td className="py-3 px-4 text-slate-200 font-sans max-w-[240px] truncate">{claim.triggerReason}</td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{claim.geofenceZone}</td>
                    <td className="py-3 px-4 font-bold text-slate-300 whitespace-nowrap">{claim.upiTransactionId}</td>
                    <td className="py-3 px-4 text-right font-black text-emerald-400 whitespace-nowrap">₹{claim.amount}</td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        PAID (INSTANT)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-semibold text-[10px] border border-slate-700 transition-all"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CLAIM DETAILS MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-extrabold text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Claim Details ({selectedClaim.id})
              </span>
              <button onClick={() => setSelectedClaim(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2">
              <span className="text-3xl font-black text-emerald-400 font-mono">₹{selectedClaim.amount}.00</span>
              <p className="text-xs text-slate-400 mt-0.5">Credited via GPay / PhonePe UPI</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">UPI Tx Reference:</span>
                <span className="text-slate-200 font-bold">{selectedClaim.upiTransactionId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">Timestamp:</span>
                <span className="text-slate-300">{selectedClaim.timestamp}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="font-sans">Geofence Zone:</span>
                <span className="text-slate-300">{selectedClaim.geofenceZone}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="font-sans text-slate-400 block text-[10px] uppercase">Trigger Criteria</span>
                <p className="font-sans text-rose-300 font-semibold mt-0.5">{selectedClaim.triggerReason}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedClaim(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
