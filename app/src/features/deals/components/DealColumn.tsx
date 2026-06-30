import { useDroppable } from '@dnd-kit/core';
import type { Deal } from '../../../services/dealService';
import { DealCard } from './DealCard';

interface DealColumnProps {
  stage: string;
  deals: Deal[];
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export function DealColumn({ stage, deals, onEdit, onDelete }: DealColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  // Calculate sum of values of all deals in this column
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalValue);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-4 p-4 rounded-orbit-card border transition-all duration-200 min-h-[500px] w-full min-w-[250px] max-w-[320px] ${
        isOver
          ? 'bg-primary/5 border-primary/30 dark:bg-primary/10 dark:border-primary/20 shadow-inner'
          : 'bg-white/10 dark:bg-slate-950/10 border-slate-200/50 dark:border-white/5'
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center pb-2 border-b border-slate-200/40 dark:border-white/5">
        <div>
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
            {stage}
          </h3>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">
            {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
          </span>
        </div>
        <span className="text-xs font-black text-slate-900 dark:text-white bg-white/65 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 px-2.5 py-1 rounded-full shadow-sm">
          {formattedTotal}
        </span>
      </div>

      {/* Column Cards Container */}
      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto max-h-[70vh] scrollbar-thin">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {deals.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200/40 dark:border-white/5 rounded-orbit-card p-6 min-h-[120px] select-none text-center">
            <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider">
              Drop Deals Here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
