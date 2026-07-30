type AlbumCardProps = {
    title: string;
    artist: string;
    coverUrl?: string;
}

export default function AlbumCard({ title, artist, coverUrl }: AlbumCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-square bg-zinc-200 dark:bg-zinc-800">
        {/* TODO: swap for next/image once real Spotify cover URLs exist */}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-500">{artist}</p>
      </div>
    </div>
  );
}