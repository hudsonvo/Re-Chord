export type Sentiment = "liked" | "fine" | "disliked";

export const UNLOCK_THRESHOLD = 5;

const TIER_RANGES: Record<Sentiment, [number, number]> = {
  liked: [7.0, 10.0],
  fine: [4.0, 6.9],
  disliked: [1.0, 3.9],
};

export function scoreAtRank(sentiment: Sentiment, index: number, count: number) {
  const [min, max] = TIER_RANGES[sentiment];

  if (count === 1) {
    return (min + max) / 2;
  }

  const step = (max - min) / (count - 1);
  return Math.round((max - index * step) * 10) / 10;
}

export function recomputeBucketScores(sentiment: Sentiment, orderedIds: string[]) {
  const count = orderedIds.length;
  return orderedIds.map((id, index) => ({
    id,
    rating: scoreAtRank(sentiment, index, count),
  }));
}
