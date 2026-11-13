/**
 * API & Telemetry Service
 * Interfaces with FastAPI Backend (Suricata / PostgreSQL) with high-fidelity Mock Telemetry.
 * NOTE: SIMULATION MODE is clearly labeled across the UI and separated from live API endpoints.
 */

export const API_CONFIG = {
  isSimulated: true, // Default to true until FastAPI backend is connected
  apiBaseUrl: window.__ENV__?.API_BASE_URL || 'http://localhost:8000/api/v1',
  wsBaseUrl: window.__ENV__?.WS_BASE_URL || 'ws://localhost:8000/ws/telemetry',
  simulationSpeedMs: 2500,
};

// Simulation State (In-Memory realistic SOC dataset)
let mockAlerts = [
  {
    id: 'ALT-98214',
    sid: 2024892,
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    signature: 'ET MALWARE Win32/CobaltStrike C2 Beaconing Observed',
    severity: 'critical',
    category: 'Trojan / C2 Communication',
    srcIp: '192.168.10.142',
    srcPort: 49812,
    dstIp: '185.220.101.5',
    dstPort: 443,
    proto: 'TCP/TLS',
    action: 'DROPPED',
    sensor: 'Sensor-US-East-01',
    status: 'Investigating',
    cve: 'CVE-2023-38831',
    payloadHex: '47 45 54 20 2f 61 70 69 2f 76 31 2f 73 79 6e 63 20 48 54 54 50 2f 31 2e 31 0d 0a 48 6f 73 74 3a 20 63 32 2e 64 61 72 6b 6e 65 74 2e 69 6f',
  },
  {
    id: 'ALT-98213',
    sid: 2100498,
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    signature: 'GPL EXPLOIT Spring4Shell RCE (CVE-2022-22965) Payload',
    severity: 'critical',
    category: 'Remote Code Execution',
    srcIp: '45.154.255.89',
    srcPort: 54120,
    dstIp: '10.0.4.12',
    dstPort: 8080,
    proto: 'TCP/HTTP',
    action: 'BLOCKED',
    sensor: 'Sensor-EU-Central-01',
    status: 'New',
    cve: 'CVE-2022-22965',
    payloadHex: '63 6c 61 73 73 2e 6d 6f 64 75 6c 65 2e 63 6c 61 73 73 4c 6f 61 64 65 72 2e 72 65 73 6f 75 72 63 65 73 2e 63 6f 6e 74 65 78 74 2e 70 61 72',
  },
  {
    id: 'ALT-98212',
    sid: 2018921,
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    signature: 'SURICATA SSH Brute Force Login Attempt Threshold Exceeded',
    severity: 'high',
    category: 'Brute Force Attempt',
    srcIp: '194.26.29.112',
    srcPort: 38221,
    dstIp: '10.0.1.5',
    dstPort: 22,
    proto: 'TCP/SSH',
    action: 'DROPPED',
    sensor: 'Sensor-US-East-01',
    status: 'Investigating',
    cve: 'N/A',
    payloadHex: '53 53 48 2d 32 2e 30 2d 4f 70 65 6e 53 53 48 5f 38 2e 32 70 31 20 55 62 75 6e 74 75 2d 34 75 62 75 6e 74 75 30 2e 35',
  },
  {
    id: 'ALT-98211',
    sid: 2031102,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    signature: 'ET SCAN Nmap Scripting Engine User-Agent Detected',
    severity: 'medium',
    category: 'Reconnaissance',
    srcIp: '185.196.8.24',
    srcPort: 41209,
    dstIp: '192.168.1.1',
    dstPort: 443,
    proto: 'TCP/HTTPS',
    action: 'ALERTED',
    sensor: 'Sensor-AP-South-01',
    status: 'Resolved',
    cve: 'N/A',
    payloadHex: '55 73 65 72 2d 41 67 65 6e 74 3a 20 4e 6d 61 70 20 53 63 72 69 70 74 69 6e 67 20 45 6e 67 69 6e 65 0d 0a',
  },
  {
    id: 'ALT-98210',
    sid: 2002194,
    timestamp: new Date(Date.now() - 1000 * 60 * 39).toISOString(),
    signature: 'GPL SQL Injection Attempt via UNION SELECT',
    severity: 'high',
    category: 'Web Application Attack',
    srcIp: '103.145.12.8',
    srcPort: 60124,
    dstIp: '10.0.4.15',
    dstPort: 80,
    proto: 'TCP/HTTP',
    action: 'DROPPED',
    sensor: 'Sensor-EU-Central-01',
    status: 'Resolved',
    cve: 'CWE-89',
    payloadHex: '27 20 55 4e 49 4f 4e 20 53 45 4c 45 43 54 20 6e 75 6c 6c 2c 20 75 73 65 72 6e 61 6d 65 2c 20 70 61 73 73 77 6f 72 64 20 46 52 4f 4d 20 75 73',
  },
  {
    id: 'ALT-98209',
    sid: 2045122,
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    signature: 'DNS Tunneling High Query Frequency (Base64 Subdomain)',
    severity: 'medium',
    category: 'Data Exfiltration',
    srcIp: '192.168.10.88',
    srcPort: 53112,
    dstIp: '8.8.8.8',
    dstPort: 53,
    proto: 'UDP/DNS',
    action: 'ALERTED',
    sensor: 'Sensor-US-East-01',
    status: 'Dismissed',
    cve: 'N/A',
    payloadHex: '61 31 62 32 63 33 64 34 65 35 66 36 2e 73 79 6e 63 2e 63 79 62 65 72 74 65 73 74 2e 69 6e 66 6f',
  },
  {
    id: 'ALT-98208',
    sid: 2001928,
    timestamp: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
    signature: 'ICMP Large Echo Request / Ping of Death Anomaly',
    severity: 'low',
    category: 'Denial of Service',
    srcIp: '91.240.118.4',
    srcPort: 0,
    dstIp: '10.0.1.1',
    dstPort: 0,
    proto: 'ICMP',
    action: 'DROPPED',
    sensor: 'Sensor-AP-South-01',
    status: 'Resolved',
    cve: 'CVE-1999-0128',
    payloadHex: '61 62 63 64 65 66 67 68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77 61 62 63 64 65 66 67 68 69',
  }
];

