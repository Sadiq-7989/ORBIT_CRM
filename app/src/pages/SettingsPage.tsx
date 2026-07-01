import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { supabase } from '../lib/supabase';
import { analyticsService } from '../services/analyticsService';
import type { DashboardStats } from '../services/analyticsService';

interface Toast {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'ai' | 'notifications' | 'preferences' | 'security' | 'about'>('profile');
  
  // Auth details from Supabase auth directly
  const [authDetails, setAuthDetails] = useState<{ created_at?: string; last_sign_in_at?: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Profile editing
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Theme preference
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');

  // AI settings
  const [aiSuggestions, setAiSuggestions] = useState(() => localStorage.getItem('ai_suggestions') !== 'false');
  const [aiRecommendations, setAiRecommendations] = useState(() => localStorage.getItem('ai_recommendations') !== 'false');
  const [aiInsights, setAiInsights] = useState(() => localStorage.getItem('ai_insights') !== 'false');
  const [aiEmail, setAiEmail] = useState(() => localStorage.getItem('ai_email') !== 'false');

  // Notifications toggles
  const [notifTasks, setNotifTasks] = useState(() => localStorage.getItem('notif_tasks') !== 'false');
  const [notifDeals, setNotifDeals] = useState(() => localStorage.getItem('notif_deals') !== 'false');
  const [notifCustomers, setNotifCustomers] = useState(() => localStorage.getItem('notif_customers') !== 'false');
  const [notifAi, setNotifAi] = useState(() => localStorage.getItem('notif_ai') !== 'false');
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem('notif_email') !== 'false');

  // Preferences dropdowns
  const [currency, setCurrency] = useState(() => localStorage.getItem('pref_currency') || 'USD');
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('pref_date_format') || 'MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState(() => localStorage.getItem('pref_time_format') || '12h');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('pref_timezone') || 'UTC');

  // Inline "Saved" alerts state
  const [inlineSaved, setInlineSaved] = useState<Record<string, boolean>>({});

  // Toast notifications
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: 'success' | 'warning' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerInlineSave = (key: string) => {
    setInlineSaved(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setInlineSaved(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  useEffect(() => {
    // 1. Fetch exact account created timestamp
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAuthDetails({
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
        });
      }
    });

    // 2. Fetch live metrics stats for profile overview
    analyticsService.getDashboardStats().then(setStats).catch(console.error);
  }, []);

