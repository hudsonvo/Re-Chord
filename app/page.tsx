import Link from "next/link";
import AlbumCard from "./components/AlbumCard";

const placeholderAlbums = [
  { title: "Album One", artist: "Artist One" },
  { title: "Album Two", artist: "Artist Two" },
  { title: "Album Three", artist: "Artist Three" },
  { title: "Album Four", artist: "Artist Four" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6">
      <section className="flex flex-col items-center gap-4 py-24 text-center">
        {/* TODO: pitch copy */}
        <h1 className="text-4xl font-semibold">Re-Chord</h1>
        <p className="max-w-md">Rate and review the music you listen to.</p>
        <Link href="/signup" className="rounded-full bg-foreground px-5 py-2 text-background">
          Get Started
        </Link>
      </section>

      <section className="w-full max-w-5xl py-12">
        <h2 className="mb-4 text-lg font-medium">Popular this week</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {placeholderAlbums.map((album) => (
            <AlbumCard key={album.title} title={album.title} artist={album.artist} />
          ))}
        </div>
      </section>
    </main>
  );
}
