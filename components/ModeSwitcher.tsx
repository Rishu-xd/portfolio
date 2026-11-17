"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bind, play, setEnabled } from "cuelume";
import { useEffect, useState } from "react";
import { Volume2, VolumeX, Terminal, Sparkles, FileText } from "lucide-react";

const MODES = [
  {
    href: "/",
    code: "01",
    label: "INTERACTIVE",
    sub: "3D & Physics",
    icon: Sparkles,
  },
  {
    href: "/minimal",
    code: "02",
    label: "INDEX",
    sub: "Zero-Scroll",
    icon: Terminal,
  },
  {
    href: "/llm",
    code: "03",
    label: "WIKI / LLM",
    sub: "Scraper Corpus",
    icon: FileText,
  },
] as const;

export function ModeSwitcher({ light = false }: { light?: boolean }) {
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const unbind = bind();
    return () => unbind();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      if (e.key === "1") window.location.href = "/";
      if (e.key === "2") window.location.href = "/minimal";
      if (e.key === "3") window.location.href = "/llm";
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggleAudio = () => {
    const next = !soundOn;
    setSoundOn(next);
    setEnabled(next);
    if (next) play("toggle");
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 select-none"
      role="navigation"
      aria-label="Portfolio View Mode Switcher"
    >
      <div
        className={`flex items-center gap-1 rounded-[2px] border px-1.5 py-1 font-mono text-[11px] shadow-2xl backdrop-blur-md transition-colors ${light
            ? "border-black/25 bg-white/95 text-black shadow-black/10"
            : "border-white/25 bg-black/95 text-white shadow-black/80"
          }`}
      >
        <span
          className={`hidden items-center gap-1.5 px-2 py-1 text-[10px] tracking-widest uppercase sm:flex ${light ? "text-black/60" : "text-white/60"
            }`}
        >
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          VIEW
        </span>

        {MODES.map((mode) => {
          const active =
            mode.href === "/"
              ? pathname === "/"
              : pathname.startsWith(mode.href);
          const Icon = mode.icon;
          return (
            <Link
              key={mode.href}
              href={mode.href}
              data-cuelume-navigate
              onClick={() => play("navigate")}
              className={`group relative flex items-center gap-1.5 rounded-[2px] px-2.5 py-1.5 transition-all ${active
                  ? light
                    ? "bg-black text-white font-semibold"
                    : "bg-white text-black font-semibold"
                  : light
                    ? "text-black/65 hover:bg-black/10 hover:text-black"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon className="size-3 shrink-0" aria-hidden="true" />
              <span className="tracking-tight">{mode.code}</span>
              <span className="tracking-wider">{mode.label}</span>
              <span
                className={`hidden text-[9px] lg:inline ${active
                    ? light
                      ? "text-white/75"
                      : "text-black/75"
                    : "opacity-50"
                  }`}
              >
                · {mode.sub}
              </span>
            </Link>
          );
        })}

        <div
          className={`mx-0.5 h-4 w-px ${light ? "bg-black/20" : "bg-white/20"
            }`}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={toggleAudio}
          aria-label={soundOn ? "Mute interface audio" : "Unmute interface audio"}
          aria-pressed={soundOn}
          title={soundOn ? "Synth audio active (Cuelume)" : "Synth audio muted"}
          className={`flex size-7 items-center justify-center rounded-[2px] transition-colors ${light
              ? "hover:bg-black/10 text-black"
              : "hover:bg-white/10 text-white"
            }`}
        >
          {soundOn ? (
            <Volume2 className="size-3.5" />
          ) : (
            <VolumeX className="size-3.5 opacity-45" />
          )}
        </button>
      </div>
    </div>
  );
}
