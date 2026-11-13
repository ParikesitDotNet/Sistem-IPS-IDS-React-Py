/**
 * Network Traffic Analytics Page
 * Inbound/Outbound bandwidth trends, Top Talkers, and Protocol Distribution
 */

import { API } from '../api.js';
import { renderTrafficChart, destroyChart } from '../components/chart.js';
import { getIcon } from '../components/icons.js';

export async function renderTrafficPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const trafficData = await API.getTrafficTimeseries('hourly');

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Page Header -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Network Traffic & Throughput Analytics</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time bandwidth consumption, protocol profiling, and edge interface saturation</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 text-blue-400 border border-slate-700">
            Aggregation: 60s Sample
          </span>
        </div>
      </div>

      <!-- Bandwidth Metrics Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div class="cyber-card p-4">
          <div class="text-slate-400 text-[10px] uppercase">Peak Ingress</div>
          <div class="text-xl font-bold text-blue-400 mt-1">9.42 Gbps</div>
          <div class="text-[10px] text-slate-500 mt-1">Interface: eth0 (AF_PACKET)</div>
        </div>
        <div class="cyber-card p-4">
          <div class="text-slate-400 text-[10px] uppercase">Peak Egress</div>
          <div class="text-xl font-bold text-purple-400 mt-1">6.85 Gbps</div>
          <div class="text-[10px] text-slate-500 mt-1">Interface: eth1 (WAN Edge)</div>
        </div>
        <div class="cyber-card p-4">
          <div class="text-slate-400 text-[10px] uppercase">DPI Inspection Rate</div>
          <div class="text-xl font-bold text-emerald-400 mt-1">100.0%</div>
          <div class="text-[10px] text-emerald-500 mt-1">Zero bypass bypass packets</div>
        </div>
        <div class="cyber-card p-4">
          <div class="text-slate-400 text-[10px] uppercase">TCP Session Table</div>
          <div class="text-xl font-bold text-amber-400 mt-1">142,890</div>
          <div class="text-[10px] text-slate-500 mt-1">Active concurrent flows</div>
        </div>
      </div>

      <!-- Main Traffic Chart -->
      <div class="cyber-card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h4 class="text-sm font-bold text-white">Aggregated Bandwidth Telemetry</h4>
            <p class="text-xs text-slate-400">Total ingress vs intercepted threat payloads over time</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span class="text-xs text-slate-400 font-mono">Gbps Normalized</span>
          </div>
        </div>
        <div class="h-72 w-full">
          <canvas id="traffic-analytics-chart"></canvas>
        </div>
      </div>

      <!-- Protocol Breakdown & Top Talkers -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Protocol Breakdown (Col 5) -->
        <div class="lg:col-span-5 cyber-card p-5">
          <h4 class="text-sm font-bold text-white mb-3">Protocol Distribution</h4>
          <div class="space-y-3 font-mono text-xs">
            <div>
              <div class="flex justify-between text-slate-300 mb-1">
                <span>HTTPS / TLS (Port 443)</span>
                <span class="font-bold text-blue-400">68.4% (6.4 Gbps)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800">
                <div class="h-full bg-blue-500 rounded-full" style="width: 68.4%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-slate-300 mb-1">
                <span>DNS / DoH (Port 53 / 853)</span>
                <span class="font-bold text-indigo-400">14.2% (1.3 Gbps)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800">
                <div class="h-full bg-indigo-500 rounded-full" style="width: 14.2%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-slate-300 mb-1">
                <span>HTTP / REST (Port 80 / 8080)</span>
                <span class="font-bold text-emerald-400">9.1% (850 Mbps)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800">
                <div class="h-full bg-emerald-500 rounded-full" style="width: 9.1%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-slate-300 mb-1">
                <span>SSH / SFTP (Port 22)</span>
                <span class="font-bold text-amber-400">5.3% (490 Mbps)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800">
                <div class="h-full bg-amber-500 rounded-full" style="width: 5.3%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-slate-300 mb-1">
                <span>Other / QUIC / ICMP</span>
                <span class="font-bold text-purple-400">3.0% (280 Mbps)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800">
                <div class="h-full bg-purple-500 rounded-full" style="width: 3.0%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Talkers (Col 7) -->
        <div class="lg:col-span-7 cyber-card p-5">
          <h4 class="text-sm font-bold text-white mb-3">Top Talkers (Bandwidth Consumers)</h4>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs font-mono">
              <thead>
                <tr class="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th class="py-2 px-3">IP Address</th>
                  <th class="py-2 px-3">Hostname / Service</th>
                  <th class="py-2 px-3">Flows</th>
                  <th class="py-2 px-3">Total Volume</th>
                  <th class="py-2 px-3 text-right">Risk</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr class="hover:bg-slate-800/30">
                  <td class="py-2.5 px-3 text-blue-400 font-bold">10.0.4.15</td>
                  <td class="py-2.5 px-3 text-slate-300">sql-db-cluster-master</td>
                  <td class="py-2.5 px-3 text-slate-400">42,190</td>
                  <td class="py-2.5 px-3 text-emerald-400 font-bold">1.8 TB</td>
                  <td class="py-2.5 px-3 text-right text-emerald-400">Low (4)</td>
                </tr>
                <tr class="hover:bg-slate-800/30">
                  <td class="py-2.5 px-3 text-blue-400 font-bold">10.0.4.12</td>
                  <td class="py-2.5 px-3 text-slate-300">web-frontend-cluster-2</td>
                  <td class="py-2.5 px-3 text-slate-400">38,410</td>
                  <td class="py-2.5 px-3 text-emerald-400 font-bold">1.4 TB</td>
                  <td class="py-2.5 px-3 text-right text-rose-400 font-bold">Critical (88)</td>
                </tr>
                <tr class="hover:bg-slate-800/30">
                  <td class="py-2.5 px-3 text-blue-400 font-bold">192.168.10.142</td>
                  <td class="py-2.5 px-3 text-slate-300">finance-ws-14.corp</td>
                  <td class="py-2.5 px-3 text-slate-400">12,890</td>
                  <td class="py-2.5 px-3 text-slate-300 font-bold">480 GB</td>
                  <td class="py-2.5 px-3 text-right text-rose-400 font-bold">Quarantined (95)</td>
                </tr>
                <tr class="hover:bg-slate-800/30">
                  <td class="py-2.5 px-3 text-blue-400 font-bold">185.220.101.5</td>
                  <td class="py-2.5 px-3 text-slate-300">External TOR Exit Node</td>
                  <td class="py-2.5 px-3 text-slate-400">1,410</td>
                  <td class="py-2.5 px-3 text-rose-400 font-bold">8.4 GB (Dropped)</td>
                  <td class="py-2.5 px-3 text-right text-rose-400 font-bold">Critical (99)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;

  renderTrafficChart('traffic-analytics-chart', trafficData);
}
