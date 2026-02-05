import { useState } from "react";
import api from "../services/api";
import Message from "./Message";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "user", text: input }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await api.post("/chat", { question: input });
      setMessages((m) => [...m, { role: "ai", ...res.data }]);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Sorry, I couldn't get a response. Please try again.";
      setMessages((m) => [
        ...m,
        { role: "ai", answer: message, sources: [] }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-[520px] flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.8)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Chat
          </p>
          <h3 className="text-base font-semibold text-white">
            Ask your documents
          </h3>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
          {isSending ? "Thinking..." : "Ready"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <Message key={i} {...m} />
        ))}
      </div>
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-3">
        <input
          className="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          disabled={isSending}
        />
        <button
          onClick={send}
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_30px_-20px_rgba(226,232,240,0.9)] transition hover:-translate-y-0.5 disabled:opacity-60"
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Tip: Ask for summaries, action items, or specific sources.
        </p>
      </div>
    </div>
  );
}
