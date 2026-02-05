import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
    } catch (error) {
      const message = error?.response?.data?.message;
      if (error?.response?.status === 404 || message === "USER_NOT_FOUND") {
        sessionStorage.setItem("prefill_email", email);
        sessionStorage.setItem(
          "flash",
          "We couldn't find your account, so we started a new registration for you."
        );
        navigate("/register");
        return;
      }
      alert(message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.85)] backdrop-blur-xl">
          <div className="mb-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pulang</p>
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
            <p className="text-sm text-slate-300">
              Sign in to continue your document chat session.
            </p>
          </div>
          <div className="space-y-3">
            <input
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={submit}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-slate-100 via-white to-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_-20px_rgba(226,232,240,0.9)] transition hover:-translate-y-0.5"
          >
            Login
          </button>
          <p className="mt-5 text-xs text-slate-400">
            By continuing, you agree to secure storage of your chat history.
          </p>
        </div>
      </div>
    </div>
  );
}
