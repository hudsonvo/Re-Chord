import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { getAlbum, getAlbumTracks } from "@/lib/spotify";
import { formatDuration } from "@/lib/format";
import { auth } from "@/auth";
import RatingFlow from "@/app/components/RatingFlow";
import { UNLOCK_THRESHOLD } from "@/lib/ranking";

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
  const session = await auth();

  let ownReview = null;
  let reviewCount = 0;

  if (session?.user) {
    const [reviewResult, countResult] = await Promise.all([
      pool.query("SELECT rating FROM reviews WHERE user_id = $1 AND album_id = $2", [
        session.user.id,
        album.id,
      ]),
      pool.query("SELECT COUNT(*) FROM reviews WHERE user_id = $1", [session.user.id]),
    ]);

    ownReview = reviewResult.rows[0] ?? null;
    reviewCount = Number(countResult.rows[0].count);
  }

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

      {session?.user && (
        <div className="mt-6">
          {ownReview ? (
            reviewCount >= UNLOCK_THRESHOLD ? (
              <p className="text-lg font-medium">
                Your rating: {ownReview.rating.toFixed(1)}
              </p>
            ) : (
              <p className="text-sm text-zinc-500">
                Rank {UNLOCK_THRESHOLD - reviewCount} more album
                {UNLOCK_THRESHOLD - reviewCount === 1 ? "" : "s"} to unlock your ratings
              </p>
            )
          ) : (
            <RatingFlow
              albumId={album.id}
              albumTitle={album.title}
              albumArtist={album.artist_name}
            />
          )}
        </div>
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
