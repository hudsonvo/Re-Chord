"use client";

import { Sentiment } from "@/lib/ranking";

export default function SentimentPicker({
  onSelect,
}: {
  onSelect: (sentiment: Sentiment) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onSelect("liked")}
        className="rounded-full border border-zinc-300 px-4 py-2 dark:border-zinc-700"
      >
        Liked it
      </button>
      <button
        type="button"
        onClick={() => onSelect("fine")}
        className="rounded-full border border-zinc-300 px-4 py-2 dark:border-zinc-700"
      >
        It was fine
      </button>
      <button
        type="button"
        onClick={() => onSelect("disliked")}
        className="rounded-full border border-zinc-300 px-4 py-2 dark:border-zinc-700"
      >
        Didn't like it
      </button>
    </div>
  );
}
