/**
 * Devices & Assets Page
 * Asset inventory, endpoint risk scoring, and automated network quarantine controls
 */

import { API } from '../api.js';
import { createStatusBadge } from '../components/card.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';

export async function renderDevicesPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const devices = await API.getDevices();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Protected Devices & Network Assets</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Discovered endpoints, risk profiling, and 802.1X quarantine integration</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="add-asset-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            ${getIcon('plus', 'w-3.5 h-3.5')}
            Add Asset
          </button>
        </div>
      </div>

      <!-- Assets Table -->
      <div class="cyber-card p-5">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th class="py-3 px-4">Hostname</th>
                <th class="py-3 px-4">IP Address</th>
                <th class="py-3 px-4">MAC Address</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4">Operating System</th>
                <th class="py-3 px-4">Risk Score</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              ${devices.map(dev => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">${dev.hostname}</td>
                  <td class="py-3.5 px-4 font-mono text-blue-400 font-medium">${dev.ip}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-400">${dev.mac}</td>
                  <td class="py-3.5 px-4 text-slate-300">${dev.type}</td>
                  <td class="py-3.5 px-4 text-slate-300">${dev.os}</td>
                  <td class="py-3.5 px-4 font-mono font-bold ${dev.risk.includes('Critical') ? 'text-rose-400' : dev.risk.includes('High') ? 'text-amber-400' : 'text-emerald-400'}">
                    ${dev.risk}
                  </td>
                  <td class="py-3.5 px-4">${createStatusBadge(dev.status)}</td>
                  <td class="py-3.5 px-4 text-right">
                    <button class="px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                      dev.status === 'Quarantined' 
                        ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-600/10 text-rose-400 border border-rose-500/20 hover:bg-rose-600/20'
                    } transition-colors quarantine-btn" data-ip="${dev.ip}" data-status="${dev.status}">
                      ${dev.status === 'Quarantined' ? 'Release' : 'Quarantine'}
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

  // Attach quarantine handler
  container.querySelectorAll('.quarantine-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ip = btn.getAttribute('data-ip');
      const current = btn.getAttribute('data-status');
      const newStatus = current === 'Quarantined' ? 'Monitored' : 'Quarantined';
      const dev = devices.find(d => d.ip === ip);
      if (dev) dev.status = newStatus;
      showToast({
        title: 'Device Policy Updated',
        message: `${ip} status updated to ${newStatus}. VLAN isolation applied.`,
        type: newStatus === 'Quarantined' ? 'warning' : 'success'
      });
      renderDevicesPage();
    });
  });

  document.getElementById('add-asset-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Register New Asset to Protection Perimeter',
      contentHtml: `
        <div class="space-y-3 font-sans">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Hostname</label>
            <input type="text" placeholder="e.g. k8s-worker-node-04.prod" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Static IP Address</label>
              <input type="text" placeholder="10.0.4.x" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">MAC Address</label>
              <input type="text" placeholder="00:1A:2B:..." class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Device Role / OS</label>
            <input type="text" placeholder="Linux Server / Ubuntu 24.04" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
          </div>
        </div>
      `,
      actionsHtml: `
        <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white" onclick="alert('Asset added successfully.'); document.getElementById('modal-close-btn').click();">Save Asset</button>
      `
    });
  });
}
