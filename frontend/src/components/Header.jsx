import React from 'react';
import { 
  Scale, RefreshCw, Database, Download, History, 
  CheckCircle2, AlertTriangle, Calendar
} from 'lucide-react';
import { getExportUrl } from '../services/api';

export default function Header({ 
  onRunRecon, 
  onOpenGenerator, 
  onOpenAudit,
  isReconciling,
  latestRun 
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand & Period */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Scale className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">AutoRecon</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
                Automated Settlement Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Month-End Close: <strong>October 2026</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Run: {latestRun?.run_id || 'RECON_INIT'}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={onOpenGenerator}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Generate Test Data</span>
          </button>

          <button
            onClick={onOpenAudit}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audit Trail</span>
          </button>

          <a
            href={getExportUrl()}
            download
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Report</span>
          </a>

          <button
            onClick={onRunRecon}
            disabled={isReconciling}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
            <span>{isReconciling ? 'Reconciling Books...' : 'Reconcile Books'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
