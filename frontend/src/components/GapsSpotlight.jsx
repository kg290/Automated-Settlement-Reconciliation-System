import React from 'react';
import { 
  Clock, Coins, Copy, AlertOctagon, ArrowUpRight, 
  HelpCircle, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function GapsSpotlight({ gaps, onSelectCategory }) {
  if (!gaps) return null;

  const fmt = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const { timing_differences, rounding_differences, duplicate_entries, orphan_refunds } = gaps;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Root Cause Gaps Spotlight</span>
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              4 Critical Flaws Identified
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed breakdown explaining exactly why the payments books failed to balance at month-end close.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* GAP 1: Timing Differences */}
        <div 
          onClick={() => onSelectCategory('TIMING_DIFFERENCE')}
          className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/5 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Gap Type 1</span>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Settled Following Month (Timing Cut-off)
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-semibold">
              {timing_differences?.count || 0} txns
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between">
            <div className="text-xl font-bold text-white">{fmt(timing_differences?.total_amount)}</div>
            <span className="text-xs text-indigo-400 font-medium">In-Transit Clearing Asset</span>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {timing_differences?.root_cause}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Solution: <strong className="text-slate-300">Balance sheet accrual</strong></span>
            <span className="text-indigo-400 flex items-center gap-0.5 font-medium group-hover:translate-x-1 transition-transform">
              View Items <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* GAP 2: Rounding Differences */}
        <div 
          onClick={() => onSelectCategory('ROUNDING_DIFFERENCE')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Gap Type 2</span>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Cumulative Rounding Drift (Sub-Cent Sum)
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-semibold">
              {rounding_differences?.count || 0} batches
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between">
            <div className="text-xl font-bold text-amber-400">
              {fmt(rounding_differences?.total_drift_amount)}
              <span className="text-xs font-normal text-slate-400 ml-1.5">(Fee Variance)</span>
            </div>
            <span className="text-xs text-amber-400 font-medium">Invisible per-txn</span>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {rounding_differences?.root_cause}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Solution: <strong className="text-slate-300">Bank charges GL entry</strong></span>
            <span className="text-amber-400 flex items-center gap-0.5 font-medium group-hover:translate-x-1 transition-transform">
              View Items <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* GAP 3: Duplicate Entries */}
        <div 
          onClick={() => onSelectCategory('DUPLICATE_ENTRY')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/5 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Gap Type 3</span>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Duplicate Entries (Bank & Platform)
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 text-xs font-semibold">
              {duplicate_entries?.count || 0} conflicts
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between">
            <div className="text-xl font-bold text-purple-400">
              {fmt((duplicate_entries?.bank_duplicates_amount || 0) + (duplicate_entries?.platform_duplicates_amount || 0))}
            </div>
            <span className="text-xs text-purple-400 font-medium">Over-Credit & Retry</span>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            Bank duplicate payout: {fmt(duplicate_entries?.bank_duplicates_amount)} | Platform duplicate retries: {fmt(duplicate_entries?.platform_duplicates_amount)}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Solution: <strong className="text-slate-300">Clawback + Void row</strong></span>
            <span className="text-purple-400 flex items-center gap-0.5 font-medium group-hover:translate-x-1 transition-transform">
              View Items <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* GAP 4: Orphan Refunds */}
        <div 
          onClick={() => onSelectCategory('ORPHAN_REFUND')}
          className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-rose-500/5 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Gap Type 4</span>
                <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                  Orphan Refunds (No Original Charge)
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 text-xs font-semibold">
              {orphan_refunds?.count || 0} debits
            </span>
          </div>

          <div className="mt-3.5 flex items-baseline justify-between">
            <div className="text-xl font-bold text-rose-400">{fmt(orphan_refunds?.total_amount)}</div>
            <span className="text-xs text-rose-400 font-medium">Unaccounted Outflow</span>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {orphan_refunds?.root_cause}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Solution: <strong className="text-slate-300">Dispute audit log match</strong></span>
            <span className="text-rose-400 flex items-center gap-0.5 font-medium group-hover:translate-x-1 transition-transform">
              View Items <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
