import { searchAlbums } from "@/lib/spotify";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const albums = await searchAlbums(query);
  return Response.json(albums);
}
