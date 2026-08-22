"use server";

import { signOut } from "@/auth";
import { auth } from "@/auth";
import pool from "@/lib/db";
import { recomputeBucketScores, Sentiment } from "@/lib/ranking";
import { searchAlbums } from "@/lib/spotify";

export async function logout() {
  await signOut({ redirectTo: "/" });
}

export async function loadMoreAlbums(query: string, offset: number) {
  return searchAlbums(query, offset);
}

export async function getBucketReviews(sentiment: Sentiment) {
  const session = await auth();
  if (!session?.user) return [];

  const result = await pool.query(
    `SELECT reviews.id, albums.title, albums.artist_name AS artist
     FROM reviews
     JOIN albums ON reviews.album_id = albums.id
     WHERE reviews.user_id = $1 AND reviews.sentiment = $2
     ORDER BY reviews.rating DESC`,
    [session.user.id, sentiment]
  );

  return result.rows;
}

export async function submitReview({
  albumId,
  sentiment,
  existingIds,
  index,
}: {
  albumId: string;
  sentiment: Sentiment;
  existingIds: string[];
  index: number;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Not signed in");

  const orderedIds = [...existingIds];
  orderedIds.splice(index, 0, "new");

  const scores = recomputeBucketScores(sentiment, orderedIds);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      const rating = scores[i].rating;

      if (id === "new") {
        await client.query(
          `INSERT INTO reviews (rating, sentiment, user_id, album_id)
           VALUES ($1, $2, $3, $4)`,
          [rating, sentiment, session.user.id, albumId]
        );
      } else {
        await client.query("UPDATE reviews SET rating = $1 WHERE id = $2", [rating, id]);
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
