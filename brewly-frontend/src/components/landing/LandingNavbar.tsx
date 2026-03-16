import { Coffee } from "lucide-react";

interface LandingNavbarProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function LandingNavbar({ onLogin, onSignup }: LandingNavbarProps) {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-transparent absolute top-0 left-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B48665] to-[#65350E] flex items-center justify-center shadow-xl">
          <Coffee className="w-6 h-6 text-[#FBF8F3]" />
        </div>
        <span className="font-serif text-2xl text-[#65350E]">Brewly</span>
      </div>
      {/* Auth Buttons */}
      <div className="flex gap-4">
        <button
          className="px-5 py-2 rounded-full font-semibold bg-[#B48665] text-[#FBF8F3] hover:bg-[#65350E] transition"
          onClick={onSignup}
        >
          Sign up
        </button>
        <button
          className="px-5 py-2 rounded-full font-semibold border border-[#B48665] text-[#B48665] hover:bg-[#B48665] hover:text-[#FBF8F3] transition"
          onClick={onLogin}
        >
          Sign in
        </button>
      </div>
    </nav>
  );
}
