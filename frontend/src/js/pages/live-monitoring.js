/**
 * Live Network Monitoring Page
 * Real-time packet telemetry streaming, pause/resume controls, and live protocol feed
 */

import { telemetryWS } from '../websocket.js';
import { createStatusBadge } from '../components/card.js';
import { getIcon } from '../components/icons.js';

let streamBuffer = [];
let unsubscribe = null;
let isPaused = false;

export function renderLiveMonitoringPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  if (unsubscribe) unsubscribe();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Stream Header Controls -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Live Packet Inspection Stream</h3>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time deep packet inspection (DPI) ingested from Suricata AF_PACKET ring buffers</p>
        </div>

        <div class="flex items-center gap-3">
          <button id="stream-pause-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors">
            <span id="pause-icon">${getIcon('monitoring', 'w-3.5 h-3.5')}</span>
            <span id="pause-label">Pause Stream</span>
          </button>
          <button id="stream-clear-btn" class="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors">
            Clear Buffer
          </button>
        </div>
      </div>

      <!-- Quick Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div class="cyber-card p-4">
          <div class="text-slate-500 uppercase tracking-wider text-[10px]">Packets Ingested</div>
          <div class="text-xl font-bold text-blue-400 mt-1" id="stream-counter">0 pkts</div>
        </div>
        <div class="cyber-card p-4">
          <div class="text-slate-500 uppercase tracking-wider text-[10px]">Throughput</div>
          <div class="text-xl font-bold text-emerald-400 mt-1">4.2 Gbps</div>
        </div>
        <div class="cyber-card p-4">
          <div class="text-slate-500 uppercase tracking-wider text-[10px]">Drop Ratio</div>
          <div class="text-xl font-bold text-purple-400 mt-1">0.001 %</div>
        </div>
        <div class="cyber-card p-4">
          <div class="text-slate-500 uppercase tracking-wider text-[10px]">Worker Threads</div>
          <div class="text-xl font-bold text-amber-400 mt-1">32 Cores</div>
        </div>
      </div>

      <!-- Live Streaming Feed Table -->
      <div class="cyber-card p-5">
        <div class="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span class="font-mono">INGESTION BUFFER: <strong class="text-white" id="buffer-size">0</strong> FRAMES</span>
          <span class="text-emerald-400 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> SOCKET HEALTHY</span>
        </div>

        <div class="overflow-x-auto custom-scrollbar max-h-[500px]">
          <table class="w-full text-left text-xs font-mono border-collapse">
            <thead class="sticky top-0 bg-slate-900/90 backdrop-blur-sm z-10">
              <tr class="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th class="py-2.5 px-3">Timestamp</th>
                <th class="py-2.5 px-3">Source IP : Port</th>
                <th class="py-2.5 px-3">Destination IP : Port</th>
                <th class="py-2.5 px-3">Protocol</th>
                <th class="py-2.5 px-3">Payload Size</th>
                <th class="py-2.5 px-3">IPS Decision</th>
                <th class="py-2.5 px-3">Threat Tier</th>
              </tr>
            </thead>
            <tbody id="stream-table-body" class="divide-y divide-slate-800/40">
              <!-- Dynamically populated via WebSocket / simulated telemetry -->
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;

  const tbody = document.getElementById('stream-table-body');
  const bufferCounter = document.getElementById('buffer-size');
  const streamCounter = document.getElementById('stream-counter');
  let totalCount = 0;

  // Stream listener
  unsubscribe = telemetryWS.on('packet', (packet) => {
    if (isPaused || !tbody) return;

    totalCount++;
    streamBuffer.unshift(packet);
    if (streamBuffer.length > 50) streamBuffer.pop();

    if (bufferCounter) bufferCounter.innerText = streamBuffer.length;
    if (streamCounter) streamCounter.innerText = `${totalCount.toLocaleString()} pkts`;

    const row = document.createElement('tr');
    row.className = 'hover:bg-slate-800/40 transition-colors animate-fade-in text-[11px]';
    row.innerHTML = `
      <td class="py-2 px-3 text-slate-400">${packet.timestamp}</td>
      <td class="py-2 px-3 text-blue-400">${packet.src}</td>
      <td class="py-2 px-3 text-purple-400">${packet.dst}</td>
      <td class="py-2 px-3 text-slate-300 font-semibold">${packet.protocol}</td>
      <td class="py-2 px-3 text-slate-400">${packet.length}</td>
      <td class="py-2 px-3">${createStatusBadge(packet.action)}</td>
      <td class="py-2 px-3 font-semibold ${packet.threatLevel === 'CRITICAL' ? 'text-rose-400 font-bold' : packet.threatLevel === 'SUSPICIOUS' ? 'text-amber-400' : 'text-slate-500'}">
        ${packet.threatLevel}
      </td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
    if (tbody.children.length > 50) {
      tbody.removeChild(tbody.lastChild);
    }
  });

  // Controls
  const pauseBtn = document.getElementById('stream-pause-btn');
  pauseBtn?.addEventListener('click', () => {
    isPaused = !isPaused;
    document.getElementById('pause-label').innerText = isPaused ? 'Resume Stream' : 'Pause Stream';
    pauseBtn.classList.toggle('border-blue-500', isPaused);
  });

  document.getElementById('stream-clear-btn')?.addEventListener('click', () => {
    streamBuffer = [];
    if (tbody) tbody.innerHTML = '';
    if (bufferCounter) bufferCounter.innerText = '0';
  });
}
