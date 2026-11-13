/**
 * Sensors & Engines Management Page
 * Cluster node health, Suricata process monitoring, and rule reload triggers
 */

import { API } from '../api.js';
import { createStatusBadge } from '../components/card.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';

export async function renderSensorsPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const sensors = await API.getSensors();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Distributed Sensor Cluster & Engines</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-region Suricata capture nodes running AF_PACKET & DPDK zero-copy drivers</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="reload-all-rules-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            ${getIcon('refresh', 'w-3.5 h-3.5')}
            Live Reload Signatures
          </button>
        </div>
      </div>

      <!-- Sensor Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${sensors.map(sen => `
          <div class="cyber-card p-5 space-y-4">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  ${getIcon('server', 'w-5 h-5')}
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white">${sen.name}</h4>
                  <p class="text-xs text-slate-400 font-mono">${sen.location} • ID: ${sen.id}</p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ONLINE
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span class="text-slate-500 text-[10px] uppercase">Throughput</span>
                <div class="text-blue-400 font-bold mt-0.5">${sen.throughput}</div>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] uppercase">Pkt Drop</span>
                <div class="text-emerald-400 font-bold mt-0.5">${sen.dropRate}</div>
              </div>
              <div>
                <span class="text-slate-500 text-[10px] uppercase">Signatures</span>
                <div class="text-slate-300 font-bold mt-0.5">${sen.rules.toLocaleString()}</div>
              </div>
            </div>

            <div class="space-y-2 text-xs font-mono">
              <div>
                <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Worker CPU Core Utilization</span>
                  <span class="text-white">${sen.cpu}%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-slate-800">
                  <div class="h-full bg-blue-500 rounded-full" style="width: ${sen.cpu}%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Ring Buffer Memory</span>
                  <span class="text-white">${sen.mem}%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-slate-800">
                  <div class="h-full bg-indigo-500 rounded-full" style="width: ${sen.mem}%"></div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span class="font-mono text-slate-500 text-[11px]">Capture Interface: <strong class="text-slate-300">${sen.interface}</strong></span>
              <button class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors restart-sensor-btn" data-id="${sen.id}">
                Restart Process
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  document.getElementById('reload-all-rules-btn')?.addEventListener('click', () => {
    showToast({
      title: 'Rule Set Reload Initiated',
      message: 'Broadcasting SIGHUP to Suricata sensors. 48,219 rules reloaded without dropped packets.',
      type: 'success'
    });
  });

  container.querySelectorAll('.restart-sensor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      showToast({
        title: 'Sensor Daemon Restarting',
        message: `Restart command delivered to ${id} via Salt/Ansible orchestrator.`,
        type: 'info'
      });
    });
  });
}
