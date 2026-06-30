import { useState } from 'react';

interface DeleteDealDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  dealTitle?: string;
}

export function DeleteDealDialog({ isOpen, onClose, onConfirm, dealTitle }: DeleteDealDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete deal record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 rounded-orbit-modal p-6 w-full max-w-sm shadow-2xl flex flex-col gap-5 z-10 animate-[scaleUp_0.15s_ease-out]">
        
        {/* Header Warning Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error/10 text-error border border-error/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Delete Deal
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">
              This action cannot be undone
            </span>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-3 bg-error/10 text-error border border-error/20 rounded-orbit-button text-xs font-bold">
            {error}
          </div>
        )}

        {/* Content text */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Are you sure you want to delete deal{' '}
          <strong className="font-bold text-slate-800 dark:text-white">
            {dealTitle || 'this record'}
          </strong>
          ? It will be permanently removed from your pipeline directory.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4.5 py-2.5 text-xs font-bold text-gray-500 dark:text-slate-350 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-orbit-button border border-slate-200/30 dark:border-white/5 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4.5 py-2.5 text-xs font-extrabold text-white bg-error hover:bg-error/90 rounded-orbit-button transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer shadow-md shadow-error/10"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
