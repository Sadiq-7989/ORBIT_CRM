import { useLocation } from 'react-router-dom';

export function OrbitNavbar() {
  const location = useLocation();
  // Get route segment (e.g., '/dashboard' -> 'dashboard', '/' -> 'dashboard')
  const path = location.pathname.substring(1) || 'dashboard';
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <header className="h-16 bg-surface-light/80 dark:bg-slate-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-white/5 rounded-[20px] shadow-lg flex items-center justify-between px-6 transition-all duration-300">
      {/* Left Title: Premium Typography */}
      <div className="flex items-center">
        <h2 className="text-xs font-extrabold text-gray-900 dark:text-white tracking-widest uppercase">
          {title}
        </h2>
      </div>

      {/* Center Search Bar: Centered floating glass style */}
      <div className="flex-1 max-w-sm mx-auto">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors duration-150">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search customers, deals, tasks..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-100/50 dark:bg-slate-950/40 border border-gray-200/30 dark:border-white/5 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white dark:focus:bg-slate-950/80 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Area: Actions & Avatar */}
      <div className="flex items-center gap-3.5">
        {/* Notification Alert Trigger */}
        <button
          type="button"
          className="relative p-2 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/5 rounded-full transition-all duration-150 cursor-pointer"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-error ring-2 ring-surface-light dark:ring-slate-900" />
        </button>

        {/* Theme Toggle Button (Moon Icon Placeholder) */}
        <button
          type="button"
          className="p-2 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-white/5 rounded-full transition-all duration-150 cursor-pointer"
          aria-label="Toggle Theme"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <div className="h-4 w-px bg-gray-200 dark:bg-white/10" />

        {/* User Avatar Placeholder */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-extrabold text-xs shadow-md shadow-primary/10">
          U
        </div>
      </div>
    </header>
  );
}
