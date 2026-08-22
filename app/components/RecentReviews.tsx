import Image from "next/image";
import Link from "next/link";
import { UNLOCK_THRESHOLD } from "@/lib/ranking";

type Review = {
  id: string;
  rating: number;
  display_name: string;
  album_id: string;
  title: string;
  artist_name: string;
  cover_url: string | null;
  reviewer_count: string;
};

export default function RecentReviews({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      {reviews.map((review) => {
        const unlocked = Number(review.reviewer_count) >= UNLOCK_THRESHOLD;

        return (
          <li key={review.id}>
            <Link
              href={`/albums/${review.album_id}`}
              className="-mx-2 flex items-center gap-4 rounded px-2 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800">
                {review.cover_url && (
                  <Image
                    src={review.cover_url}
                    alt={review.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{review.display_name}</span> rated{" "}
                  <span className="font-medium">{review.title}</span>
                </p>
                <p className="text-sm text-zinc-500">{review.artist_name}</p>
              </div>
              <span className="text-sm font-medium text-zinc-500">
                {unlocked ? review.rating.toFixed(1) : "rated it"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
