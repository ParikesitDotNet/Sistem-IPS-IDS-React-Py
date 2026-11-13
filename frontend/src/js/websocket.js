/**
 * WebSocket & Real-Time Telemetry Stream Manager
 * Switches cleanly between real WebSocket stream (ws://localhost:8000/ws/telemetry)
 * and an in-browser simulated telemetry generator.
 */

import { API_CONFIG, API } from './api.js';

class TelemetryWebSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.simulationInterval = null;
    this.isPaused = false;
  }

  init() {
    if (API_CONFIG.isSimulated) {
      this.startSimulationStream();
    } else {
      this.connectWebSocket();
    }

    // Listen to simulation mode toggle
    window.addEventListener('simulationModeChanged', (e) => {
      this.disconnect();
      if (e.detail.isSimulated) {
        this.startSimulationStream();
      } else {
        this.connectWebSocket();
      }
    });
  }

  connectWebSocket() {
    try {
      this.socket = new WebSocket(API_CONFIG.wsBaseUrl);

      this.socket.onopen = () => {
        console.log('[SOC WS] Connected to live FastAPI Suricata Telemetry Stream');
        this.emit('connection_status', { connected: true, live: true });
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.emit(payload.type || 'packet', payload.data);
        } catch (e) {
          console.error('[SOC WS] Error parsing telemetry message', e);
        }
      };

      this.socket.onclose = () => {
        console.warn('[SOC WS] Telemetry socket closed. Reconnecting in 5s...');
        this.emit('connection_status', { connected: false, live: false });
        setTimeout(() => this.connectWebSocket(), 5000);
      };

      this.socket.onerror = (err) => {
        console.error('[SOC WS] WebSocket error encountered', err);
      };
    } catch (e) {
      console.warn('[SOC WS] Live WebSocket failed to connect. Falling back to simulated stream.', e);
      this.startSimulationStream();
    }
  }

  startSimulationStream() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.emit('connection_status', { connected: true, live: false, simulated: true });

    this.simulationInterval = setInterval(async () => {
      if (this.isPaused) return;

      // 1. Emit live packet
      const packet = await API.getLiveTelemetryStream();
      if (packet) {
        this.emit('packet', packet);
      }

      // 2. Occasionally emit a live security alert (10% chance)
      if (Math.random() < 0.15) {
        const attackTypes = [
          { sig: 'SURICATA Applayer Detect TLS SNI Tor Domain', sev: 'critical', act: 'DROPPED', cve: 'N/A' },
          { sig: 'ET WEB_SERVER Apache HTTP Server Path Traversal (CVE-2021-41773)', sev: 'critical', act: 'BLOCKED', cve: 'CVE-2021-41773' },
          { sig: 'ET POLICY Suspicious Inbound SMB Traffic from Public IP', sev: 'high', act: 'DROPPED', cve: 'N/A' },
          { sig: 'ET DNS Query for Suspicious Dynamic DNS Provider', sev: 'medium', act: 'ALERTED', cve: 'N/A' }
        ];
        const atk = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const simulatedAlert = {
          id: `ALT-${Math.floor(Math.random() * 90000) + 10000}`,
          sid: Math.floor(Math.random() * 800000) + 2000000,
          timestamp: new Date().toISOString(),
          signature: atk.sig,
          severity: atk.sev,
          category: 'Live Attack Intercept',
          srcIp: `198.51.100.${Math.floor(Math.random() * 250) + 2}`,
          srcPort: Math.floor(Math.random() * 40000) + 1024,
          dstIp: '10.0.4.12',
          dstPort: atk.sig.includes('SMB') ? 445 : 443,
          proto: 'TCP',
          action: atk.act,
          sensor: 'Sensor-US-East-01',
          status: 'New',
          cve: atk.cve,
          isLiveSimulation: true
        };
        this.emit('alert', simulatedAlert);
      }
    }, API_CONFIG.simulationSpeedMs);
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      }
    }
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  disconnect() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const telemetryWS = new TelemetryWebSocketManager();
