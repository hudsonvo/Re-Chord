"use client";

import { useState } from "react";
import AlbumCard from "./AlbumCard";
import { loadMoreAlbums } from "@/app/browse/actions";

type Album = {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
};

export default function AlbumResults({
  query,
  initialAlbums,
}: {
  query: string;
  initialAlbums: Album[];
}) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [offset, setOffset] = useState(initialAlbums.length);

  async function handleLoadMore() {
    const nextAlbums = await loadMoreAlbums(query, offset);
    setAlbums([...albums, ...nextAlbums]);
    setOffset(offset + nextAlbums.length);
  }

  return (
    <>
      <div className="mt-8 grid w-full max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            id={album.id}
            title={album.name}
            artist={album.artists[0]?.name ?? "Unknown"}
            coverUrl={album.images[0]?.url}
          />
        ))}
      </div>

      {albums.length > 0 && (
        <button
          onClick={handleLoadMore}
          className="mt-6 rounded-full border border-zinc-300 px-5 py-2 dark:border-zinc-700"
        >
          Load more
        </button>
      )}
    </>
  );
}
