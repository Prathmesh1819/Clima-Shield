import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import { ClaimRecord } from '../../types';

interface UpiPayoutModalProps {
  claim: ClaimRecord;
  onClose: () => void;
}

export const UpiPayoutModal: React.FC<UpiPayoutModalProps> = ({ claim, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 150, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="absolute inset-x-2 bottom-3 z-50 bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-4 shadow-2xl shadow-emerald-950/80 text-white overflow-hidden"
    >
      {/* Background glowing gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
          <Zap className="w-4 h-4 fill-emerald-400" />
          <span>INSTANT UPI PAYOUT</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
          SIH-PARAMETRIC-V1
        </span>
      </div>

      {/* Amount Display */}
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2 text-emerald-400 shadow-lg shadow-emerald-500/20 animate-pulse">
          <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">₹{claim.amount}.00</h3>
        <p className="text-xs font-semibold text-emerald-400 mt-0.5">Credited to GPay / PhonePe UPI</p>
      </div>

      {/* Details Box */}
      <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 space-y-2 text-xs my-3">
        <div className="flex justify-between items-center text-slate-400">
          <span>Transaction Ref ID:</span>
          <span className="font-mono font-bold text-slate-200 text-[11px]">{claim.upiTransactionId}</span>
        </div>

        <div className="flex justify-between items-center text-slate-400">
          <span>Timestamp:</span>
          <span className="font-mono text-slate-300 text-[10px]">{claim.timestamp}</span>
        </div>

        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Trigger Cause</span>
          <p className="text-xs text-rose-300 font-semibold mt-0.5 leading-snug">
            {claim.triggerReason}
          </p>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-cyan-400">
            <ShieldCheck className="w-3 h-3" /> Underwriter Pool Auto-Verified
          </span>
          <span className="text-slate-500 flex items-center gap-0.5">
            Audit Ledger <ExternalLink className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
      >
        <span>Acknowledge & Close</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
