export type ProjectItem = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  architecture: string;
  stack: string[];
  category: "Full-Stack" | "Systems & AI" | "Automation & Tools";
  href: string;
  repoHref: string;
  liveHref?: string;
  year: string;
  status: "LIVE" | "OSS" | "SHIPPED";
  metrics: string;
};

export const PROFILE = {
  name: "Akhand Veer Singh",
  handle: "Rishu-xd",
  alias: "Thorfinn / Rishu",
  role: "Product & Systems Engineer",
  secondaryRoles: [
    "Product Engineer",
    "Full-Stack Builder",
    "Systems & UI Craftsman",
    "Interactive Web Architect",
  ],
  location: "India",
  coordinates: "26.8467° N, 80.9462° E",
  timezone: "IST (UTC+05:30)",
  email: "rishu99xd@gmail.com",
  github: "https://github.com/Rishu-xd",
  githubReposUrl: "https://github.com/Rishu-xd?tab=repositories",
  linkedin: "https://linkedin.com/in/rishu-xd",
  twitter: "https://x.com/rishu_xd",
  spotify: "https://open.spotify.com",
  avatar: "/images/hero.jpg",
  bannerVideo: "/video/banner.mp4",
  summaryShort:
    "Product engineer building tactile interfaces, real-time web tools, and deterministic backend systems across TypeScript, Next.js, Python, and C++.",
  philosophy:
    "Software should feel like physical hardware—responsive to the millisecond, honest in its materials, and stripped of decorative bloat.",
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "betterclock",
    number: "01",
    title: "Betterclock",
    tagline: "Multiplayer focus clock & low-latency co-working room",
    description:
      "A calm, high-precision focus timer built for deep work sessions with friends. Combines synchronized Pomodoro state machines, ambient room presence, and peer-to-peer video chat without the bloat of traditional meeting tools.",
    architecture:
      "Built on Next.js App Router and TypeScript with deterministic client-side tick synchronization and WebRTC media streams.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "WebRTC", "Realtime State"],
    category: "Full-Stack",
    href: "https://www.betterclock.xyz",
    repoHref: "https://github.com/Rishu-xd/better-clock",
    liveHref: "https://www.betterclock.xyz",
    year: "2026",
    status: "LIVE",
    metrics: "Sub-15ms timer drift · Live multiplayer rooms",
  },
  {
    id: "arc",
    number: "02",
    title: "ARC — Adaptive Reasoning Canvas",
    tagline: "Spatial node-graph workspace for multi-step reasoning",
    description:
      "An infinite spatial canvas engineered for branching thought experiments, structured decomposition, and non-linear problem solving. Turns flat prompt threads into inspectable, directed acyclic graphs.",
    architecture:
      "Custom 60fps pan-zoom viewport engine in TypeScript with spring-physics edge routing and local-first state serialization.",
    stack: ["TypeScript", "React", "Canvas 2D", "Graph Engine", "Motion"],
    category: "Systems & AI",
    href: "https://github.com/Rishu-xd/arc",
    repoHref: "https://github.com/Rishu-xd/arc",
    year: "2026",
    status: "OSS",
    metrics: "60fps spatial canvas · DAG state engine",
  },
  {
    id: "dolog",
    number: "03",
    title: "DoLog",
    tagline: "Habit telemetry, daily execution log & contribution matrix",
    description:
      "A high-density productivity workbench that treats daily habits like git commits. Features an interactive task ledger, calendar scheduling, streak analytics, and a 365-day GitHub-style intensity heatmap.",
    architecture:
      "Reactive front-end architecture with optimistic UI updates, keyboard-first command bindings, and zero-latency local storage persistence.",
    stack: ["React", "TypeScript", "Motion", "GitHub API", "Tailwind CSS"],
    category: "Full-Stack",
    href: "https://github.com/Rishu-xd/DoLog",
    repoHref: "https://github.com/Rishu-xd/DoLog",
    year: "2025",
    status: "SHIPPED",
    metrics: "365-cell telemetry matrix · Keyboard-first UX",
  },
  {
    id: "qflow",
    number: "04",
    title: "Qflow",
    tagline: "Distributed digital queue & real-time token dispatch engine",
    description:
      "A cross-platform queue management system built to eliminate physical waiting lines in high-throughput clinics and campus counters. Bridges mobile ticket holders with live operator consoles.",
    architecture:
      "Flutter mobile client paired with a Next.js operator dashboard, backed by Supabase PostgreSQL row-level security and live WebSocket broadcasts.",
    stack: ["Flutter", "Next.js", "Supabase", "PostgreSQL", "REST / Realtime"],
    category: "Full-Stack",
    href: "https://github.com/Rishu-xd",
    repoHref: "https://github.com/Rishu-xd",
    year: "2025",
    status: "SHIPPED",
    metrics: "Realtime WebSocket sync · Dual mobile/web client",
  },
  {
    id: "birdwiki",
    number: "05",
    title: "BirdWiki",
    tagline: "Fast taxonomic encyclopedia & avian field-guide index",
    description:
      "A structured knowledge index for exploring avian species, habitats, conservation statuses, and taxonomic trees with instant prefix search and clean typographic reading views.",
    architecture:
      "TypeScript application utilizing static indexing, debounced fuzzy search, and semantic encyclopedic cross-linking.",
    stack: ["TypeScript", "Next.js", "Search Index", "Tailwind CSS"],
    category: "Full-Stack",
    href: "https://github.com/Rishu-xd/birdwiki",
    repoHref: "https://github.com/Rishu-xd/birdwiki",
    year: "2025",
    status: "OSS",
    metrics: "Instant client-side indexing · Encyclopedic UI",
  },
  {
    id: "flask-music-downloader",
    number: "06",
    title: "SaavnPlay — Headless Audio Scraper",
    tagline: "Playwright-driven music search, stream & extraction pipeline",
    description:
      "A headless browser automation and audio retrieval server that searches JioSaavn catalogs, resolves high-bitrate stream manifests, and packages metadata-tagged audio files on the fly.",
    architecture:
      "Python & Flask backend orchestrating pooled headless Playwright browser contexts with asynchronous stream piping.",
    stack: ["Python", "Flask", "Playwright", "HTML/CSS", "Headless Chromium"],
    category: "Automation & Tools",
    href: "https://github.com/Rishu-xd/flask-music-downloadser",
    repoHref: "https://github.com/Rishu-xd/flask-music-downloadser",
    year: "2025",
    status: "OSS",
    metrics: "Automated DOM extraction · Stream multiplexer",
  },
  {
    id: "pinterest-bot",
    number: "07",
    title: "PinFetch — Media Extraction Bot",
    tagline: "Automated Pinterest video & pin stream downloader utility",
    description:
      "A lightweight Python automation bot that parses Pinterest pin URLs, bypasses dynamic CSR wrappers, extracts raw MP4/HLS media streams, and delivers direct downloads.",
    architecture:
      "Asynchronous Python worker inspecting network payload signatures and media manifests with minimal memory overhead.",
    stack: ["Python", "AsyncIO", "HTTPX", "Media Parsing", "CLI / Bot"],
    category: "Automation & Tools",
    href: "https://github.com/Rishu-xd/Pinterest-Video-Downloader-Bot-",
    repoHref: "https://github.com/Rishu-xd/Pinterest-Video-Downloader-Bot-",
    year: "2024",
    status: "OSS",
    metrics: "Zero-dependency parser · Direct MP4 resolution",
  },
];

