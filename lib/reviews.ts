import pool from "./db";

export async function getRecentReviews(limit = 8) {
  const result = await pool.query(
    `SELECT
       reviews.id,
       reviews.rating,
       users.display_name,
       albums.id AS album_id,
       albums.title,
       albums.artist_name,
       albums.cover_url,
       (SELECT COUNT(*) FROM reviews r2 WHERE r2.user_id = reviews.user_id) AS reviewer_count
     FROM reviews
     JOIN users ON reviews.user_id = users.id
     JOIN albums ON reviews.album_id = albums.id
     ORDER BY reviews.created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}
