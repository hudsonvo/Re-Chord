"use server";

import { searchAlbums } from "@/lib/spotify";

export async function loadMoreAlbums(query: string, offset: number) {
  return searchAlbums(query, offset);
}
