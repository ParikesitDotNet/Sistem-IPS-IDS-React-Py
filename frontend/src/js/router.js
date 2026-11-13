/**
 * SPA Hash Router
 * Routes across 12 SOC administration views without page reloads.
 */

import { renderSidebar } from './components/sidebar.js';
import { renderTopbar } from './components/topbar.js';
import { destroyAllCharts } from './components/chart.js';

// Page modules
import { renderOverviewPage } from './pages/overview.js';
import { renderLiveMonitoringPage } from './pages/live-monitoring.js';
import { renderAlertsPage } from './pages/alerts.js';
import { renderTrafficPage } from './pages/traffic.js';
import { renderDevicesPage } from './pages/devices.js';
import { renderRulesPage } from './pages/rules.js';
import { renderPoliciesPage } from './pages/policies.js';
import { renderSensorsPage } from './pages/sensors.js';
import { renderReportsPage } from './pages/reports.js';
import { renderUsersPage } from './pages/users.js';
import { renderAuditPage } from './pages/audit.js';
import { renderSettingsPage } from './pages/settings.js';

export const ROUTES = {
  'overview': {
    title: 'Overview',
    subtitle: 'Enterprise SOC Intrusion Detection & Prevention Telemetry',
    render: renderOverviewPage
  },
  'monitoring': {
    title: 'Live Monitoring',
    subtitle: 'Real-time Packet Flow, DPI Engine & Protocol Stream',
    render: renderLiveMonitoringPage
  },
  'alerts': {
    title: 'Security Alerts',
    subtitle: 'Suricata EVE-JSON Threat Incident Triage & Investigation',
    render: renderAlertsPage
  },
  'traffic': {
    title: 'Network Traffic',
    subtitle: 'Throughput Analytics, Protocol Distribution & Top Talkers',
    render: renderTrafficPage
  },
  'devices': {
    title: 'Devices & Assets',
    subtitle: 'Internal Network Assets, Host Risk Scores & 802.1X Quarantine',
    render: renderDevicesPage
  },
  'rules': {
    title: 'Detection Rules',
    subtitle: 'Suricata Signature Sets, Emerging Threats & Custom SIDs',
    render: renderRulesPage
  },
  'policies': {
    title: 'Prevention Policies',
    subtitle: 'Inline IPS Auto-Drop, Rate Limiting & Blacklist Policies',
    render: renderPoliciesPage
  },
  'sensors': {
    title: 'Sensors & Engines',
    subtitle: 'Distributed Suricata Engine Cluster, AF_PACKET & DPDK Nodes',
    render: renderSensorsPage
  },
  'reports': {
    title: 'Reports',
    subtitle: 'Executive Incident Summaries & Compliance Export Center',
    render: renderReportsPage
  },
  'users': {
    title: 'User Management',
    subtitle: 'SOC Team Roster, Role-Based Access Control & Hardware MFA',
    render: renderUsersPage
  },
  'audit': {
    title: 'Audit Logs',
    subtitle: 'Cryptographic Ledger of Administrative & Policy Actions',
    render: renderAuditPage
  },
  'settings': {
    title: 'Settings',
    subtitle: 'DPI Engine Configuration, SIEM Forwarding & Webhook Routing',
    render: renderSettingsPage
  }
};

let currentRouteId = 'overview';
let isSidebarCollapsed = false;

export function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('load', handleRouteChange);
  handleRouteChange();
}

export function getCurrentRoute() {
  return currentRouteId;
}

export function setSidebarCollapsed(collapsed) {
  isSidebarCollapsed = collapsed;
  renderSidebar(currentRouteId, isSidebarCollapsed);
  attachSidebarHandlers();
}

function handleRouteChange() {
  const hash = window.location.hash.replace(/^#\/?/, '').trim();
  const routeKey = hash.split('?')[0] || 'overview';
  
  const route = ROUTES[routeKey] || ROUTES['overview'];
  currentRouteId = routeKey in ROUTES ? routeKey : 'overview';

  // Destroy previous page charts to prevent canvas memory leaks
  destroyAllCharts();

  // Render Topbar & Sidebar
  renderTopbar(route.title, route.subtitle);
  renderSidebar(currentRouteId, isSidebarCollapsed);
  attachSidebarHandlers();

  // Update Page Title
  document.title = `${route.title} — Defense Platform IDS/IPS`;

  // Render View
  route.render();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function attachSidebarHandlers() {
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  toggleBtn?.addEventListener('click', () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  });

  const mobileBtn = document.getElementById('mobile-menu-btn');
  mobileBtn?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const isHidden = sidebar.classList.contains('hidden');
      if (isHidden) {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('fixed', 'inset-y-0', 'left-0', 'z-50', 'shadow-2xl');
      } else {
        sidebar.classList.add('hidden');
        sidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50', 'shadow-2xl');
      }
    }
  });

  // Close mobile sidebar on navigation
  document.querySelectorAll('#sidebar a[data-nav-id]').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('hidden')) {
          sidebar.classList.add('hidden');
          sidebar.classList.remove('fixed', 'inset-y-0', 'left-0', 'z-50');
        }
      }
    });
  });
}
