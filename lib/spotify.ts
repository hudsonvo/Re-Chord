let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60_000,
  };

  return cachedToken.value;
}


export async function searchAlbums(query: string, offset = 0) {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: "album",
    limit: "10",
    offset: String(offset),
  });


  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
        },
    })

    const data = await response.json()
    return data.albums.items
}

export async function searchArtists(query: string) {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: "artist",
    limit: "1",
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.artists.items[0] ?? null;
}

export async function searchTracks(query: string) {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: "5",
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.tracks.items;
}

export async function getAlbum(id: string) {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function getTrack(id: string) {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function getAlbumTracks(albumId: string) {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data.items;
}

export async function getArtistAlbums(artistId: string, offset = 0) {
  const token = await getAccessToken();

  const params = new URLSearchParams({
    include_groups: "album,single",
    limit: "10",
    offset: String(offset),
  });

  const response = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/albums?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.items;
}