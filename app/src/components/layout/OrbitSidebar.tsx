interface SidebarNavItem {
  name: string;
  icon: React.ReactNode;
  id: string;
}

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export function OrbitSidebar() {
  const { user, logout } = useAuth();
  const displayName = user?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const navItems: SidebarNavItem[] = [
    {
      id: 'dashboard',
      name: "Dashboard",
      icon: (
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'customers',
      name: "Customers",
      icon: (
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'deals',
      name: "Deals",
      icon: (
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'tasks',
      name: "Tasks",
      icon: (
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'analytics',
      name: "Analytics",
      icon: (
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      name: "Settings",
      icon: (
        <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-slate-950/80 dark:bg-slate-950/50 backdrop-blur-xl text-slate-300 flex-col rounded-orbit-card border border-white/10 shadow-2xl p-4 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/5 mb-6">
        <div className="w-10 h-10 rounded-orbit-button bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary/20">
          O
        </div>
        <div>
          <h1 className="font-sans font-black text-white text-base leading-tight tracking-wider uppercase">
            Orbit CRM
          </h1>
          <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase">
            OrbitOS Platform
          </p>
        </div>
      </div>

      {/* Workspace Section */}
      <div className="mb-6 px-1">
        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-3 px-2">
          Workspace
        </p>
        <div className="flex items-center justify-between p-2.5 rounded-orbit-button bg-white/5 border border-white/5 shadow-inner hover:bg-white/10 transition-colors duration-200 cursor-pointer group">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Orbit Dev Lab</span>
          </div>
          <svg className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={`/${item.id}`}
            className={({ isActive }) =>
              `w-full group flex items-center gap-3.5 px-4 py-3 text-xs font-semibold tracking-wide rounded-orbit-button transition-all duration-200 cursor-pointer border ${
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-0.5 border-transparent"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Profile Section */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center justify-between p-2 rounded-orbit-button bg-white/5 border border-white/5 shadow-inner hover:bg-white/10 transition-all duration-300">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder with letters */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent border border-white/20 flex items-center justify-center text-white font-black text-xs shadow-md shadow-primary/20">
              {initial}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">{displayName}</span>
              <span className="text-[9px] text-slate-500 font-extrabold tracking-wider uppercase mt-0.5">Administrator</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={logout} 
            title="Log Out"
            className="p-2 text-slate-400 hover:text-error hover:bg-error/15 rounded-orbit-button transition-all duration-250 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