let mockSensors = [
  { id: 'SEN-01', name: 'Sensor-US-East-01', interface: 'eth0 (AF_PACKET)', location: 'N. Virginia (AWS)', throughput: '3.8 Gbps', dropRate: '0.002%', cpu: 28, mem: 42, rules: 48219, status: 'online' },
  { id: 'SEN-02', name: 'Sensor-EU-Central-01', interface: 'eth0 (AF_PACKET)', location: 'Frankfurt (Equinix)', throughput: '2.4 Gbps', dropRate: '0.001%', cpu: 34, mem: 51, rules: 48219, status: 'online' },
  { id: 'SEN-03', name: 'Sensor-AP-South-01', interface: 'ens18 (DPDK)', location: 'Singapore (DC-2)', throughput: '4.1 Gbps', dropRate: '0.004%', cpu: 46, mem: 58, rules: 48219, status: 'online' },
  { id: 'SEN-04', name: 'Sensor-Corp-HQ-01', interface: 'eth1 (Inline IPS)', location: 'HQ Server Room', throughput: '850 Mbps', dropRate: '0.000%', cpu: 18, mem: 31, rules: 48219, status: 'online' },
];

let mockRules = [
  { sid: 2024892, name: 'ET MALWARE Win32/CobaltStrike C2 Beaconing Observed', protocol: 'tcp', action: 'drop', classtype: 'trojan-activity', rev: 4, enabled: true, source: 'Emerging Threats Pro' },
  { sid: 2100498, name: 'GPL EXPLOIT Spring4Shell RCE (CVE-2022-22965) Payload', protocol: 'tcp', action: 'drop', classtype: 'attempted-admin', rev: 2, enabled: true, source: 'Suricata GPL' },
  { sid: 2018921, name: 'SURICATA SSH Brute Force Login Attempt Threshold Exceeded', protocol: 'tcp', action: 'drop', classtype: 'attempted-user', rev: 8, enabled: true, source: 'Suricata Builtin' },
  { sid: 2031102, name: 'ET SCAN Nmap Scripting Engine User-Agent Detected', protocol: 'tcp', action: 'alert', classtype: 'reconnaissance', rev: 1, enabled: true, source: 'Emerging Threats' },
  { sid: 2002194, name: 'GPL SQL Injection Attempt via UNION SELECT', protocol: 'tcp', action: 'drop', classtype: 'web-application-attack', rev: 12, enabled: true, source: 'Suricata GPL' },
  { sid: 2045122, name: 'DNS Tunneling High Query Frequency (Base64 Subdomain)', protocol: 'udp', action: 'alert', classtype: 'bad-traffic', rev: 3, enabled: true, source: 'Custom SOC' },
  { sid: 2001928, name: 'ICMP Large Echo Request / Ping of Death Anomaly', protocol: 'icmp', action: 'drop', classtype: 'denial-of-service', rev: 5, enabled: true, source: 'Suricata GPL' },
  { sid: 2051190, name: 'ET CURRENT_EVENTS Teramind / Agent Activity', protocol: 'tcp', action: 'alert', classtype: 'policy-violation', rev: 2, enabled: false, source: 'Emerging Threats' },
  { sid: 2011980, name: 'ET EXPLOIT Log4j JNDI LDAP Inbound Probe (CVE-2021-44228)', protocol: 'tcp', action: 'drop', classtype: 'attempted-admin', rev: 15, enabled: true, source: 'Emerging Threats Pro' }
];

