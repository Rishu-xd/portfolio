"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LiquidGlass } from "./ui/apple-tahoe-liquid-glass-button";
import { PROFILE } from "../app/data/portfolio";

type SpotifyState = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

export function SpotifyNavBubble({ light = false }: { light?: boolean }) {
  const [spotify, setSpotify] = useState<SpotifyState | null>(null);

  useEffect(() => {
    let active = true;

    const fetchNowPlaying = () => {
      fetch("/api/spotify-now-playing")
        .then(async (res) => {
          if (!res.ok) return;
          const data = (await res.json()) as SpotifyState;
          if (active) setSpotify(data);
        })
        .catch(() => {});
    };

    fetchNowPlaying();
    const id = window.setInterval(fetchNowPlaying, 15000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  const isPlaying = Boolean(spotify?.isPlaying && spotify?.title);

  return (
    <LiquidGlass
      asChild
      material="regular"
      appearance={light ? "light" : "dark"}
      refraction={24}
      bezel={20}
      blur={2}
      className={`flex h-9 w-[178px] shrink-0 items-center justify-between gap-2 overflow-hidden rounded-full border px-3 font-mono text-[11px] transition-colors sm:w-[205px] ${
        light
          ? "border-black/15 text-black hover:border-black/35"
          : "border-white/20 text-white hover:border-white/40"
      }`}
    >
      <a
        href={spotify?.songUrl || PROFILE.spotify}
        target="_blank"
        rel="noreferrer"
        data-cuelume-navigate
        title={
          isPlaying
            ? `Listening to ${spotify?.title} by ${spotify?.artist}`
            : "Spotify — Not currently playing"
        }
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isPlaying && spotify?.albumImageUrl ? (
            <Image
              src={spotify.albumImageUrl}
              alt={spotify.album || spotify.title || "Album Art"}
              width={22}
              height={22}
              className="size-[22px] shrink-0 rounded-full object-cover animate-[spin_10s_linear_infinite]"
            />
          ) : (
            <Image
              src="/spotify.png"
              alt="Spotify"
              width={18}
              height={18}
              className="size-[18px] shrink-0 object-contain"
            />
          )}

          <div className="min-w-0 flex-1 truncate">
            {isPlaying ? (
              <div className="truncate text-[10px] leading-tight">
                <span className="font-semibold">{spotify?.title}</span>
                {spotify?.artist && (
                  <span className="opacity-65"> · {spotify.artist}</span>
                )}
              </div>
            ) : (
              <span className="text-[10px] opacity-65">Not playing</span>
            )}
          </div>
        </div>

        {/* Equalizer / Status Indicator */}
        {isPlaying ? (
          <span
            className="flex h-3 shrink-0 items-end gap-[2px]"
            aria-hidden="true"
          >
            <span className="w-[2px] animate-[pulse_0.8s_ease-in-out_infinite] bg-[#1DB954] h-2.5 rounded-full" />
            <span className="w-[2px] animate-[pulse_1.1s_ease-in-out_infinite] bg-[#1DB954] h-3 rounded-full" />
            <span className="w-[2px] animate-[pulse_0.6s_ease-in-out_infinite] bg-[#1DB954] h-1.5 rounded-full" />
          </span>
        ) : (
          <span className="size-1.5 shrink-0 rounded-full bg-current/30" />
        )}
      </a>
    </LiquidGlass>
  );
}