export type SkillNode = {
  name: string;
  image: string;
  category: "Frontend & UI" | "Backend & Data" | "Systems & Core";
  mass: number;
  detail: string;
};

export const SKILLS: SkillNode[] = [
  { name: "TypeScript", image: "/skills/typescript.png", category: "Frontend & UI", mass: 1.35, detail: "Strict type systems, AST tooling, full-stack contracts" },
  { name: "Next.js", image: "/skills/next-js.png", category: "Frontend & UI", mass: 1.3, detail: "App Router, RSCs, edge routes, hybrid rendering" },
  { name: "React", image: "/skills/react.png", category: "Frontend & UI", mass: 1.25, detail: "Custom hooks, concurrent UI, 60fps canvas bindings" },
  { name: "Tailwind CSS", image: "/skills/tailwindcss.png", category: "Frontend & UI", mass: 1.15, detail: "Design tokens, responsive grids, custom shaders/CSS" },
  { name: "Python", image: "/skills/python.png", category: "Backend & Data", mass: 1.3, detail: "FastAPI, Flask, Playwright automation, data pipelines" },
  { name: "Node.js", image: "/skills/nodejs.png", category: "Backend & Data", mass: 1.2, detail: "Event-driven APIs, WebSockets, stream processing" },
  { name: "PostgreSQL", image: "/skills/postgresql.png", category: "Backend & Data", mass: 1.2, detail: "Relational modeling, indexing, query optimization" },
  { name: "Supabase", image: "/skills/supabase.png", category: "Backend & Data", mass: 1.15, detail: "Realtime broadcast, Auth, Row-Level Security" },
  { name: "C++", image: "/skills/cpp.png", category: "Systems & Core", mass: 1.25, detail: "Data structures, algorithms, memory-conscious code" },
  { name: "C", image: "/skills/c-lang.png", category: "Systems & Core", mass: 1.1, detail: "Low-level systems programming, pointers, OS fundamentals" },
  { name: "Docker", image: "/skills/docker.png", category: "Systems & Core", mass: 1.15, detail: "Containerized builds, reproducible microservices" },
  { name: "Git", image: "/skills/git.png", category: "Systems & Core", mass: 1.1, detail: "Version control, CI workflows, clean commit history" },
];

