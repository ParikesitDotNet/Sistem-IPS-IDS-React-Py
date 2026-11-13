/**
 * Detection Rules Page
 * Suricata signature management, SID status toggles, and Rule Editor
 */

import { API } from '../api.js';
import { createStatusBadge } from '../components/card.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';

export async function renderRulesPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const rules = await API.getDetectionRules();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in">
      
      <!-- Top Action Bar -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Suricata IDS Detection Rules</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">48,219 compiled signatures active in memory across Emerging Threats Pro & GPL rule sets</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="add-rule-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
            ${getIcon('plus', 'w-3.5 h-3.5')}
            Create Custom Rule
          </button>
        </div>
      </div>

      <!-- Rules Table -->
      <div class="cyber-card p-5">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                <th class="py-3 px-4">SID</th>
                <th class="py-3 px-4">Rule Name / Signature</th>
                <th class="py-3 px-4">Protocol</th>
                <th class="py-3 px-4">Default Action</th>
                <th class="py-3 px-4">Classification</th>
                <th class="py-3 px-4">Feed Source</th>
                <th class="py-3 px-4">Rev</th>
                <th class="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
              ${rules.map(rule => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors rule-row cursor-pointer" data-sid="${rule.sid}">
                  <td class="py-3.5 px-4 font-mono font-bold text-blue-400">${rule.sid}</td>
                  <td class="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                    <div>${rule.name}</div>
                  </td>
                  <td class="py-3.5 px-4 font-mono uppercase text-slate-300">${rule.protocol}</td>
                  <td class="py-3.5 px-4">${createStatusBadge(rule.action)}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-400 text-[11px]">${rule.classtype}</td>
                  <td class="py-3.5 px-4 text-slate-400 text-[11px]">${rule.source}</td>
                  <td class="py-3.5 px-4 font-mono text-slate-400">r${rule.rev}</td>
                  <td class="py-3.5 px-4 text-right" onclick="event.stopPropagation()">
                    <button class="px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                      rule.enabled 
                        ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    } transition-colors toggle-rule-btn" data-sid="${rule.sid}">
                      ${rule.enabled ? 'ENABLED' : 'DISABLED'}
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

  // Attach toggle rule
  container.querySelectorAll('.toggle-rule-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sid = parseInt(btn.getAttribute('data-sid'));
      const res = await API.toggleDetectionRule(sid);
      showToast({
        title: 'Rule Status Changed',
        message: `SID ${sid} is now ${res.rule.enabled ? 'ENABLED' : 'DISABLED'} on Suricata workers.`,
        type: 'info'
      });
      renderRulesPage();
    });
  });

  // Rule row inspect
  container.querySelectorAll('.rule-row').forEach(row => {
    row.addEventListener('click', () => {
      const sid = parseInt(row.getAttribute('data-sid'));
      const rule = rules.find(r => r.sid === sid);
      if (rule) {
        openModal({
          title: `Suricata Signature Definition: SID ${rule.sid}`,
          contentHtml: `
            <div class="space-y-3 font-sans">
              <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-blue-300">
                ${rule.action} ${rule.protocol} $EXTERNAL_NET any -> $HOME_NET any (msg:"${rule.name}"; classtype:${rule.classtype}; sid:${rule.sid}; rev:${rule.rev};)
              </div>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span class="text-slate-400">Signature Source:</span>
                  <div class="font-bold text-white mt-0.5">${rule.source}</div>
                </div>
                <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                  <span class="text-slate-400">IPS Action:</span>
                  <div class="font-bold text-rose-400 mt-0.5 uppercase">${rule.action}</div>
                </div>
              </div>
            </div>
          `,
          actionsHtml: `
            <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white" onclick="document.getElementById('modal-close-btn').click()">Close</button>
          `
        });
      }
    });
  });

  document.getElementById('add-rule-btn')?.addEventListener('click', () => {
    openModal({
      title: 'Create Custom Suricata Detection Rule',
      contentHtml: `
        <div class="space-y-3 font-sans">
          <div>
            <label class="block text-xs font-medium text-slate-300 mb-1">Suricata Rule Raw Syntax</label>
            <textarea rows="4" class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-emerald-400 focus:outline-none" placeholder="drop tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:&quot;CUSTOM SQL Injection Inbound&quot;; flow:to_server,established; content:&quot;UNION SELECT&quot;; nocase; sid:9000001; rev:1;)"></textarea>
          </div>
        </div>
      `,
      actionsHtml: `
        <button class="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white" onclick="alert('Rule compiled and added to Suricata engine.'); document.getElementById('modal-close-btn').click();">Compile & Deploy</button>
      `
    });
  });
}
