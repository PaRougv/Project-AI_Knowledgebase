import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";
import DocumentPanel from "../components/DocumentPanel";

export default function Dashboard() {
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const message = sessionStorage.getItem("flash");
    if (!message) return;
    setFlash(message);
    sessionStorage.removeItem("flash");
    const timer = setTimeout(() => setFlash(""), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-6 pb-6 pt-4">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-4">
          {flash && (
            <div className="rounded-2xl border border-emerald-200/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-100 shadow-[0_15px_40px_-30px_rgba(16,185,129,0.6)]">
              {flash}
            </div>
          )}
          <DocumentPanel />
          <Chat />
        </div>
      </div>
    </div>
  );
}
