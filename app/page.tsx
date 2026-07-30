import Link from "next/link";
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
        {/* TODO: section heading, e.g. "Popular this week" */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* TODO: map over placeholder albums array -> AlbumCard */}
        </div>
      </section>
    </main>
  );
}
