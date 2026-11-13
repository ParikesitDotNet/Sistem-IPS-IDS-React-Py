/**
 * Reusable Card Components
 * Grounded, minimal SOC styling without artificial blur halos or neon glows.
 */

export function createMetricCard({
  title,
  value,
  changeText,
  changeType = 'neutral',
  icon = ''
}) {
  const badgeColors = {
    positive: 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50',
    negative: 'text-rose-400 bg-rose-950/30 border-rose-900/50',
    critical: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
    warning: 'text-amber-400 bg-amber-950/30 border-amber-900/50',
    neutral: 'text-slate-400 bg-slate-900/40 border-slate-800'
  };

  const badgeClass = badgeColors[changeType] || badgeColors.neutral;

  return `
    <div class="cyber-card p-5 flex flex-col justify-between">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium text-slate-400">${title}</span>
        <div class="flex items-center text-slate-500">
          ${icon || `<svg class="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`}
        </div>
      </div>

      <div class="flex items-baseline justify-between">
        <h3 class="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">${value}</h3>
      </div>

      ${changeText ? `
        <div class="mt-3 flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${badgeClass}">
            ${changeText}
          </span>
        </div>
      ` : ''}
    </div>
  `;
}

export function createStatusBadge(status) {
  const map = {
    online: 'bg-emerald-950/30 text-emerald-400 border border-emerald-800/40',
    active: 'bg-blue-950/30 text-blue-400 border border-blue-800/40',
    critical: 'bg-rose-950/40 text-rose-400 border border-rose-800/50 font-semibold',
    high: 'bg-orange-950/30 text-orange-400 border border-orange-800/40',
    medium: 'bg-amber-950/30 text-amber-400 border border-amber-800/40',
    low: 'bg-slate-800 text-slate-300 border border-slate-700',
    dropped: 'bg-rose-950/40 text-rose-300 border border-rose-800/40 font-mono',
    blocked: 'bg-purple-950/40 text-purple-300 border border-purple-800/40 font-mono',
    alerted: 'bg-amber-950/40 text-amber-300 border border-amber-800/40 font-mono',
    passed: 'bg-slate-800 text-emerald-400 border border-slate-700 font-mono',
    quarantined: 'bg-rose-950/50 text-rose-300 border border-rose-800/60 font-semibold'
  };

  const style = map[status.toLowerCase()] || 'bg-slate-800 text-slate-300 border border-slate-700';

  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${style}">${status}</span>`;
}
