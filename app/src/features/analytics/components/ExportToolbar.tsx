import { useState } from 'react';

export function ExportToolbar() {
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleExportPDF = () => {
    showNotification('PDF export initiated. Generating document...');
  };

  const handleExportCSV = () => {
    showNotification('CSV export completed. Download starting...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Toast Notification overlay */}
      {notification && (
        <div className="absolute -top-12 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/20 animate-bounce flex items-center gap-1.5 z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          {notification}
        </div>
      )}

      {/* Export CSV Button */}
      <button
        type="button"
        onClick={handleExportCSV}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-button hover:bg-slate-100 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Export CSV</span>
      </button>

      {/* Export PDF Button */}
      <button
        type="button"
        onClick={handleExportPDF}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-button hover:bg-slate-100 dark:hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span>Export PDF</span>
      </button>

      {/* Print Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/20 border border-slate-700 dark:border-white/10 rounded-orbit-button hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span>Print</span>
      </button>
    </div>
  );
}
