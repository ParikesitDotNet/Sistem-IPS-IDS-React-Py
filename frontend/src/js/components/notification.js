/**
 * Toast Notification & Threat Alert Component
 */

let container = null;

function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4';
    document.body.appendChild(container);
  }
}

export function showToast({ title, message, type = 'info', duration = 4500, actionLabel = '', onAction = null }) {
  ensureContainer();

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-4 opacity-0 text-sm';

  const typeStyles = {
    critical: 'bg-[#18131d] border-rose-900/60 text-rose-200 shadow-lg',
    warning: 'bg-[#1c1912] border-amber-900/60 text-amber-200 shadow-lg',
    success: 'bg-[#101b15] border-emerald-900/60 text-emerald-200 shadow-lg',
    info: 'bg-[#131826] border-[#1e2638] text-slate-200 shadow-lg'
  };

  toast.className += ` ${typeStyles[type] || typeStyles.info}`;

  const iconSvg = type === 'critical'
    ? `<svg class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    : `<svg class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="flex-1 min-w-0">
      <h4 class="font-semibold text-xs uppercase tracking-wider">${title}</h4>
      <p class="text-xs opacity-90 mt-0.5">${message}</p>
      ${actionLabel ? `<button class="mt-2 text-xs font-semibold underline hover:opacity-80 action-btn">${actionLabel}</button>` : ''}
    </div>
    <button class="text-slate-400 hover:text-white p-1 close-btn">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  const dismiss = () => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.close-btn').addEventListener('click', dismiss);

  if (actionLabel && onAction) {
    toast.querySelector('.action-btn')?.addEventListener('click', () => {
      onAction();
      dismiss();
    });
  }

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}
