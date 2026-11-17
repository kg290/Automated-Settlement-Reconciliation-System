const API_BASE = '/api';

export async function fetchLatestRecon() {
  const res = await fetch(`${API_BASE}/reconcile/latest`);
  if (!res.ok) throw new Error('Failed to load latest reconciliation');
  return res.json();
}

export async function fetchGapsSummary() {
  const res = await fetch(`${API_BASE}/reconcile/gaps-summary`);
  if (!res.ok) throw new Error('Failed to load gaps summary');
  return res.json();
}

export async function fetchReconItems({ status, category, search, gapsOnly = false, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (gapsOnly) params.append('gaps_only', 'true');
  params.append('limit', limit);
  params.append('offset', offset);

  const res = await fetch(`${API_BASE}/reconcile/items?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch reconciliation items');
  return res.json();
}

export async function fetchTransactions({ limit = 50, offset = 0, search } = {}) {
  const params = new URLSearchParams();
  params.append('limit', limit);
  params.append('offset', offset);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch internal transactions');
  return res.json();
}

export async function fetchSettlements({ limit = 50, offset = 0, search } = {}) {
  const params = new URLSearchParams();
  params.append('limit', limit);
  params.append('offset', offset);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/settlements?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch bank settlements');
  return res.json();
}

export async function triggerReconciliation(month = 10, year = 2026) {
  const res = await fetch(`${API_BASE}/reconcile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ month, year }),
  });
  if (!res.ok) throw new Error('Reconciliation execution failed');
  return res.json();
}

export async function generateTestData(params = { num_transactions: 1200, month: 10, year: 2026, seed: 42 }) {
  const res = await fetch(`${API_BASE}/data/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to generate test data');
  return res.json();
}

export async function recordAuditAction(payload) {
  const res = await fetch(`${API_BASE}/audit/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to record audit action');
  return res.json();
}

export async function fetchAuditLogs(runId) {
  const url = runId ? `${API_BASE}/audit/logs?run_id=${runId}` : `${API_BASE}/audit/logs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export function getExportUrl() {
  return `${API_BASE}/export`;
}
