"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  GitBranch,
  Star,
  Sun,
  Moon,
  Radio,
  Cpu,
  Layers,
  Terminal,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { bind, play } from "cuelume";
import { GlassDock } from "../components/GlassDock";
import "../components/GlassDock.css";
import { ThreeArtifact } from "../components/ThreeArtifact";
import { PhysicsSkillArena } from "../components/PhysicsSkillArena";
import { ModeSwitcher } from "../components/ModeSwitcher";
import { LoadingScreen } from "../components/LoadingScreen";
import {
  LiquidGlass,
  LiquidGlassButton,
} from "../components/ui/apple-tahoe-liquid-glass-button";
import {
  PROFILE,
  PROJECTS,
  ENGINEERING_LOG,
  SOCIAL_LINKS,
} from "./data/portfolio";
import type { GitHubRepoSummary } from "./api/github-repos/route";

type ContributionActivity = {
  username: string;
  total: number;
  year: number;
  cells: { date: string; level: number; count: number }[];
};

type SpotifyState = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

const darkActivityColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const lightActivityColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

export default function InteractivePortfolio() {
  const [lightTheme, setLightTheme] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [activity, setActivity] = useState<ContributionActivity | null>(null);
  const [activityError, setActivityError] = useState(false);
  const [liveRepos, setLiveRepos] = useState<GitHubRepoSummary[]>([]);
  const [spotify, setSpotify] = useState<SpotifyState | null>(null);
  const [clockStr, setClockStr] = useState<string>("--:--:-- IST");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeSectionTitle, setActiveSectionTitle] = useState<string | null>(null);
  const [navHovered, setNavHovered] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  // Track scroll position to morph navbar between Hero controls and Section title
  useEffect(() => {
    const updateActiveSection = () => {
      const y = window.scrollY;
      if (y < 220) {
        setActiveSectionTitle(null);
        return;
      }

      const sections: { id: string; title: string }[] = [
        { id: "telemetry", title: "Execution Log & Live Signals" },
        { id: "physics", title: "Physics Lab" },
        { id: "projects", title: "Selected Engineering Work" },
      ];

      const triggerLine = window.innerHeight * 0.34;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerLine) {
            setActiveSectionTitle(sec.title);
            return;
          }
        }
      }
      setActiveSectionTitle("Selected Engineering Work");
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  useEffect(() => {
    const unbind = bind();
    return () => unbind();
  }, []);

  // Rotate secondary roles
  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % PROFILE.secondaryRoles.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, []);

  // Live IST precision clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);
        setClockStr(`${formatted} IST`);
      } catch {
        setClockStr("IST (UTC+5:30)");
      }
    };
    updateClock();
    const id = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Fetch GitHub contributions
  useEffect(() => {
    const controller = new AbortController();
    const year = new Date().getFullYear();

    fetch(`/api/github-contributions?year=${year}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unavailable");
        const data: ContributionActivity = await res.json();
        setActivity(data);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setActivityError(true);
      });

    return () => controller.abort();
  }, []);

  // Fetch live GitHub repositories
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github-repos", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { repos?: GitHubRepoSummary[] };
        if (data.repos) setLiveRepos(data.repos);
      })
      .catch(() => { });
    return () => controller.abort();
  }, []);

  // Fetch Spotify now playing
  useEffect(() => {
    fetch("/api/spotify-now-playing")
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as SpotifyState;
        setSpotify(data);
      })
      .catch(() => { });
  }, []);

  const filteredProjects =
    projectFilter === "ALL"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === projectFilter);

  // Additional live repos from GitHub that aren't already in our curated 7
  const curatedNames = new Set([
    "better-clock",
    "betterclock",
    "arc",
    "dolog",
    "qflow",
    "birdwiki",
    "flask-music-downloadser",
    "pinterest-video-downloader-bot-",
  ]);

  const extraGithubRepos = liveRepos
    .filter((r) => !curatedNames.has(r.name.toLowerCase()))
    .slice(0, 6);

  const copyEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email);
    setCopiedEmail(true);
    play("success");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      className={`relative min-h-svh pb-24 transition-colors duration-300 ${lightTheme
          ? "bg-white text-black selection:bg-black selection:text-white"
          : "bg-black text-white selection:bg-white selection:text-black"
        }`}
    >
      <LoadingScreen />
      {/* Subtle monochrome grid lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: lightTheme
            ? "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Fixed-Shape Liquid Glass Navbar — Keeps exact pill dimensions so refraction stays crisp */}
      <header
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
        className="sticky top-3 z-40 mx-auto flex justify-center px-4"
      >
        <LiquidGlass
          material="regular"
          appearance={lightTheme ? "light" : "dark"}
          refraction={24}
          bezel={20}
          blur={2}
          className={`flex h-9 w-[310px] items-center justify-center overflow-hidden rounded-full border px-3.5 font-mono text-[11px] sm:w-[340px] ${
            lightTheme
              ? "border-black/15 text-black"
              : "border-white/20 text-white"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {activeSectionTitle && !navHovered ? (
              <motion.a
                key={`sec-${activeSectionTitle}`}
                href="#top"
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 26,
                }}
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap"
                title="Hover to show navigation links or click to return to top"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate font-serif text-[15px] leading-none tracking-tight">
                  {activeSectionTitle}
                </span>
              </motion.a>
            ) : (
              <motion.div
                key="hero-nav"
                initial={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 26,
                }}
                className="flex w-full items-center justify-between gap-2 whitespace-nowrap"
              >
                <a
                  href="#top"
                  data-cuelume-navigate
                  className="font-serif text-base leading-none tracking-tight"
                >
                  Rishu
                </a>

                <div
                  className={`h-3 w-px shrink-0 ${
                    lightTheme ? "bg-black/20" : "bg-white/20"
                  }`}
                  aria-hidden="true"
                />

                <nav
                  aria-label="Primary sections"
                  className="flex items-center gap-1"
                >
                  <a
                    href="#projects"
                    data-cuelume-navigate
                    className={`rounded-full px-2 py-0.5 transition-colors ${
                      lightTheme
                        ? "text-black/70 hover:bg-black/10 hover:text-black"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Work
                  </a>
                  <a
                    href="#physics"
                    data-cuelume-navigate
                    className={`rounded-full px-2 py-0.5 transition-colors ${
                      lightTheme
                        ? "text-black/70 hover:bg-black/10 hover:text-black"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Lab
                  </a>
                  <a
                    href="#telemetry"
                    data-cuelume-navigate
                    className={`rounded-full px-2 py-0.5 transition-colors ${
                      lightTheme
                        ? "text-black/70 hover:bg-black/10 hover:text-black"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Log
                  </a>
                </nav>

                <div
                  className={`h-3 w-px shrink-0 ${
                    lightTheme ? "bg-black/20" : "bg-white/20"
                  }`}
                  aria-hidden="true"
                />

                <div className="flex items-center gap-1.5">
                  <span className="hidden items-center gap-1 text-[10px] opacity-70 sm:inline-flex">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {clockStr.slice(0, 5)}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setLightTheme((v) => !v);
                      play("toggle");
                    }}
                    aria-label={
                      lightTheme ? "Switch to dark mode" : "Switch to light mode"
                    }
                    className={`grid size-6 place-items-center rounded-full border transition-colors ${
                      lightTheme
                        ? "border-black/20 text-black hover:bg-black/10"
                        : "border-white/25 text-white hover:bg-white/10"
                    }`}
                  >
                    {lightTheme ? (
                      <Sun className="size-3" />
                    ) : (
                      <Moon className="size-3" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LiquidGlass>
      </header>

      <main id="top" className="relative z-10 mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
        {/* HERO GRID: Left Identity & Bio + Right Interactive Three.js Artifact */}
        <section
          aria-labelledby="hero-heading"
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {/* Left 7 columns: Identity Card */}
          <div
            className={`flex flex-col justify-between rounded-sm border p-5 sm:p-6 lg:col-span-7 ${lightTheme
                ? "border-black/20 bg-neutral-50"
                : "border-white/20 bg-neutral-950"
              }`}
          >
            <div>
              {/* Video Banner Strip in full natural color */}
              <div className="relative mb-5 h-24 w-full overflow-hidden rounded-sm border border-current/20 bg-black">
                <video
                  src={PROFILE.bannerVideo}
                  autoPlay={!shouldReduceMotion}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
                <div className="absolute bottom-2 left-3 flex items-center gap-2 font-mono text-[10px] text-white">
                  <span className="inline-block size-2 rounded-full bg-emerald-400" />
                  <span>SYS.NODE // THORFINN.DEV</span>
                  <span className="opacity-70">· {PROFILE.coordinates}</span>
                </div>
              </div>

              {/* Avatar + Name + Animated Role */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <Image
                    src={PROFILE.avatar}
                    alt={PROFILE.name}
                    width={76}
                    height={76}
                    priority
                    className="size-[76px] rounded-sm border border-current/30 object-cover"
                  />
                  <span
                    title="Available for high-impact engineering roles & builds"
                    className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-black bg-emerald-400"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest opacity-60">
                    <span>IND // FULL-STACK & SYSTEMS</span>
                  </div>
                  <h1
                    id="hero-heading"
                    className="mt-0.5 font-serif text-3xl tracking-tight sm:text-4xl"
                  >
                    {PROFILE.name}
                  </h1>

                  <div className="mt-1 flex items-center gap-2 font-mono text-xs">
                    <span className="opacity-50">&gt;</span>
                    <div className="h-5 overflow-hidden font-medium">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={PROFILE.secondaryRoles[roleIndex]}
                          initial={
                            shouldReduceMotion
                              ? false
                              : { y: -14, opacity: 0 }
                          }
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 12, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="block"
                        >
                          {PROFILE.secondaryRoles[roleIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Human Copywriting */}
              <div className="mt-5 space-y-2.5 text-sm leading-relaxed opacity-85">
                <p>
                  I build fast, tactile web software and backend automation tools. My work sits at the intersection of{" "}
                  <strong className="font-semibold underline decoration-current/40 underline-offset-4">
                    deterministic systems engineering
                  </strong>{" "}
                  and{" "}
                  <strong className="font-semibold underline decoration-current/40 underline-offset-4">
                    high-craft interaction design
                  </strong>
                  —where spring physics, WebGL/Three.js topologies, and clean database schemas work together.
                </p>
                <p className="text-[13px] opacity-80">
                  Core stack:{" "}
                  <span className="font-mono text-xs">
                    TypeScript · Next.js · React · Python (FastAPI / Flask / Playwright) · C++ · PostgreSQL · Supabase
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* Bottom bar: GlassDock + Quick mode jumps + Copy Email */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-4">
              <div className="flex items-center gap-2">
                <GlassDock magnify={1.28} spread={2} lift={8} />
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={copyEmail}
                  className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 transition-colors ${lightTheme
                      ? "border-black/25 bg-black/5 hover:bg-black hover:text-white"
                      : "border-white/25 bg-white/5 hover:bg-white hover:text-black"
                    }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="size-3.5" /> COPIED EMAIL
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> {PROFILE.email}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right 5 columns: Interactive Three.js Topology Rig */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <ThreeArtifact light={lightTheme} />

            {/* Multi-View Switcher Callout Card */}
            <div
              className={`flex flex-col justify-between rounded-sm border p-4 font-mono text-xs ${lightTheme
                  ? "border-black/20 bg-neutral-50"
                  : "border-white/20 bg-neutral-950"
                }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  PORTFOLIO ARCHITECTURE // 3 SURFACES
                </span>
                <span
                  className={`rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold ${lightTheme
                      ? "bg-black text-white"
                      : "bg-white text-black"
                    }`}
                >
                  KEY: 1 / 2 / 3
                </span>
              </div>
              <p className="mt-1.5 font-sans text-xs leading-relaxed opacity-75">
                Switch between this interactive physics studio, a zero-scroll single-screen index, or a plain-text Wikipedia corpus built for LLM web scrapers.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/minimal"
                  data-cuelume-navigate
                  className={`flex items-center justify-between rounded-[2px] border px-2.5 py-2 text-[11px] transition-colors ${lightTheme
                      ? "border-black/25 hover:bg-black hover:text-white"
                      : "border-white/25 hover:bg-white hover:text-black"
                    }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Terminal className="size-3.5" /> 02. Minimal 1-Page
                  </span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
                <Link
                  href="/llm"
                  data-cuelume-navigate
                  className={`flex items-center justify-between rounded-[2px] border px-2.5 py-2 text-[11px] transition-colors ${lightTheme
                      ? "border-black/25 hover:bg-black hover:text-white"
                      : "border-white/25 hover:bg-white hover:text-black"
                    }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="size-3.5" /> 03. LLM / Wiki
                  </span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: EXPANDED GITHUB PROJECTS INDEX */}
        <section id="projects" className="mt-14 scroll-mt-16" aria-labelledby="projects-heading">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-current/20 pb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                [01 // SHIPPED SYSTEMS & GITHUB REPOSITORIES]
              </div>
              <h2 id="projects-heading" className="mt-1 font-serif text-3xl tracking-tight">
                Selected Engineering Work
              </h2>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              {(["ALL", "Full-Stack", "Systems & AI", "Automation & Tools"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setProjectFilter(cat);
                      play("select");
                    }}
                    className={`rounded-sm border px-2.5 py-1 transition-colors ${projectFilter === cat
                        ? lightTheme
                          ? "border-black bg-black text-white font-semibold"
                          : "border-white bg-white text-black font-semibold"
                        : "border-current/20 opacity-65 hover:opacity-100"
                      }`}
                  >
                    {cat === "ALL" ? `ALL (${PROJECTS.length})` : cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Asymmetric Architectural Ledger Grid */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredProjects.map((project, idx) => {
              const isFeatured = idx === 0 && projectFilter === "ALL";
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className={`group relative flex flex-col justify-between rounded-sm border p-5 transition-colors ${isFeatured ? "md:col-span-2" : ""
                    } ${lightTheme
                      ? "border-black/20 bg-neutral-50 hover:border-black"
                      : "border-white/20 bg-neutral-950 hover:border-white"
                    }`}
                >
                  <div>
                    {/* Top metadata row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold ${lightTheme
                              ? "bg-black text-white"
                              : "bg-white text-black"
                            }`}
                        >
                          {project.number}
                        </span>
                        <span className="uppercase tracking-wider opacity-70">
                          {project.category}
                        </span>
                        <span className="opacity-40">·</span>
                        <span className="opacity-70">{project.year}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-[2px] border px-1.5 py-0.5 text-[9px] uppercase ${project.status === "LIVE"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-semibold"
                              : "border-current/25 opacity-70"
                            }`}
                        >
                          ● {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-2xl tracking-tight">
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                          data-cuelume-navigate
                          className="hover:underline"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <span className="font-mono text-[10px] opacity-60">
                        {project.metrics}
                      </span>
                    </div>

                    <p className="mt-1 font-mono text-xs opacity-90">
                      {project.tagline}
                    </p>

                    <p className="mt-3 text-[13px] leading-relaxed opacity-80">
                      {project.description}
                    </p>

                    <div
                      className={`mt-3 rounded-sm border-l-2 pl-3 font-mono text-[11px] leading-relaxed opacity-75 ${lightTheme ? "border-black/50" : "border-white/50"
                        }`}
                    >
                      <span className="font-semibold uppercase">Arch: </span>
                      {project.architecture}
                    </div>
                  </div>

                  {/* Stack Pills & Action Links */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-current/15 pt-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-[2px] border border-current/20 px-2 py-0.5 font-mono text-[10px] opacity-80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      {project.liveHref && (
                        <a
                          href={project.liveHref}
                          target="_blank"
                          rel="noreferrer"
                          data-cuelume-navigate
                          className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
                        >
                          Live App <ExternalLink className="size-3" />
                        </a>
                      )}
                      <a
                        href={project.repoHref}
                        target="_blank"
                        rel="noreferrer"
                        data-cuelume-navigate
                        className="inline-flex items-center gap-1 opacity-70 transition-opacity hover:opacity-100"
                      >
                        <GitBranch className="size-3" /> Source
                        <ArrowUpRight className="size-3" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Live GitHub API Repository Feed (if additional public repos exist) */}
          {extraGithubRepos.length > 0 && (
            <div className="mt-6 rounded-sm border border-current/20 p-4">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="uppercase tracking-wider opacity-75">
                  + LIVE GITHUB REPOSITORY INDEX (SYNCED FROM @RISHU-XD)
                </span>
                <a
                  href={PROFILE.githubReposUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline underline-offset-4 opacity-75 hover:opacity-100"
                >
                  All 25+ Repos <ArrowUpRight className="size-3" />
                </a>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {extraGithubRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cuelume-navigate
                    className={`flex flex-col justify-between rounded-sm border p-3 transition-colors ${lightTheme
                        ? "border-black/15 bg-white hover:border-black"
                        : "border-white/15 bg-black hover:border-white"
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 font-mono text-xs font-semibold">
                        <span className="truncate">{repo.name}</span>
                        <ArrowUpRight className="size-3 shrink-0 opacity-50" />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs opacity-65">
                        {repo.description || "Open-source engineering repository by @Rishu-xd."}
                      </p>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] opacity-60">
                      <span>{repo.language}</span>
                      {repo.stargazersCount > 0 && (
                        <span className="inline-flex items-center gap-0.5">
                          <Star className="size-2.5" /> {repo.stargazersCount}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 02: INTERACTIVE 2D RIGID-BODY PHYSICS LAB (Spring Field Removed) */}
        <section id="physics" className="mt-14 scroll-mt-16" aria-labelledby="physics-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-current/20 pb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                [02 // INTERACTIVE PHYSICS & KINETIC SANDBOX]
              </div>
              <h2 id="physics-heading" className="mt-1 font-serif text-3xl tracking-tight">
                Technical Stack & Rigid-Body Mechanics
              </h2>
            </div>
            <p className="font-mono text-xs opacity-65">
              Custom impulse solver · Zero external physics bloat
            </p>
          </div>

          <PhysicsSkillArena light={lightTheme} />
        </section>

        {/* SECTION 03: TELEMETRY, GITHUB HEATMAP & ENGINEERING LOG */}
        <section id="telemetry" className="mt-14 scroll-mt-16" aria-labelledby="telemetry-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-current/20 pb-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                [03 // COMMIT TELEMETRY & ENGINEERING TIMELINE]
              </div>
              <h2 id="telemetry-heading" className="mt-1 font-serif text-3xl tracking-tight">
                Execution Log & Live Signals
              </h2>
            </div>
            {activity && (
              <span className="font-mono text-xs opacity-75">
                {activity.total.toLocaleString()} Contributions in {activity.year}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* GitHub Heatmap + Spotify Signal (7 cols) */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-7">
              <div
                className={`rounded-sm border p-4 ${lightTheme
                    ? "border-black/20 bg-neutral-50"
                    : "border-white/20 bg-neutral-950"
                  }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-semibold uppercase">
                    GITHUB_MATRIX // @{PROFILE.handle}
                  </span>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] opacity-70 hover:opacity-100"
                  >
                    Inspect Profile <ArrowUpRight className="size-3" />
                  </a>
                </div>

                {activity ? (
                  <div
                    className="activity-scroll mt-4 overflow-x-auto pb-2"
                    role="img"
                    aria-label={`${activity.total.toLocaleString()} GitHub contributions in ${activity.year}`}
                  >
                    <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
                      {activity.cells.map(({ date, level, count }) => {
                        const intensity = Math.min(Math.max(level, 0), 4);
                        return (
                          <span
                            key={date}
                            title={`${date}: ${count} contribution${count === 1 ? "" : "s"}`}
                            className="size-[10px] rounded-[1px] transition-transform hover:scale-150"
                            style={{
                              backgroundColor: (
                                lightTheme ? lightActivityColors : darkActivityColors
                              )[intensity],
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : activityError ? (
                  <p className="mt-4 font-mono text-xs opacity-60">
                    GitHub contribution stream offline. View directly at github.com/Rishu-xd.
                  </p>
                ) : (
                  <p className="mt-4 font-mono text-xs opacity-60">
                    Synchronizing GitHub contribution matrix…
                  </p>
                )}
              </div>

              {/* Live Audio / Spotify Telemetry Card */}
              <div
                className={`flex items-center justify-between gap-4 rounded-sm border p-4 font-mono text-xs ${lightTheme
                    ? "border-black/20 bg-neutral-50"
                    : "border-white/20 bg-neutral-950"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-sm border ${lightTheme
                        ? "border-black bg-black text-white"
                        : "border-white bg-white text-black"
                      }`}
                  >
                    <Radio className="size-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider opacity-60">
                      AUDIO_TELEMETRY // SPOTIFY_STREAM
                    </div>
                    {spotify?.isPlaying && spotify.title ? (
                      <a
                        href={spotify.songUrl || PROFILE.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block font-sans text-sm font-medium hover:underline"
                      >
                        {spotify.title} — <span className="opacity-70">{spotify.artist}</span>
                      </a>
                    ) : (
                      <div className="mt-0.5 font-sans text-sm">
                        Offline / Deep Focus Session ·{" "}
                        <span className="opacity-65">Lo-Fi & Systems Architecture</span>
                      </div>
                    )}
                  </div>
                </div>
                <Cpu className="size-4 shrink-0 opacity-45" />
              </div>
            </div>

            {/* Engineering Log (5 cols) */}
            <div
              className={`rounded-sm border p-5 lg:col-span-5 ${lightTheme
                  ? "border-black/20 bg-neutral-50"
                  : "border-white/20 bg-neutral-950"
                }`}
            >
              <div className="font-mono text-xs font-semibold uppercase tracking-wider">
                CHRONOLOGY // BUILD LOG
              </div>
              <div className="mt-4 space-y-5">
                {ENGINEERING_LOG.map((entry) => (
                  <div
                    key={entry.period}
                    className="border-l-2 border-current/40 pl-3.5"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider opacity-65">
                      {entry.period} · {entry.location}
                    </div>
                    <h3 className="mt-0.5 font-serif text-lg leading-snug">
                      {entry.role}
                    </h3>
                    <div className="font-mono text-[11px] opacity-75">
                      {entry.org}
                    </div>
                    <ul className="mt-2 space-y-1.5 text-xs leading-relaxed opacity-85">
                      {entry.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-mono opacity-60">-</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-current/20 pt-6 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-serif text-base">{PROFILE.name}</span>
              <span className="ml-2 opacity-60">
                // Built with Next.js, Three.js, Custom 2D Physics & Cuelume Audio.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer" : undefined}
                  data-cuelume-navigate
                  className="opacity-70 transition-opacity hover:opacity-100 hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </main>

      {/* Persistent 3-Page Mode Switcher */}
      <ModeSwitcher light={lightTheme} />
    </div>
  );
}
