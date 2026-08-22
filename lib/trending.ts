import pool from "./db";

export async function getTrendingAlbums() {
  const result = await pool.query(
    `SELECT albums.id, albums.title, albums.artist_name AS artist,
            albums.cover_url AS "coverUrl", COUNT(*) AS review_count
     FROM reviews
     JOIN albums ON reviews.album_id = albums.id
     GROUP BY albums.id
     ORDER BY review_count DESC
     LIMIT 12`
  );

  return result.rows;
}