let mockPolicies = [
  { id: 'POL-01', name: 'Auto-Block High/Critical C2 Traffic', type: 'IPS Inline Drop', status: 'ACTIVE', triggers: 'Severity >= Critical', appliedTo: 'All External Interfaces', hits: 1420 },
  { id: 'POL-02', name: 'Rate Limiting SSH/RDP Brute Force', type: 'Rate Limiter', status: 'ACTIVE', triggers: '> 10 attempts / 60s', appliedTo: 'Edge DMZ Gateway', hits: 894 },
  { id: 'POL-03', name: 'Tor Exit Node & Known Malicious IP Drop', type: 'Threat Feed Blacklist', status: 'ACTIVE', triggers: 'Daily AlienVault OTX Feed', appliedTo: 'Perimeter Firewall', hits: 3812 },
  { id: 'POL-04', name: 'SQL Injection & XSS Auto-Drop on Web DMZ', type: 'WAF / IPS Hybrid', status: 'ACTIVE', triggers: 'OWASP Core Rule Set', appliedTo: 'Reverse Proxy Cluster', hits: 641 },
  { id: 'POL-05', name: 'Bypass Inspection for Internal Backup VLAN', type: 'Whitelisting Bypass', status: 'PAUSED', triggers: 'VLAN 400 (SAN)', appliedTo: 'Storage Subnet', hits: 0 }
];

let mockDevices = [
  { ip: '10.0.1.5', mac: '00:1A:2B:3C:4D:5E', hostname: 'prod-auth-01.internal', type: 'Server', os: 'Ubuntu 22.04 LTS', risk: 'Low (12/100)', status: 'Monitored', lastSeen: 'Just now' },
  { ip: '10.0.4.12', mac: '00:1A:2B:99:88:77', hostname: 'web-frontend-cluster-2', type: 'Server', os: 'Debian 12', risk: 'Critical (88/100)', status: 'Targeted', lastSeen: '2 min ago' },
  { ip: '192.168.10.142', mac: 'BC:D0:74:11:22:33', hostname: 'finance-ws-14.corp', type: 'Workstation', os: 'Windows 11 Enterprise', risk: 'Critical (95/100)', status: 'Quarantined', lastSeen: '5 min ago' },
  { ip: '192.168.1.1', mac: 'E4:8D:8C:55:66:77', hostname: 'core-router-gw.corp', type: 'Gateway / Router', os: 'Cisco IOS-XE', risk: 'Low (5/100)', status: 'Monitored', lastSeen: 'Just now' },
  { ip: '192.168.10.88', mac: '3C:06:30:AA:BB:CC', hostname: 'research-station-08', type: 'Workstation', os: 'macOS Sonoma', risk: 'Medium (42/100)', status: 'Monitored', lastSeen: '12 min ago' },
  { ip: '10.0.4.15', mac: '00:1A:2B:55:44:33', hostname: 'sql-db-cluster-master', type: 'Database Server', os: 'RHEL 9.2', risk: 'High (71/100)', status: 'Protected', lastSeen: 'Just now' }
];

let mockUsers = [
  { id: 'USR-01', name: 'Yojanna Parikesit', email: 'secops-lead@defense.internal', role: 'SecOps Administrator', mfa: true, status: 'Active', lastActive: 'Now (Current Session)' },
  { id: 'USR-02', name: 'Sarah Chen', email: 's.chen@defense.internal', role: 'Senior Threat Hunter', mfa: true, status: 'Active', lastActive: '14 min ago' },
  { id: 'USR-03', name: 'Marcus Vance', email: 'm.vance@defense.internal', role: 'SOC Analyst Tier-2', mfa: true, status: 'Active', lastActive: '1 hour ago' },
  { id: 'USR-04', name: 'Elena Rostova', email: 'e.rostova@defense.internal', role: 'Security Auditor (Read-Only)', mfa: true, status: 'Active', lastActive: 'Yesterday' }
];

