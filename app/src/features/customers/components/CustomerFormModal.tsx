import { useState, useEffect } from 'react';
import type { Customer, CustomerInput } from '../../../services/customerService';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: CustomerInput) => Promise<void>;
  customer?: Customer;
}

export function CustomerFormModal({ isOpen, onClose, onSubmit, customer }: CustomerFormModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('Lead');
  const [source, setSource] = useState('Referral');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset or populate fields when open/customer props change
  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setCompany(customer.company || '');
      setStatus(customer.status || 'Lead');
      setSource(customer.source || 'Referral');
      setNotes(customer.notes || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setStatus('Lead');
      setSource('Referral');
      setNotes('');
    }
    setError('');
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        status,
        source,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save customer record.');
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
            {customer ? 'Edit Customer' : 'Add Customer'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="modal-name" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Full Name *
              </label>
              <input
                id="modal-name"
                type="text"
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
                required
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-email" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
              <input
                id="modal-email"
                type="email"
                placeholder="sarah@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-phone" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Phone Number
              </label>
              <input
                id="modal-phone"
                type="tel"
                placeholder="+1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Company Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-company" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Company
              </label>
              <input
                id="modal-company"
                type="text"
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Status Select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-status" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Status
              </label>
              <select
                id="modal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                <option value="Lead">Lead</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {/* Source Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="modal-source" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Source
              </label>
              <select
                id="modal-source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all select-none"
              >
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Partner">Partner</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Notes Input */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="modal-notes" className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Notes
              </label>
              <textarea
                id="modal-notes"
                placeholder="Add general details or deal history context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer border border-white/10 shadow-md shadow-primary/15"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Customer</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
