import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { UNLOCK_THRESHOLD } from "@/lib/ranking";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [userResult, statsResult, previewResult] = await Promise.all([
    pool.query(
      "SELECT username, display_name, avatar_url, created_at FROM users WHERE id = $1",
      [session.user.id]
    ),
    pool.query(
      `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE sentiment = 'liked') AS liked_count,
         COUNT(*) FILTER (WHERE sentiment = 'fine') AS fine_count,
         COUNT(*) FILTER (WHERE sentiment = 'disliked') AS disliked_count
       FROM reviews
       WHERE user_id = $1`,
      [session.user.id]
    ),
    pool.query(
      `SELECT reviews.rating, albums.id AS album_id, albums.title, albums.artist_name,
              albums.cover_url
       FROM reviews
       JOIN albums ON reviews.album_id = albums.id
       WHERE reviews.user_id = $1
       ORDER BY reviews.rating DESC
       LIMIT 5`,
      [session.user.id]
    ),
  ]);

  const user = userResult.rows[0];
  const stats = statsResult.rows[0];
  const preview = previewResult.rows;

  const total = Number(stats.total);
  const unlocked = total >= UNLOCK_THRESHOLD;

  const joined = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-2xl flex-col items-center gap-3 text-center">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.display_name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-500">
              {user.display_name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{user.display_name}</h1>
          <p className="text-sm text-zinc-500">
            @{user.username} · Joined {joined}
          </p>
        </div>
      </div>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold">{total}</p>
          <p className="text-xs text-zinc-500">Ranked</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{stats.liked_count}</p>
          <p className="text-xs text-zinc-500">Liked</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{stats.fine_count}</p>
          <p className="text-xs text-zinc-500">Fine</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{stats.disliked_count}</p>
          <p className="text-xs text-zinc-500">Disliked</p>
        </div>
      </div>

      <div className="mt-10 w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Top Rankings</h2>
          <Link href="/lists" className="text-sm text-zinc-500 hover:underline">
            View all
          </Link>
        </div>

        {preview.length === 0 ? (
          <p className="text-sm text-zinc-500">
            You haven&apos;t rated anything yet — go find an album to rate!
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {preview.map((review, index) => (
              <li key={review.album_id}>
                <Link
                  href={`/albums/${review.album_id}`}
                  className="-mx-2 flex items-center gap-4 rounded px-2 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span className="w-5 text-sm text-zinc-500">{index + 1}</span>
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
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
                    <span className="text-sm font-medium text-zinc-500">
                      {review.rating.toFixed(1)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
