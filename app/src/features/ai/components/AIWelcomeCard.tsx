import { useState, useEffect } from 'react';
import { aiService } from '../../../services/aiService';
import { AISuggestionCard } from './AISuggestionCard';

interface AIWelcomeCardProps {
  onSelectSuggestion: (text: string) => void;
}

export function AIWelcomeCard({ onSelectSuggestion }: AIWelcomeCardProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    aiService.generateSuggestions()
      .then((data) => setSuggestions(data))
      .catch((err) => console.error('Error fetching suggestions:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-5 p-5 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 rounded-orbit-card border border-primary/10 dark:border-white/5 animate-[fadeIn_0.3s_ease-out]">
      {/* Bot Icon & Tagline */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/20">
          O
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Orbit AI Assistant
          </h4>
          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold block mt-0.5">
            Your intelligence companion
          </span>
        </div>
      </div>

      {/* Intro paragraph */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
        I can fetch dynamic stats, summarize customer directory profiles, review pipeline deals, or audit overdue tasks. Select a query suggestion below to begin.
      </p>

      {/* Suggestions column */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[8px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Suggested Queries
        </span>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200/50 dark:bg-white/5 animate-pulse rounded-orbit-button border border-slate-200/20" />
            ))}
          </div>
        ) : (
          suggestions.map((s, idx) => (
            <AISuggestionCard
              key={idx}
              text={s}
              onClick={() => onSelectSuggestion(s)}
            />
          ))
        )}
      </div>
    </div>
  );
}
