import Link from "next/link";
import AlbumCard from "./components/AlbumCard";
import { getPopularAlbums } from "@/lib/popular";

export default async function Home() {
  const albums = await getPopularAlbums();

  return (
    <main className="flex flex-1 flex-col items-center px-6">
      <section className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-4xl font-semibold">Re-Chord</h1>
        <p className="max-w-md">Rate and review the music you listen to.</p>
        <Link href="/signup" className="rounded-full bg-foreground px-5 py-2 text-background">
          Get Started
        </Link>
      </section>

      <section className="w-full max-w-5xl py-12">
        <h2 className="mb-4 text-lg font-medium">Popular right now</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {albums.map((album: any) => (
            <AlbumCard
              key={album.id}
              id={album.id}
              title={album.name}
              artist={album.artists[0]?.name ?? "Unknown"}
              coverUrl={album.images[0]?.url}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
