/**
 * Reusable Accessible Modal Component
 */

let activeModal = null;

export function openModal({ title, contentHtml, actionsHtml = '', maxWidth = 'max-w-2xl' }) {
  closeModal();

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const modalEl = document.createElement('div');
  modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in';
  modalEl.id = 'active-modal-container';

  modalEl.innerHTML = `
    <div class="cyber-card w-full ${maxWidth} bg-white dark:bg-[#131826] border border-slate-300 dark:border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          ${title}
        </h3>
        <button id="modal-close-btn" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-sm text-slate-700 dark:text-slate-300">
        ${contentHtml}
      </div>

      <!-- Modal Footer -->
      ${actionsHtml ? `
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          ${actionsHtml}
        </div>
      ` : ''}
    </div>
  `;

  modalRoot.appendChild(modalEl);
  activeModal = modalEl;

  // Event handlers
  const closeBtn = modalEl.querySelector('#modal-close-btn');
  closeBtn?.addEventListener('click', closeModal);

  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.addEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') closeModal();
}

export function closeModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
    document.removeEventListener('keydown', handleEscapeKey);
  }
}
