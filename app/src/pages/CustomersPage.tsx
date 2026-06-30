import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import type { Customer, CustomerInput } from '../services/customerService';
import { CustomerTable } from '../features/customers/components/CustomerTable';
import { CustomerCard } from '../features/customers/components/CustomerCard';
import { CustomerFormModal } from '../features/customers/components/CustomerFormModal';
import { DeleteConfirmationDialog } from '../features/customers/components/DeleteConfirmationDialog';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

  // Fetch customer list
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err?.message || 'Failed to retrieve customer records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Form modal triggers
  const handleOpenAddModal = () => {
    setSelectedCustomer(undefined);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  // Submit operations
  const handleFormSubmit = async (input: CustomerInput) => {
    if (selectedCustomer) {
      // Edit operation
      const updated = await customerService.updateCustomer(selectedCustomer.id, input);
      setCustomers((prev) => prev.map((c) => (c.id === selectedCustomer.id ? updated : c)));
    } else {
      // Add operation
      const created = await customerService.createCustomer(input);
      setCustomers((prev) => [created, ...prev]);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCustomer) {
      await customerService.deleteCustomer(selectedCustomer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
    }
  };

  // Real-time filtering based on query
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      customer.name.toLowerCase().includes(query) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.company && customer.company.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-[fadeIn_0.3s_ease-out]">
      
      {/* 1. Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage relationships, track lead statuses, and log details.
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
          <span>Add Customer</span>
        </button>
      </div>

      {/* 2. Search and filter panel */}
      <div className="w-full">
        <div className="relative group max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white dark:focus:bg-slate-950/80 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 3. Main content areas: Loading / Error / Empty / Grid list */}
      {isLoading ? (
        /* Loading Skeleton list */
        <div className="flex-1 flex flex-col gap-4 py-12 items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
            Loading customers...
          </span>
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
            onClick={fetchCustomers}
            className="px-4 py-2 text-xs font-bold text-white bg-error rounded-orbit-button hover:opacity-90 hover:scale-[1.01] transition-all cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-16">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center select-none">
            <div className="absolute w-36 h-36 rounded-full border border-dashed border-gray-300 dark:border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-24 h-24 rounded-full border border-dashed border-gray-300/80 dark:border-white/5 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-base shadow-xl shadow-primary/20">
              C
            </div>
            <div className="absolute w-2 h-2 rounded-full bg-accent shadow-md shadow-accent/40 top-8 left-8" />
          </div>

          <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white mb-2 uppercase">
            {searchQuery ? 'No Results Found' : 'No Customers Yet'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
            {searchQuery
              ? `We couldn't find records matching "${searchQuery}". Try editing your query.`
              : 'Add your first customer relationship record to get started tracking deal values.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 transition-all border border-white/10 shadow-md shadow-primary/20 cursor-pointer"
            >
              Add Your First Customer
            </button>
          )}
        </div>
      ) : (
        /* Customers grid and table */
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Desktop Table View (visible on md+) */}
          <div className="hidden md:block">
            <CustomerTable
              customers={filteredCustomers}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          </div>

          {/* Mobile Card Grid View (visible on mobile) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteDialog}
              />
            ))}
          </div>

        </div>
      )}

      {/* Forms and confirmation modals */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        customer={selectedCustomer}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        customerName={selectedCustomer?.name}
      />

    </div>
  );
}
