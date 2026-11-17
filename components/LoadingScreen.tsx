"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// Essential assets that make the hero, avatar, and 3D globe immediately visible
const ESSENTIAL_IMAGES = [
  "/images/hero.jpg",
  "/globe/8k_earth_daymap.jpeg",
  "/globe/8k_earth_nightmap.jpg",
  "/globe/8k_earth_specular_map.png",
];

// Secondary heavy textures that can continue streaming in the background
const BACKGROUND_IMAGES = [
  "/globe/8k_earth_normal_map_(0-00-00-00).jpg",
  "/globe/8k_earth_clouds.jpeg",
];

const STATUS_STEPS = [
  "INITIALIZING WEBGL & SHADER PIPELINE...",
  "STREAMING 8K PLANETARY SURFACE TEXTURES...",
  "CALIBRATING REAL-TIME SOLAR TERMINATOR...",
  "READY // ENTERING STUDIO",
];

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(8);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    let mounted = true;
    let loadedCount = 0;
    const totalEssential = ESSENTIAL_IMAGES.length;
    // Wait until ~75% of essential hero + globe textures are ready (3 of 4),
    // or a maximum of 2.1 seconds so the user is never blocked on slow networks.
    const thresholdCount = Math.ceil(totalEssential * 0.75);

    const finishLoading = () => {
      if (!mounted) return;
      setProgress(100);
      setStatusIdx(3);
      setTimeout(() => {
        if (mounted) setVisible(false);
      }, 320);
    };

    const onAssetReady = () => {
      if (!mounted) return;
      loadedCount += 1;
      const pct = Math.min(
        95,
        Math.round(15 + (loadedCount / totalEssential) * 80)
      );
      setProgress((prev) => Math.max(prev, pct));
      setStatusIdx(Math.min(2, loadedCount));

      if (loadedCount >= thresholdCount) {
        finishLoading();
      }
    };

    // Preload essential visible assets
    ESSENTIAL_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = onAssetReady;
      img.onerror = onAssetReady;
      img.src = src;
    });

    // Warm cache for secondary heavy textures in the background without blocking
    BACKGROUND_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    // Smoothly tick progress upward while waiting so the bar never feels frozen
    const tickInterval = window.setInterval(() => {
      if (!mounted) return;
      setProgress((prev) => (prev < 86 ? prev + 4 : prev));
    }, 110);

    // Fallback safety cap: open the site as soon as most things are ready (max 2.1s)
    const maxWaitTimer = window.setTimeout(() => {
      finishLoading();
    }, 2100);

    return () => {
      mounted = false;
      window.clearInterval(tickInterval);
      window.clearTimeout(maxWaitTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="portfolio-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(8px)",
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black p-6 text-white select-none sm:p-10"
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio assets"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-white/55 uppercase">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYS.BOOT // THORFINN.DEV
            </span>
            <span>8K_EARTH + LIQUID_GLASS</span>
          </div>

          {/* Center identity & progress readout */}
          <div className="mx-auto flex w-full max-w-md flex-col items-start">
            <div className="flex w-full items-baseline justify-between">
              <span className="font-serif text-3xl tracking-tight sm:text-4xl">
                Akhand Veer Singh
              </span>
              <span className="font-mono text-2xl font-light tabular-nums tracking-tight text-white/90">
                {progress}%
              </span>
            </div>

            {/* Minimal 1px high-contrast progress track */}
            <div className="mt-4 h-[2px] w-full overflow-hidden bg-white/15">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "8%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>

            <div className="mt-3 flex w-full items-center justify-between font-mono text-[10px] text-white/55">
              <span className="truncate">{STATUS_STEPS[statusIdx]}</span>
              <span className="shrink-0 pl-2">STREAMING</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between font-mono text-[10px] text-white/40">
            <span>INDIA // 26.85°N 80.95°E</span>
            <span>PROGRESSIVE ASSET LOADER</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
