/**
 * Chart.js Integration Module
 * Renders enterprise SOC charts matching the reference design:
 * - Gradient bar & line charts for Network Traffic
 * - Doughnut chart with center metrics for Threat & Severity distribution
 */

import { getTheme } from '../theme.js';

let chartInstances = {};

export function destroyChart(canvasId) {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
    delete chartInstances[canvasId];
  }
}

export function destroyAllCharts() {
  Object.keys(chartInstances).forEach(id => destroyChart(id));
}

// Re-theme charts when theme changes
window.addEventListener('themeChanged', () => {
  // Can trigger re-draws of existing charts if needed
});

export function renderTrafficChart(canvasId, data, timeframe = 'Hourly') {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;

  const ctx = canvas.getContext('2d');
  const isDark = getTheme() === 'dark';

  // Gradient for bars/lines
  const purpleGradient = ctx.createLinearGradient(0, 0, 0, 300);
  purpleGradient.addColorStop(0, 'rgba(147, 51, 234, 0.85)');
  purpleGradient.addColorStop(1, 'rgba(99, 102, 241, 0.2)');

  const blueGradient = ctx.createLinearGradient(0, 0, 0, 300);
  blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
  blueGradient.addColorStop(1, 'rgba(14, 165, 233, 0.1)');

  const chart = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Total Inbound Traffic (Gbps)',
          data: data.inboundTraffic,
          backgroundColor: purpleGradient,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
        {
          label: 'Threats Blocked / Dropped (x100)',
          data: data.blockedTraffic,
          backgroundColor: blueGradient,
          borderRadius: 8,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            color: isDark ? '#94a3b8' : '#64748b',
            font: { family: 'inherit', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.parsed.y} units`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            color: isDark ? '#64748b' : '#94a3b8',
            font: { size: 11 }
          }
        },
        y: {
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            drawBorder: false,
          },
          ticks: {
            color: isDark ? '#64748b' : '#94a3b8',
            font: { size: 11 }
          }
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}

export function renderSeverityDonut(canvasId, severityData) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;

  const ctx = canvas.getContext('2d');
  const isDark = getTheme() === 'dark';

  const chart = new window.Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [
        {
          data: [
            severityData.critical,
            severityData.high,
            severityData.medium,
            severityData.low
          ],
          backgroundColor: [
            '#ef4444', // Red for Critical
            '#f97316', // Orange for High
            '#eab308', // Amber for Medium
            '#8b5cf6'  // Purple/Blue for Low
          ],
          borderWidth: 0,
          hoverOffset: 4,
          borderRadius: 4,
          spacing: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '76%',
      plugins: {
        legend: {
          display: false // We render custom interactive legend matching reference screenshot
        },
        tooltip: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          boxPadding: 4
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}
