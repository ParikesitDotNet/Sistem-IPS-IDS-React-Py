/**
 * Chart.js Integration Module
 * Clean, subdued enterprise SOC charts without exaggerated neon gradients.
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

export function renderTrafficChart(canvasId, data) {
  destroyChart(canvasId);
  const canvas = document.getElementById(canvasId);
  if (!canvas || !window.Chart) return null;

  const ctx = canvas.getContext('2d');
  const isDark = getTheme() === 'dark';

  const chart = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Total Inbound Traffic (Gbps)',
          data: data.inboundTraffic,
          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.85)',
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.55,
          categoryPercentage: 0.8,
        },
        {
          label: 'Threats Blocked / Dropped (x100)',
          data: data.blockedTraffic,
          backgroundColor: isDark ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)',
          borderRadius: 4,
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
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            color: isDark ? '#94a3b8' : '#64748b',
            font: { family: 'inherit', size: 11 }
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? '#1e2638' : '#e2e8f0',
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          boxPadding: 4,
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
            font: { size: 10 }
          }
        },
        y: {
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            drawBorder: false,
          },
          ticks: {
            color: isDark ? '#64748b' : '#94a3b8',
            font: { size: 10 }
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
            '#ef4444', // Red
            '#f97316', // Orange
            '#eab308', // Amber
            '#3b82f6'  // Blue
          ],
          borderColor: isDark ? '#131826' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 3,
          borderRadius: 2,
          spacing: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '74%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#475569',
          borderColor: isDark ? '#1e2638' : '#e2e8f0',
          borderWidth: 1,
          padding: 8,
          cornerRadius: 6,
          boxPadding: 4
        }
      }
    }
  });

  chartInstances[canvasId] = chart;
  return chart;
}
