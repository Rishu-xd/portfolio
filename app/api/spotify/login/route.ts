import { NextResponse } from "next/server";

const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? "http://127.0.0.1:3000/api/spotify/callback";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "SPOTIFY_CLIENT_ID is not configured." }, { status: 500 });
  }

  const state = crypto.randomUUID();
  const authorizationUrl = new URL("https://accounts.spotify.com/authorize");
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "user-read-currently-playing user-read-playback-state",
    state,
  }).toString();

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    maxAge: 600,
    path: "/api/spotify/callback",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
