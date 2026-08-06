import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="font-semibold">
        {/* TODO: wordmark/logo */}
        Re-Chord
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/browse">Browse</Link>
        {session?.user ? (
          <UserMenu name={session.user.name ?? "Account"} />
        ) : (
          <Link href="/login">Sign in</Link>
        )}
      </div>
    </nav>
  );
}
