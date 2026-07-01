import { useState } from 'react';
import type { ChatMessage } from '../../../services/aiService';

interface AIMessageProps {
  message: ChatMessage;
}

function renderBoldCodeAndText(text: string) {
  // Parse **bold** and `code` tags
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-extrabold text-slate-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-primary dark:text-secondary rounded border border-slate-200/50 dark:border-white/5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function formatMessageContent(content: string) {
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaderParsed = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for table lines
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      const cols = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      const isSeparator = cols.every(c => c.startsWith('-') || c === '');
      if (isSeparator) {
        continue;
      }
      
      if (!tableHeaderParsed) {
        tableHeaders = cols;
        tableHeaderParsed = true;
      } else {
        tableRows.push(cols);
      }
      continue;
    } else {
      if (inTable) {
        const tableKey = `table-${i}`;
        renderedElements.push(
          <div key={tableKey} className="overflow-x-auto my-3 border border-slate-200/50 dark:border-white/5 rounded-orbit-input max-w-full shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5 text-[10px]">
              <thead className="bg-slate-100/50 dark:bg-slate-950/40">
                <tr>
                  {tableHeaders.map((h, hIdx) => (
                    <th key={hIdx} className="px-3 py-2 text-left font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/20 dark:bg-slate-950/10">
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300 font-semibold">
                        {renderBoldCodeAndText(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableHeaderParsed = false;
        tableHeaders = [];
        tableRows = [];
      }
    }

    if (line === '') {
      renderedElements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    const isBullet = line.startsWith('• ') || line.startsWith('* ') || line.startsWith('- ');
    const rawLine = isBullet ? line.substring(2) : line;

    if (isBullet) {
      renderedElements.push(
        <li key={`bullet-${i}`} className="ml-4 list-disc text-[11px] leading-relaxed mb-1.5 text-slate-800 dark:text-slate-200 font-semibold">
          {renderBoldCodeAndText(rawLine)}
        </li>
      );
    } else {
      renderedElements.push(
        <p key={`p-${i}`} className="text-[11px] leading-relaxed mb-2 text-slate-800 dark:text-slate-200 font-semibold">
          {renderBoldCodeAndText(rawLine)}
        </p>
      );
    }
  }

  if (inTable) {
    renderedElements.push(
      <div key="table-end" className="overflow-x-auto my-3 border border-slate-200/50 dark:border-white/5 rounded-orbit-input max-w-full shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-white/5 text-[10px]">
          <thead className="bg-slate-100/50 dark:bg-slate-950/40">
            <tr>
              {tableHeaders.map((h, hIdx) => (
                <th key={hIdx} className="px-3 py-2 text-left font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/20 dark:bg-slate-950/10">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                {row.map((val, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300 font-semibold">
                    {renderBoldCodeAndText(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return renderedElements;
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Orbit AI response:', err);
    }
  };

  return (
    <div
      className={`flex flex-col max-w-[85%] ${
        isUser ? 'self-end items-end' : 'self-start items-start'
      } animate-[fadeIn_0.2s_ease-out]`}
    >
      {/* Sender Header */}
      <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 px-1">
        {isUser ? 'You' : 'Orbit AI'}
      </span>

      {/* Bubble Container */}
      <div
        className={`p-3.5 rounded-orbit-card border relative group/bubble ${
          isUser
            ? 'bg-gradient-to-tr from-primary to-secondary text-white border-primary/20 shadow-md shadow-primary/5 rounded-tr-none'
            : 'bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-white/5 rounded-tl-none shadow-orbit-card'
        }`}
      >
        {isUser ? (
          <p className="text-xs leading-relaxed font-semibold">{message.content}</p>
        ) : (
          <div className="flex flex-col pr-6">{formatMessageContent(message.content)}</div>
        )}

        {!isUser && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 opacity-0 group-hover/bubble:opacity-100 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100/80 dark:bg-slate-800 rounded-orbit-input transition-all duration-200 cursor-pointer shadow-sm border border-slate-200/50 dark:border-white/5"
            title={copied ? "Copied!" : "Copy Response"}
          >
            {copied ? (
              <svg className="w-3 h-3 text-success animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Date Timestamp */}
      <span className="text-[8px] text-slate-400 dark:text-slate-600 font-semibold mt-1 px-1">
        {new Date(message.created_at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  );
}
