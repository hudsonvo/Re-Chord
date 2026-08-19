import { searchArtists, searchAlbums, searchTracks } from "@/lib/spotify";
import AlbumResults from "../components/AlbumResults.tsx";

export default async function Browse({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const artist = q ? await searchArtists(q) : null;
  const albums = q ? await searchAlbums(q) : [];
  const tracks = q ? await searchTracks(q) : [];

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <form className="w-full max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search artists, albums, or songs"
          className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </form>

      {artist && <h2 className="mt-8 text-xl font-semibold">{artist.name}</h2>}

      {albums.length > 0 && (
        <>
          <h3 className="mt-8 mb-2 w-full max-w-5xl text-sm font-medium text-zinc-500">
            Albums
          </h3>
          <AlbumResults query={q ?? ""} initialAlbums={albums} />
        </>
      )}

      {tracks.length > 0 && (
        <div className="mt-8 w-full max-w-5xl">
          <h3 className="mb-2 text-sm font-medium text-zinc-500">Songs</h3>
          <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
            {tracks.map((track: any) => (
              <li key={track.id} className="flex items-center gap-3 py-2">
                <span className="font-medium">{track.name}</span>
                <span className="text-sm text-zinc-500">
                  {track.artists[0]?.name ?? "Unknown"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
