/**
 * User Management Page
 * SOC analysts, role-based access control (RBAC), and multi-factor authentication (MFA)
 */

import { API } from '../api.js';
import { createStatusBadge } from '../components/card.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';

export async function renderUsersPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const users = await API.getUsers();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">SOC Team & Operator Access Control</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Role-based permissions (RBAC) and hardware-backed FIDO2 / MFA enforcement</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="add-user-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            ${getIcon('plus', 'w-3.5 h-3.5')}
            Invite SOC Analyst
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="cyber-card p-5">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th class="py-3 px-4">Operator / Name</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">MFA Enforced</th>
                <th class="py-3 px-4">Account Status</th>
                <th class="py-3 px-4">Last Activity</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              ${users.map(u => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                        ${u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div class="font-semibold text-slate-900 dark:text-white">${u.name}</div>
                        <div class="text-[11px] text-slate-400 font-mono">${u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-4 font-mono font-medium text-slate-300">${u.role}</td>
                  <td class="py-3.5 px-4">
                    <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      ${getIcon('check', 'w-3.5 h-3.5')} FIDO2 / TOTP
                    </span>
                  </td>
                  <td class="py-3.5 px-4">${createStatusBadge(u.status)}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-400 text-xs">${u.lastActive}</td>
                  <td class="py-3.5 px-4 text-right">
                    <button class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors edit-user-btn" data-id="${u.id}">
                      Edit Permissions
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

  document.getElementById('add-user-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Provision New SOC Analyst Account',
      contentHtml: `
        <div class="space-y-3 font-sans">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input type="text" placeholder="e.g. Alex Mercer" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Corporate Email Address</label>
            <input type="email" placeholder="a.mercer@defense.internal" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
            <select class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
              <option>SOC Analyst Tier-1 (Triage Only)</option>
              <option>SOC Analyst Tier-2 (Rule Management)</option>
              <option>Senior Threat Hunter</option>
              <option>SecOps Administrator (Full IPS Control)</option>
            </select>
          </div>
        </div>
      `,
      actionsHtml: `
        <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white" onclick="alert('Invitation sent with temporary hardware MFA enrollment token.'); document.getElementById('modal-close-btn').click();">Send Invitation</button>
      `
    });
  });
}
