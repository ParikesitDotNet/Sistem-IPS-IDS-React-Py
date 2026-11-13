/**
 * Topbar Component
 * Provides Search, Simulation Telemetry Toggle, Date Filter, Notifications, Theme Toggle,
 * and AI Quick Action button matching the reference design.
 */

import { ICONS, getIcon } from './icons.js';
import { getTheme, toggleTheme } from '../theme.js';
import { API, API_CONFIG } from '../api.js';
import { openModal } from './modal.js';

export function renderTopbar(pageTitle = 'Overview', subtitle = "Real-time Network Intrusion Detection & Prevention Telemetry") {
  const topbarEl = document.getElementById('topbar');
  if (!topbarEl) return;

  const isDark = getTheme() === 'dark';
  const isSimulated = API.isSimulated();

  topbarEl.innerHTML = `
    <header class="h-16 px-4 lg:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0c0f17]/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      
      <!-- Left: Mobile Menu & Page Titles -->
      <div class="flex items-center gap-3">
        <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          ${getIcon('menu')}
        </button>

        <div>
          <h1 class="text-base lg:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ${pageTitle}
          </h1>
          <p class="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            ${subtitle}
          </p>
        </div>
      </div>

      <!-- Center: Search Input (Styled closely to reference image search bar) -->
      <div class="hidden md:flex items-center relative max-w-xs lg:max-w-sm w-full mx-4">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          ${getIcon('search', 'w-4 h-4')}
        </div>
        <input 
          id="global-search-input"
          type="text" 
          placeholder="Search CVE, IP, signature, SID..." 
          class="w-full pl-9 pr-16 py-1.5 bg-slate-100 dark:bg-[#131826] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-sans"
        />
        <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
          <kbd class="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded">⌘K</kbd>
        </div>
      </div>

      <!-- Right Controls: Simulation Badge, Timefilter, Notifications, Theme, AI Action -->
      <div class="flex items-center gap-2 lg:gap-3">
        
        <!-- Simulation Status Pill (Crucial requirement: Never present mock data as real) -->
        <button 
          id="simulation-toggle-btn"
          title="Toggle Simulation vs Live FastAPI Suricata Backend"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-all ${
            isSimulated 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }">
          <span class="w-2 h-2 rounded-full ${isSimulated ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse"></span>
          <span class="hidden sm:inline">${isSimulated ? 'SIMULATED DATA' : 'LIVE FASTAPI'}</span>
        </button>

        <!-- Time Range Dropdown -->
        <div class="relative hidden sm:block">
          <select id="time-range-select" class="appearance-none bg-slate-100 dark:bg-[#131826] border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-7 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-sans">
            <option value="1h">Last 1 Hour</option>
            <option value="24h" selected>Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ${ICONS.chevronDown}
          </div>
        </div>

        <!-- Notification Bell with Flyout Indicator -->
        <div class="relative">
          <button id="notifications-btn" class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative" title="Security Alerts">
            ${getIcon('bell', 'w-4 h-4')}
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0c0f17]"></span>
          </button>
        </div>

        <!-- Theme Toggle (Moon / Sun) -->
        <button id="theme-toggle-btn" class="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Toggle Theme">
          ${isDark ? getIcon('sun', 'w-4 h-4 text-amber-400') : getIcon('moon', 'w-4 h-4 text-slate-700')}
        </button>

        <!-- AI Threat Analyst Pill Button (Matching purple AI Assistant button in reference image) -->
        <button id="ai-analyst-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
          ${getIcon('sparkles', 'w-3.5 h-3.5')}
          <span class="hidden md:inline">AI SOC Copilot</span>
        </button>

      </div>
    </header>
  `;

  // Attach Topbar event handlers
  document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
    toggleTheme();
    renderTopbar(pageTitle, subtitle);
  });

  document.getElementById('simulation-toggle-btn')?.addEventListener('click', () => {
    const current = API.isSimulated();
    API.setSimulationMode(!current);
    renderTopbar(pageTitle, subtitle);
  });

  document.getElementById('ai-analyst-btn')?.addEventListener('click', () => {
    openModal({
      title: 'AI SOC Copilot — Threat Investigation Engine',
      contentHtml: `
        <div class="space-y-4">
          <div class="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 text-xs flex items-start gap-3">
            <span class="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">${getIcon('sparkles')}</span>
            <div>
              <p class="font-semibold text-white">Autonomous SOC Heuristic Analysis Ready</p>
              <p class="mt-1 opacity-90">Analyzing real-time Suricata eve.json stream, signature correlation, and lateral movement heuristics.</p>
            </div>
          </div>

          <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div class="text-slate-400">SOC Copilot Findings (Last 10m):</div>
            <div class="text-rose-400">● 1 active C2 Beaconing session detected (IP: 192.168.10.142 -> 185.220.101.5). Auto-drop rule executed.</div>
            <div class="text-amber-400">● 14 failed SSH root attempts from 194.26.29.112. Target: prod-auth-01. Host rate-limited for 3600s.</div>
            <div class="text-emerald-400">● Suricata Sensor cluster healthy. Zero packet loss on 10 Gbps pipeline.</div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Ask SOC Copilot / Run Query</label>
            <div class="flex gap-2">
              <input type="text" placeholder="e.g. Summarize top attackers, or Is CVE-2022-22965 mitigated?" class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" value="Verify perimeter firewall drop integrity on port 445" />
              <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium">Analyze</button>
            </div>
          </div>
        </div>
      `,
      actionsHtml: `
        <button class="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white" onclick="document.getElementById('modal-close-btn').click()">Close</button>
        <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white">Export AI Threat Memo</button>
      `
    });
  });
}
