import { useState, useEffect } from 'react';
import { dealService } from '../services/dealService';
import type { Deal, DealInput } from '../services/dealService';
import { DealBoard } from '../features/deals/components/DealBoard';
import { DealFormModal } from '../features/deals/components/DealFormModal';
import { DeleteDealDialog } from '../features/deals/components/DeleteDealDialog';

export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>(undefined);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await dealService.getDeals();
      setDeals(data);
    } catch (err: any) {
      console.error('Error fetching deals:', err);
      setError(err?.message || 'Failed to retrieve deals records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Modal actions
  const handleOpenAddModal = () => {
    setSelectedDeal(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsDeleteOpen(true);
  };

  // Submit actions
  const handleFormSubmit = async (input: DealInput) => {
    if (selectedDeal) {
      // Edit operation
      const updated = await dealService.updateDeal(selectedDeal.id, input);
      setDeals((prev) => prev.map((d) => (d.id === selectedDeal.id ? updated : d)));
    } else {
      // Create operation
      const created = await dealService.createDeal(input);
      setDeals((prev) => [created, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedDeal) {
      await dealService.deleteDeal(selectedDeal.id);
      setDeals((prev) => prev.filter((d) => d.id !== selectedDeal.id));
    }
  };

  // Drag and drop: Optimistic stage updates with network fallbacks
  const handleDragEnd = async (dealId: string, destinationStage: string) => {
    // Save original deals array for rollback
    const originalDeals = [...deals];

    // Optimistically update stage state
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: destinationStage } : d))
    );

    try {
      await dealService.updateDeal(dealId, { stage: destinationStage });
    } catch (err) {
      console.error('Error updating deal stage in Supabase:', err);
      // Rollback to original state
      setDeals(originalDeals);
      alert('Failed to update stage on database. Reverting pipeline...');
    }
  };

  // Filter deals based on search query (filters by deal title, customer name, or company)
  const filteredDeals = deals.filter((deal) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      deal.title.toLowerCase().includes(query) ||
      (deal.customers?.name && deal.customers.name.toLowerCase().includes(query)) ||
      (deal.customers?.company && deal.customers.company.toLowerCase().includes(query))
    );
  });

  // Calculate total value of the entire pipeline
  const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const formattedPipelineTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalPipelineValue);

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
            Deals Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Drag cards to update deal stages. Track probability and closing dates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="self-start sm:self-center px-4 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Deal</span>
        </button>
      </div>

      {/* 2. Pipeline value & search query dashboard panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/30 dark:bg-slate-950/20 backdrop-blur-sm p-4 border border-slate-200/50 dark:border-white/5 rounded-orbit-card shadow-sm">
        
        {/* Search Input */}
        <div className="relative group w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search deals or accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white dark:focus:bg-slate-950/80 transition-all text-xs"
          />
        </div>

        {/* Total Value Display */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            Pipeline Value
          </span>
          <span className="text-sm font-black text-primary dark:text-white bg-primary/10 dark:bg-slate-950/40 border border-primary/20 dark:border-white/5 px-3 py-1.5 rounded-orbit-button shadow-inner">
            {formattedPipelineTotal}
          </span>
        </div>

      </div>

      {/* 3. Pipeline Content Area */}
      {isLoading ? (
        /* Loading States */
        <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 animate-pulse">
          {['Lead', 'Contacted', 'Negotiation', 'Won', 'Lost'].map((stage, i) => (
            <div key={stage} className="flex flex-col gap-4 bg-slate-100/40 dark:bg-slate-950/20 rounded-orbit-card p-4 border border-slate-200/50 dark:border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-white/5">
                <div className="h-3.5 bg-slate-300 dark:bg-white/10 rounded w-1/2" />
                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded-full w-6" />
              </div>
              <div className="space-y-3">
                {[...Array(i === 0 ? 2 : i === 2 ? 1 : i === 3 ? 2 : 0)].map((_, idx) => (
                  <div key={idx} className="p-4 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-button space-y-3 shadow-sm">
                    <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-5/6" />
                    <div className="h-2 bg-slate-200/60 dark:bg-white/5 rounded w-1/3" />
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="h-3.5 bg-slate-200 dark:bg-white/5 rounded w-10" />
                      <div className="h-5 bg-slate-200 dark:bg-white/5 rounded-full w-10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error banner */
        <div className="p-6 bg-error/10 border border-error/20 rounded-orbit-card text-center flex flex-col items-center gap-3 max-w-md mx-auto my-12">
          <div className="w-10 h-10 rounded-full bg-error/20 text-error flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Database Fetch Failed</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
          <button
            type="button"
            onClick={fetchDeals}
            className="px-4 py-2 text-xs font-bold text-white bg-error rounded-orbit-button hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      ) : filteredDeals.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center select-none">
            <div className="absolute w-36 h-36 rounded-full border border-dashed border-gray-300 dark:border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-gray-300/80 dark:border-white/5 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-base shadow-xl shadow-primary/20">
              D
            </div>
            <div className="absolute w-2.5 h-2.5 rounded-full bg-accent shadow-md shadow-accent/40 top-5 left-10 animate-bounce" />
          </div>

          <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white mb-2 uppercase">
            {searchQuery ? 'No Results Found' : 'No Deals in Pipeline'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
            {searchQuery
              ? `We couldn't find any deals matching "${searchQuery}". Try editing your query.`
              : 'Add your first sales deal to track conversion stage values and close dates.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 transition-all border border-white/10 shadow-md shadow-primary/20 cursor-pointer"
            >
              Create Your First Deal
            </button>
          )}
        </div>
      ) : (
        /* Kanban Board rendering */
        <div className="flex-1 min-h-0 w-full">
          <DealBoard
            deals={filteredDeals}
            onDragEnd={handleDragEnd}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
          />
        </div>
      )}

      {/* Forms & Dialog overlays */}
      <DealFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        deal={selectedDeal}
      />

      <DeleteDealDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        dealTitle={selectedDeal?.title}
      />

    </div>
  );
}
