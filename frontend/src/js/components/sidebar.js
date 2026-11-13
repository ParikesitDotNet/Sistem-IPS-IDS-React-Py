/**
 * Sidebar Navigation Component
 * Subdued, minimal enterprise navigation matching real SOC platforms.
 */

import { ICONS, getIcon } from './icons.js';

export const NAV_ITEMS = [
  {
    group: 'MAIN MENU',
    items: [
      { id: 'overview', title: 'Overview', icon: 'overview', path: '#/' },
      { id: 'monitoring', title: 'Live Monitoring', icon: 'monitoring', path: '#/monitoring', badge: 'LIVE', badgeColor: 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' },
      { id: 'alerts', title: 'Security Alerts', icon: 'alerts', path: '#/alerts', badge: '12', badgeColor: 'bg-rose-950/40 text-rose-400 border border-rose-800/40 font-mono font-bold' },
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
    <div class="flex flex-col h-full bg-[#0c1017] border-r border-[#1e2638] transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-60'} select-none">
      
      <!-- Logo Branding -->
      <div class="h-14 px-4 flex items-center justify-between border-b border-[#1e2638]">
        <a href="#/" class="flex items-center gap-2.5 overflow-hidden">
          <div class="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
            ${getIcon('shield', 'w-4 h-4 text-white')}
          </div>
          ${!isCollapsed ? `
            <div class="flex flex-col min-w-0">
              <span class="font-bold text-xs tracking-wider text-slate-100 uppercase">Aegis Defense</span>
              <span class="text-[9px] font-mono text-slate-400 uppercase tracking-widest">IDS / IPS SOC</span>
            </div>
          ` : ''}
        </a>

        <!-- Collapse Toggle -->
        <button id="sidebar-toggle-btn" class="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors hidden lg:block" title="Toggle Sidebar">
          ${isCollapsed ? ICONS.chevronDown : `<svg class="w-3.5 h-3.5 transform rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`}
        </button>
      </div>

      <!-- Navigation Menu Items -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-3 space-y-5">
        ${NAV_ITEMS.map(group => `
          <div>
            ${!isCollapsed ? `
              <div class="px-2.5 mb-1.5 text-[9px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                ${group.group}
              </div>
            ` : '<div class="h-1.5"></div>'}
            
            <ul class="space-y-0.5">
              ${group.items.map(item => {
                const isActive = currentRoute === item.id;
                const activeClasses = isActive
                  ? 'bg-slate-800/90 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40';

                return `
                  <li>
                    <a href="${item.path}" 
                       data-nav-id="${item.id}"
                       title="${item.title}"
                       class="flex items-center ${isCollapsed ? 'justify-center px-1.5' : 'justify-between px-2.5'} py-2 rounded-lg text-xs transition-colors ${activeClasses} group">
                      
                      <div class="flex items-center gap-2.5 min-w-0">
                        <span class="shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}">
                          ${getIcon(item.icon, 'w-4 h-4')}
                        </span>
                        ${!isCollapsed ? `<span class="truncate">${item.title}</span>` : ''}
                      </div>

                      ${(!isCollapsed && item.badge) ? `
                        <span class="text-[9px] px-1.5 py-0.2 rounded font-semibold ${item.badgeColor}">
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

      <!-- User Profile Card at Bottom -->
      <div class="p-2.5 border-t border-[#1e2638] bg-[#0c1017]">
        <div class="flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="relative shrink-0">
              <div class="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-300">
                YP
              </div>
              <span class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0c1017]"></span>
            </div>
            ${!isCollapsed ? `
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-medium text-slate-200 truncate leading-tight">Y. Parikesit</span>
                <span class="text-[10px] text-slate-500 truncate leading-tight">SecOps Lead</span>
              </div>
            ` : ''}
          </div>
          ${!isCollapsed ? `
            <button id="user-quick-menu-btn" class="text-slate-500 hover:text-slate-300 p-1">
              ${ICONS.more}
            </button>
          ` : ''}
        </div>
      </div>

    </div>
  `;
}
