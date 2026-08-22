import Image from "next/image";
import Link from "next/link";

type AlbumCardProps = {
  id?: string;
  title: string;
  artist: string;
  coverUrl?: string;
};

export default function AlbumCard({ id, title, artist, coverUrl }: AlbumCardProps) {
  const content = (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-500">{artist}</p>
      </div>
    </div>
  );

  if (!id) return content;

  return (
    <Link href={`/albums/${id}`} className="group">
      {content}
    </Link>
  );
}
