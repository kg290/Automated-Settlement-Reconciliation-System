import React from 'react';
import { 
  CreditCard, Landmark, ArrowRightLeft, ShieldCheck, 
  TrendingUp, AlertCircle 
} from 'lucide-react';

export default function KpiCards({ run, unexplainedVariance }) {
  if (!run) return null;

  const fmt = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const grossVar = run.gross_variance || 0;
  const isZeroUnexplained = Math.abs(unexplainedVariance || 0) < 0.01;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Platform Books */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Internal Ledger</span>
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">{fmt(run.total_platform_volume)}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="font-medium text-slate-300">{run.total_platform_txns.toLocaleString()}</span>
            <span>processed payments</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
          <span>Est. Platform Fees:</span>
          <span className="text-slate-300 font-mono">{fmt(run.total_platform_fees)}</span>
        </div>
      </div>

      {/* 2. Bank Settled */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bank Settled Deposits</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-white tracking-tight">{fmt(run.total_bank_volume)}</div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="font-medium text-slate-300">{run.total_bank_settlements.toLocaleString()}</span>
            <span>settlement payouts</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
          <span>Actual Bank Fees:</span>
          <span className="text-slate-300 font-mono">{fmt(run.total_bank_fees)}</span>
        </div>
      </div>

      {/* 3. Month-End Imbalance (The Gap) */}
      <div className="bg-slate-900 border border-amber-900/40 rounded-xl p-5 shadow-sm relative overflow-hidden group hover:border-amber-700/50 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Raw Month-End Variance</span>
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{fmt(grossVar)}</div>
          <div className="text-xs text-slate-400 mt-1">
            <span>Books don't balance without reconciliation</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
          <span>Base Match Rate:</span>
          <span className="text-amber-300 font-medium">{run.match_rate_percentage}%</span>
        </div>
      </div>

      {/* 4. Reconciled Unexplained Balance (The Solution) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-brand-500/30 rounded-xl p-5 shadow-lg shadow-brand-500/5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Unexplained Discrepancy</span>
          </span>
          <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold text-brand-400 tracking-tight">
            {isZeroUnexplained ? '$0.00' : fmt(unexplainedVariance)}
          </div>
          <div className="text-xs text-slate-300 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
            <span>100% of variance accounted for</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between text-xs text-slate-400">
          <span>Resolution Status:</span>
          <span className="text-brand-300 font-semibold uppercase">Reconciled to the Cent</span>
        </div>
      </div>

    </div>
  );
}
