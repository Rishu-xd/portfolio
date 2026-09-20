import { NextResponse } from "next/server";

type SpotifyTokenResponse = {
  access_token: string;
};

type SpotifyCurrentlyPlaying = {
  is_playing: boolean;
  item?: {
    name: string;
    external_urls?: { spotify?: string };
    artists: { name: string }[];
    album: {
      name: string;
      images: { url: string }[];
    };
  };
};

const idleResponse = () => NextResponse.json({ isPlaying: false });

async function getAccessToken() {
  if (process.env.SPOTIFY_ACCESS_TOKEN) return process.env.SPOTIFY_ACCESS_TOKEN;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) return null;

  const token = await tokenResponse.json() as SpotifyTokenResponse;
  return token.access_token;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return idleResponse();

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (response.status === 204 || response.status === 401) return idleResponse();
    if (!response.ok) return NextResponse.json({ error: "Spotify is temporarily unavailable." }, { status: 502 });

    const track = await response.json() as SpotifyCurrentlyPlaying;
    if (!track.is_playing || !track.item) return idleResponse();

    return NextResponse.json({
      isPlaying: true,
      title: track.item.name,
      artist: track.item.artists.map((artist) => artist.name).join(", "),
      album: track.item.album.name,
      albumImageUrl: track.item.album.images[0]?.url,
      songUrl: track.item.external_urls?.spotify,
    });
  } catch {
    return idleResponse();
  }
}
