export default function Message({ role, text, answer, sources }) {
  const content = role === "user" ? text : answer;

  return (
    <div className={`mb-4 flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-[0_10px_30px_-22px_rgba(15,23,42,0.7)] ${
          role === "user"
            ? "bg-gradient-to-r from-slate-200 via-white to-slate-100 text-slate-900"
            : "bg-slate-900/60 text-slate-100"
        }`}
      >
        <div className="leading-relaxed">{content}</div>
        {sources?.length > 0 && (
          <div className="mt-2 text-xs uppercase tracking-wide text-slate-400">
            Sources: {sources.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
