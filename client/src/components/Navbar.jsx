import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 py-4 text-white backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Pulang
        </p>
        <h1 className="text-lg font-semibold">AI Copilot</h1>
      </div>
      <button
        onClick={logout}
        className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/30 hover:bg-white/20"
      >
        Logout
      </button>
    </div>
  );
}
