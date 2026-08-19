import { searchAlbums } from "@/lib/spotify";
import AlbumResults from "../components/AlbumResults.tsx";

export default async function Browse({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const albums = q ? await searchAlbums(q) : [];

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12">
      <form className="w-full max-w-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search albums"
          className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
      </form>

      <AlbumResults query={q ?? ""} initialAlbums={albums} />
    </main>
  );
}