  // Update input when user loads
  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user]);

  // Profile Save metadata in Supabase
  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const { error } = await supabase.auth.updateUser({
        data: { name: nameInput }
      });
      if (error) throw error;
      triggerInlineSave('profile');
      showToast('success', 'Profile updated successfully.');
    } catch (err: any) {
      showToast('error', err?.message || 'Failed to update Profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Theme Change trigger
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    showToast('success', `Theme changed to ${newTheme} mode.`);
  };

  // Preference update helpers
  const handlePreferenceChange = (key: string, value: string, cacheKey: string) => {
    localStorage.setItem(cacheKey, value);
    triggerInlineSave(key);
    showToast('success', 'Preferences saved.');
  };

  const handleToggleChange = (key: string, value: boolean, setter: (v: boolean) => void, cacheKey: string) => {
    setter(value);
    localStorage.setItem(cacheKey, String(value));
    triggerInlineSave(key);
    showToast('success', 'Preferences saved.');
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'ai', label: 'AI Settings', icon: '🤖' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ] as const;

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-[fadeIn_0.3s_ease-out] relative">
      
      {/* Toast Alert popup overlay */}
      {toast && (
        <div className={`fixed top-6 right-6 px-4 py-2.5 rounded-orbit-button text-white text-xs font-bold shadow-xl flex items-center gap-2 z-[999] border border-white/10 transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-success shadow-success/15' :
          toast.type === 'error' ? 'bg-error shadow-error/15' :
          toast.type === 'warning' ? 'bg-warning shadow-warning/15' : 'bg-primary shadow-primary/15'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          {toast.message}
        </div>
      )}

      {/* Header Row */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
          Settings Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Manage system layouts, database connection details, preferences, and security access keys.
        </p>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Navigation Column (Left / Top) */}
        <div className="w-full lg:w-60 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-4 shadow-orbit-card h-fit space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-orbit-button text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content Container (Right / Bottom) */}
        <div className="flex-1 min-w-0">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  My Profile
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200/35 dark:border-white/5">
                  {/* Large initials avatar placeholder */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/15 relative shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-success border-2 border-white dark:border-slate-900" />
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {user?.name || 'Orbit User'}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      Account created: {authDetails?.created_at ? new Date(authDetails.created_at).toLocaleDateString() : 'Loading...'}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                      Administrator
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full max-w-md px-3.5 py-2.5 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/50 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full max-w-md px-3.5 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-white/5 rounded-orbit-input text-slate-500 dark:text-slate-500 cursor-not-allowed font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Save cancel bar */}
                <div className="pt-4 border-t border-slate-200/35 dark:border-white/5 flex items-center gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-primary/10 transition-all disabled:opacity-50 cursor-pointer border border-white/5 flex items-center gap-1.5"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setNameInput(user?.name || '')}
                    className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-orbit-button transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  {inlineSaved.profile && (
                    <span className="text-xs font-bold text-success animate-pulse">✓ Changes Saved</span>
                  )}
                </div>
              </div>

              {/* Account statistics details card */}
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Account Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5 shadow-sm text-center">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      Customers
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {stats ? stats.totalCustomers : '—'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5 shadow-sm text-center">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      Deals Count
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {stats ? stats.totalDeals : '—'}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5 shadow-sm text-center">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                      Active Workload
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {stats ? stats.openTasks : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Layout & Appearance
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  Personalize the interface theme mode settings.
                </p>
              </div>

              {/* Previews Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Light mode preview */}
                <div
                  onClick={() => handleThemeChange('light')}
                  className={`group p-4 bg-white border rounded-orbit-card cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${
                    theme === 'light' ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-slate-200/50'
                  }`}
                >
                  <div className="h-20 bg-slate-50 rounded-orbit-button border border-slate-150 p-2 space-y-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-10 bg-slate-300 rounded" />
                      <div className="h-2 w-2 bg-slate-300 rounded-full" />
                    </div>
                    <div className="h-6 w-full bg-white rounded border border-slate-150 shadow-sm" />
                    <div className="h-2 w-12 bg-primary rounded" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 block text-center mt-3">Light Mode</span>
                </div>

                {/* Dark mode preview */}
                <div
                  onClick={() => handleThemeChange('dark')}
                  className={`group p-4 bg-slate-950 border rounded-orbit-card cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${
                    theme === 'dark' ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-white/5'
                  }`}
                >
                  <div className="h-20 bg-slate-900 rounded-orbit-button border border-white/5 p-2 space-y-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-10 bg-slate-700 rounded" />
                      <div className="h-2 w-2 bg-slate-700 rounded-full" />
                    </div>
                    <div className="h-6 w-full bg-slate-950 rounded border border-white/5" />
                    <div className="h-2 w-12 bg-primary rounded" />
                  </div>
                  <span className="text-xs font-bold text-slate-300 block text-center mt-3">Dark Mode</span>
                </div>

                {/* System mode preview */}
                <div
                  onClick={() => handleThemeChange('system')}
                  className={`group p-4 bg-slate-100 dark:bg-slate-900 border rounded-orbit-card cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${
                    theme === 'system' ? 'border-primary ring-2 ring-primary/20 scale-[1.01]' : 'border-slate-200/50 dark:border-white/5'
                  }`}
                >
                  <div className="h-20 rounded-orbit-button border border-slate-200/80 dark:border-white/5 flex overflow-hidden shadow-inner bg-slate-50">
                    <div className="flex-1 bg-slate-50 p-2 flex flex-col justify-between border-r border-slate-200/50">
                      <div className="h-2 w-6 bg-slate-300 rounded" />
                      <div className="h-4 bg-white rounded border border-slate-100" />
                    </div>
                    <div className="flex-1 bg-slate-900 p-2 flex flex-col justify-between">
                      <div className="h-2 w-6 bg-slate-700 rounded" />
                      <div className="h-4 bg-slate-950 rounded border border-white/5" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block text-center mt-3">System Default</span>
                </div>
              </div>
            </div>
          )}

          {/* AI SETTINGS TAB */}
          {activeTab === 'ai' && (
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    AI Business Copilot settings
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Configure Google Gemini SDK credentials and preferences.
                  </p>
                </div>
                {inlineSaved.ai && (
                  <span className="text-[10px] font-bold text-success animate-pulse shrink-0">✓ Saved</span>
                )}
              </div>

              {/* Status information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200/35 dark:border-white/5">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
                    Current AI Provider
                  </span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Google Gemini
                  </span>
                </div>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100/50 dark:border-white/5">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
                    Active AI Model
                  </span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    gemini-2.5-flash
                  </span>
                </div>
              </div>

              {/* Preferences toggles */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Enable AI Suggestions
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Show quick-reply chips inside the chat panels.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('ai', !aiSuggestions, setAiSuggestions, 'ai_suggestions')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      aiSuggestions ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${aiSuggestions ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Enable Smart Recommendations
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Recommend next best actions to close negotiation deals.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('ai', !aiRecommendations, setAiRecommendations, 'ai_recommendations')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      aiRecommendations ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${aiRecommendations ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Enable Business Insights
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Show live pipeline analysis summaries.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('ai', !aiInsights, setAiInsights, 'ai_insights')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      aiInsights ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${aiInsights ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Enable AI Email Assistant
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Auto-generate follow-up drafts for customer notes.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('ai', !aiEmail, setAiEmail, 'ai_email')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      aiEmail ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${aiEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Notifications Settings
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Toggle alert limits for active CRM events.
                  </p>
                </div>
                {inlineSaved.notif && (
                  <span className="text-[10px] font-bold text-success animate-pulse shrink-0">✓ Saved</span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Task Reminders
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Notify me of checklist items passing their due dates.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('notif', !notifTasks, setNotifTasks, 'notif_tasks')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      notifTasks ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${notifTasks ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Deal Updates
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Send alerts when deal values update or stage changes.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('notif', !notifDeals, setNotifDeals, 'notif_deals')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      notifDeals ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${notifDeals ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Customer Notifications
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Alert when new customer registrations are added.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('notif', !notifCustomers, setNotifCustomers, 'notif_customers')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      notifCustomers ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${notifCustomers ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      AI Recommendations
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Receive alerts on pipeline opportunity warnings.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('notif', !notifAi, setNotifAi, 'notif_ai')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      notifAi ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${notifAi ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Email Notifications
                    </label>
                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-medium block mt-0.5">
                      Receive a daily digests of open deals and workload alerts.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('notif', !notifEmail, setNotifEmail, 'notif_email')}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer border ${
                      notifEmail ? 'bg-primary border-primary/25' : 'bg-slate-200 dark:bg-white/5 border-slate-300/30 dark:border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-all ${notifEmail ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Localization Preferences
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    Customize formatting ranges for local currency and time values.
                  </p>
                </div>
                {inlineSaved.pref && (
                  <span className="text-xs font-bold text-success animate-pulse shrink-0">✓ Saved</span>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Currency selector */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      System Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value);
                        handlePreferenceChange('pref', e.target.value, 'pref_currency');
                      }}
                      className="w-full px-3 py-2 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none select-none font-bold"
                    >
                      <option value="USD">USD ($) - United States Dollar</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound Sterling</option>
                    </select>
                  </div>

                  {/* Date format */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Date Formatting
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => {
                        setDateFormat(e.target.value);
                        handlePreferenceChange('pref', e.target.value, 'pref_date_format');
                      }}
                      className="w-full px-3 py-2 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none select-none font-bold"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/01/2026)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 01/07/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-07-01)</option>
                    </select>
                  </div>

                  {/* Time format */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Time Standard
                    </label>
                    <select
                      value={timeFormat}
                      onChange={(e) => {
                        setTimeFormat(e.target.value);
                        handlePreferenceChange('pref', e.target.value, 'pref_time_format');
                      }}
                      className="w-full px-3 py-2 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none select-none font-bold"
                    >
                      <option value="12h">12-Hour format (AM/PM)</option>
                      <option value="24h">24-Hour format</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Local Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => {
                        setTimezone(e.target.value);
                        handlePreferenceChange('pref', e.target.value, 'pref_timezone');
                      }}
                      className="w-full px-3 py-2 text-xs bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-orbit-input text-slate-900 dark:text-gray-100 focus:outline-none select-none font-bold"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                      <option value="IST">IST (India Standard Time - UTC+5:30)</option>
                      <option value="EST">EST (Eastern Standard Time - UTC-5)</option>
                      <option value="PST">PST (Pacific Standard Time - UTC-8)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Access & Security
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Current Login Email
                    </label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      disabled
                      className="w-full max-w-md px-3.5 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-white/5 rounded-orbit-input text-slate-500 cursor-not-allowed font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value="••••••••••••••••"
                      disabled
                      className="w-full max-w-md px-3.5 py-2.5 text-xs bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/30 dark:border-white/5 rounded-orbit-input text-slate-500 cursor-not-allowed font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/35 dark:border-white/5 flex items-center gap-3">
                  <button
                    onClick={() => showToast('info', 'Password change trigger modal is under local mockup.')}
                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-primary to-secondary rounded-orbit-button hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border border-white/5 shadow-md shadow-primary/10"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 text-xs font-bold text-error bg-error/10 hover:bg-error/15 border border-error/25 rounded-orbit-button transition-all cursor-pointer"
                  >
                    Sign Out Account
                  </button>
                </div>
              </div>

              {/* Security info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Session details */}
                <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Current Browser Session
                  </h4>
                  <div className="space-y-2.5 text-[11px] font-semibold text-slate-650 dark:text-slate-400">
                    <div className="flex justify-between items-center">
                      <span>Device Type:</span>
                      <span className="text-slate-800 dark:text-white font-extrabold">Desktop Computer</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Operating System:</span>
                      <span className="text-slate-800 dark:text-white font-extrabold">Windows 11 Enterprise</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Browser Client:</span>
                      <span className="text-slate-800 dark:text-white font-extrabold">Chrome v122.0.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>IP Address:</span>
                      <span className="text-slate-800 dark:text-white font-extrabold">192.168.1.185 (Mock)</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200/30 dark:border-white/5 pt-2.5">
                      <span>Session Status:</span>
                      <span className="flex items-center gap-1.5 text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                        Active (Current Session)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Password guidelines */}
                <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Password Requirements
                  </h4>
                  <ul className="space-y-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                    <li className="flex items-center gap-1.5">
                      <span className="text-success">✔</span> At least 8 characters in length
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-success">✔</span> Includes letters and numerals
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-success">✔</span> Contains a special character (!@#$)
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-success">✔</span> Checked against common dictionaries
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Product Card */}
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/5 blur-2xl pointer-events-none" />

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    Orbit CRM
                    <span className="px-2 py-0.5 text-[9px] font-black text-white bg-primary rounded-full normal-case">
                      v1.0
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                    Next-generation Customer Relationship Management platform. Designed for OrbitOS.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200/35 dark:border-white/5">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Developer Information
                    </h4>
                    <div className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div>Lead Developer: <span className="font-extrabold text-slate-900 dark:text-white">S.V. Sadiq Basha</span></div>
                      <div>Build Date: <span className="font-extrabold text-slate-900 dark:text-white">July 1, 2026</span></div>
                      <div>Build Status: <span className="px-2 py-0.5 text-[9px] font-bold text-success bg-success/10 dark:bg-success/20 rounded-full border border-success/10">Production Ready</span></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Project Statistics
                    </h4>
                    <div className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <div>Total Modules: <span className="font-extrabold text-slate-900 dark:text-white">7 Modules</span></div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {['Dashboard', 'Customers', 'Deals', 'Tasks', 'Analytics', 'Settings', 'Orbit AI'].map(m => (
                          <span key={m} className="px-1.5 py-0.5 text-[8px] bg-slate-100 dark:bg-white/5 rounded border border-slate-200/50 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Badges */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 text-sky-500 rounded-orbit-button text-xs font-extrabold border border-sky-500/20 shadow-sm shadow-sky-500/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      React
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-orbit-button text-xs font-extrabold border border-blue-500/20 shadow-sm shadow-blue-500/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      TypeScript
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-orbit-button text-xs font-extrabold border border-success/20 shadow-sm shadow-success/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Supabase
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-orbit-button text-xs font-extrabold border border-primary/20 shadow-sm shadow-primary/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Gemini 2.5 Flash
                    </span>
                  </div>
                </div>
              </div>

              {/* Coming Soon roadmap details */}
              <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-orbit-card border border-slate-200/50 dark:border-white/5 p-6 shadow-orbit-card space-y-4">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    Upcoming Feature Roadmap
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                    Exciting updates coming in the next release cycles.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100 dark:border-white/5">
                    <span className="text-[9px] font-black text-primary uppercase block mb-0.5">AI Campaigns</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Automatic customer email follow-up drafts based on deal conversion scores.</p>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100 dark:border-white/5">
                    <span className="text-[9px] font-black text-secondary uppercase block mb-0.5">Custom Dashboard</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Drag-and-drop workspace layout widgets to prioritize core pipeline matrices.</p>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100 dark:border-white/5">
                    <span className="text-[9px] font-black text-accent uppercase block mb-0.5">APIs & Webhooks</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Sync customers database and deals pipeline actions with external apps dynamically.</p>
                  </div>
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-orbit-button border border-slate-100 dark:border-white/5">
                    <span className="text-[9px] font-black text-success uppercase block mb-0.5">Mobile Clients</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Dedicated native iOS & Android applications with offline synchronization.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
}
