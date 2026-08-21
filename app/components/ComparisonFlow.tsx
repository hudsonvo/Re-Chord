"use client";

import { useEffect, useState } from "react";

type ComparisonItem = {
  id: string;
  title: string;
  artist: string;
};

export default function ComparisonFlow({
  newItem,
  existingItems,
  onComplete,
}: {
  newItem: { title: string; artist: string };
  existingItems: ComparisonItem[];
  onComplete: (index: number) => void;
}) {
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(existingItems.length);

  useEffect(() => {
    if (low >= high) {
      onComplete(low);
    }
  }, [low, high, onComplete]);

  if (low >= high) {
    return null;
  }

  const mid = Math.floor((low + high) / 2);
  const opponent = existingItems[mid];

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-zinc-500">Which do you prefer?</p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setHigh(mid)}
          className="rounded border border-zinc-300 px-6 py-4 text-left dark:border-zinc-700"
        >
          <p className="font-medium">{newItem.title}</p>
          <p className="text-sm text-zinc-500">{newItem.artist}</p>
        </button>
        <button
          type="button"
          onClick={() => setLow(mid + 1)}
          className="rounded border border-zinc-300 px-6 py-4 text-left dark:border-zinc-700"
        >
          <p className="font-medium">{opponent.title}</p>
          <p className="text-sm text-zinc-500">{opponent.artist}</p>
        </button>
      </div>
    </div>
  );
}
