interface AIFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function AIFloatingButton({ onClick, isOpen }: AIFloatingButtonProps) {
  if (isOpen) return null; // Hide float trigger button if panel is already open

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 flex items-center justify-center border border-white/10 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group"
      title="Open Orbit AI"
    >
      {/* Outer rotating pulse ring */}
      <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping group-hover:animate-none opacity-75" />

      {/* SVG Assistant Icon */}
      <svg
        className="w-5.5 h-5.5 transition-transform duration-300 group-hover:rotate-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    </button>
  );
}
