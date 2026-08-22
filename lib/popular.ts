import { unstable_cache } from "next/cache";
import { getTopTracks } from "./lastfm";
import { findTrack } from "./spotify";

async function fetchPopularAlbums() {
  const topTracks = await getTopTracks(25);

  const matches = await Promise.all(
    topTracks.map((track: any) => findTrack(track.name, track.artist.name))
  );

  const albums = new Map();
  for (const match of matches) {
    if (match?.album && !albums.has(match.album.id)) {
      albums.set(match.album.id, match.album);
    }
  }

  return Array.from(albums.values()).slice(0, 12);
}

export const getPopularAlbums = unstable_cache(fetchPopularAlbums, ["popular-albums"], {
  revalidate: 3600,
});
