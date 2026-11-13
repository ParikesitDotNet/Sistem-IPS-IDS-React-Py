/**
 * Prevention Policies Page
 * Inline IPS mitigation rules, auto-block policies, rate limits, and perimeter enforcement
 */

import { API } from '../api.js';
import { createStatusBadge } from '../components/card.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';
import { openModal } from '../components/modal.js';

export async function renderPoliciesPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const policies = await API.getPreventionPolicies();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">IPS Prevention & Mitigation Policies</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Autonomous packet drop, dynamic rate-limiting, and perimeter firewall enforcement</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="add-policy-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            ${getIcon('plus', 'w-3.5 h-3.5')}
            Create Prevention Policy
          </button>
        </div>
      </div>

      <!-- Policies Grid / Table -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${policies.map(pol => `
          <div class="cyber-card p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-blue-400">${pol.id}</span>
                <span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                  pol.status === 'ACTIVE' 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }">
                  ${pol.status}
                </span>
              </div>
              <h4 class="text-sm font-bold text-white mb-1">${pol.name}</h4>
              <p class="text-xs text-slate-400 font-mono mb-4">Type: <span class="text-purple-400 font-semibold">${pol.type}</span></p>

              <div class="space-y-2 text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div class="flex justify-between">
                  <span class="text-slate-500">Condition:</span>
                  <span class="text-slate-300">${pol.triggers}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Applied Interface:</span>
                  <span class="text-slate-300">${pol.appliedTo}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Mitigation Hits:</span>
                  <span class="text-rose-400 font-bold">${pol.hits.toLocaleString()} attacks dropped</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span class="text-[11px] text-slate-500">Auto-Enforcement: Inline</span>
              <button class="px-3 py-1.5 rounded-xl text-xs font-semibold ${
                pol.status === 'ACTIVE' ? 'bg-amber-600/15 text-amber-300 border border-amber-500/30 hover:bg-amber-600/25' : 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/25'
              } transition-colors toggle-policy-btn" data-id="${pol.id}">
                ${pol.status === 'ACTIVE' ? 'Pause Enforcement' : 'Activate Policy'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;

  container.querySelectorAll('.toggle-policy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const res = await API.togglePolicy(id);
      showToast({
        title: 'Policy Updated',
        message: `Policy ${id} is now ${res.policy.status}.`,
        type: 'info'
      });
      renderPoliciesPage();
    });
  });

  document.getElementById('add-policy-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Define New IPS Prevention Policy',
      contentHtml: `
        <div class="space-y-3 font-sans">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Policy Title</label>
            <input type="text" placeholder="e.g. Block Ransomware C2 Domain Resolution" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Enforcement Action</label>
              <select class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white">
                <option>DROP (Inline Silent)</option>
                <option>REJECT (TCP Reset / ICMP Unreachable)</option>
                <option>RATE_LIMIT (Token Bucket)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1">Trigger Threshold</label>
              <input type="text" placeholder="> 50 packets/sec" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white" />
            </div>
          </div>
        </div>
      `,
      actionsHtml: `
        <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white" onclick="alert('Policy active.'); document.getElementById('modal-close-btn').click();">Deploy Policy</button>
      `
    });
  });
}
