"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Sun, Moon, Copy, Check, GitBranch } from "lucide-react";
import { play } from "cuelume";
import {
  PROFILE,
  PROJECTS,
  SKILLS,
  SOCIAL_LINKS,
} from "../data/portfolio";
import { ModeSwitcher } from "../../components/ModeSwitcher";

export default function MinimalPortfolioPage() {
  const [light, setLight] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const activeProject = PROJECTS[hoveredIdx] ?? PROJECTS[0];

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(PROFILE.email);
    setCopied(true);
    play("success");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className={`min-h-svh w-full transition-colors duration-200 lg:h-svh lg:overflow-hidden ${
        light
          ? "bg-white text-black selection:bg-black selection:text-white"
          : "bg-black text-white selection:bg-white selection:text-black"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1380px] flex-col justify-between px-4 pb-16 pt-3 sm:px-6 lg:pb-14 lg:pt-4">
        {/* TOP COMPACT BAR */}
        <header
          className={`flex shrink-0 items-center justify-between border-b pb-2.5 font-mono text-[11px] ${
            light ? "border-black/20" : "border-white/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`rounded-[2px] px-1.5 py-0.5 text-[10px] font-bold ${
                light
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              INDEX // 02
            </span>
            <span className="font-semibold tracking-tight">{PROFILE.name}</span>
            <span className="hidden opacity-55 sm:inline">
              — {PROFILE.role} ({PROFILE.location})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              data-cuelume-navigate
              className="underline decoration-current/35 underline-offset-4 opacity-70 hover:opacity-100"
            >
              01.Interactive
            </Link>
            <Link
              href="/llm"
              data-cuelume-navigate
              className="underline decoration-current/35 underline-offset-4 opacity-70 hover:opacity-100"
            >
              03.LLM-Wiki
            </Link>
            <button
              type="button"
              onClick={() => {
                setLight((v) => !v);
                play("toggle");
              }}
              aria-label="Toggle color theme"
              className={`inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 text-[10px] uppercase ${
                light
                  ? "border-black bg-black text-white"
                  : "border-white bg-white text-black"
              }`}
            >
              {light ? <Sun className="size-3" /> : <Moon className="size-3" />}
              {light ? "WHITE" : "BLACK"}
            </button>
          </div>
        </header>

        {/* CENTER BENTO LEDGER — FITS IN 1 SCREEN ON DESKTOP */}
        <main className="my-auto grid flex-1 grid-cols-1 gap-4 py-3 lg:min-h-0 lg:grid-cols-12 lg:gap-5">
          {/* LEFT COLUMN (4 COLS): Identity, About, Stack & Socials */}
          <section
            aria-label="About and Social Links"
            className={`flex flex-col justify-between border-b pb-4 lg:col-span-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5 ${
              light ? "border-black/20" : "border-white/20"
            }`}
          >
            {/* Identity + About */}
            <div>
              <div className="flex items-center gap-3.5">
                <Image
                  src={PROFILE.avatar}
                  alt={PROFILE.name}
                  width={56}
                  height={56}
                  className="size-14 rounded-sm border border-current/25 object-cover"
                />
                <div>
                  <h1 className="font-serif text-2xl leading-none tracking-tight sm:text-3xl">
                    {PROFILE.name}
                  </h1>
                  <p className="mt-1 font-mono text-xs opacity-70">
                    @{PROFILE.handle} · {PROFILE.role}
                  </p>
                </div>
              </div>

              <p className="mt-3.5 text-[13px] leading-relaxed opacity-85">
                {PROFILE.summaryShort} Focused on shipping clean full-stack applications, spatial canvases, and reliable automation pipelines without bloat.
              </p>

              {/* Compact Tech Stack */}
              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-55">
                  CORE STACK ({SKILLS.length})
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {SKILLS.map((s) => (
                    <span
                      key={s.name}
                      className={`rounded-[2px] border px-1.5 py-0.5 font-mono text-[10px] ${
                        light
                          ? "border-black/20 bg-neutral-100"
                          : "border-white/20 bg-neutral-900"
                      }`}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Project Inspector Preview Box */}
            <div
              className={`my-3 hidden rounded-sm border p-3 lg:block ${
                light
                  ? "border-black/20 bg-neutral-100"
                  : "border-white/20 bg-neutral-950"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] opacity-60">
                <span>INSPECTOR // {activeProject.number}</span>
                <span>{activeProject.metrics}</span>
              </div>
              <div className="mt-1 font-serif text-lg leading-snug">
                {activeProject.title}
              </div>
              <p className="mt-1 text-xs leading-relaxed opacity-80">
                {activeProject.description}
              </p>
              <div className="mt-2 font-mono text-[10px] opacity-65">
                {activeProject.architecture}
              </div>
            </div>

            {/* Social Links & Direct Email */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest opacity-55">
                DIRECT CHANNELS & SOCIALS
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 font-mono text-xs">
                {SOCIAL_LINKS.slice(0, 4).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noreferrer" : undefined}
                    data-cuelume-navigate
                    className={`flex items-center justify-between rounded-[2px] border px-2.5 py-1.5 transition-colors ${
                      light
                        ? "border-black/20 hover:bg-black hover:text-white"
                        : "border-white/20 hover:bg-white hover:text-black"
                    }`}
                  >
                    <span className="truncate">{s.label}</span>
                    <ArrowUpRight className="size-3 shrink-0 opacity-60" />
                  </a>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`mt-1.5 flex w-full items-center justify-between rounded-[2px] border px-2.5 py-1.5 font-mono text-[11px] transition-colors ${
                  light
                    ? "border-black bg-black text-white font-semibold"
                    : "border-white bg-white text-black font-semibold"
                }`}
              >
                <span>{PROFILE.email}</span>
                <span className="inline-flex items-center gap-1 text-[10px]">
                  {copied ? (
                    <>
                      <Check className="size-3" /> COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" /> COPY
                    </>
                  )}
                </span>
              </button>
            </div>
          </section>

          {/* RIGHT COLUMN (8 COLS): All 7 Good Projects in One Dense Zero-Scroll Table */}
          <section
            aria-label="All Selected Projects"
            className="flex flex-col justify-between lg:col-span-8"
          >
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[11px] uppercase tracking-wider opacity-65">
                SELECTED PROJECTS LEDGER ({PROJECTS.length} REPOSITORIES)
              </div>
              <a
                href={PROFILE.githubReposUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                github.com/Rishu-xd (25+ repos) <ArrowUpRight className="size-3" />
              </a>
            </div>

            <div
              className={`mt-2 divide-y border-t border-b ${
                light
                  ? "divide-black/15 border-black/25"
                  : "divide-white/15 border-white/25"
              }`}
            >
              {PROJECTS.map((project, index) => {
                const isSelected = hoveredIdx === index;
                return (
                  <div
                    key={project.id}
                    onMouseEnter={() => setHoveredIdx(index)}
                    className={`group grid grid-cols-12 items-center gap-2 px-2 py-2.5 transition-colors sm:px-3 ${
                      isSelected
                        ? light
                          ? "bg-black/[0.06]"
                          : "bg-white/[0.08]"
                        : ""
                    }`}
                  >
                    {/* Index + Title */}
                    <div className="col-span-12 flex items-baseline gap-2.5 sm:col-span-4">
                      <span className="font-mono text-[11px] opacity-45">
                        {project.number}
                      </span>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cuelume-navigate
                        className="font-serif text-lg leading-tight tracking-tight hover:underline"
                      >
                        {project.title}
                      </a>
                    </div>

                    {/* Concise One-line summary */}
                    <div className="col-span-12 text-xs opacity-75 sm:col-span-5">
                      {project.tagline}
                    </div>

                    {/* Tech stack + Direct Links */}
                    <div className="col-span-12 flex items-center justify-between gap-2 font-mono text-[10px] sm:col-span-3 sm:justify-end">
                      <span className="truncate opacity-55">
                        {project.stack.slice(0, 2).join(" · ")}
                      </span>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {project.liveHref && (
                          <a
                            href={project.liveHref}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-[2px] border border-emerald-500/40 bg-emerald-500/15 px-1.5 py-0.5 font-semibold text-emerald-500"
                          >
                            ● LIVE
                          </a>
                        )}
                        <a
                          href={project.repoHref}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} GitHub repository`}
                          className="inline-flex items-center gap-0.5 rounded-[2px] border border-current/25 px-1.5 py-0.5 hover:bg-current/10"
                        >
                          <GitBranch className="size-2.5" /> CODE
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom status strip inside right column */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] opacity-60">
              <span>
                ZERO-SCROLL DESKTOP SPECIFICATION // 100SVH VIEWPORT LOCKED
              </span>
              <span>
                HOVER ANY ROW TO INSPECT ARCHITECTURE · PRESS [1] [2] [3] TO SWITCH MODES
              </span>
            </div>
          </section>
        </main>
      </div>

      <ModeSwitcher light={light} />
    </div>
  );
}