export const ENGINEERING_LOG = [
  {
    period: "2025 — PRESENT",
    role: "Independent Product & Systems Engineer",
    org: "Self-Directed / Open Source (@Rishu-xd)",
    location: "India",
    bullets: [
      "Engineered and deployed Betterclock (betterclock.xyz), a real-time multiplayer focus clock with synchronized timers and peer-to-peer study rooms.",
      "Built ARC (Adaptive Reasoning Canvas) and BirdWiki in TypeScript, exploring spatial node-graph interfaces, custom 2D/3D canvas rendering, and instant local search.",
      "Developed automated media & stream extraction pipelines in Python, Flask, and Playwright across 25+ public repositories.",
    ],
  },
  {
    period: "2024 — 2025",
    role: "Full-Stack Developer & Systems Explorer",
    org: "Product Builds & Campus Systems",
    location: "India",
    bullets: [
      "Architected Qflow using Flutter, Next.js, and Supabase Realtime to digitize physical waiting queues into live token streams.",
      "Created DoLog, combining daily habit tracking with a custom 365-day contribution telemetry heatmap.",
      "Deepened foundation in Data Structures & Algorithms (C/C++), computer graphics (Three.js / WebGL), and deterministic UI physics.",
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: "GitHub", handle: "@Rishu-xd", href: "https://github.com/Rishu-xd", icon: "/github.png", external: true },
  { label: "LinkedIn", handle: "Akhand Veer Singh", href: "https://linkedin.com/in/rishu-xd", icon: "/linkedin.png", external: true },
  { label: "X / Twitter", handle: "@rishu_xd", href: "https://x.com/rishu_xd", icon: "/x.png", external: true },
  { label: "Email", handle: "rishu99xd@gmail.com", href: "mailto:rishu99xd@gmail.com", icon: "/gmailnew.png", external: false },
  { label: "Spotify", handle: "Live Telemetry", href: "https://open.spotify.com", icon: "/spotify.png", external: true },
];
