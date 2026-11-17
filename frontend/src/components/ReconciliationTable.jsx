import React, { useState } from 'react';
import { 
  Search, Filter, Eye, AlertTriangle, CheckCircle2, 
  Clock, Coins, Copy, AlertOctagon, ArrowUpDown, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function ReconciliationTable({ 
  items, 
  total, 
  limit, 
  offset, 
  onPageChange,
  activeFilter, 
  onFilterChange, 
  searchQuery, 
  onSearchChange,
  onInspectItem 
}) {
  const fmt = (val) => 
    val !== null && val !== undefined
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
      : '—';

  const filterTabs = [
    { id: 'ALL', label: 'All Records' },
    { id: 'GAPS_ONLY', label: 'All Gaps', badgeColor: 'bg-amber-500/10 text-amber-400' },
    { id: 'TIMING_DIFFERENCE', label: 'Timing Cut-off', icon: Clock, badgeColor: 'bg-indigo-500/10 text-indigo-400' },
    { id: 'ROUNDING_VARIANCE', label: 'Rounding Drift', icon: Coins, badgeColor: 'bg-amber-500/10 text-amber-400' },
    { id: 'DUPLICATE_ENTRY', label: 'Duplicates', icon: Copy, badgeColor: 'bg-purple-500/10 text-purple-400' },
    { id: 'ORPHAN_REFUND', label: 'Orphan Refunds', icon: AlertOctagon, badgeColor: 'bg-rose-500/10 text-rose-400' },
    { id: 'MATCHED', label: 'Clean Matched', icon: CheckCircle2, badgeColor: 'bg-brand-500/10 text-brand-400' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'MATCHED':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">Matched Clean</span>;
      case 'TIMING_DIFFERENCE':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Timing Lag (Nov)</span>;
      case 'ROUNDING_VARIANCE':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Rounding Drift</span>;
      case 'DUPLICATE_BANK':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">Duplicate Bank Credit</span>;
      case 'DUPLICATE_PLATFORM':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">Duplicate Platform Retry</span>;
      case 'ORPHAN_REFUND':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Orphan Refund</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-slate-700 text-white shadow-sm border border-slate-600' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search txn ID, settlement..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-semibold">
              <th className="py-3 px-4">Status & Category</th>
              <th className="py-3 px-4">Platform Txn ID</th>
              <th className="py-3 px-4">Bank Settlement ID</th>
              <th className="py-3 px-4 text-right">Platform Amt</th>
              <th className="py-3 px-4 text-right">Bank Amt</th>
              <th className="py-3 px-4 text-right">Amount Variance</th>
              <th className="py-3 px-4 text-right">Fee Variance</th>
              <th className="py-3 px-4">Settlement Lag</th>
              <th className="py-3 px-4 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  No records matching the selected filters.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const amtVar = item.amount_variance || 0;
                const feeVar = item.fee_variance || 0;
                const hasAmtMismatch = Math.abs(amtVar) > 0.001;
                const hasFeeMismatch = Math.abs(feeVar) > 0.0001;

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-850/50 transition-colors group cursor-pointer"
                    onClick={() => onInspectItem(item)}
                  >
                    <td className="py-3 px-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.internal_txn_id || <span className="text-slate-600 italic">None (Orphan)</span>}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.settlement_id || <span className="text-slate-600 italic">None (Unsettled)</span>}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      {item.platform_amount !== null ? fmt(item.platform_amount) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-200">
                      {item.bank_amount !== null ? fmt(item.bank_amount) : '—'}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-medium ${
                      hasAmtMismatch 
                        ? amtVar > 0 ? 'text-amber-400' : 'text-purple-400'
                        : 'text-slate-400'
                    }`}>
                      {hasAmtMismatch ? (amtVar > 0 ? `+${fmt(amtVar)}` : fmt(amtVar)) : '$0.00'}
                    </td>
                    <td className={`py-3 px-4 text-right font-mono ${
                      hasFeeMismatch ? 'text-amber-400 font-medium' : 'text-slate-500'
                    }`}>
                      {hasFeeMismatch ? `${feeVar > 0 ? '+' : ''}$${feeVar.toFixed(4)}` : '$0.0000'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.timing_lag_days !== null ? (
                        <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                          item.timing_lag_days > 2 ? 'bg-indigo-500/20 text-indigo-300 font-semibold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          +{item.timing_lag_days}d lag
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectItem(item);
                        }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Inspect discrepancy details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="text-slate-200 font-medium">{Math.min(offset + 1, total)}</span> to{' '}
          <span className="text-slate-200 font-medium">{Math.min(offset + limit, total)}</span> of{' '}
          <span className="text-slate-200 font-medium">{total.toLocaleString()}</span> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(offset - limit)}
            disabled={offset === 0}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(offset + limit)}
            disabled={offset + limit >= total}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
