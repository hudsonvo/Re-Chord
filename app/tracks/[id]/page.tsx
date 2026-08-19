import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getTrack } from "@/lib/spotify";
import { formatDuration } from "@/lib/format";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const existing = await pool.query("SELECT * FROM tracks WHERE spotify_id = $1", [id]);
  let track = existing.rows[0];

  if (!track) {
    const spotifyTrack = await getTrack(id);
    if (!spotifyTrack) notFound();

    const inserted = await pool.query(
      `INSERT INTO tracks (spotify_id, title, artist_name, artist_spotify_id, duration_ms)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        spotifyTrack.id,
        spotifyTrack.name,
        spotifyTrack.artists[0]?.name ?? "Unknown",
        spotifyTrack.artists[0]?.id ?? null,
        spotifyTrack.duration_ms,
      ]
    );
    track = inserted.rows[0];
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12 text-center">
      <h1 className="text-2xl font-semibold">{track.title}</h1>
      <p className="text-zinc-500">{track.artist_name}</p>
      <p className="mt-2 text-sm text-zinc-500">{formatDuration(track.duration_ms)}</p>
    </main>
  );
}
