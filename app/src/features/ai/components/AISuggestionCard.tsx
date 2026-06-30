interface AISuggestionCardProps {
  text: string;
  onClick: () => void;
}

export function AISuggestionCard({ text, onClick }: AISuggestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3 bg-slate-50 dark:bg-slate-950/40 hover:bg-primary/5 dark:hover:bg-primary/10 border border-slate-200/50 dark:border-white/5 hover:border-primary/20 dark:hover:border-primary/20 rounded-orbit-button transition-all duration-200 cursor-pointer group flex items-center justify-between gap-2"
    >
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350 group-hover:text-primary transition-colors leading-normal truncate">
        {text}
      </span>
      <svg
        className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
