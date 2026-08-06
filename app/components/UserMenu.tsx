"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/actions";

export default function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>{name}</button>

      {open && (
        <div className="absolute right-0 mt-2 flex flex-col rounded border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-black">
          <Link href="/account" className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            Account
          </Link>
          <form action={logout}>
            <button type="submit" className="w-full px-4 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900">
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
