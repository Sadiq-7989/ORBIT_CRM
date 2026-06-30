import { DndContext } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Deal } from '../../../services/dealService';
import { DealColumn } from './DealColumn';

interface DealBoardProps {
  deals: Deal[];
  onDragEnd: (dealId: string, destinationStage: string) => Promise<void>;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export const PIPELINE_STAGES = ['Lead', 'Contacted', 'Negotiation', 'Won', 'Lost'];

export function DealBoard({ deals, onDragEnd, onEdit, onDelete }: DealBoardProps) {
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;
    const destinationStage = over.id as string;

    // Find the deal to verify if stage has changed
    const deal = deals.find((d) => d.id === dealId);
    if (deal && deal.stage !== destinationStage) {
      onDragEnd(dealId, destinationStage);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-4 w-full select-none scrollbar-thin scroll-smooth items-stretch">
        {PIPELINE_STAGES.map((stage) => {
          // Filter deals belonging to this column stage
          const stageDeals = deals.filter((d) => d.stage === stage);
          
          return (
            <DealColumn
              key={stage}
              stage={stage}
              deals={stageDeals}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </DndContext>
  );
}
