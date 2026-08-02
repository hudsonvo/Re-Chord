export default function Login() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 py-24">
      <form className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Log in</h1>

        <input
          type="email"
          placeholder="Email"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
        <input
          type="password"
          placeholder="Password"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />

        <button type="submit" className="rounded-full bg-foreground px-5 py-2 text-background">
          Log in
        </button>
      </form>
    </main>
  );
}
