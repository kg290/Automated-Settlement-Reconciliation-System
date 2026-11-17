import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import KpiCards from './components/KpiCards';
import GapsSpotlight from './components/GapsSpotlight';
import WaterfallRecon from './components/WaterfallRecon';
import ReconciliationTable from './components/ReconciliationTable';
import DiscrepancyModal from './components/DiscrepancyModal';
import GeneratorModal from './components/GeneratorModal';
import AuditLogDrawer from './components/AuditLogDrawer';

import { 
  fetchLatestRecon, 
  fetchGapsSummary, 
  fetchReconItems, 
  triggerReconciliation 
} from './services/api';

export default function App() {
  const [latestRun, setLatestRun] = useState(null);
  const [waterfall, setWaterfall] = useState([]);
  const [unexplainedVariance, setUnexplainedVariance] = useState(0);
  const [gapsSummary, setGapsSummary] = useState(null);
  
  // Table state
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [activeFilter, setActiveFilter] = useState('GAPS_ONLY');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [inspectedItem, setInspectedItem] = useState(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isReconciling, setIsReconciling] = useState(false);

  // Load initial data
  useEffect(() => {
    loadAllData();
  }, []);

  // Reload table whenever filters, search, or pagination change
  useEffect(() => {
    loadTableItems();
  }, [offset, activeFilter, searchQuery]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [reconData, gapsData] = await Promise.all([
        fetchLatestRecon(),
        fetchGapsSummary()
      ]);
      setLatestRun(reconData.run);
      setWaterfall(reconData.waterfall);
      setUnexplainedVariance(reconData.unexplained_variance);
      setGapsSummary(gapsData.gaps);
      await loadTableItems();
    } catch (err) {
      console.error('Error loading reconciliation data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTableItems = async () => {
    try {
      const params = {
        limit,
        offset,
        search: searchQuery || undefined,
      };

      if (activeFilter === 'GAPS_ONLY') {
        params.gapsOnly = true;
      } else if (activeFilter === 'TIMING_DIFFERENCE') {
        params.status = 'TIMING_DIFFERENCE';
      } else if (activeFilter === 'ROUNDING_VARIANCE') {
        params.status = 'ROUNDING_VARIANCE';
      } else if (activeFilter === 'DUPLICATE_ENTRY') {
        params.category = 'DUPLICATE_ENTRY';
      } else if (activeFilter === 'ORPHAN_REFUND') {
        params.status = 'ORPHAN_REFUND';
      } else if (activeFilter === 'MATCHED') {
        params.status = 'MATCHED';
      }

      const res = await fetchReconItems(params);
      setItems(res.items);
      setTotalItems(res.total);
    } catch (err) {
      console.error('Error loading table items:', err);
    }
  };

  const handleRunRecon = async () => {
    try {
      setIsReconciling(true);
      await triggerReconciliation(10, 2026);
      await loadAllData();
    } catch (err) {
      alert('Reconciliation failed: ' + err.message);
    } finally {
      setIsReconciling(false);
    }
  };

  const handleSelectGapCategory = (category) => {
    setActiveFilter(category);
    setOffset(0);
    // Smooth scroll to table
    const tableEl = document.getElementById('recon-table-section');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 antialiased">
      
      {/* Top Navigation */}
      <Header
        onRunRecon={handleRunRecon}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        isReconciling={isReconciling}
        latestRun={latestRun}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Executive KPI Overview */}
        <KpiCards 
          run={latestRun} 
          unexplainedVariance={unexplainedVariance} 
        />

        {/* Root Cause Gaps Spotlight */}
        <GapsSpotlight 
          gaps={gapsSummary} 
          onSelectCategory={handleSelectGapCategory} 
        />

        {/* Financial Reconciliation Waterfall Bridge */}
        <WaterfallRecon 
          waterfall={waterfall} 
          unexplainedVariance={unexplainedVariance} 
        />

        {/* Filterable Data Grid */}
        <div id="recon-table-section" className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Reconciliation Data Explorer</h2>
              <p className="text-xs text-slate-400">
                Browse, search, and inspect individual transactions and settlement records.
              </p>
            </div>
          </div>

          <ReconciliationTable
            items={items}
            total={totalItems}
            limit={limit}
            offset={offset}
            onPageChange={(newOffset) => setOffset(newOffset)}
            activeFilter={activeFilter}
            onFilterChange={(newFilter) => {
              setActiveFilter(newFilter);
              setOffset(0);
            }}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setOffset(0);
            }}
            onInspectItem={(item) => setInspectedItem(item)}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <p>Automated Settlement Reconciliation System • Built for Payments & Fintech Platforms</p>
        <p className="mt-1 text-[11px] text-slate-600">Deterministic Multi-Pass Settlement Matching Engine • React + FastAPI + MySQL + Docker</p>
      </footer>

      {/* Inspection Modal */}
      {inspectedItem && (
        <DiscrepancyModal
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
          onActionLogged={() => {
            loadTableItems();
          }}
        />
      )}

      {/* Test Data Generator Modal */}
      {isGeneratorOpen && (
        <GeneratorModal
          onClose={() => setIsGeneratorOpen(false)}
          onGenerated={() => loadAllData()}
        />
      )}

      {/* Audit Log Drawer */}
      <AuditLogDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        runId={latestRun?.run_id}
      />

    </div>
  );
}
