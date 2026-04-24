"use client";

import { useState } from "react";
import type { Evidence } from "../dashboard-data";

type TaskEvidenceProps = {
  evidence: Evidence[];
  onAddEvidence: (linkTitle: string, url: string) => void;
  onDeleteEvidence: (id: string) => void;
};

export default function TaskEvidence({
  evidence,
  onAddEvidence,
  onDeleteEvidence,
}: TaskEvidenceProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newUrl.trim()) {
      onAddEvidence(newTitle, newUrl);
      setNewTitle("");
      setNewUrl("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Evidence</p>
        <div className="mt-3 overflow-x-auto">
          {evidence.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No evidence submitted yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">
                    Time
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">
                    Link
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {evidence.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)]">
                    <td className="px-3 py-2 text-[var(--foreground)]">{item.time}</td>
                    <td className="px-3 py-2 text-[var(--foreground)]">{item.date}</td>
                    <td className="px-3 py-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--signal-blue)] hover:underline"
                      >
                        {item.linkTitle}
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onDeleteEvidence(item.id)}
                        className="rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 rounded-2xl border border-[var(--border)] bg-white p-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
          Link title
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Assignment submission"
            className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
          URL
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/file.pdf"
            className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--signal-blue)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add evidence
        </button>
      </form>
    </div>
  );
}
