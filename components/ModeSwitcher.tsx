"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bind, play, setEnabled } from "cuelume";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Sparkles, Terminal, FileText } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  LiquidGlass,
  LiquidGlassButton,
} from "./ui/apple-tahoe-liquid-glass-button";
import { SpotifyNavBubble } from "./SpotifyNavBubble";

const MODES = [
  {
    href: "/",
    code: "01",
    label: "LAB",
    icon: Sparkles,
  },
  {
    href: "/minimal",
    code: "02",
    label: "MIN",
    icon: Terminal,
  },
  {
    href: "/llm",
    code: "03",
    label: "LLM",
    icon: FileText,
  },
] as const;

export function ModeSwitcher({ light = false }: { light?: boolean }) {
  const pathname = usePathname();
  const [soundOn, setSoundOn] = useState(true);
  const dockZoneRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIdx = Math.max(
    0,
    MODES.findIndex((m) =>
      m.href === "/" ? pathname === "/" : pathname.startsWith(m.href)
    )
  );

  // Floating LiquidGlassButton position around the dock
  const pillX = useMotionValue(0);
  const pillY = useMotionValue(-34);
  const smoothX = useSpring(pillX, { damping: 24, stiffness: 200, mass: 0.45 });
  const smoothY = useSpring(pillY, { damping: 24, stiffness: 200, mass: 0.45 });

  useEffect(() => {
    const unbind = bind();
    return () => unbind();
  }, []);

  // Snap floating liquid glass pill above the active mode item by default
  useEffect(() => {
    const zone = dockZoneRef.current;
    const activeEl = itemRefs.current[activeIdx];
    if (!zone || !activeEl) return;
    const zr = zone.getBoundingClientRect();
    const ar = activeEl.getBoundingClientRect();
    pillX.set(ar.left - zr.left + ar.width / 2 - 42);
    pillY.set(-34);
  }, [activeIdx, pillX, pillY]);

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

  const nextMode = MODES[(activeIdx + 1) % MODES.length];

  return (
    <div
      ref={dockZoneRef}
      onPointerMove={(e) => {
        const zone = dockZoneRef.current;
        if (!zone) return;
        const zr = zone.getBoundingClientRect();
        const relX = e.clientX - zr.left - 42;
        const relY = Math.min(-28, Math.max(-46, e.clientY - zr.top - 36));
        pillX.set(relX);
        pillY.set(relY);
      }}
      onPointerLeave={() => {
        const zone = dockZoneRef.current;
        const activeEl = itemRefs.current[activeIdx];
        if (!zone || !activeEl) return;
        const zr = zone.getBoundingClientRect();
        const ar = activeEl.getBoundingClientRect();
        pillX.set(ar.left - zr.left + ar.width / 2 - 42);
        pillY.set(-34);
      }}
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 select-none"
      role="navigation"
      aria-label="Portfolio View Mode Switcher"
    >
      {/* Floating Apple Tahoe Liquid Glass Navigation Button orbiting the dock */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="pointer-events-auto absolute left-0 top-0 z-20"
      >
        <LiquidGlassButton
          asChild
          interactive
          size="sm"
          material="clear"
          appearance={light ? "light" : "dark"}
          refraction={22}
          bezel={18}
          blur={1.5}
          dispersion={0.18}
          className={`!px-3 !py-1 font-mono text-[10px] tracking-wider shadow-lg ${
            light ? "text-black" : "text-white"
          }`}
        >
          <Link
            href={nextMode.href}
            data-cuelume-navigate
            onClick={() => play("navigate")}
            title={`Jump to ${nextMode.label}`}
          >
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{MODES[activeIdx].label} →</span>
          </Link>
        </LiquidGlassButton>
      </motion.div>

      {/* Main Compact Liquid Glass Dock */}
      <LiquidGlass
        material="regular"
        appearance={light ? "light" : "dark"}
        refraction={24}
        bezel={20}
        blur={2}
        className={`flex h-9 items-center gap-1 rounded-full border px-1.5 font-mono text-[11px] ${
          light
            ? "border-black/15 text-black"
            : "border-white/20 text-white"
        }`}
      >
        {MODES.map((mode, idx) => {
          const active = idx === activeIdx;
          const Icon = mode.icon;
          return (
            <Link
              key={mode.href}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              href={mode.href}
              data-cuelume-navigate
              onClick={() => play("navigate")}
              className={`group relative flex items-center gap-1 rounded-full px-2.5 py-1 transition-all ${
                active
                  ? light
                    ? "bg-black text-white font-semibold"
                    : "bg-white text-black font-semibold"
                  : light
                  ? "text-black/70 hover:bg-black/10 hover:text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="size-3 shrink-0" aria-hidden="true" />
              <span>{mode.label}</span>
            </Link>
          );
        })}

        <div
          className={`mx-0.5 h-3.5 w-px ${
            light ? "bg-black/20" : "bg-white/20"
          }`}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={toggleAudio}
          aria-label={soundOn ? "Mute audio" : "Unmute audio"}
          aria-pressed={soundOn}
          title={soundOn ? "Audio On" : "Audio Muted"}
          className={`flex size-6 items-center justify-center rounded-full transition-colors ${
            light
              ? "hover:bg-black/10 text-black"
              : "hover:bg-white/10 text-white"
          }`}
        >
          {soundOn ? (
            <Volume2 className="size-3" />
          ) : (
            <VolumeX className="size-3 opacity-45" />
          )}
        </button>
      </LiquidGlass>

      {/* Separate Liquid Glass Bubble on the Right Side of the Bottom Dock */}
      <SpotifyNavBubble light={light} />
    </div>
  );
}
