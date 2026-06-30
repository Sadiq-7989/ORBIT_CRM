import { useState, useEffect, useRef } from 'react';
import { aiService } from '../../../services/aiService';
import type { ChatMessage } from '../../../services/aiService';
import { AIMessage } from './AIMessage';
import { AIWelcomeCard } from './AIWelcomeCard';
import { AIInput } from './AIInput';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    // 1. Append user message to list
    const userMsg: ChatMessage = {
      id: `m-user-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 2. Trigger typing indicator
    try {
      setIsTyping(true);
      const answer = await aiService.chat(text, messages);
      
      const botMsg: ChatMessage = {
        id: `m-bot-${Date.now()}`,
        role: 'assistant',
        content: answer,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error dispatching chat request to Orbit AI:', err);
      const errorMsg: ChatMessage = {
        id: `m-err-${Date.now()}`,
        role: 'assistant',
        content: 'Error: Failed to process your request. I may have encountered network issues.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Slide-out Panel container */}
      <div className="relative w-full max-w-[360px] sm:max-w-[400px] h-screen bg-slate-50 dark:bg-slate-900 border-l border-slate-200/50 dark:border-white/5 shadow-2xl flex flex-col z-10 animate-[slideIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-white dark:bg-slate-950/20 backdrop-blur-md">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
              <span>Orbit AI Copilot</span>
            </h3>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">
              Live intelligence helper
            </span>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Close Panel"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin">
          {messages.length === 0 ? (
            <AIWelcomeCard onSelectSuggestion={handleSelectSuggestion} />
          ) : (
            messages.map((message) => (
              <AIMessage key={message.id} message={message} />
            ))
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="self-start flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                Orbit AI
              </span>
              <div className="flex gap-1.5 p-3.5 bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-card rounded-tl-none items-center shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          {/* Scroll Anchor */}
          <div ref={scrollRef} className="h-2" />
        </div>

        {/* Input Composer */}
        <AIInput onSend={handleSendMessage} disabled={isTyping} />

      </div>
    </div>
  );
}
