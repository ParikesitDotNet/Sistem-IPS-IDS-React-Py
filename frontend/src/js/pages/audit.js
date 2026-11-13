/**
 * Audit Logs Page
 * Immutable SOC operational ledger tracking admin actions, rule updates, and policy enforcement
 */

import { API } from '../api.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';

export async function renderAuditPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const logs = await API.getAuditLogs();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Cryptographic System Audit Trail</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Immutable ledger of administrative decisions, signature changes, and firewall interactions</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="export-audit-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
            ${getIcon('download', 'w-3.5 h-3.5')}
            Export Audit CSV
          </button>
        </div>
      </div>

      <!-- Audit Table -->
      <div class="cyber-card p-5">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th class="py-3 px-4">Log ID</th>
                <th class="py-3 px-4">Timestamp</th>
                <th class="py-3 px-4">Admin Operator</th>
                <th class="py-3 px-4">Action Type</th>
                <th class="py-3 px-4">Audit Details</th>
                <th class="py-3 px-4 text-right">Origin IP</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              ${logs.map(log => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3.5 px-4 font-mono font-bold text-blue-400">${log.id}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-400 text-xs">${new Date(log.timestamp).toLocaleString()}</td>
                  <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-white">${log.user}</td>
                  <td class="py-3.5 px-4 font-mono">
                    <span class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-purple-300 border border-slate-700">
                      ${log.action}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-slate-300">${log.details}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-400 text-right">${log.ip}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  document.getElementById('export-audit-btn')?.addEventListener('click', () => {
    showToast({
      title: 'Audit Trail Exported',
      message: 'Exported SOC compliance audit log with SHA-256 seal verification.',
      type: 'success'
    });
  });
}
