/**
 * Reusable Card Components
 * Styled with modern cybersecurity aesthetics matching the reference image.
 */

export function createMetricCard({
  title,
  value,
  changeText,
  changeType = 'neutral', // 'positive', 'negative', 'neutral', 'critical'
  icon = '',
  actionMenuId = '',
  sparklineId = ''
}) {
  const badgeColors = {
    positive: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    negative: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    critical: 'text-rose-400 bg-rose-950/60 border-rose-700/60 animate-pulse',
    warning: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    neutral: 'text-blue-400 bg-blue-950/30 border-blue-800/30'
  };

  const badgeClass = badgeColors[changeType] || badgeColors.neutral;

  return `
    <div class="cyber-card p-5 relative overflow-hidden group hover:border-slate-600/60 transition-all duration-300">
      <!-- Glow ambient backdrop on hover -->
      <div class="absolute -right-12 -top-12 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
      
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-400">${title}</span>
        <div class="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
          ${icon || `<svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`}
        </div>
      </div>

      <div class="flex items-baseline justify-between">
        <h3 class="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">${value}</h3>
      </div>

      ${changeText ? `
        <div class="mt-3 flex items-center gap-2">
          <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeClass}">
            ${changeText}
          </span>
        </div>
      ` : ''}

      ${sparklineId ? `<div id="${sparklineId}" class="mt-2 h-6 w-full"></div>` : ''}
    </div>
  `;
}

export function createStatusBadge(status, type = 'default') {
  const map = {
    online: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    active: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    critical: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse',
    high: 'bg-orange-500/20 text-orange-400 border border-orange-500/40',
    medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    low: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    dropped: 'bg-rose-950/60 text-rose-300 border border-rose-800/60 font-mono',
    blocked: 'bg-purple-950/60 text-purple-300 border border-purple-800/60 font-mono',
    alerted: 'bg-amber-950/60 text-amber-300 border border-amber-800/60 font-mono',
    passed: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 font-mono',
    quarantined: 'bg-rose-950/80 text-rose-200 border border-rose-700 font-semibold'
  };

  const style = map[status.toLowerCase()] || 'bg-slate-800 text-slate-300 border border-slate-700';

  return `<span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${style}">${status}</span>`;
}
