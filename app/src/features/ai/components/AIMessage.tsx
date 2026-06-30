import type { ChatMessage } from '../../../services/aiService';

interface AIMessageProps {
  message: ChatMessage;
}

function formatMessageContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    const isBullet = line.startsWith('• ') || line.startsWith('* ');
    const rawLine = isBullet ? line.substring(2) : line;
    
    // Parse **bold** tags
    const parts = rawLine.split(/(\*\*.*?\*\*)/g);
    const renderedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-extrabold text-slate-950 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={lineIdx} className="ml-4 list-disc text-xs leading-relaxed mb-1.5 text-slate-800 dark:text-slate-200">
          {renderedLine}
        </li>
      );
    }

    return (
      <p key={lineIdx} className="text-xs leading-relaxed mb-2 text-slate-800 dark:text-slate-200 min-h-[1em]">
        {renderedLine}
      </p>
    );
  });
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';

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
        className={`p-3.5 rounded-orbit-card border ${
          isUser
            ? 'bg-gradient-to-tr from-primary to-secondary text-white border-primary/20 shadow-md shadow-primary/5 rounded-tr-none'
            : 'bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border-slate-200/50 dark:border-white/5 rounded-tl-none'
        }`}
      >
        {isUser ? (
          <p className="text-xs leading-relaxed">{message.content}</p>
        ) : (
          <div className="flex flex-col">{formatMessageContent(message.content)}</div>
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
