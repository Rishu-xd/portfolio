
"use client";

import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react";
import { useRef } from "react";

const letters = [
  {
    char: "R",
    x: -500,
    y: -300,
    rotate: -35,
  },
  {
    char: "I",
    x: 400,
    y: -400,
    rotate: 30,
  },
  {
    char: "S",
    x: -450,
    y: 300,
    rotate: 25,
  },
  {
    char: "H",
    x: 500,
    y: 250,
    rotate: -30,
  },
  {
    char: "U",
    x: 0,
    y: 500,
    rotate: 40,
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Camera starts pushing through the completed name
  // after the letters have assembled.
  const cameraScale = useTransform(
    scrollYProgress,
    [0.55, 1],
    [1, 20]
  );

  const cameraBlur = useTransform(
    scrollYProgress,
    [0.75, 1],
    ["0px", "14px"]
  );

  const cameraOpacity = useTransform(
    scrollYProgress,
    [0.9, 1],
    [1, 0]
  );

  // Subtitle disappears early.
  const subtitleOpacity = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, 0]
  );

  return (
    <main className="bg-black text-white">

      {/* =========================
          CINEMATIC INTRO
      ========================== */}

      <section
        ref={heroRef}
        className="relative h-[300vh]"
      >

        {/* This stays fixed while the
            300vh section scrolls. */}
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Top left */}
          <div className="absolute left-8 top-8 z-20">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">
              Portfolio — 2026
            </p>
          </div>

          {/* Top right */}
          <div className="absolute right-8 top-8 z-20">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/30">
              01 / 05
            </p>
          </div>

          {/* =========================
              CAMERA
          ========================== */}

          <motion.div
            style={{
              scale: cameraScale,
              filter: cameraBlur,
              opacity: cameraOpacity,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >

            <div className="flex whitespace-nowrap text-[clamp(3rem,10vw,1rem)] font-black leading-none tracking-[-0.09em]">

              {letters.map((letter, index) => (
                <AnimatedLetter
                  key={letter.char}
                  letter={letter.char}
                  index={index}
                  progress={scrollYProgress}
                  x={letter.x}
                  y={letter.y}
                  rotate={letter.rotate}
                />
              ))}

            </div>

          </motion.div>

          {/* =========================
              SUBTITLE
          ========================== */}

          <motion.div
            style={{
              opacity: subtitleOpacity,
            }}
            className="absolute bottom-12 left-1/2 z-20 -translate-x-1/2 text-center"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Creative Developer
            </p>

            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/20">
              Scroll to enter
            </p>
          </motion.div>

        </div>
      </section>

      {/* =========================
          PORTFOLIO
      ========================== */}

      <section className="min-h-screen bg-[#050505] px-8 py-32">

        <div className="mx-auto max-w-7xl">

          <p className="text-xs uppercase tracking-[0.35em] text-white/30">
            Selected Work
          </p>

          <h2 className="mt-12 text-[11vw] font-bold leading-[0.8] tracking-[-0.07em]">
            I BUILD
            <br />
            THINGS.
          </h2>

        </div>

      </section>

    </main>
  );
}


/* =================================
   INDIVIDUAL LETTER
================================= */

function AnimatedLetter({
  letter,
  index,
  progress,
  x: initialX,
  y: initialY,
  rotate: initialRotate,
}: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
  x: number;
  y: number;
  rotate: number;
}) {

  /*
   * Each letter starts slightly later.
   *
   * R → 0.00
   * I → 0.08
   * S → 0.16
   * H → 0.24
   * U → 0.32
   */

  const start = index * 0.08;

  const end = start + 0.25;

  const x = useTransform(
    progress,
    [start, end],
    [initialX, 0]
  );

  const y = useTransform(
    progress,
    [start, end],
    [initialY, 0]
  );

  const rotate = useTransform(
    progress,
    [start, end],
    [initialRotate, 0]
  );

  const scale = useTransform(
    progress,
    [start, end],
    [0.4, 1]
  );

  const opacity = useTransform(
    progress,
    [start, start + 0.12],
    [0, 1]
  );

  const blur = useTransform(
    progress,
    [start, end],
    ["18px", "0px"]
  );

  return (
    <motion.span
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        filter: blur,
      }}
      className="inline-block"
    >
      {letter}
    </motion.span>
  );
}

