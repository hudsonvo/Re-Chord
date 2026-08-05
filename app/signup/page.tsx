import Link from "next/link";
import { signup } from "./actions";

export default function Signup() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <form action={signup} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Sign up</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />

        <button type="submit" className="rounded-full bg-foreground px-5 py-2 text-background">
          Sign up
        </button>

        <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          Already have an account? Log in
        </Link>
      </form>
    </main>
  );
}
