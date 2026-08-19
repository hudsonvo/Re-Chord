import Image from "next/image";

type AlbumCardProps = {
  title: string;
  artist: string;
  coverUrl?: string;
};

export default function AlbumCard({ title, artist, coverUrl }: AlbumCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square bg-zinc-200 dark:bg-zinc-800">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(min-width: 640px) 25vw, 50vw"
            className="object-cover"
          />
        )}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-500">{artist}</p>
      </div>
    </div>
  );
}
