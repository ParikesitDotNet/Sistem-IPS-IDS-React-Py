/**
 * Overview Page Module
 * Primary SOC Dashboard matching the reference design:
 * - 4 Top Metric Cards (Total Alerts, Critical Threats, Active Sensors, Blocked Traffic)
 * - Network Traffic Performance Chart (Left) + Threat Severity Donut Chart (Right)
 * - Suricata IDS/IPS Engine Status Card + System Health Monitor
 * - Recent Security Alerts Interactive Table
 */

import { API } from '../api.js';
import { createMetricCard, createStatusBadge } from '../components/card.js';
import { renderTrafficChart, renderSeverityDonut, destroyAllCharts } from '../components/chart.js';
import { openModal } from '../components/modal.js';
import { ICONS, getIcon } from '../components/icons.js';

export async function renderOverviewPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  // 1. Fetch metrics and data
  const metrics = await API.getOverviewMetrics();
  const trafficData = await API.getTrafficTimeseries('hourly');
  const severityData = await API.getSeverityDistribution();
  const recentAlerts = await API.getSecurityAlerts();

  // 2. Render HTML Layout
  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Metrics Row (Matching 4 card row in reference image) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${createMetricCard({
          title: 'Total Alerts',
          value: metrics.totalAlerts.toLocaleString(),
          changeText: metrics.alertsChange,
          changeType: 'neutral',
          icon: getIcon('alerts', 'w-4 h-4 text-blue-400')
        })}
        ${createMetricCard({
          title: 'Critical Threats',
          value: metrics.criticalThreats.toString(),
          changeText: metrics.criticalChange,
          changeType: 'critical',
          icon: getIcon('shield', 'w-4 h-4 text-rose-500')
        })}
        ${createMetricCard({
          title: 'Active Sensors',
          value: metrics.activeSensors,
          changeText: metrics.sensorsChange,
          changeType: 'positive',
          icon: getIcon('sensors', 'w-4 h-4 text-emerald-400')
        })}
        ${createMetricCard({
          title: 'Blocked Traffic',
          value: metrics.blockedTraffic,
          changeText: metrics.blockedPackets,
          changeType: 'positive',
          icon: getIcon('lock', 'w-4 h-4 text-purple-400')
        })}
      </div>

      <!-- Charts Row (Matches reference image middle section) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left: Network Traffic & Threat Volume Chart (Col 8) -->
        <div class="lg:col-span-8 cyber-card p-5 flex flex-col justify-between">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Network Traffic & Threat Volume</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Total ingress vs intercepted attack payloads</p>
            </div>
            
            <!-- Timeframe Selector Tabs -->
            <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button class="px-3 py-1 font-medium rounded-lg bg-blue-600 text-white shadow-sm timeframe-btn" data-timeframe="hourly">Hourly</button>
              <button class="px-3 py-1 font-medium rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white timeframe-btn" data-timeframe="daily">Daily</button>
              <button class="px-3 py-1 font-medium rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white timeframe-btn" data-timeframe="weekly">Weekly</button>
            </div>
          </div>

          <!-- Canvas Container -->
          <div class="relative w-full h-64 sm:h-72">
            <canvas id="overview-traffic-chart"></canvas>
          </div>
        </div>

        <!-- Right: Threat Severity Distribution Donut Chart (Col 4) (Matching right attendance chart in reference image) -->
        <div class="lg:col-span-4 cyber-card p-5 flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">Threat Severity</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">Classified incident distribution</p>
            </div>
            <span class="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">Live</span>
          </div>

          <!-- Donut chart with centered number -->
          <div class="relative w-full h-48 my-2 flex items-center justify-center">
            <canvas id="overview-severity-chart"></canvas>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-2xl font-bold font-mono text-slate-900 dark:text-white">${severityData.total}</span>
              <span class="text-[10px] uppercase tracking-wider text-slate-400">Total Events</span>
            </div>
          </div>

          <!-- Custom Legend matching screenshot -->
          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <span class="flex items-center gap-1.5 text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</span>
              <span class="font-mono font-bold text-rose-400">${severityData.critical}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <span class="flex items-center gap-1.5 text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High</span>
              <span class="font-mono font-bold text-orange-400">${severityData.high}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <span class="flex items-center gap-1.5 text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium</span>
              <span class="font-mono font-bold text-amber-400">${severityData.medium}</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
              <span class="flex items-center gap-1.5 text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Low</span>
              <span class="font-mono font-bold text-purple-400">${severityData.low}</span>
            </div>
          </div>

          <a href="#/alerts" class="mt-3 block w-full py-2 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors">
            View Incident Details
          </a>
        </div>

      </div>

      <!-- Engine Status & System Health Row -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Suricata Engine Status Card (Col 7) -->
        <div class="lg:col-span-7 cyber-card p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <div class="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                ${getIcon('server', 'w-4 h-4')}
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 dark:text-white">IDS/IPS Engine Status</h3>
                <p class="text-[11px] text-slate-400 font-mono">${metrics.engineStatus.version}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                ${metrics.engineStatus.status}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#0f1420] border border-slate-200 dark:border-[#1e2638]">
              <div class="text-[10px] uppercase font-mono text-slate-500">Mode</div>
              <div class="text-xs font-bold font-mono text-slate-200 mt-0.5">${metrics.engineStatus.mode}</div>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#0f1420] border border-slate-200 dark:border-[#1e2638]">
              <div class="text-[10px] uppercase font-mono text-slate-500">Rules Loaded</div>
              <div class="text-xs font-bold font-mono text-slate-200 mt-0.5">${metrics.engineStatus.rulesLoaded.toLocaleString()}</div>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#0f1420] border border-slate-200 dark:border-[#1e2638]">
              <div class="text-[10px] uppercase font-mono text-slate-500">Drop Rate</div>
              <div class="text-xs font-bold font-mono text-emerald-400 mt-0.5">${metrics.engineStatus.dropRate}</div>
            </div>
            <div class="p-3 rounded-lg bg-slate-50 dark:bg-[#0f1420] border border-slate-200 dark:border-[#1e2638]">
              <div class="text-[10px] uppercase font-mono text-slate-500">Pkt Latency</div>
              <div class="text-xs font-bold font-mono text-slate-300 mt-0.5">${metrics.engineStatus.latency}</div>
            </div>
          </div>
        </div>

        <!-- System Health Progress Gauges (Col 5) -->
        <div class="lg:col-span-5 cyber-card p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                ${getIcon('monitoring', 'w-4 h-4')}
              </div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Sensor Hardware Health</h3>
            </div>
            <span class="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Optimal (42°C)
            </span>
          </div>

          <div class="space-y-3">
            <div>
              <div class="flex justify-between text-xs mb-1 font-mono">
                <span class="text-slate-400">CPU Core Load (Suricata Workers)</span>
                <span class="font-bold text-blue-400">${metrics.systemHealth.cpu}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-blue-500 rounded-full transition-all duration-500" style="width: ${metrics.systemHealth.cpu}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1 font-mono">
                <span class="text-slate-400">Ring Buffer RAM Utilization</span>
                <span class="font-bold text-indigo-400">${metrics.systemHealth.ram}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-indigo-500 rounded-full transition-all duration-500" style="width: ${metrics.systemHealth.ram}%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1 font-mono">
                <span class="text-slate-400">PCAP Storage Disk (NVMe RAID)</span>
                <span class="font-bold text-amber-400">${metrics.systemHealth.disk}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-amber-500 rounded-full transition-all duration-500" style="width: ${metrics.systemHealth.disk}%"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Security Alerts Table (Matches bottom section of reference image) -->
      <div class="cyber-card p-5">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Recent Security Alerts</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Suricata EVE-JSON threat events intercepted across sensors</p>
          </div>
          <div class="flex items-center gap-2">
            <a href="#/alerts" class="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All Alerts &rarr;
            </a>
          </div>
        </div>

        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th class="py-3 px-4">Event ID</th>
                <th class="py-3 px-4">Severity</th>
                <th class="py-3 px-4">Signature / Attack Category</th>
                <th class="py-3 px-4">Source &rarr; Destination</th>
                <th class="py-3 px-4">Proto</th>
                <th class="py-3 px-4">Action</th>
                <th class="py-3 px-4 text-right">Triage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              ${recentAlerts.slice(0, 5).map(alert => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors alert-row cursor-pointer" data-alert-id="${alert.id}">
                  <td class="py-3.5 px-4 font-mono font-medium text-blue-400">${alert.id}</td>
                  <td class="py-3.5 px-4">${createStatusBadge(alert.severity)}</td>
                  <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200">
                    <div class="truncate max-w-xs sm:max-w-md">${alert.signature}</div>
                    <div class="text-[10px] text-slate-500 font-mono">${alert.category} • SID: ${alert.sid}</div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-400">
                    <div>${alert.srcIp}:${alert.srcPort}</div>
                    <div class="text-slate-500 text-[10px]">&rarr; ${alert.dstIp}:${alert.dstPort}</div>
                  </td>
                  <td class="py-3.5 px-4 font-mono text-slate-300">${alert.proto}</td>
                  <td class="py-3.5 px-4">${createStatusBadge(alert.action)}</td>
                  <td class="py-3.5 px-4 text-right">
                    <button class="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors view-alert-btn" data-id="${alert.id}">
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

  // 3. Mount Charts
  renderTrafficChart('overview-traffic-chart', trafficData);
  renderSeverityDonut('overview-severity-chart', severityData);

  // 4. Attach event listeners
  container.querySelectorAll('.view-alert-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const alert = recentAlerts.find(a => a.id === id);
      if (alert) openAlertModal(alert);
    });
  });

  container.querySelectorAll('.alert-row').forEach(row => {
    row.addEventListener('click', () => {
      const id = row.getAttribute('data-alert-id');
      const alert = recentAlerts.find(a => a.id === id);
      if (alert) openAlertModal(alert);
    });
  });
}

