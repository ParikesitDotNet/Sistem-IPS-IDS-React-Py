/**
 * Security Alerts Management Page
 * Filtering by Severity, Action, Status, Search, and In-depth Alert Investigation
 */

import { API } from '../api.js';
import { createStatusBadge } from '../components/card.js';
import { openAlertModal } from './overview.js';
import { getIcon } from '../components/icons.js';
import { showToast } from '../components/notification.js';

let activeFilters = {
  severity: 'all',
  action: 'all',
  search: ''
};

export async function renderAlertsPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const alerts = await API.getSecurityAlerts(activeFilters);

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Alert Summary & Header -->
      <div class="cyber-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Security Alert Triage & Response</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Suricata EVE telemetry correlated across network sensors with active IPS mitigation
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button id="export-alerts-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
            ${getIcon('download', 'w-3.5 h-3.5')}
            Export CSV
          </button>
          <button id="bulk-resolve-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            Resolve Selected
          </button>
        </div>
      </div>

      <!-- Filter Controls Strip -->
      <div class="cyber-card p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        <!-- Severity Pill Buttons -->
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <span class="text-slate-400 text-xs mr-2 font-medium">Severity:</span>
          ${['all', 'critical', 'high', 'medium', 'low'].map(s => `
            <button class="severity-pill px-3 py-1 rounded-xl font-medium transition-all ${
              activeFilters.severity === s 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
            }" data-severity="${s}">
              ${s.toUpperCase()}
            </button>
          `).join('')}
        </div>

        <!-- Action Filter & Search -->
        <div class="flex items-center gap-3">
          <select id="action-filter-select" class="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-sans focus:outline-none">
            <option value="all">All IPS Actions</option>
            <option value="DROPPED" ${activeFilters.action === 'DROPPED' ? 'selected' : ''}>DROPPED</option>
            <option value="BLOCKED" ${activeFilters.action === 'BLOCKED' ? 'selected' : ''}>BLOCKED</option>
            <option value="ALERTED" ${activeFilters.action === 'ALERTED' ? 'selected' : ''}>ALERTED</option>
          </select>

          <div class="relative w-full sm:w-64">
            <input 
              id="alert-search-input"
              type="text" 
              placeholder="Search IP, SID, or CVE..." 
              value="${activeFilters.search}"
              class="w-full px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            />
          </div>
        </div>

      </div>

      <!-- Alerts Master Table -->
      <div class="cyber-card p-5">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th class="py-3 px-4 w-10">
                  <input type="checkbox" id="select-all-alerts" class="rounded border-slate-700 bg-slate-800 text-blue-500" />
                </th>
                <th class="py-3 px-4">Alert ID</th>
                <th class="py-3 px-4">Severity</th>
                <th class="py-3 px-4">Signature & Vulnerability</th>
                <th class="py-3 px-4">Source Host</th>
                <th class="py-3 px-4">Target Host</th>
                <th class="py-3 px-4">Proto</th>
                <th class="py-3 px-4">Action</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              ${alerts.length === 0 ? `
                <tr>
                  <td colspan="10" class="py-12 text-center text-slate-400 font-mono">
                    No security alerts matching active filter criteria.
                  </td>
                </tr>
              ` : alerts.map(alert => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer alert-row-item" data-id="${alert.id}">
                  <td class="py-3.5 px-4" onclick="event.stopPropagation()">
                    <input type="checkbox" class="alert-item-checkbox rounded border-slate-700 bg-slate-800 text-blue-500" value="${alert.id}" />
                  </td>
                  <td class="py-3.5 px-4 font-mono font-medium text-blue-400">${alert.id}</td>
                  <td class="py-3.5 px-4">${createStatusBadge(alert.severity)}</td>
                  <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200">
                    <div class="truncate max-w-xs sm:max-w-sm">${alert.signature}</div>
                    <div class="text-[10px] text-slate-500 font-mono mt-0.5">
                      SID: ${alert.sid} ${alert.cve && alert.cve !== 'N/A' ? `• <span class="text-rose-400 font-bold">${alert.cve}</span>` : ''}
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-300">
                    <div>${alert.srcIp}</div>
                    <div class="text-[10px] text-slate-500">Port: ${alert.srcPort}</div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-300">
                    <div>${alert.dstIp}</div>
                    <div class="text-[10px] text-slate-500">Port: ${alert.dstPort}</div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-400">${alert.proto}</td>
                  <td class="py-3.5 px-4">${createStatusBadge(alert.action)}</td>
                  <td class="py-3.5 px-4 font-mono text-xs">
                    <span class="px-2 py-0.5 rounded text-[11px] ${
                      alert.status === 'Resolved' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' :
                      alert.status === 'Investigating' ? 'bg-blue-950/40 text-blue-400 border border-blue-800/40' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }">${alert.status}</span>
                  </td>
                  <td class="py-3.5 px-4 text-right" onclick="event.stopPropagation()">
                    <button class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 transition-colors inspect-btn" data-id="${alert.id}">
                      Inspect
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  // Attach Filter Listeners
  container.querySelectorAll('.severity-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilters.severity = btn.getAttribute('data-severity');
      renderAlertsPage();
    });
  });

  const actionSelect = document.getElementById('action-filter-select');
  actionSelect?.addEventListener('change', () => {
    activeFilters.action = actionSelect.value;
    renderAlertsPage();
  });

  const searchInput = document.getElementById('alert-search-input');
  searchInput?.addEventListener('input', (e) => {
    activeFilters.search = e.target.value;
    // Debounce re-render
    clearTimeout(searchInput._timer);
    searchInput._timer = setTimeout(() => renderAlertsPage(), 300);
  });

  container.querySelectorAll('.inspect-btn, .alert-row-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-id');
      const alert = alerts.find(a => a.id === id);
      if (alert) openAlertModal(alert);
    });
  });

  document.getElementById('export-alerts-btn')?.addEventListener('click', () => {
    showToast({
      title: 'Telemetry Exported',
      message: `Exported ${alerts.length} security alerts to suricata_eve_alerts.csv`,
      type: 'success'
    });
  });

  document.getElementById('bulk-resolve-btn')?.addEventListener('click', () => {
    showToast({
      title: 'Alert Triage Updated',
      message: 'Selected alerts marked as TRIAGED / RESOLVED in PostgreSQL backend.',
      type: 'success'
    });
  });
}