let mockAuditLogs = [
  { id: 'AUD-501', timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(), user: 'Yojanna Parikesit', action: 'POLICY_UPDATE', details: 'Updated IPS Policy POL-01 action from ALERT to DROP', ip: '10.14.2.100' },
  { id: 'AUD-500', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), user: 'Sarah Chen', action: 'RULE_ENABLE', details: 'Enabled Suricata SID: 2100498 (Spring4Shell RCE)', ip: '10.14.2.105' },
  { id: 'AUD-499', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), user: 'Marcus Vance', action: 'ALERT_TRIAGE', details: 'Marked ALT-98210 as RESOLVED with containment verified', ip: '10.14.2.112' },
  { id: 'AUD-498', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), user: 'System Engine', action: 'SURICATA_RELOAD', details: 'Rule set reloaded successfully (48,219 rules compiled)', ip: '127.0.0.1' },
  { id: 'AUD-497', timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), user: 'Yojanna Parikesit', action: 'DEVICE_QUARANTINE', details: 'Triggered automated quarantine on workstation 192.168.10.142', ip: '10.14.2.100' }
];

let mockReports = [
  { id: 'REP-2026-W45', title: 'Weekly SOC Threat Intelligence & IPS Block Summary', period: 'Nov 07 - Nov 13, 2026', totalEvents: '1,492,041', blockedThreats: 18420, criticalIncidents: 4, generatedAt: '2026-11-13 08:00' },
  { id: 'REP-2026-M10', title: 'Monthly Executive Security Posture & Compliance Report', period: 'October 2026', totalEvents: '6,218,900', blockedThreats: 82140, criticalIncidents: 19, generatedAt: '2026-11-01 00:00' },
  { id: 'REP-2026-AUD', title: 'ISO 27001 / SOC-2 Intrusion Prevention Audit Trail', period: 'Q3 2026', totalEvents: '18,400,290', blockedThreats: 241090, criticalIncidents: 38, generatedAt: '2026-10-01 00:00' }
];

let systemSettings = {
  engineMode: 'IPS_INLINE', // 'IDS_PASSIVE' or 'IPS_INLINE'
  suricataVersion: 'Suricata 7.0.4-RELEASE (Inline AF_PACKET)',
  logRetentionDays: 90,
  alertThreshold: 'Medium',
  siemForwarding: true,
  siemHost: 'siem.corp.internal:514 (Syslog/TLS)',
  autoQuarantine: true,
  maxBandwidthInspectionGbps: 10,
  emailAlerts: true,
  slackWebhook: 'https://hooks.slack.com/services/T00/B00/IDS_ALERTS'
};

