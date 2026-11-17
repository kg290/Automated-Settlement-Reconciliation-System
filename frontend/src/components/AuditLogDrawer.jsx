import React, { useEffect, useState } from 'react';
import { X, History, User, Clock, CheckCircle2 } from 'lucide-react';
import { fetchAuditLogs } from '../services/api';

export default function AuditLogDrawer({ isOpen, onClose, runId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen, runId]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchAuditLogs(runId);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reconciliation Audit Trail</h3>
              <p className="text-[11px] text-slate-400">Compliance & auditor resolution ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="text-center text-xs text-slate-500 py-10">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-10">
              No audit actions recorded for this run yet.
            </div>
          ) : (
            logs.map((log) => (
              <div 
                key={log.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px]">
                    {log.action_type}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed">
                  {log.notes}
                </p>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3 h-3" />
                    {log.performed_by}
                  </span>
                  {log.item_id && (
                    <span className="font-mono text-slate-400">Item #{log.item_id}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
