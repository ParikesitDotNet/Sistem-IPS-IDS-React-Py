/**
 * Sidebar Navigation Component
 * Features categorized groups, live alert counter badge, user profile card at bottom,
 * and responsive collapsible state matching the reference image.
 */

import { ICONS, getIcon } from './icons.js';

export const NAV_ITEMS = [
  {
    group: 'MAIN MENU',
    items: [
      { id: 'overview', title: 'Overview', icon: 'overview', path: '#/' },
      { id: 'monitoring', title: 'Live Monitoring', icon: 'monitoring', path: '#/monitoring', badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
      { id: 'alerts', title: 'Security Alerts', icon: 'alerts', path: '#/alerts', badge: '12', badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-mono font-bold' },
      { id: 'traffic', title: 'Network Traffic', icon: 'traffic', path: '#/traffic' }
    ]
  },
  {
    group: 'DETECTION & PREVENTION',
    items: [
      { id: 'devices', title: 'Devices & Assets', icon: 'devices', path: '#/devices' },
      { id: 'rules', title: 'Detection Rules', icon: 'rules', path: '#/rules' },
      { id: 'policies', title: 'Prevention Policies', icon: 'policies', path: '#/policies' },
      { id: 'sensors', title: 'Sensors & Engines', icon: 'sensors', path: '#/sensors' }
    ]
  },
  {
    group: 'GOVERNANCE & SYSTEM',
    items: [
      { id: 'reports', title: 'Reports', icon: 'reports', path: '#/reports' },
      { id: 'users', title: 'User Management', icon: 'users', path: '#/users' },
      { id: 'audit', title: 'Audit Logs', icon: 'audit', path: '#/audit' },
      { id: 'settings', title: 'Settings', icon: 'settings', path: '#/settings' }
    ]
  }
];

export function renderSidebar(currentRoute = 'overview', isCollapsed = false) {
  const sidebarEl = document.getElementById('sidebar');
  if (!sidebarEl) return;

  sidebarEl.innerHTML = `
    <div class="flex flex-col h-full bg-slate-900/95 dark:bg-[#0c0f17] border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} select-none">
      
      <!-- Logo Branding (Matches reference image header) -->
      <div class="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
        <a href="#/" class="flex items-center gap-3 overflow-hidden">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
            ${getIcon('shield', 'w-5 h-5 text-white')}
          </div>
          ${!isCollapsed ? `
            <div class="flex flex-col min-w-0">
              <span class="font-bold text-sm text-slate-900 dark:text-white tracking-wide truncate">DEFENSE PLATFORM</span>
              <span class="text-[10px] font-mono text-blue-500 dark:text-blue-400 font-semibold tracking-wider uppercase">SURICATA IDS / IPS</span>
            </div>
          ` : ''}
        </a>

        <!-- Collapse Toggle -->
        <button id="sidebar-toggle-btn" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors hidden lg:block" title="Toggle Sidebar">
          ${isCollapsed ? ICONS.chevronDown : `<svg class="w-4 h-4 transform rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`}
        </button>
      </div>

      <!-- Navigation Menu Items -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
        ${NAV_ITEMS.map(group => `
          <div>
            ${!isCollapsed ? `
              <div class="px-3 mb-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                ${group.group}
              </div>
            ` : '<div class="h-2"></div>'}
            
            <ul class="space-y-1">
              ${group.items.map(item => {
                const isActive = currentRoute === item.id;
                const activeClasses = isActive
                  ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/10 text-blue-400 dark:text-white border border-blue-500/30 dark:border-blue-500/40 shadow-sm shadow-blue-500/10 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent';

                return `
                  <li>
                    <a href="${item.path}" 
                       data-nav-id="${item.id}"
                       title="${item.title}"
                       class="flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-xl text-xs transition-all duration-150 ${activeClasses} group">
                      
                      <div class="flex items-center gap-3 min-w-0">
                        <span class="shrink-0 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-300'} transition-colors">
                          ${getIcon(item.icon, 'w-4 h-4')}
                        </span>
                        ${!isCollapsed ? `<span class="truncate">${item.title}</span>` : ''}
                      </div>

                      ${(!isCollapsed && item.badge) ? `
                        <span class="text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${item.badgeColor}">
                          ${item.badge}
                        </span>
                      ` : ''}
                    </a>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <!-- User Profile Card at Bottom (Matching Reference Image) -->
      <div class="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-900/40">
        <div class="flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-2 rounded-xl hover:bg-slate-800/40 transition-colors">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <div class="w-9 h-9 rounded-full bg-slate-800 border border-blue-500/40 flex items-center justify-center font-bold text-xs text-blue-400">
                YP
              </div>
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0f17]"></span>
            </div>
            ${!isCollapsed ? `
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-semibold text-slate-200 truncate">Yojanna Parikesit</span>
                <span class="text-[10px] text-slate-400 truncate">SecOps Lead</span>
              </div>
            ` : ''}
          </div>
          ${!isCollapsed ? `
            <button id="user-quick-menu-btn" class="text-slate-400 hover:text-slate-200 p-1">
              ${ICONS.more}
            </button>
          ` : ''}
        </div>
      </div>

    </div>
  `;
}
