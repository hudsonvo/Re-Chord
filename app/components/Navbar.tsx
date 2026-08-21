import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-black">
      <Link href="/" className="font-semibold">
        {/* TODO: wordmark/logo */}
        Re-Chord
      </Link>

      <form action="/" className="max-w-md flex-1 sm:mx-8">
        <input
          type="text"
          name="q"
          placeholder="Search artists, albums, or songs"
          className="w-full rounded-full border border-zinc-300 px-4 py-1.5 text-sm dark:border-zinc-700"
        />
      </form>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Link href="/lists">My Lists</Link>
            <UserMenu name={session.user.name ?? "Account"} />
          </>
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
