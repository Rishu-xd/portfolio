"use client";

import Image from "next/image";
import { motion, useReducedMotion , AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import React from "react";

const sections = ["home", "stats", "projects", "contact"] as const;
const words = ["Fullstack","Product engineer" ];
const cursorLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const cursorNumbers = "0123456789";
const cursorBrackets = "[]{}()";
type SectionId = (typeof sections)[number];
type CursorGlyph = { id: number; character: string; tone: "white" | "green"; x: number; y: number };
type GithubActivity = {
  username: string;
  total: number;
  year: number;
  cells: { date: string; level: number }[];
};
const dialPositions: Record<SectionId, { button: string; marker: string }> = {
  home: { button: "left-1/2 top-[-36px] -translate-x-1/2", marker: "left-1/2 top-[23px] -translate-x-1/2" },
  stats: { button: "left-[-38px] top-[18%]", marker: "left-[66px] top-[5px]" },
  projects: { button: "bottom-[-26px] left-1/2 -translate-x-1/2", marker: "bottom-[23px] left-1/2 -translate-x-1/2" },
  contact: { button: "right-[-47px] top-[18%]", marker: "right-[67px] top-[5px]" },
};
type SpotifyNowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

function pickCursorCharacter() {
  const selection = Math.random();
  const characters = selection < 0.45 ? cursorBrackets : selection < 0.8 ? cursorNumbers : cursorLetters;
  return characters[Math.floor(Math.random() * characters.length)];
}

export default function Page() {
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [dialRotation, setDialRotation] = useState(0);
  const [index, setIndex] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<SpotifyNowPlaying>({ isPlaying: false });
  const [githubActivity, setGithubActivity] = useState<GithubActivity | null>(null);
  const [githubActivityStatus, setGithubActivityStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [cursorGlyphs, setCursorGlyphs] = useState<CursorGlyph[]>([]);
  const dialRotationRef = useRef(0);
  const cursorGlyphIdRef = useRef(0);
  const lastGlyphPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (shouldReduceMotion || event.pointerType === "touch") return;

      const lastPosition = lastGlyphPositionRef.current;
      if (lastPosition && Math.hypot(event.clientX - lastPosition.x, event.clientY - lastPosition.y) < 16) return;

      lastGlyphPositionRef.current = { x: event.clientX, y: event.clientY };
      const glyphs = Array.from({ length: 3 }, () => {
        const id = cursorGlyphIdRef.current++;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 38;

        return {
          id,
          character: pickCursorCharacter(),
          tone: id % 2 === 0 ? "green" as const : "white" as const,
          x: event.clientX + Math.cos(angle) * radius,
          y: event.clientY + Math.sin(angle) * radius,
        };
      });

      setCursorGlyphs((currentGlyphs) => [...currentGlyphs, ...glyphs].slice(-36));
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % words.length);
    }, 3300);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify-now-playing", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json() as SpotifyNowPlaying;
        if (!cancelled) setNowPlaying(data);
      } catch {
        if (!cancelled) setNowPlaying({ isPlaying: false });
      }
    };

    loadNowPlaying();
    const interval = window.setInterval(loadNowPlaying, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadGithubActivity = async () => {
      try {
        const response = await fetch("/api/github-contributions", { cache: "no-store" });
        if (!response.ok) throw new Error("GitHub activity unavailable");

        const data = await response.json() as GithubActivity;
        if (!cancelled) {
          setGithubActivity(data);
          setGithubActivityStatus("ready");
        }
      } catch {
        if (!cancelled) setGithubActivityStatus("unavailable");
      }
    };

    loadGithubActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const nextRotation = Math.max(0, Math.min((sections.length - 1) * 90, dialRotationRef.current + event.deltaY * 0.35));
      dialRotationRef.current = nextRotation;
      setDialRotation(nextRotation);
      setActiveSection(sections[Math.round(nextRotation / 90)]);
    };
     
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);

    
  }, []);

  const navigateTo = (sectionId: SectionId) => {
    const nextRotation = sections.indexOf(sectionId) * 90;
    dialRotationRef.current = nextRotation;
    setDialRotation(nextRotation);
    setActiveSection(sectionId);
  };

  const sectionState = (sectionId: SectionId) => activeSection === sectionId;
   

  
  return (
    <>
      <main className="h-svh w-full overflow-hidden bg-[#202020]" aria-label="Portfolio sections">
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
          {cursorGlyphs.map((glyph) => (
            <span
              key={glyph.id}
              className={`cursor-glyph cursor-glyph--${glyph.tone} absolute text-[14px] font-semibold`}
              style={{ left: glyph.x, top: glyph.y }}
              onAnimationEnd={() => setCursorGlyphs((currentGlyphs) => currentGlyphs.filter((item) => item.id !== glyph.id))}
            >
              {glyph.character}
            </span>
          ))}
        </div>
        <div className="relative h-full w-full">
          <motion.section id="home" className="absolute inset-0 z-10 overflow-hidden border border-black bg-[#141414]" animate={sectionState("home") ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" }} style={{ pointerEvents: sectionState("home") ? "auto" : "none" }} aria-labelledby="home-title">
            <motion.header className="absolute left-14 top-11 flex items-center gap-4" initial={false} animate={sectionState("home") ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }} transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.12 }}>
              <Image src="/images/hero.jpg" alt="Akhand Veer Singh" width={116} height={116} className="size-[116px] rounded-full border-4 border-[#242424] object-cover" />
              <div>
                <h1 id="home-title" className="font-serif text-[38px] leading-none tracking-tight text-white">Akhand Veer Singh</h1>
                <h1 className="overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={words[index]}
                      initial={{ y: -20, opacity: 0, filter: "blur(8px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: 0, opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 1 }}
                      className="inline-block text-gray-400"
                    >
                      {words[index]}
                    </motion.span>
                  </AnimatePresence>
                </h1>
              </div>
            </motion.header>

            <motion.div
              className="absolute left-14 right-14 top-[255px] max-w-[900px]"
              initial={false}
              animate={sectionState("home") ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.18 }}
            >
              <div className="grid grid-cols-3 gap-8 opacity-40">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.14em] text-white">LOCATION</p>
                  <p className="mt-4 flex items-center gap-3 text-[16px] text-white"><span className="text-[13px] text-white" aria-hidden="true">⌖</span>India</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.14em] text-white">EMAIL</p>
                  <p className="mt-4 flex items-center gap-3 text-[16px] text-white"><span className="text-[13px] text-white" aria-hidden="true">✉</span>rishu99xd@gmail.com</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.14em] text-white">PRONOUNS</p>
                  <p className="mt-4 flex items-center gap-3 text-[16px] text-white"><span className="text-[13px] text-white" aria-hidden="true">♙</span>he/him</p>
                </div>
              </div>
              <p className="mt-10 text-[18px] leading-8 text-gray-400">
                I build end-to-end web products, paying attention to the small details that make software feel polished and effortless to use. Currently working with <strong className="font-medium text-white">TypeScript, React, Next.js, Tailwind CSS.</strong>
              </p>
            </motion.div>

            <motion.nav className="absolute left-15 top-[450px] flex items-center gap-6" initial={false} animate={sectionState("home") ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.22 }} aria-label="Social links">
              {
              [["mailto:rishu99xd@gmail.com", "Email", "/gmailnew.png"],
               ["https://github.com/Rishu-xd", "GitHub", "/github.png"],
               ["https://linkedin.com", "LinkedIn", "/linkedin.png"],
               ["https://x.com","X","/x.png"] ].map(([href, label, image]) => (
                <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} aria-label={label} whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.12 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}>
                  <Image src={image} alt="" width={25} height={25} className="size-[25px] object-contain" />
                </motion.a>
              ))}
            </motion.nav>

            <motion.a href={nowPlaying.songUrl ?? "https://open.spotify.com"} target="_blank" rel="noreferrer" className="group absolute bottom-[30px] left-[50px] flex h-[66px] w-[193px] items-center overflow-hidden rounded-full   bg-[#454545] px-3" whileHover={shouldReduceMotion ? undefined : { x: 5, width: 340, height: 140, borderRadius: 22, backgroundColor: "transparent" }} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }} transition={{ type: "spring", stiffness: 280, damping: 50 }}>
              <span className="relative flex h-full w-full items-center gap-2 rounded-full transition-all duration-300 group-hover:absolute group-hover:left-1/2 group-hover:top-1/2 group-hover:h-[90px] group-hover:w-[300px] group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:rounded-[16px] group-hover:bg-[#dedede] group-hover:px-3">
                <motion.span className="absolute  top-1/2 z-10 -translate-y-1/2 transition-all duration-300 group-hover:top-3 group-hover:translate-y-0" aria-hidden="true">
                  <Image src="/spotify.png" alt="" width={45} height={45} className="size-[45px]  justify-between transition-all  duration-300 group-hover:size-6" />
                </motion.span>
                <motion.span className="pointer-events-none absolute right-3 top-1/2 size-[60px] -translate-y-1/2 overflow-hidden rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Image src={nowPlaying.isPlaying && nowPlaying.albumImageUrl ? nowPlaying.albumImageUrl : "/spotify.png"} alt={nowPlaying.isPlaying ? `${nowPlaying.title} album artwork` : "Spotify"} fill className="object-cover" />
                </motion.span>
                <span className="min-w-0 pl-[58px] text-[12px] text-white transition-colors duration-300 group-hover:pr-[68px] group-hover:text-[#5b5b5b]" aria-live="polite">
                  {nowPlaying.isPlaying ? <><span className="block truncate">{nowPlaying.title}</span><span className="block truncate text-white/60 group-hover:text-[#929292]">{nowPlaying.artist}</span></> : "Not playing"}
                </span>
              </span>
            </motion.a>
          </motion.section>

          <motion.section id="stats" className="absolute inset-0 flex items-center justify-center border-y border-black bg-[#181818] px-6 py-8 sm:px-12" animate={sectionState("stats") ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" }} style={{ pointerEvents: sectionState("stats") ? "auto" : "none" }} aria-labelledby="stats-title">
            <div className="w-full max-w-[820px]">
              <motion.p initial={false} animate={sectionState("stats") ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.45 }} className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Now / lately</motion.p>
              <motion.h2 id="stats-title" initial={false} animate={sectionState("stats") ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.06 }} className="mt-3 font-serif text-4xl text-white sm:text-5xl">Stats</motion.h2>

              <motion.div className="mt-7 border-y border-white/10 py-5" initial={false} animate={sectionState("stats") ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.12 }}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium text-white/80">GitHub activity</h3>
                  {githubActivityStatus === "ready" && githubActivity ? (
                    <p className="text-xs text-white/40"><span className="text-white/75">{githubActivity.total.toLocaleString()}</span> contributions in {githubActivity.year}</p>
                  ) : (
                    <p className="text-xs text-white/40" role="status">{githubActivityStatus === "loading" ? "Loading activity..." : "GitHub activity is unavailable right now."}</p>
                  )}
                </div>
                {githubActivityStatus === "ready" && githubActivity && (
                  <div className="overflow-x-auto pb-2" aria-label={`${githubActivity.username}'s GitHub contribution activity for ${githubActivity.year}`}>
                    <div className="grid w-max grid-flow-col grid-rows-7 auto-cols-[9px] gap-[3px]" role="img" aria-label={`${githubActivity.total} contributions in ${githubActivity.year}`}>
                      {githubActivity.cells.map((cell) => (
                        <span
                          key={cell.date}
                          className="size-[9px] rounded-[2px]"
                          title={cell.date}
                          style={{ backgroundColor: ["#292929", "#244d2b", "#347d3b", "#4aa83f", "#72f257"][cell.level] ?? "#72f257" }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="grid gap-6 pt-5 sm:grid-cols-2 sm:gap-10">
                <motion.div initial={false} animate={sectionState("stats") ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.18 }}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">Currently working on</p>
                  <h3 className="mt-3 text-lg font-medium text-white">Qflow</h3>
                  <p className="mt-1 text-sm leading-6 text-white/50">A digital queue platform designed to reduce wait times and help teams manage busy queues.</p>
                </motion.div>
                <motion.div initial={false} animate={sectionState("stats") ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.24 }}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">Currently studying</p>
                  <h3 className="mt-3 text-lg font-medium text-white">Product engineering</h3>
                  <p className="mt-1 text-sm leading-6 text-white/50">Expressive interfaces, useful motion, and the small details that make products feel natural.</p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <motion.section id="projects" className="absolute inset-0 flex items-center justify-center border-y border-black bg-[#141414] px-6 sm:px-12" animate={sectionState("projects") ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" }} style={{ pointerEvents: sectionState("projects") ? "auto" : "none" }} aria-labelledby="projects-title">
            <div className="w-full max-w-[800px]">
              <motion.p initial={false} animate={sectionState("projects") ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.45 }} className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">Selected work</motion.p>
              <motion.h2 id="projects-title" initial={false} animate={sectionState("projects") ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }} transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.06 }} className="mt-3 font-serif text-4xl text-white sm:text-5xl">Projects</motion.h2>
              <div className="mt-8">
                {
                [
                  ['Betterclock', 'A focused timer for getting things done.'],
                  ['DoLog', 'A productivity space for consistent progress.'],
                  ['Qflow', 'A universal queue-management platform designed to reduce waiting time and manage high-volume queues digitally.']


                  ].map(([title, description], index) => (
                  <motion.article
                    key={title}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)]  gap-x-3 border-t border-white/10 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-5"
                    initial={false}
                    animate={sectionState("projects") ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                  }
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.12 + index * 0.08 }}
                  >
                    <span className="pt-1 font-mono text-xs text-white/30">0{index + 1}</span>
                    <div>
                      <h3 className="text-base font-medium text-white/90 sm:text-lg">{title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-white/45">{description}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section id="contact" className="absolute inset-0 flex items-center justify-center border-y border-black bg-[#181818] px-16" animate={sectionState("contact") ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" }} style={{ pointerEvents: sectionState("contact") ? "auto" : "none" }} aria-labelledby="contact-title">
            <motion.div className="text-center" initial={false} animate={sectionState("contact") ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }} transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}>
              <p className="text-sm uppercase tracking-[0.3em] text-white">Let&apos;s talk</p>
              <h2 id="contact-title" className="mt-5 font-serif text-5xl text-white">Have a good idea?</h2>
              <motion.a href="mailto:rishu99xd@gmail.com" className="mt-8 inline-block border-b border-white pb-2 text-lg text-white" whileHover={shouldReduceMotion ? undefined : { color: "#ffffff", letterSpacing: "0.04em" }}>rishu99xd@gmail.com</motion.a>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <motion.nav className="group fixed right-8 top-1/2 z-20 flex w-28 -translate-y-1/2 flex-col items-end gap-3 text-[16px]" initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.3 }} aria-label="Section navigation">
        {sections.map((section) => (
          <motion.button
            key={section}
            type="button"
            onClick={() => navigateTo(section)}
            className={`relative h-1 w-5 rounded-full border-0 bg-white px-0 outline-none transition-all duration-300 group-hover:h-6 group-hover:w-28 group-hover:rounded-none group-hover:bg-transparent group-hover:px-1 ${activeSection === section ? "-translate-x-3 bg-[#72f257]" : ""}`}
            whileHover={shouldReduceMotion ? undefined : { x: -4 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
          >
            <span className={`absolute right-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-left text-[16px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${activeSection === section ? "text-[#72f257]" : "text-white"}`}>
              {section[0].toUpperCase() + section.slice(1)}
            </span>
          </motion.button>
        ))}
      </motion.nav>

      <motion.div className="fixed bottom-0 left-1/2 z-20 aspect-square w-[min(360px,42vw)] -translate-x-1/2 translate-y-[65%]" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.2 }} aria-label="Portfolio navigation">
          <motion.div className="absolute inset-0" animate={{ rotate: dialRotation }} transition={{ duration: shouldReduceMotion ? 0 : 0.12, ease: "linear" }}>
          <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-dashed border-[rgb(45_113_69_/_75%)]" aria-hidden="true" />
          {sections.map((section) => (
            <motion.button key={section} type="button" onClick={() => navigateTo(section)} className={`pointer-events-auto absolute border-0 bg-transparent text-[16px] ${dialPositions[section].button} ${activeSection === section ? "text-[#72f257]" : "text-white"}`} whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}>
              <span className={`absolute size-[17px] rounded-full bg-[#72f257] ${dialPositions[section].marker}`} aria-hidden="true" />
              <motion.span className="inline-block" animate={{ rotate: -dialRotation }}>{section[0].toUpperCase() + section.slice(1)}</motion.span>
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
