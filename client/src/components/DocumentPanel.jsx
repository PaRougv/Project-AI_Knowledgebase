import { useEffect, useState } from "react";
import api from "../services/api";

export default function DocumentPanel() {
  const [sources, setSources] = useState([]);
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const loadSources = async () => {
    try {
      const res = await api.get("/documents/sources");
      setSources(res.data.sources || []);
    } catch (error) {
      setStatus("Failed to load sources.");
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const seedDocs = async () => {
    setIsBusy(true);
    setStatus("Seeding mock documents...");
    try {
      const res = await api.post("/documents/seed");
      setStatus(
        `Seeded ${res.data.documents} documents (${res.data.chunksStored} chunks).`
      );
      await loadSources();
    } catch (error) {
      setStatus(
        error?.response?.data?.message || "Seeding failed. Check server logs."
      );
    } finally {
      setIsBusy(false);
    }
  };

  const uploadDoc = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsBusy(true);
    setStatus(`Uploading ${file.name}...`);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatus(
        `Uploaded ${file.name} (${res.data.chunksStored} chunks).`
      );
      await loadSources();
    } catch (error) {
      setStatus(
        error?.response?.data?.message || "Upload failed. Check server logs."
      );
    } finally {
      setIsBusy(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-100 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.8)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Knowledge Base
          </p>
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <p className="text-sm text-slate-400">
            Seed sample docs or upload your own `.txt` files.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-[0_12px_30px_-20px_rgba(226,232,240,0.8)] transition hover:-translate-y-0.5 disabled:opacity-60"
            onClick={seedDocs}
            disabled={isBusy}
          >
            Seed Mock Docs
          </button>
          <label className="cursor-pointer rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/10">
            Upload Document
            <input
              type="file"
              accept=".txt"
              onChange={uploadDoc}
              disabled={isBusy}
              className="hidden"
            />
          </label>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sources
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-slate-200">
          {sources.length ? (
            sources.map((source) => (
              <span
                key={source}
                className="rounded-full border border-white/10 bg-slate-900/50 px-3 py-1"
              >
                {source}
              </span>
            ))
          ) : (
            <span className="text-slate-500">None yet</span>
          )}
        </div>
      </div>
      {status && (
        <div className="mt-4 rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-sm text-slate-300">
          {status}
        </div>
      )}
    </div>
  );
}