export function openAlertModal(alert) {
  openModal({
    title: `Security Alert Inspection: ${alert.id}`,
    contentHtml: `
      <div class="space-y-4">
        <div class="p-4 rounded-xl ${alert.severity === 'critical' ? 'bg-rose-950/40 border border-rose-800/40' : 'bg-slate-900 border border-slate-800'}">
          <div class="flex items-center justify-between">
            ${createStatusBadge(alert.severity)}
            <span class="text-xs font-mono text-slate-400">${new Date(alert.timestamp).toLocaleString()}</span>
          </div>
          <h4 class="text-sm font-bold text-white mt-2">${alert.signature}</h4>
          <p class="text-xs text-slate-400 mt-1">${alert.category} • Action Taken: <span class="font-bold font-mono text-white">${alert.action}</span></p>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs font-mono">
          <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div class="text-slate-500">Source Host</div>
            <div class="text-blue-400 font-bold mt-0.5">${alert.srcIp}:${alert.srcPort}</div>
            <div class="text-slate-500 text-[10px] mt-1">Sensor: ${alert.sensor}</div>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div class="text-slate-500">Destination Target</div>
            <div class="text-purple-400 font-bold mt-0.5">${alert.dstIp}:${alert.dstPort}</div>
            <div class="text-slate-500 text-[10px] mt-1">Protocol: ${alert.proto}</div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Raw Packet Payload (Hex Dump)</span>
            <span class="font-mono text-[10px]">Suricata Rule SID: ${alert.sid}</span>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all">
            ${alert.payloadHex || '45 00 00 3c 1c 46 40 00 40 06 b1 e6 c0 a8 01 02 c0 a8 01 01 04 00 00 50'}
          </div>
        </div>

        ${alert.cve && alert.cve !== 'N/A' ? `
          <div class="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-blue-300 text-xs flex items-center justify-between">
            <span>Associated Vulnerability: <strong class="font-mono">${alert.cve}</strong></span>
            <a href="https://nvd.nist.gov/vuln/detail/${alert.cve}" target="_blank" class="underline hover:text-white">NVD Advisory &rarr;</a>
          </div>
        ` : ''}
      </div>
    `,
    actionsHtml: `
      <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30" onclick="alert('Host ${alert.srcIp} added to active firewall blacklist.')">
        Block & Quarantine IP
      </button>
      <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white" onclick="document.getElementById('modal-close-btn').click()">
        Mark as Investigating
      </button>
    `
  });
}
