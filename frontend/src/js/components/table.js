/**
 * Reusable Enterprise Data Table Component
 */

export function createDataTable({
  columns = [], // [{ key, title, render: (row) => string, sortable: bool }]
  rows = [],
  id = '',
  emptyMessage = 'No records found',
  onRowClick = null
}) {
  return `
    <div class="overflow-x-auto custom-scrollbar w-full">
      <table class="w-full text-left text-xs sm:text-sm border-collapse" id="${id}">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono uppercase text-[11px] tracking-wider bg-slate-100/50 dark:bg-slate-900/40">
            ${columns.map(col => `
              <th scope="col" class="py-3 px-4 font-semibold ${col.align === 'right' ? 'text-right' : 'text-left'}">
                ${col.title}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800/60 font-sans">
          ${rows.length === 0 ? `
            <tr>
              <td colspan="${columns.length}" class="py-12 text-center text-slate-400 dark:text-slate-500">
                ${emptyMessage}
              </td>
            </tr>
          ` : rows.map((row, idx) => `
            <tr class="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group" data-row-index="${idx}">
              ${columns.map(col => `
                <td class="py-3.5 px-4 ${col.align === 'right' ? 'text-right' : 'text-left'} text-slate-700 dark:text-slate-300">
                  ${col.render ? col.render(row) : (row[col.key] ?? '')}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
