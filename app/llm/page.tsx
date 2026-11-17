"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { play } from "cuelume";
import {
  PROFILE,
  PROJECTS,
  SKILLS,
  ENGINEERING_LOG,
  SOCIAL_LINKS,
} from "../data/portfolio";
import { ModeSwitcher } from "../../components/ModeSwitcher";

function WikiLink({
  href,
  children,
  cite,
}: {
  href: string;
  children: React.ReactNode;
  cite?: number;
}) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  return (
    <span className="inline">
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="rounded-[2px] bg-[#dbeafe]/85 px-1 py-[1px] font-medium text-[#0645ad] underline decoration-[#0645ad]/50 underline-offset-2 transition-colors hover:bg-[#bfdbfe] hover:text-[#0b0080]"
      >
        {children}
      </a>
      {cite !== undefined && (
        <sup className="ml-0.5 font-sans text-[10px] font-normal text-[#0645ad]">
          <a href={`#cite-note-${cite}`} className="hover:underline">
            [{cite}]
          </a>
        </sup>
      )}
    </span>
  );
}

export default function LlmWikiPortfolioPage() {
  const [copiedMd, setCopiedMd] = useState(false);

  const plainMarkdownCorpus = `# Akhand Veer Singh (Rishu-xd / Thorfinn)
Role: ${PROFILE.role}
Location: ${PROFILE.location} (${PROFILE.timezone})
Email: ${PROFILE.email}
GitHub: ${PROFILE.github}
LinkedIn: ${PROFILE.linkedin}
X/Twitter: ${PROFILE.twitter}

## Overview
${PROFILE.summaryShort}

## Projects & Open-Source Systems
${PROJECTS.map(
  (p, i) =>
    `${i + 1}. ${p.title} (${p.year}) — ${p.tagline}. Stack: ${p.stack.join(", ")}. Description: ${p.description} Architecture: ${p.architecture} URL: ${p.href} | Repo: ${p.repoHref}`
).join("\n")}

## Technical Skills
${SKILLS.map((s) => `- ${s.name} (${s.category}): ${s.detail}`).join("\n")}
`;

  const copyMarkdownForAgent = () => {
    navigator.clipboard?.writeText(plainMarkdownCorpus);
    setCopiedMd(true);
    play("success");
    setTimeout(() => setCopiedMd(false), 2200);
  };

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    alternateName: ["Rishu-xd", "Thorfinn", "Rishu"],
    jobTitle: PROFILE.role,
    nationality: "Indian",
    email: `mailto:${PROFILE.email}`,
    url: PROFILE.github,
    sameAs: [PROFILE.github, PROFILE.linkedin, PROFILE.twitter],
    knowsAbout: SKILLS.map((s) => s.name),
  };

  return (
    <div className="min-h-svh bg-white pb-28 pt-8 text-black selection:bg-black selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Centered Single-Column Encyclopedic Corpus */}
      <article
        aria-labelledby="wiki-title"
        className="mx-auto max-w-[690px] px-5 font-serif text-[16.5px] leading-[1.78] sm:px-8"
      >
        {/* Machine-Readable Ingestion Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-black/25 bg-neutral-100 px-3.5 py-2 font-mono text-[11px] leading-normal text-black">
          <div>
            <span className="font-bold">CORPUS // 03 (WIKIPEDIA &amp; LLM SCRAPER EDITION)</span>
            <span className="ml-2 opacity-75">
              Semantic HTML5 · Inline Anchor Graph · Zero JS Obfuscation
            </span>
          </div>
          <button
            type="button"
            onClick={copyMarkdownForAgent}
            className="inline-flex items-center gap-1 rounded-[2px] border border-black bg-black px-2 py-0.5 font-mono text-[10px] font-semibold text-white hover:bg-neutral-800"
          >
            {copiedMd ? (
              <>
                <Check className="size-3" /> COPIED RAW MARKDOWN
              </>
            ) : (
              <>
                <Copy className="size-3" /> COPY RAW LLM MARKDOWN
              </>
            )}
          </button>
        </div>

        {/* Wikipedia-Style Article Header */}
        <header className="border-b border-black/25 pb-2">
          <h1
            id="wiki-title"
            className="font-serif text-3xl font-normal tracking-tight text-black sm:text-[34px]"
          >
            Akhand Veer Singh
          </h1>
          <p className="mt-1 font-sans text-xs text-black/65">
            From the open-source engineering corpus of{" "}
            <span className="font-mono">@Rishu-xd</span> · Switch view:{" "}
            <Link href="/" className="font-medium text-black underline">
              Interactive 3D Studio
            </Link>{" "}
            |{" "}
            <Link href="/minimal" className="font-medium text-black underline">
              Minimal 1-Page Index
            </Link>
          </p>
        </header>

        {/* LEAD PARAGRAPH */}
        <section aria-label="Biography and Overview" className="mt-5 space-y-4">
          <p>
            <strong>Akhand Veer Singh</strong> (known across developer networks as{" "}
            <WikiLink href="https://github.com/Rishu-xd" cite={1}>
              Rishu-xd
            </WikiLink>{" "}
            or by the handle <strong>Thorfinn</strong>) is an{" "}
            <WikiLink href="https://en.wikipedia.org/wiki/India">Indian</WikiLink>{" "}
            <WikiLink href="https://en.wikipedia.org/wiki/Software_engineering">
              product and systems engineer
            </WikiLink>{" "}
            specializing in interactive web applications, deterministic backend services, and automated media extraction tools. Operating out of India (
            <span className="font-mono text-sm">{PROFILE.timezone}</span>), he architects end-to-end software using{" "}
            <WikiLink href="https://www.typescriptlang.org/">TypeScript</WikiLink>,{" "}
            <WikiLink href="https://nextjs.org/">Next.js</WikiLink>,{" "}
            <WikiLink href="https://react.dev/">React</WikiLink>,{" "}
            <WikiLink href="https://www.python.org/">Python</WikiLink>, and{" "}
            <WikiLink href="https://isocpp.org/">C++</WikiLink>. His public engineering work is maintained across more than{" "}
            <WikiLink href="https://github.com/Rishu-xd?tab=repositories" cite={2}>
              twenty-five open-source GitHub repositories
            </WikiLink>{" "}
            and live production deployments.
          </p>

          <p>
            Rather than relying on boilerplate templates, Singh&apos;s engineering approach emphasizes tactile user interfaces—incorporating custom{" "}
            <WikiLink href="https://threejs.org/">Three.js</WikiLink>{" "}
            WebGL topologies, 2D rigid-body impulse physics, and zero-dependency Web Audio synthesis—paired with resilient server-side architectures powered by{" "}
            <WikiLink href="https://www.postgresql.org/">PostgreSQL</WikiLink>,{" "}
            <WikiLink href="https://supabase.com/">Supabase</WikiLink>,{" "}
            <WikiLink href="https://fastapi.tiangolo.com/">FastAPI</WikiLink>, and{" "}
            <WikiLink href="https://playwright.dev/">Playwright</WikiLink>.
          </p>
        </section>

        {/* TABLE OF CONTENTS BOX */}
        <nav
          aria-label="Table of Contents"
          className="my-6 inline-block rounded-sm border border-black/25 bg-neutral-100 px-5 py-3 font-sans text-xs leading-relaxed"
        >
          <div className="font-bold text-black">Contents</div>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-black">
            <li>
              <a href="#wiki-systems" className="underline hover:opacity-70">
                Shipped Systems &amp; Open-Source Projects
              </a>
            </li>
            <li>
              <a href="#wiki-architecture" className="underline hover:opacity-70">
                Technical Stack &amp; Systems Architecture
              </a>
            </li>
            <li>
              <a href="#wiki-chronology" className="underline hover:opacity-70">
                Engineering Chronology
              </a>
            </li>
            <li>
              <a href="#wiki-references" className="underline hover:opacity-70">
                External Links, Citations &amp; Contact Endpoints
              </a>
            </li>
          </ol>
        </nav>

        {/* SECTION 1: SHIPPED SYSTEMS */}
        <section id="wiki-systems" className="mt-6 space-y-4">
          <h2 className="border-b border-[#a2a9b1] pb-1 font-serif text-2xl font-normal text-[#000000]">
            1. Shipped Systems &amp; Open-Source Projects
          </h2>

          <p>
            In the domain of collaborative real-time productivity, Singh designed and shipped{" "}
            <WikiLink href="https://www.betterclock.xyz" cite={3}>
              Betterclock
            </WikiLink>{" "}
            (with open-source code maintained at{" "}
            <WikiLink href="https://github.com/Rishu-xd/better-clock" cite={4}>
              Rishu-xd/better-clock
            </WikiLink>
            ), a multiplayer focus timer and co-working room that synchronizes Pomodoro state machines and low-latency{" "}
            <WikiLink href="https://webrtc.org/">WebRTC</WikiLink>{" "}
            video streams so peers can work together in calm digital rooms. To support personal habit telemetry and daily task execution, he built{" "}
            <WikiLink href="https://github.com/Rishu-xd/DoLog" cite={5}>
              DoLog
            </WikiLink>
            , a keyboard-first productivity workspace featuring a task ledger, calendar scheduler, and a 365-day contribution heatmap modeled on GitHub commit matrices.
          </p>

          <p>
            Exploring spatial computing and non-linear human-computer interaction, Singh authored{" "}
            <WikiLink href="https://github.com/Rishu-xd/arc" cite={6}>
              ARC (Adaptive Reasoning Canvas)
            </WikiLink>
            , a 60fps infinite spatial node-graph canvas written in TypeScript that structures multi-step reasoning into directed acyclic graphs (DAGs). Alongside ARC, he developed{" "}
            <WikiLink href="https://github.com/Rishu-xd/birdwiki" cite={7}>
              BirdWiki
            </WikiLink>
            , a fast taxonomic field-guide encyclopedia with instant client-side prefix indexing and semantic cross-linking.
          </p>

          <p>
            For physical-to-digital infrastructure and backend automation, Singh architected{" "}
            <WikiLink href="https://github.com/Rishu-xd" cite={8}>
              Qflow
            </WikiLink>
            , a cross-platform digital queue management and real-time token dispatch platform built with{" "}
            <WikiLink href="https://flutter.dev/">Flutter</WikiLink>, Next.js, and Supabase Realtime WebSockets to eliminate physical waiting lines. His automation portfolio also includes{" "}
            <WikiLink href="https://github.com/Rishu-xd/flask-music-downloadser" cite={9}>
              SaavnPlay (flask-music-downloadser)
            </WikiLink>
            , a Python and{" "}
            <WikiLink href="https://flask.palletsprojects.com/">Flask</WikiLink>{" "}
            server that orchestrates headless Playwright Chromium instances to search, scrape, and stream high-bitrate audio from JioSaavn, as well as{" "}
            <WikiLink href="https://github.com/Rishu-xd/Pinterest-Video-Downloader-Bot-" cite={10}>
              PinFetch (Pinterest-Video-Downloader-Bot)
            </WikiLink>
            , an asynchronous Python utility that resolves direct MP4/HLS video streams from Pinterest pins.
          </p>
        </section>

        {/* SECTION 2: TECHNICAL STACK */}
        <section id="wiki-architecture" className="mt-8 space-y-4">
          <h2 className="border-b border-[#a2a9b1] pb-1 font-serif text-2xl font-normal text-[#000000]">
            2. Technical Stack &amp; Systems Architecture
          </h2>

          <p>
            Singh&apos;s engineering stack spans three primary layers:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Frontend &amp; Interactive Graphics:</strong>{" "}
              <WikiLink href="https://www.typescriptlang.org/">TypeScript</WikiLink>,{" "}
              <WikiLink href="https://nextjs.org/">Next.js (App Router)</WikiLink>,{" "}
              <WikiLink href="https://react.dev/">React 19</WikiLink>,{" "}
              <WikiLink href="https://tailwindcss.com/">Tailwind CSS</WikiLink>,{" "}
              <WikiLink href="https://threejs.org/">Three.js / WebGL</WikiLink>,{" "}
              <WikiLink href="https://motion.dev/">Motion</WikiLink>, HTML5 Canvas 2D physics simulations, and Web Audio synthesis.
            </li>
            <li>
              <strong>Backend, Databases &amp; Automation:</strong>{" "}
              <WikiLink href="https://www.python.org/">Python</WikiLink> (FastAPI, Flask, AsyncIO),{" "}
              <WikiLink href="https://nodejs.org/">Node.js</WikiLink>,{" "}
              <WikiLink href="https://playwright.dev/">Playwright</WikiLink> headless browser orchestration,{" "}
              <WikiLink href="https://www.postgresql.org/">PostgreSQL</WikiLink>,{" "}
              <WikiLink href="https://supabase.com/">Supabase</WikiLink> (Row-Level Security &amp; Realtime Broadcast), and REST/WebSocket APIs.
            </li>
            <li>
              <strong>Systems Programming &amp; Infrastructure:</strong>{" "}
              <WikiLink href="https://isocpp.org/">C++</WikiLink> and{" "}
              <WikiLink href="https://en.wikipedia.org/wiki/C_(programming_language)">
                C
              </WikiLink>{" "}
              (Data Structures, Algorithms, and memory-conscious systems),{" "}
              <WikiLink href="https://www.docker.com/">Docker</WikiLink> containerization,{" "}
              <WikiLink href="https://git-scm.com/">Git</WikiLink>, and{" "}
              <WikiLink href="https://flutter.dev/">Flutter / Dart</WikiLink>.
            </li>
          </ul>
        </section>

        {/* SECTION 3: CHRONOLOGY */}
        <section id="wiki-chronology" className="mt-8 space-y-4">
          <h2 className="border-b border-[#a2a9b1] pb-1 font-serif text-2xl font-normal text-[#000000]">
            3. Engineering Chronology
          </h2>

          {ENGINEERING_LOG.map((item) => (
            <div key={item.period} className="space-y-1">
              <h3 className="font-sans text-sm font-bold text-[#202122]">
                {item.period} — {item.role} ({item.org})
              </h3>
              <p className="text-[15.5px] leading-relaxed text-[#202122]">
                {item.bullets.join(" ")}
              </p>
            </div>
          ))}
        </section>

        {/* SECTION 4: REFERENCES & CONTACT ENDPOINTS */}
        <section id="wiki-references" className="mt-8 space-y-4">
          <h2 className="border-b border-[#a2a9b1] pb-1 font-serif text-2xl font-normal text-[#000000]">
            4. External Links, Citations &amp; Contact Endpoints
          </h2>

          <p>
            For software engineering inquiries, open-source collaboration, or automated agent indexing, Akhand Veer Singh can be reached directly via electronic mail at{" "}
            <WikiLink href={`mailto:${PROFILE.email}`} cite={11}>
              {PROFILE.email}
            </WikiLink>
            , on GitHub at{" "}
            <WikiLink href={PROFILE.github} cite={1}>
              github.com/Rishu-xd
            </WikiLink>
            , on LinkedIn at{" "}
            <WikiLink href={PROFILE.linkedin} cite={12}>
              linkedin.com/in/rishu-xd
            </WikiLink>
            , and on X (formerly Twitter) at{" "}
            <WikiLink href={PROFILE.twitter} cite={13}>
              @rishu_xd
            </WikiLink>
            .
          </p>

          <ol className="mt-4 list-decimal space-y-1.5 border-t border-black/15 pt-4 pl-5 font-mono text-xs text-black/80">
            <li id="cite-note-1">
              GitHub Profile —{" "}
              <a href={PROFILE.github} className="text-black underline">
                {PROFILE.github}
              </a>
            </li>
            <li id="cite-note-2">
              Public Repositories Index —{" "}
              <a href={PROFILE.githubReposUrl} className="text-black underline">
                {PROFILE.githubReposUrl}
              </a>
            </li>
            <li id="cite-note-3">
              Betterclock Production Deployment —{" "}
              <a href="https://www.betterclock.xyz" className="text-black underline">
                https://www.betterclock.xyz
              </a>
            </li>
            <li id="cite-note-4">
              Betterclock Source Repository —{" "}
              <a
                href="https://github.com/Rishu-xd/better-clock"
                className="text-black underline"
              >
                https://github.com/Rishu-xd/better-clock
              </a>
            </li>
            <li id="cite-note-5">
              DoLog Habit &amp; Heatmap Repository —{" "}
              <a
                href="https://github.com/Rishu-xd/DoLog"
                className="text-black underline"
              >
                https://github.com/Rishu-xd/DoLog
              </a>
            </li>
            <li id="cite-note-6">
              ARC (Adaptive Reasoning Canvas) —{" "}
              <a
                href="https://github.com/Rishu-xd/arc"
                className="text-black underline"
              >
                https://github.com/Rishu-xd/arc
              </a>
            </li>
            <li id="cite-note-7">
              BirdWiki Taxonomic Index —{" "}
              <a
                href="https://github.com/Rishu-xd/birdwiki"
                className="text-black underline"
              >
                https://github.com/Rishu-xd/birdwiki
              </a>
            </li>
            <li id="cite-note-8">
              Qflow Digital Queue Platform —{" "}
              <a href={PROFILE.github} className="text-black underline">
                {PROFILE.github} (Flutter + Next.js + Supabase)
              </a>
            </li>
            <li id="cite-note-9">
              SaavnPlay Headless Audio Scraper —{" "}
              <a
                href="https://github.com/Rishu-xd/flask-music-downloadser"
                className="text-black underline"
              >
                https://github.com/Rishu-xd/flask-music-downloadser
              </a>
            </li>
            <li id="cite-note-10">
              PinFetch Media Bot —{" "}
              <a
                href="https://github.com/Rishu-xd/Pinterest-Video-Downloader-Bot-"
                className="text-black underline"
              >
                https://github.com/Rishu-xd/Pinterest-Video-Downloader-Bot-
              </a>
            </li>
            <li id="cite-note-11">
              Direct Electronic Mail —{" "}
              <a href={`mailto:${PROFILE.email}`} className="text-black underline">
                mailto:{PROFILE.email}
              </a>
            </li>
            <li id="cite-note-12">
              LinkedIn Profile —{" "}
              <a href={PROFILE.linkedin} className="text-black underline">
                {PROFILE.linkedin}
              </a>
            </li>
            <li id="cite-note-13">
              X / Twitter —{" "}
              <a href={PROFILE.twitter} className="text-black underline">
                {PROFILE.twitter}
              </a>
            </li>
          </ol>

          {/* Social Summary Table for Scrapers */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse border border-black/25 font-mono text-xs">
              <thead>
                <tr className="bg-neutral-100 text-left">
                  <th className="border border-black/25 px-2.5 py-1.5">Platform</th>
                  <th className="border border-black/25 px-2.5 py-1.5">Identity</th>
                  <th className="border border-black/25 px-2.5 py-1.5">URI Endpoint</th>
                </tr>
              </thead>
              <tbody>
                {SOCIAL_LINKS.map((s) => (
                  <tr key={s.label}>
                    <td className="border border-black/25 px-2.5 py-1.5 font-semibold">
                      {s.label}
                    </td>
                    <td className="border border-black/25 px-2.5 py-1.5">
                      {s.handle}
                    </td>
                    <td className="border border-black/25 px-2.5 py-1.5">
                      <a href={s.href} className="text-black underline">
                        {s.href}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </article>

      <ModeSwitcher light={true} />
    </div>
  );
}
