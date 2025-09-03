import { NavLink, useLocation } from "react-router-dom";
import { useSfx } from "@/hooks/use-sfx";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

const links = [
  { to: "/", label: "Home" },
];

export default function Navbar() {
  const { hover, click } = useSfx();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <nav className="container flex items-center justify-between py-3">
        <a
          href="/"
          onMouseEnter={hover}
          onClick={click}
          className="flex items-center gap-2 group"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F593ada92f6a849fdaf6600d87713b3e8%2F1d15e19565ec48abb938ffbdbd1b87f1?format=webp&width=800"
            alt="Dream to Design logo"
            className="h-8 w-8 rounded-full object-cover glow"
          />
          <span className="text-lg font-extrabold tracking-widest neon-text">
            D2D
          </span>
        </a>
        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onMouseEnter={hover}
              onClick={click}
              className={({ isActive }) =>
                `px-4 py-2 text-sm rounded-full transition-colors ${
                  isActive
                    ? "bg-brand-cyan/20 text-white shadow-glow"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {Boolean((import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY) ? (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onMouseEnter={hover}
                    onClick={click}
                    className="px-4 py-2 text-sm rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: { userButtonAvatarBox: "shadow-glow" },
                  }}
                />
              </SignedIn>
            </>
          ) : null}
          <a
            href="/input"
            onMouseEnter={hover}
            onClick={click}
            className="hidden md:inline-flex items-center px-4 py-2 text-sm rounded-full bg-brand-cyan/20 text-white border border-brand-cyan/40 hover:bg-brand-cyan/30 shadow-glow"
          >
            New Dream
          </a>
        </div>
      </nav>
    </header>
  );
}
