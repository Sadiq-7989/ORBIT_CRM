import { useState, useEffect } from 'react';
import { customerService } from '../../../services/customerService';
import type { Customer } from '../../../services/customerService';
import type { Deal, DealInput } from '../../../services/dealService';
import { PIPELINE_STAGES } from './DealBoard';

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deal: DealInput) => Promise<void>;
  deal?: Deal;
}

export function DealFormModal({ isOpen, onClose, onSubmit, deal }: DealFormModalProps) {
  const [title, setTitle] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [value, setValue] = useState<number>(0);
  const [stage, setStage] = useState('Lead');
  const [probability, setProbability] = useState<number>(10);
  const [expectedClose, setExpectedClose] = useState('');
  const [notes, setNotes] = useState('');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch customers dropdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCustomers(true);
      customerService.getCustomers()
        .then((data) => {
          setCustomers(data);
          if (data.length > 0 && !customerId) {
            // Set default customer selection if creating
            if (!deal) setCustomerId(data[0].id);
          }
        })
        .catch((err) => {
          console.error('Error fetching customers in deals modal:', err);
        })
        .finally(() => {
          setIsLoadingCustomers(false);
        });
    }
  }, [isOpen, deal]);

  // Reset or populate fields when props/open triggers change
  useEffect(() => {
    if (deal) {
      setTitle(deal.title || '');
      setCustomerId(deal.customer_id || '');
      setValue(deal.value || 0);
      setStage(deal.stage || 'Lead');
      setProbability(deal.probability || 10);
      setExpectedClose(deal.expected_close || '');
      setNotes(deal.notes || '');
    } else {
      setTitle('');
      // If there are customers loaded already, pick the first one
      setCustomerId(customers[0]?.id || '');
      setValue(0);
      setStage('Lead');
      setProbability(10);
      setExpectedClose('');
      setNotes('');
    }
    setError('');
  }, [deal, isOpen, customers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Deal title is required.');
      return;
    }

    if (!customerId) {
      setError('Please select a customer to associate with this deal.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        customer_id: customerId,
        value: Number(value) || 0,
        stage,
        probability: Number(probability) || 10,
        expected_close: expectedClose || undefined,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save deal record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Form Container */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 rounded-orbit-modal p-6 md:p-8 w-full max-w-lg shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto z-10 animate-[scaleUp_0.15s_ease-out]">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-white/5">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
            {deal ? 'Edit Deal' : 'Create Deal'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
            </svg>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 bg-error/10 text-error border border-error/20 rounded-orbit-button text-xs font-bold flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Warning if no customers found */}
        {customers.length === 0 && !isLoadingCustomers && (
          <div className="p-4 bg-warning/10 text-warning border border-warning/20 rounded-orbit-button text-xs font-bold leading-relaxed flex flex-col gap-2">
            <span>No Customers Found</span>
            <p className="font-normal text-slate-500 dark:text-slate-400">
              You must create at least one customer inside the Customer Directory before creating a deal.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Deal Title Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="deal-title" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Deal Title *
              </label>
              <input
                id="deal-title"
                type="text"
                placeholder="Enterprise Subscription Expansion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting || customers.length === 0}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
                required
              />
            </div>

            {/* Customer Select dropdown */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="deal-customer" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Customer Name / Account *
              </label>
              <select
                id="deal-customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                disabled={isSubmitting || isLoadingCustomers || customers.length === 0}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
                required
              >
                {isLoadingCustomers ? (
                  <option>Loading customer accounts...</option>
                ) : customers.length === 0 ? (
                  <option value="">No customer accounts available</option>
                ) : (
                  <>
                    <option value="">-- Choose Customer Account --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company ? `(${c.company})` : ''}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Deal Value Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deal-val" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Value (USD) *
              </label>
              <input
                id="deal-val"
                type="number"
                min="0"
                placeholder="45000"
                value={value}
                onChange={(e) => setValue(Number(e.target.value) || 0)}
                disabled={isSubmitting || customers.length === 0}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
                required
              />
            </div>

            {/* Stage Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deal-stage" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Pipeline Stage
              </label>
              <select
                id="deal-stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                disabled={isSubmitting || customers.length === 0}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Expected Close Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deal-close" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Expected Close Date
              </label>
              <input
                id="deal-close"
                type="date"
                value={expectedClose}
                onChange={(e) => setExpectedClose(e.target.value)}
                disabled={isSubmitting || customers.length === 0}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Probability Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deal-prob" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Probability (%) *
              </label>
              <input
                id="deal-prob"
                type="number"
                min="0"
                max="100"
                placeholder="60"
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value) || 0)}
                disabled={isSubmitting || customers.length === 0}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
                required
              />
            </div>

            {/* Notes Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="deal-notes" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Notes
              </label>
              <textarea
                id="deal-notes"
                placeholder="Log progress discussions or customer requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting || customers.length === 0}
                rows={3}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all resize-none"
              />
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-gray-500 dark:text-slate-350 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-orbit-button border border-slate-200/30 dark:border-white/5 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || customers.length === 0}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer border border-white/10 shadow-md shadow-primary/15"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Deal</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
