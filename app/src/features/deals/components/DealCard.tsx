import { useDraggable } from '@dnd-kit/core';
import type { Deal } from '../../../services/dealService';

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export function DealCard({ deal, onEdit, onDelete }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(deal.value || 0);

  // Format close date: YYYY-MM-DD -> Month DD, YYYY
  const getFormattedDate = (dateString?: string) => {
    if (!dateString) return 'No close date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-4 shadow-sm hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-200 flex flex-col gap-3 group/card ${
        isDragging ? 'opacity-40 border-primary/45 shadow-lg scale-[1.01]' : ''
      }`}
    >
      {/* Top row: Drag handle & Title */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug group-hover/card:text-primary transition-colors truncate">
            {deal.title}
          </h4>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5 truncate">
            {deal.customers?.name || 'Unknown Customer'}
            {deal.customers?.company && ` • ${deal.customers.company}`}
          </span>
        </div>

        {/* Drag Handle element */}
        <div
          {...listeners}
          {...attributes}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-slate-350 dark:text-slate-600 hover:text-slate-655 dark:hover:text-slate-400 rounded transition-colors"
          title="Drag to move stage"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 11-2 2 2 2 0 012-2zm0 6a2 2 0 11-2 2 2 2 0 012-2zm0 6a2 2 0 11-2 2 2 2 0 012-2zm6-12a2 2 0 11-2 2 2 2 0 012-2zm0 6a2 2 0 11-2 2 2 2 0 012-2zm0 6a2 2 0 11-2 2 2 2 0 012-2z" />
          </svg>
        </div>
      </div>

      {/* Middle row: Value & Probability badge */}
      <div className="flex justify-between items-center gap-2 mt-1">
        <span className="text-xs font-black text-slate-800 dark:text-white">
          {formattedValue}
        </span>
        <span
          className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
            deal.probability >= 70
              ? 'bg-success/10 text-success border border-success/15'
              : deal.probability >= 40
              ? 'bg-warning/10 text-warning border border-warning/15'
              : 'bg-primary/10 text-primary border border-primary/15'
          }`}
        >
          {deal.probability}% Prob
        </span>
      </div>

      {/* Bottom row: Close date & Action buttons */}
      <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5 text-[9px] mt-1">
        <div className="flex items-center gap-1 text-slate-450 dark:text-slate-500 font-semibold">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getFormattedDate(deal.expected_close)}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
            title="Edit Deal"
            className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal);
            }}
            title="Delete Deal"
            className="p-1 text-slate-400 hover:text-error hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
