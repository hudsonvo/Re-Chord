import Image from "next/image";
import Link from "next/link";
import AlbumRow from "./components/AlbumRow";
import AlbumResults from "./components/AlbumResults";
import RecentReviews from "./components/RecentReviews";
import { getPopularAlbums } from "@/lib/popular";
import { getTrendingAlbums } from "@/lib/trending";
import { getRecentReviews } from "@/lib/reviews";
import { searchArtists, searchAlbums, searchTracks } from "@/lib/spotify";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();

  return (
    <main className="flex flex-1 flex-col items-center px-6 pt-8">
      {!q && (
        <section className="flex flex-col items-center gap-4 py-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">Re-Chord</h1>
          <p className="max-w-md text-zinc-500">
            Rate and review the music you listen to.
          </p>

          {!session?.user && (
            <Link
              href="/signup"
              className="rounded-full bg-foreground px-5 py-2 text-background"
            >
              Get Started
            </Link>
          )}
        </section>
      )}

      {q ? (
        <SearchResults query={q} />
      ) : (
        <Discover />
      )}
    </main>
  );
}

async function SearchResults({ query }: { query: string }) {
  const [artist, albums, tracks] = await Promise.all([
    searchArtists(query),
    searchAlbums(query),
    searchTracks(query),
  ]);

  return (
    <>
      {artist && (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            {artist.images?.[0]?.url && (
              <Image
                src={artist.images[0].url}
                alt={artist.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-xs text-zinc-500">Artist</p>
            <h2 className="text-xl font-semibold">{artist.name}</h2>
          </div>
        </div>
      )}

      {albums.length > 0 && (
        <>
          <h3 className="mt-10 mb-4 w-full max-w-5xl text-sm font-medium text-zinc-500">
            Albums
          </h3>
          <AlbumResults query={query} initialAlbums={albums} />
        </>
      )}

      {tracks.length > 0 && (
        <div className="mt-10 w-full max-w-5xl">
          <h3 className="mb-2 text-sm font-medium text-zinc-500">Songs</h3>
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {tracks.map((track: any) => (
              <li key={track.id}>
                <Link
                  href={`/tracks/${track.id}`}
                  className="-mx-2 flex items-center gap-4 rounded px-2 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                    {track.album?.images?.[0]?.url && (
                      <Image
                        src={track.album.images[0].url}
                        alt={track.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-zinc-500">
                      {track.artists[0]?.name ?? "Unknown"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

async function Discover() {
  const [popularAlbums, trendingAlbums, recentReviews] = await Promise.all([
    getPopularAlbums(),
    getTrendingAlbums(),
    getRecentReviews(),
  ]);

  return (
    <>
      <section className="w-full max-w-5xl py-8">
        <AlbumRow
          title="Popular right now"
          albums={popularAlbums.map((album: any) => ({
            id: album.id,
            title: album.name,
            artist: album.artists[0]?.name ?? "Unknown",
            coverUrl: album.images[0]?.url,
          }))}
        />
      </section>

      {trendingAlbums.length > 0 && (
        <section className="w-full max-w-5xl py-8">
          <AlbumRow title="Trending on Re-Chord" albums={trendingAlbums} />
        </section>
      )}

      {recentReviews.length > 0 && (
        <section className="w-full max-w-5xl py-8 pb-16">
          <h2 className="mb-4 text-lg font-medium">Recent reviews</h2>
          <RecentReviews reviews={recentReviews} />
        </section>
      )}
    </>
  );
}
