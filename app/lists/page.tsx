import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { UNLOCK_THRESHOLD } from "@/lib/ranking";

export default async function ListsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const result = await pool.query(
    `SELECT reviews.rating, reviews.sentiment, albums.id AS album_id, albums.title,
            albums.artist_name, albums.cover_url
     FROM reviews
     JOIN albums ON reviews.album_id = albums.id
     WHERE reviews.user_id = $1
     ORDER BY reviews.rating DESC`,
    [session.user.id]
  );

  const reviews = result.rows;
  const unlocked = reviews.length >= UNLOCK_THRESHOLD;
  const remaining = UNLOCK_THRESHOLD - reviews.length;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <h1 className="text-2xl font-semibold">My Lists</h1>

      {!unlocked && reviews.length > 0 && (
        <p className="mt-4 text-sm text-zinc-500">
          Rank {remaining} more album{remaining === 1 ? "" : "s"} to unlock your rankings
        </p>
      )}

      {reviews.length === 0 && (
        <p className="mt-8 text-sm text-zinc-500">
          You haven&apos;t rated anything yet — go find an album to rate!
        </p>
      )}

      <ul className="mt-8 w-full max-w-md divide-y divide-zinc-200 dark:divide-zinc-800">
        {reviews.map((review, index) => (
          <li key={review.album_id}>
            <Link
              href={`/albums/${review.album_id}`}
              className="flex items-center gap-4 py-3 hover:underline"
            >
              <span className="w-6 text-sm text-zinc-500">{index + 1}</span>
              <div className="relative h-12 w-12 flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
                {review.cover_url && (
                  <Image
                    src={review.cover_url}
                    alt={review.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{review.title}</p>
                <p className="text-sm text-zinc-500">{review.artist_name}</p>
              </div>
              {unlocked && (
                <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