/* Unified API Interface */
export const API = {
  isSimulated() {
    return API_CONFIG.isSimulated;
  },

  setSimulationMode(val) {
    API_CONFIG.isSimulated = Boolean(val);
    window.dispatchEvent(new CustomEvent('simulationModeChanged', { detail: { isSimulated: API_CONFIG.isSimulated } }));
  },

  async getOverviewMetrics() {
    if (API_CONFIG.isSimulated) {
      return {
        totalAlerts: 24850,
        alertsChange: '+12.4% vs last hour',
        criticalThreats: 12,
        criticalChange: '2 requiring immediate action',
        activeSensors: '4 / 4 Nodes',
        sensorsChange: '100% telemetry coverage',
        blockedTraffic: '99.4%',
        blockedPackets: '18,420 attacks dropped',
        engineStatus: {
          name: 'Suricata IDS/IPS',
          mode: systemSettings.engineMode,
          version: 'v7.0.4 Inline',
          rulesLoaded: 48219,
          dropRate: '0.002%',
          latency: '0.42 ms',
          status: 'ACTIVE'
        },
        systemHealth: {
          cpu: 31,
          ram: 46,
          disk: 58,
          temperature: '42°C',
          status: 'HEALTHY'
        }
      };
    }
    // Live FastAPI endpoint fallback
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/overview/metrics`);
    return await res.json();
  },

  async getTrafficTimeseries(period = 'hourly') {
    if (API_CONFIG.isSimulated) {
      const labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
      return {
        labels,
        inboundTraffic: [42, 58, 35, 85, 92, 78, 64, 52], // Gbps or %
        blockedTraffic: [8, 12, 5, 24, 32, 19, 14, 9],
        normalTraffic: [34, 46, 30, 61, 60, 59, 50, 43]
      };
    }
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/traffic/timeseries?period=${period}`);
    return await res.json();
  },

  async getSeverityDistribution() {
    if (API_CONFIG.isSimulated) {
      return {
        critical: 12,
        high: 48,
        medium: 142,
        low: 380,
        total: 582
      };
    }
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/alerts/severity-distribution`);
    return await res.json();
  },

  async getSecurityAlerts(filters = {}) {
    if (API_CONFIG.isSimulated) {
      let filtered = [...mockAlerts];
      if (filters.severity && filters.severity !== 'all') {
        filtered = filtered.filter(a => a.severity.toLowerCase() === filters.severity.toLowerCase());
      }
      if (filters.action && filters.action !== 'all') {
        filtered = filtered.filter(a => a.action.toLowerCase() === filters.action.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          a.signature.toLowerCase().includes(q) ||
          a.srcIp.includes(q) ||
          a.dstIp.includes(q) ||
          a.id.toLowerCase().includes(q)
        );
      }
      return filtered;
    }
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/alerts?${query}`);
    return await res.json();
  },

  async triageAlert(alertId, newStatus) {
    if (API_CONFIG.isSimulated) {
      const found = mockAlerts.find(a => a.id === alertId);
      if (found) {
        found.status = newStatus;
      }
      return { success: true, alert: found };
    }
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/alerts/${alertId}/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    return await res.json();
  },

  async getLiveTelemetryStream() {
    if (API_CONFIG.isSimulated) {
      // Generate synthetic packet telemetry entries
      const protocols = ['TCP/TLS', 'TCP/HTTP', 'UDP/DNS', 'TCP/SSH', 'ICMP', 'TCP/QUIC'];
      const actions = ['PASSED', 'PASSED', 'PASSED', 'DROPPED', 'ALERTED', 'BLOCKED'];
      const ips = ['192.168.10.14', '10.0.4.5', '172.16.0.42', '45.33.32.156', '185.220.101.5', '8.8.4.4', '142.250.190.46'];
      
      const p = protocols[Math.floor(Math.random() * protocols.length)];
      const act = actions[Math.floor(Math.random() * actions.length)];
      const src = ips[Math.floor(Math.random() * ips.length)];
      const dst = ips[Math.floor(Math.random() * ips.length)];

      return {
        timestamp: new Date().toLocaleTimeString(),
        src: `${src}:${Math.floor(Math.random() * 50000) + 1024}`,
        dst: `${dst}:${p.includes('DNS') ? 53 : p.includes('HTTP') ? 80 : 443}`,
        protocol: p,
        length: `${Math.floor(Math.random() * 1400) + 64} B`,
        action: act,
        threatLevel: act === 'DROPPED' || act === 'BLOCKED' ? 'CRITICAL' : act === 'ALERTED' ? 'SUSPICIOUS' : 'NORMAL'
      };
    }
    return null;
  },

  async getDevices() {
    if (API_CONFIG.isSimulated) return [...mockDevices];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/devices`);
    return await res.json();
  },

  async getDetectionRules() {
    if (API_CONFIG.isSimulated) return [...mockRules];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/rules`);
    return await res.json();
  },

  async toggleDetectionRule(sid) {
    if (API_CONFIG.isSimulated) {
      const rule = mockRules.find(r => r.sid === sid);
      if (rule) rule.enabled = !rule.enabled;
      return { success: true, rule };
    }
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/rules/${sid}/toggle`, { method: 'POST' });
    return await res.json();
  },

  async getPreventionPolicies() {
    if (API_CONFIG.isSimulated) return [...mockPolicies];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/policies`);
    return await res.json();
  },

  async togglePolicy(id) {
    if (API_CONFIG.isSimulated) {
      const policy = mockPolicies.find(p => p.id === id);
      if (policy) policy.status = policy.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      return { success: true, policy };
    }
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/policies/${id}/toggle`, { method: 'POST' });
    return await res.json();
  },

  async getSensors() {
    if (API_CONFIG.isSimulated) return [...mockSensors];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/sensors`);
    return await res.json();
  },

  async getReports() {
    if (API_CONFIG.isSimulated) return [...mockReports];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/reports`);
    return await res.json();
  },

  async getUsers() {
    if (API_CONFIG.isSimulated) return [...mockUsers];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/users`);
    return await res.json();
  },

  async getAuditLogs() {
    if (API_CONFIG.isSimulated) return [...mockAuditLogs];
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/audit-logs`);
    return await res.json();
  },

  async getSettings() {
    if (API_CONFIG.isSimulated) return { ...systemSettings };
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/settings`);
    return await res.json();
  },

  async saveSettings(newSettings) {
    if (API_CONFIG.isSimulated) {
      systemSettings = { ...systemSettings, ...newSettings };
      return { success: true, settings: systemSettings };
    }
    const res = await fetch(`${API_CONFIG.apiBaseUrl}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    return await res.json();
  }
};
