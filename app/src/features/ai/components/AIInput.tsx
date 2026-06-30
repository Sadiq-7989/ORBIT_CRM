import React, { useState } from 'react';

interface AIInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function AIInput({ onSend, disabled }: AIInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white/60 dark:bg-slate-950/20 border-t border-slate-200/50 dark:border-white/5 flex gap-2.5 items-center backdrop-blur-md"
    >
      <input
        type="text"
        placeholder="Ask about dashboard, customers, deals, tasks..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        maxLength={300}
        className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-150 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900/80 transition-all shadow-inner"
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="p-2.5 rounded-orbit-button bg-gradient-to-r from-primary to-secondary hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none transition-all flex items-center justify-center border border-white/10 text-white cursor-pointer"
        title="Send Message"
      >
        <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}
