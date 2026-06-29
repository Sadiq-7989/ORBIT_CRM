export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-sans">
      {/* Sidebar Placeholder */}
      <aside className="hidden md:flex md:w-64 bg-surface-dark text-gray-400 flex-col border-r border-gray-800 items-center justify-center font-semibold text-lg">
        Orbit Sidebar
      </aside>

      {/* Right Column (Navbar + Main Content) */}
      <div className="flex flex-col flex-1">
        {/* Navbar Placeholder */}
        <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center px-6 text-gray-500 dark:text-gray-400 font-semibold text-md">
          Orbit Navbar
        </header>

        {/* Main Content Area Placeholder */}
        <main className="flex-1 p-6">
          <div className="h-full w-full bg-surface-light dark:bg-surface-dark rounded-orbit-card border border-gray-200 dark:border-gray-800 shadow-orbit-card flex items-center justify-center text-gray-400 font-semibold text-xl">
            Orbit Workspace
          </div>
        </main>
      </div>
    </div>
  );
}
