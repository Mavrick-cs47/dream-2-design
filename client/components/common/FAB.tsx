import { Link } from "react-router-dom";

export default function FAB() {
  return (
    <Link
      to="/input"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-brand-cyan/30 border border-brand-cyan/40 text-white flex items-center justify-center shadow-glow hover:bg-brand-cyan/40"
      aria-label="Create new dream"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="drop-shadow">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Link>
  );
}
