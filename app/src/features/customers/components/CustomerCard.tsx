import type { Customer } from '../../../services/customerService';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-success bg-success/10 dark:bg-success/20 rounded-full border border-success/20">
            Active
          </span>
        );
      case 'lead':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-warning bg-warning/10 dark:bg-warning/20 rounded-full border border-warning/20">
            Lead
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-error bg-error/10 dark:bg-error/20 rounded-full border border-error/20">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-300/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-5 shadow-sm hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-200 flex flex-col gap-4">
      {/* Title & Actions header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
            {customer.name}
          </h4>
          <span className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold block mt-0.5">
            {customer.company || 'Individual'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="p-1.5 text-slate-450 hover:text-primary hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(customer)}
            className="p-1.5 text-slate-450 hover:text-error hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid Contact Details */}
      <div className="grid grid-cols-2 gap-3 text-[10px]">
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">
            Email
          </span>
          <span className="text-slate-655 dark:text-slate-350 font-semibold truncate block">
            {customer.email || '—'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">
            Phone
          </span>
          <span className="text-slate-655 dark:text-slate-350 font-semibold block">
            {customer.phone || '—'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">
            Source
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-bold block">
            {customer.source || '—'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">
            Status
          </span>
          <div className="mt-0.5">{getStatusBadge(customer.status)}</div>
        </div>
      </div>

      {/* Notes summary */}
      {customer.notes && (
        <div className="pt-2 border-t border-slate-100 dark:border-white/5">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide block mb-1">
            Notes
          </span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
            {customer.notes}
          </p>
        </div>
      )}
    </div>
  );
}
