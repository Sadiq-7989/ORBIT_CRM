import { useState } from 'react';
import type { ActivityItem } from '../../../services/analyticsService';

interface ActivityCardProps {
  activities: ActivityItem[];
}

function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function renderContent(content: string) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-black text-slate-850 dark:text-slate-200">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function ActivityCard({ activities }: ActivityCardProps) {
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);

  // Always display the newest activity first
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getIcon = (type: 'customer' | 'deal' | 'task') => {
    switch (type) {
      case 'customer':
        return (
          <div className="w-8 h-8 rounded-full bg-accent/15 text-accent border border-accent/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        );
      case 'deal':
        return (
          <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary border border-secondary/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        );
      case 'task':
        return (
          <div className="w-8 h-8 rounded-full bg-success/15 text-success border border-success/10 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card hover:shadow-orbit-hover hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 flex flex-col h-[360px]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        <span 
          onClick={() => setIsAuditLogOpen(true)}
          className="text-[10px] font-bold text-primary dark:text-secondary hover:underline cursor-pointer"
        >
          View Audit Log
        </span>
      </div>

      {/* Timeline List - Scrollable with thin modern scrollbar styling */}
      <div className="flex-1 overflow-y-auto scroll-smooth pr-1 flex flex-col gap-4 [&::-webkit-scrollbar]:w-0 lg:[&::-webkit-scrollbar]:w-[6px] lg:[&::-webkit-scrollbar-track]:bg-transparent lg:[&::-webkit-scrollbar-thumb]:bg-primary/25 dark:lg:[&::-webkit-scrollbar-thumb]:bg-white/10 lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:hover:[&::-webkit-scrollbar-thumb]:bg-primary/45 dark:lg:hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:duration-200">
        {sortedActivities.map((activity, index) => (
          <div key={activity.id} className="relative flex items-start gap-3">
            {/* Timeline vertical connector line */}
            {index !== sortedActivities.length - 1 && (
              <span className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-800/80 -z-10" />
            )}

            {/* Icon */}
            <div className="flex-shrink-0">{getIcon(activity.type)}</div>

            {/* Content & Time */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-655 dark:text-slate-350 leading-normal mb-0.5">
                {renderContent(activity.content)}
              </p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {formatRelativeTime(activity.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Log Modal */}
      {isAuditLogOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={() => setIsAuditLogOpen(false)} />
          
          {/* Modal Container */}
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 rounded-orbit-modal p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 z-10 animate-[scaleUp_0.15s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Audit Log
              </h3>
              <button
                type="button"
                onClick={() => setIsAuditLogOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-bold text-center py-2">
              🚧 Audit Log feature is coming soon.
            </p>

            {/* Actions / Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={() => setIsAuditLogOpen(false)}
                className="px-4 py-2 text-xs font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 rounded-orbit-button transition-all cursor-pointer shadow-sm uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
