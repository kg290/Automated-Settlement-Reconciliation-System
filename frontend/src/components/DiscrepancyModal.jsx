import React, { useState } from 'react';
import { 
  X, CheckCircle, AlertTriangle, Clock, Coins, Copy, 
  AlertOctagon, ArrowRight, ShieldAlert, Send 
} from 'lucide-react';
import { recordAuditAction } from '../services/api';

export default function DiscrepancyModal({ item, onClose, onActionLogged }) {
  if (!item) return null;

  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fmt = (val) => 
    val !== null && val !== undefined
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
      : '—';

  const handleAuditAction = async (actionType) => {
    try {
      setIsSubmitting(true);
      const payload = {
        run_id: item.run_id,
        item_id: item.id,
        action_type: actionType,
        notes: noteText || `Auditor performed: ${actionType} on item #${item.id}`,
        performed_by: 'Senior Financial Auditor'
      };
      await recordAuditAction(payload);
      setSuccessMsg(`Action recorded: ${actionType}`);
      setNoteText('');
      setTimeout(() => {
        setSuccessMsg('');
        if (onActionLogged) onActionLogged();
      }, 1500);
    } catch (err) {
      alert('Error recording audit action: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Discrepancy Inspector</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  Item #{item.id}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Detailed side-by-side reconciliation proof and audit resolution.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Platform Record */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center justify-between">
                <span>Platform Internal Ledger</span>
                <span className="text-[11px] text-slate-500 font-mono">Source: DB</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono text-slate-200 font-medium">{item.internal_txn_id || 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Gross Amount:</span>
                  <span className="font-mono text-slate-100 font-semibold">{fmt(item.platform_amount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Expected Fee:</span>
                  <span className="font-mono text-slate-300">
                    {item.platform_fee !== null ? `$${item.platform_fee.toFixed(4)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Transaction Date:</span>
                  <span className="text-slate-300">
                    {item.platform_date ? new Date(item.platform_date).toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Bank Record */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>Bank Settlement Statement</span>
                <span className="text-[11px] text-slate-500 font-mono">Source: ACH/Wire</span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Settlement ID:</span>
                  <span className="font-mono text-slate-200 font-medium">{item.settlement_id || 'None'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Gross Settled:</span>
                  <span className="font-mono text-slate-100 font-semibold">{fmt(item.bank_amount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Actual Bank Fee:</span>
                  <span className="font-mono text-slate-300">
                    {item.bank_fee !== null ? `$${item.bank_fee.toFixed(4)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Settlement Date:</span>
                  <span className="text-slate-300">
                    {item.settlement_date ? new Date(item.settlement_date).toLocaleString() : '—'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Root Cause & Accounting Recommendation */}
          <div className="bg-slate-850/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Root Cause Analysis</span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {item.root_cause_explanation}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Recommended Accounting Action</span>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {item.recommended_action}
              </p>
            </div>
          </div>

          {/* Audit Resolution Box */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 block">
              Auditor Resolution & Work Notes
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add audit note or adjustment reason..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
              <button
                onClick={() => handleAuditAction('NOTE_ADDED')}
                disabled={isSubmitting || !noteText.trim()}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => handleAuditAction('MARK_RESOLVED')}
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Reconciled</span>
              </button>

              <button
                onClick={() => handleAuditAction('ACCRUE_IN_TRANSIT')}
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Accrue In-Transit Asset</span>
              </button>

              <button
                onClick={() => handleAuditAction('INITIATE_CLAWBACK')}
                disabled={isSubmitting}
                className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Initiate Clawback</span>
              </button>
            </div>

            {successMsg && (
              <div className="p-2 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-medium text-center">
                {successMsg}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
