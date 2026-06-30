import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // If already logged in, redirect to dashboard
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
            Loading OrbitOS...
          </span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background-light dark:bg-background-dark font-sans overflow-hidden transition-colors duration-300">
      
      {/* Left Column: Premium Brand & Cosmic Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 text-white flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
        
        {/* Glow Effects */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px] top-[-150px] left-[-150px] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-secondary/15 blur-[100px] bottom-[-50px] right-[-50px] pointer-events-none" />
        
        {/* Dotted Grid Layout Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

        {/* Top: Brand Header */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-orbit-button bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary/20 border border-white/10">
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

        {/* Middle: Headline, Subtitle, & Premium Illustration */}
        <div className="relative z-10 my-auto">
          <div className="max-w-sm mb-10">
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Cosmic Workspace. Close Deals. Drive Growth.
            </h2>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              An enterprise-grade CRM engineered for hyper-growth teams. Experience the speed, aesthetics, and intelligence of OrbitOS.
            </p>
          </div>

          {/* Cosmic Planet & Orbit Graphic Illustration */}
          <div className="w-full flex justify-center py-4 select-none">
            <svg 
              className="w-full max-w-[280px] h-auto"
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-secondary)" />
                </linearGradient>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="var(--color-secondary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Orbit paths */}
              <circle cx="100" cy="100" r="85" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="65" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="3 5" />
              
              {/* Rotating outer orbit */}
              <ellipse cx="100" cy="100" rx="90" ry="35" stroke="url(#ringGrad)" strokeWidth="2" transform="rotate(-20 100 100)" />
              
              {/* Glowing Planet Core */}
              <circle cx="100" cy="100" r="28" fill="url(#planetGrad)" filter="url(#glowFilter)" />
              <circle cx="100" cy="100" r="18" fill="rgba(255,255,255,0.15)" />

              {/* Data Connections / Satellites */}
              <line x1="100" y1="100" x2="45" y2="65" stroke="rgba(6,182,212,0.4)" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="100" y1="100" x2="145" y2="145" stroke="rgba(6,182,212,0.4)" strokeWidth="1" strokeDasharray="2 2" />
              
              <circle cx="45" cy="65" r="4.5" fill="var(--color-accent)" filter="url(#glowFilter)" className="animate-ping" style={{ animationDuration: '4s' }} />
              <circle cx="45" cy="65" r="3.5" fill="var(--color-accent)" />

              <circle cx="145" cy="145" r="4.5" fill="var(--color-success)" filter="url(#glowFilter)" />
              <circle cx="145" cy="145" r="3" fill="#1e293b" stroke="var(--color-success)" strokeWidth="1.5" />
              
              {/* Little Orbiting Moons */}
              <circle cx="100" cy="40" r="4.5" fill="var(--color-secondary)" filter="url(#glowFilter)" />
              <circle cx="100" cy="40" r="3" fill="white" />
            </svg>
          </div>
        </div>

        {/* Bottom: Copyright & Platform Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold relative z-10">
          <span>&copy; 2026 OrbitOS</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            v2.1.0-alpha
          </span>
        </div>
      </div>

      {/* Right Column: Authentication Form Interface */}
      <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center p-6 md:p-12 relative">
        {/* Glow Spot for Mobile Backing */}
        <div className="absolute w-[250px] h-[250px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[80px] pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-md bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-orbit-card p-8 md:p-10 shadow-orbit-card">
          <Outlet />
        </div>
      </div>

    </div>
  );
}
