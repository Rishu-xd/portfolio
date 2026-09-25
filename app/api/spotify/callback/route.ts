import { NextRequest, NextResponse } from "next/server";

const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? "http://127.0.0.1:3000/api/spotify/callback";

type SpotifyTokenResponse = {
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const savedState = request.cookies.get("spotify_oauth_state")?.value;

  if (requestUrl.searchParams.get("error")) {
    return NextResponse.json({ error: "Spotify authorization was cancelled." }, { status: 400 });
  }

  if (!code || !state || state !== savedState) {
    return NextResponse.json({ error: "Invalid Spotify authorization state." }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Spotify credentials are not configured." }, { status: 500 });
  }

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const token = await tokenResponse.json() as SpotifyTokenResponse;
  if (!tokenResponse.ok || !token.refresh_token) {
    return NextResponse.json(
      { error: token.error_description ?? "Spotify did not return a refresh token." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ refresh_token: token.refresh_token });
  response.cookies.delete("spotify_oauth_state");
  return response;
}
