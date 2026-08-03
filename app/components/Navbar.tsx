import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="font-semibold">
        {/* TODO: wordmark/logo */}
        Re-Chord
      </Link>

      <div className="flex items-center gap-4">
        {/* TODO: real routes + styling once auth exists */}
        <Link href="/browse">Browse</Link>
        <Link href="/login">Sign in</Link>
      </div>
    </nav>
  );
}
