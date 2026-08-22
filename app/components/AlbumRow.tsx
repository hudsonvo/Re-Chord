"use client";

import { useRef } from "react";
import AlbumCard from "./AlbumCard";

type AlbumRowItem = {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
};

export default function AlbumRow({
  title,
  albums,
}: {
  title: string;
  albums: AlbumRowItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * container.clientWidth,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="rounded-full border border-zinc-300 p-2 dark:border-zinc-700"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="rounded-full border border-zinc-300 p-2 dark:border-zinc-700"
          >
            →
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {albums.map((album) => (
          <div key={album.id} className="w-40 flex-shrink-0">
            <AlbumCard
              id={album.id}
              title={album.title}
              artist={album.artist}
              coverUrl={album.coverUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
