"use client";

import { useState } from "react";
import type { Rating } from "../dashboard-data";

type TaskRatingsProps = {
  ratings: Rating[];
  onAddRating: (category: string, value: number) => void;
  onDeleteRating: (id: string) => void;
};

export default function TaskRatings({
  ratings,
  onAddRating,
  onDeleteRating,
}: TaskRatingsProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newValue, setNewValue] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddRating(newCategory, newValue);
      setNewCategory("");
      setNewValue(5);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Ratings</p>
        <div className="mt-3 space-y-3">
          {ratings.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No ratings yet</p>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {rating.category}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {[...Array(10)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-2 rounded-full ${
                          idx < rating.value
                            ? "bg-[var(--signal-blue)]"
                            : "bg-[var(--border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {rating.value}/10 by {rating.author}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteRating(rating.id)}
                  className="flex-shrink-0 rounded border border-[var(--signal-red)] px-2 py-1 text-xs font-medium text-[var(--signal-red)] transition hover:bg-[var(--signal-red)]/10"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-[var(--border)] bg-white p-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
          Category
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g., Accuracy, Completeness"
            className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none transition focus:border-[var(--signal-blue)]"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
          Rating (1-10)
          <input
            type="range"
            min="1"
            max="10"
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-[var(--muted)]">{newValue}/10</span>
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--signal-blue)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add rating
        </button>
      </form>
    </div>
  );
}
