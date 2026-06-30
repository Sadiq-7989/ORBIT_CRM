import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { OrbitSidebar } from './OrbitSidebar';
import { OrbitNavbar } from './OrbitNavbar';
import { AIFloatingButton } from '../../features/ai/components/AIFloatingButton';
import { AIChatPanel } from '../../features/ai/components/AIChatPanel';

export function AppLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-sans p-4 gap-4 transition-all duration-300 overflow-hidden">
      {/* Left Sidebar */}
      <OrbitSidebar />

      {/* Right Column (Navbar + Main Content) */}
      <div className="flex flex-col flex-1 gap-4 h-full min-w-0">
        {/* Top Navbar */}
        <OrbitNavbar />

        {/* Main Content Area: Floating Workspace Panel */}
        <main
          className={`flex-1 bg-surface-light/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-orbit-card border border-gray-200/50 dark:border-white/5 shadow-orbit-card p-6 md:p-8 flex flex-col transition-all duration-300 min-h-0 overflow-y-auto ${
            isDashboard
              ? 'justify-start items-stretch'
              : 'justify-center items-center'
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant Trigger & Panel */}
      <AIFloatingButton onClick={() => setIsChatOpen(true)} isOpen={isChatOpen} />
      <AIChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

