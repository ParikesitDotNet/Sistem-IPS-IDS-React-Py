/**
 * Main Application Entry Point
 * Orchestrates Theme, Router, WebSocket Stream, and Global Event Listeners
 */

import { initTheme } from './theme.js';
import { initRouter } from './router.js';
import { telemetryWS } from './websocket.js';
import { showToast } from './components/notification.js';
import { openAlertModal } from './pages/overview.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (Dark mode by default matching cybersecurity aesthetic)
  initTheme();

  // 2. Initialize Telemetry Stream (Simulated or Live WebSocket)
  telemetryWS.init();

  // 3. Global Intrusion Alert Notification Hook
  telemetryWS.on('alert', (alert) => {
    if (alert.severity === 'critical') {
      showToast({
        title: `CRITICAL THREAT: ${alert.signature.substring(0, 36)}...`,
        message: `${alert.action} from ${alert.srcIp} &rarr; Target: ${alert.dstIp}`,
        type: 'critical',
        duration: 7000,
        actionLabel: 'Inspect Threat',
        onAction: () => openAlertModal(alert)
      });
    }
  });

  // 4. Initialize Router & mount views
  initRouter();

  // 5. Global Keyboard Shortcuts (⌘K / Ctrl+K for search)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('global-search-input');
      searchInput?.focus();
    }
  });

  console.log('[AEGIS SOC] Defense Platform IDS/IPS Initialized Successfully.');
});
