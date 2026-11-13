/**
 * Security Reports Page
 * SOC Executive summaries, compliance exports, and scheduled automated report delivery
 */

import { API } from '../api.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';
import { openModal } from '../components/modal.js';

export async function renderReportsPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const reports = await API.getReports();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Security & Incident Reports</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">SOC intelligence summaries, intrusion prevention metrics, and audit documentation</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="generate-report-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            ${getIcon('plus', 'w-3.5 h-3.5')}
            Generate New Report
          </button>
        </div>
      </div>

      <!-- Reports List -->
      <div class="space-y-4">
        ${reports.map(rep => `
          <div class="cyber-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                ${getIcon('reports', 'w-6 h-6')}
              </div>
              <div>
                <span class="text-xs font-mono font-bold text-blue-400">${rep.id}</span>
                <h4 class="text-sm font-bold text-white mt-0.5">${rep.title}</h4>
                <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                  <span>Period: ${rep.period}</span>
                  <span>•</span>
                  <span>Events: ${rep.totalEvents}</span>
                  <span>•</span>
                  <span class="text-rose-400 font-bold">${rep.blockedThreats.toLocaleString()} Blocked</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 w-full md:w-auto justify-end">
              <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 download-btn" data-id="${rep.id}" data-format="PDF">
                ${getIcon('download', 'w-3.5 h-3.5')}
                PDF
              </button>
              <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 download-btn" data-id="${rep.id}" data-format="CSV">
                ${getIcon('download', 'w-3.5 h-3.5')}
                CSV
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  container.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const format = btn.getAttribute('data-format');
      showToast({
        title: 'Report Download Started',
        message: `Compiled ${id} as ${format} document. Downloading...`,
        type: 'success'
      });
    });
  });

  document.getElementById('generate-report-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Generate Custom SOC Threat Report',
      contentHtml: `
        <div class="space-y-3 font-sans">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Report Scope</label>
            <select class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
              <option>Executive Threat Landscape (7 Days)</option>
              <option>Detailed Forensic PCAP & CVE Analysis</option>
              <option>PCI-DSS / ISO-27001 Intrusion Audit Report</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Format</label>
              <select class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
                <option>PDF (Formatted SOC Memo)</option>
                <option>CSV Raw Telemetry</option>
                <option>JSON Machine Readable</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Timeframe</label>
              <select class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      `,
      actionsHtml: `
        <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white" onclick="alert('Report generated and queued.'); document.getElementById('modal-close-btn').click();">Generate</button>
      `
    });
  });
}
