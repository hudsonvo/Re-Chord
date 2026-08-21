export async function getTopTracks(limit = 15) {
  const params = new URLSearchParams({
    method: "chart.gettoptracks",
    api_key: process.env.LASTFM_API_KEY!,
    format: "json",
    limit: String(limit),
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`);
  const data = await response.json();
  return data.tracks.track;
}
