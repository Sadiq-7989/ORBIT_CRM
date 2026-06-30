import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';

export function DashboardHeader() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good Morning 👋');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    // Determine greeting based on current local time
    const hour = new Date().getHours();
    const namePart = user?.name ? `, ${user.name.split(' ')[0]}` : '';
    if (hour < 12) {
      setGreeting(`Good Morning${namePart} 👋`);
    } else if (hour < 18) {
      setGreeting(`Good Afternoon${namePart} 👋`);
    } else {
      setGreeting(`Good Evening${namePart} 👋`);
    }

    // Format local date
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    setDateString(new Date().toLocaleDateString('en-US', options));
  }, [user]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      {/* Greeting Column */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1.5 transition-colors duration-200">
          {greeting}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Welcome back to Orbit CRM. Here's what's happening today.
        </p>
      </div>

      {/* Date & Quick Stats Pill */}
      <div className="flex items-center gap-3 self-start sm:self-center">
        <div className="px-4 py-2.5 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-button shadow-sm backdrop-blur-md flex items-center gap-2">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {dateString}
          </span>
        </div>
      </div>
    </div>
  );
}
