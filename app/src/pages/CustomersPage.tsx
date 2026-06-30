export function CustomersPage() {
  const triggerAction = () => {
    alert('Create action triggered for Customers');
  };

  const triggerSetup = () => {
    alert('Quick setup triggered for Customers');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto py-12 animate-[fadeIn_0.3s_ease-out]">
      {/* Cosmic Empty State Graphic */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center select-none">
        {/* Concentric dashed orbit circles */}
        <div className="absolute w-44 h-44 rounded-full border border-dashed border-gray-300 dark:border-white/10 animate-[spin_40s_linear_infinite]" />
        <div className="absolute w-32 h-32 rounded-full border border-dashed border-gray-300/80 dark:border-white/5 animate-[spin_25s_linear_infinite_reverse]" />
        <div className="absolute w-20 h-20 rounded-full border border-gray-200 dark:border-white/10" />

        {/* Central Glowing Planet */}
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-lg shadow-xl shadow-primary/30 z-10">
          C
        </div>

        {/* Orbiting Orbs */}
        <div className="absolute w-3 h-3 rounded-full bg-accent shadow-md shadow-accent/40 top-5 left-10 animate-bounce" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-secondary shadow-md shadow-secondary/40 bottom-10 right-4" />
      </div>

      {/* Typography Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3">
          Customers Workspace
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
          View, filter, search, and manage your customers list. Track customer metrics and details.
        </p>
      </div>

      {/* Premium Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={triggerAction}
          className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button shadow-lg shadow-primary/20 hover:opacity-90 hover:scale-[1.02] hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 cursor-pointer border border-white/10"
        >
          Add Customer
        </button>
        <button
          type="button"
          onClick={triggerSetup}
          className="px-6 py-3 text-xs font-bold text-gray-600 dark:text-slate-300 bg-gray-100/80 dark:bg-white/5 hover:bg-gray-200/80 dark:hover:bg-white/10 rounded-orbit-button border border-gray-200/50 dark:border-white/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Quick Setup
        </button>
      </div>
    </div>
  );
}
