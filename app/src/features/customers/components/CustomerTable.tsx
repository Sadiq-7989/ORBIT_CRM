import type { Customer } from '../../../services/customerService';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-success bg-success/10 dark:bg-success/20 rounded-full border border-success/20">
            Active
          </span>
        );
      case 'lead':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-warning bg-warning/10 dark:bg-warning/20 rounded-full border border-warning/20">
            Lead
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-error bg-error/10 dark:bg-error/20 rounded-full border border-error/20">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-300/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-orbit-card border border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-slate-950/20 backdrop-blur-sm shadow-sm">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/40">
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Name / Company
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Contact Info
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Source
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Notes
            </th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition-colors duration-150"
            >
              {/* Name & Company */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {customer.name}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium">
                    {customer.company || 'No Company'}
                  </span>
                </div>
              </td>

              {/* Contact Info */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-slate-655 dark:text-slate-300">
                    {customer.email || '—'}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-550">
                    {customer.phone || '—'}
                  </span>
                </div>
              </td>

              {/* Status Badge */}
              <td className="px-6 py-4 vertical-align-middle">
                {getStatusBadge(customer.status)}
              </td>

              {/* Source Badge */}
              <td className="px-6 py-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {customer.source || '—'}
                </span>
              </td>

              {/* Notes preview */}
              <td className="px-6 py-4 max-w-xs truncate">
                <span className="text-xs text-slate-450 dark:text-slate-500">
                  {customer.notes || '—'}
                </span>
              </td>

              {/* Action Buttons */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(customer)}
                    title="Edit Customer"
                    className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(customer)}
                    title="Delete Customer"
                    className="p-1.5 text-slate-450 hover:text-error hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
