/**
 * System Settings Page
 * Suricata operational mode (Passive IDS vs Inline IPS), SIEM integration, and notification routing
 */

import { API } from '../api.js';
import { showToast } from '../components/notification.js';
import { getIcon } from '../components/icons.js';

export async function renderSettingsPage() {
  const container = document.getElementById('main-content');
  if (!container) return;

  const settings = await API.getSettings();

  container.innerHTML = `
    <div class="space-y-6 animate-fade-in max-w-4xl">
      
      <!-- Page Header -->
      <div class="cyber-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Platform Engine & Integration Settings</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure Suricata DPI inspection modes, Syslog forwarders, and alert sensitivity thresholds</p>
        </div>

        <button id="save-settings-btn" class="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all">
          ${getIcon('check', 'w-3.5 h-3.5')}
          Save Platform Changes
        </button>
      </div>

      <!-- Section 1: Engine Operating Mode -->
      <div class="cyber-card p-5 space-y-4">
        <h4 class="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          ${getIcon('shield', 'w-4 h-4 text-blue-400')}
          Suricata Engine Operating Mode
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label class="cyber-card p-4 flex items-start gap-3 cursor-pointer border hover:border-blue-500/50 transition-colors ${settings.engineMode === 'IPS_INLINE' ? 'border-blue-500/80 bg-blue-950/20' : 'border-slate-800'}">
            <input type="radio" name="engine_mode" value="IPS_INLINE" ${settings.engineMode === 'IPS_INLINE' ? 'checked' : ''} class="mt-1 text-blue-500" />
            <div>
              <div class="font-bold text-xs text-white">IPS Inline Mode (Active Prevention)</div>
              <p class="text-[11px] text-slate-400 mt-1">Packets are actively inspected in-path. Malicious signatures are dropped/rejected before reaching target hosts.</p>
            </div>
          </label>

          <label class="cyber-card p-4 flex items-start gap-3 cursor-pointer border hover:border-blue-500/50 transition-colors ${settings.engineMode === 'IDS_PASSIVE' ? 'border-blue-500/80 bg-blue-950/20' : 'border-slate-800'}">
            <input type="radio" name="engine_mode" value="IDS_PASSIVE" ${settings.engineMode === 'IDS_PASSIVE' ? 'checked' : ''} class="mt-1 text-blue-500" />
            <div>
              <div class="font-bold text-xs text-white">IDS Passive Mode (Detection Tap)</div>
              <p class="text-[11px] text-slate-400 mt-1">SPAN/TAP mirrored traffic inspection only. Telemetry is alerted to SIEM, but packets are not dropped.</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Section 2: Retention & Thresholds -->
      <div class="cyber-card p-5 space-y-4">
        <h4 class="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          ${getIcon('settings', 'w-4 h-4 text-purple-400')}
          Telemetry Sizing & Retention Policy
        </h4>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block font-medium text-slate-300 mb-1">EVE-JSON Log Retention (Days)</label>
            <input type="number" id="setting-retention" value="${settings.logRetentionDays}" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500" />
            <span class="text-[10px] text-slate-500 mt-1 block">PostgreSQL table partition pruning threshold.</span>
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Alerting Trigger Severity</label>
            <select id="setting-threshold" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-sans focus:outline-none focus:border-blue-500">
              <option value="Critical" ${settings.alertThreshold === 'Critical' ? 'selected' : ''}>Critical Only</option>
              <option value="High" ${settings.alertThreshold === 'High' ? 'selected' : ''}>High & Critical</option>
              <option value="Medium" ${settings.alertThreshold === 'Medium' ? 'selected' : ''}>Medium, High & Critical</option>
              <option value="Low" ${settings.alertThreshold === 'Low' ? 'selected' : ''}>All Events (Verbose)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Section 3: SIEM & Forwarding Integrations -->
      <div class="cyber-card p-5 space-y-4">
        <h4 class="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
          ${getIcon('network', 'w-4 h-4 text-emerald-400')}
          SIEM Forwarding & Webhook Channels
        </h4>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-medium text-slate-300 mb-1">Syslog / SIEM Collector Endpoint (TLS)</label>
            <input type="text" id="setting-siem" value="${settings.siemHost}" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label class="block font-medium text-slate-300 mb-1">Incident Webhook URL (Slack / Teams / Discord)</label>
            <input type="text" id="setting-webhook" value="${settings.slackWebhook}" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      </div>

    </div>
  `;

  document.getElementById('save-settings-btn')?.addEventListener('click', async () => {
    const selectedMode = document.querySelector('input[name="engine_mode"]:checked')?.value || 'IPS_INLINE';
    const retention = parseInt(document.getElementById('setting-retention').value) || 90;
    const threshold = document.getElementById('setting-threshold').value;
    const siem = document.getElementById('setting-siem').value;
    const webhook = document.getElementById('setting-webhook').value;

    await API.saveSettings({
      engineMode: selectedMode,
      logRetentionDays: retention,
      alertThreshold: threshold,
      siemHost: siem,
      slackWebhook: webhook
    });

    showToast({
      title: 'Platform Settings Saved',
      message: 'Suricata daemon configuration updated and applied across nodes.',
      type: 'success'
    });
  });
}
