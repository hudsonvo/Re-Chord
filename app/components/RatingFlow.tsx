"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SentimentPicker from "./SentimentPicker";
import ComparisonFlow from "./ComparisonFlow";
import { Sentiment } from "@/lib/ranking";
import { getBucketReviews, submitReview } from "@/app/actions";

type ExistingItem = { id: string; title: string; artist: string };

export default function RatingFlow({
  albumId,
  albumTitle,
  albumArtist,
}: {
  albumId: string;
  albumTitle: string;
  albumArtist: string;
}) {
  const router = useRouter();
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [existingItems, setExistingItems] = useState<ExistingItem[] | null>(null);
  const [done, setDone] = useState(false);

  async function handleSentimentSelect(chosen: Sentiment) {
    const items = await getBucketReviews(chosen);
    setSentiment(chosen);
    setExistingItems(items);
  }

  async function handleComparisonComplete(index: number) {
    if (!sentiment || !existingItems) return;

    await submitReview({
      albumId,
      sentiment,
      existingIds: existingItems.map((item) => item.id),
      index,
    });

    setDone(true);
    router.refresh();
  }

  if (done) {
    return <p className="text-sm text-zinc-500">Rated!</p>;
  }

  if (!sentiment || !existingItems) {
    return <SentimentPicker onSelect={handleSentimentSelect} />;
  }

  return (
    <ComparisonFlow
      newItem={{ title: albumTitle, artist: albumArtist }}
      existingItems={existingItems}
      onComplete={handleComparisonComplete}
    />
  );
}
