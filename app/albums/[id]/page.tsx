import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getAlbum, getAlbumTracks } from "@/lib/spotify";
import { formatDuration } from "@/lib/format";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const existing = await pool.query("SELECT * FROM albums WHERE spotify_id = $1", [id]);
  let album = existing.rows[0];

  if (!album) {
    const spotifyAlbum = await getAlbum(id);
    if (!spotifyAlbum) notFound();

    const inserted = await pool.query(
      `INSERT INTO albums (spotify_id, title, artist_name, artist_spotify_id, cover_url, release_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        spotifyAlbum.id,
        spotifyAlbum.name,
        spotifyAlbum.artists[0]?.name ?? "Unknown",
        spotifyAlbum.artists[0]?.id ?? null,
        spotifyAlbum.images[0]?.url ?? null,
        spotifyAlbum.release_date ?? null,
      ]
    );
    album = inserted.rows[0];
  }

  const tracks = await getAlbumTracks(album.spotify_id);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="relative aspect-square w-full max-w-xs bg-zinc-200 dark:bg-zinc-800">
        {album.cover_url && (
          <Image
            src={album.cover_url}
            alt={album.title}
            fill
            sizes="320px"
            className="object-cover"
          />
        )}
      </div>
      <h1 className="mt-6 text-2xl font-semibold">{album.title}</h1>
      <p className="text-zinc-500">{album.artist_name}</p>
      {album.release_date && (
        <p className="mt-1 text-sm text-zinc-500">{album.release_date}</p>
      )}

      <ul className="mt-8 w-full max-w-md divide-y divide-zinc-200 dark:divide-zinc-800">
        {tracks.map((track: any) => (
          <li key={track.id}>
            <Link
              href={`/tracks/${track.id}`}
              className="flex items-center justify-between gap-3 py-2 hover:underline"
            >
              <span>{track.name}</span>
              <span className="text-sm text-zinc-500">
                {formatDuration(track.duration_ms)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
