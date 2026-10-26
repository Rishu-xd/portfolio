"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Moon,
  Sun,
} from "lucide-react";
import { bind, play } from "cuelume";
import { GlassDock } from "../components/GlassDock";
import "../components/GlassDock.css";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";


const projects = [
  {
    number: "01",
    title: "Betterclock",
    description: "A focused timer for getting things done together.",
    stack: "Next.js · TypeScript",
    href: "https://www.betterclock.xyz",
    accent: "from-emerald-200 via-lime-300 to-green-500",
    preview: "A calmer way to focus",
  },
  {
    number: "02",
    title: "DoLog",
    description: "A productivity space for organizing tasks and building consistent habits.",
    stack: "React · Motion",
    href: "https://github.com/Rishu-xd/DoLog",
    accent: "from-rose-200 via-pink-400 to-rose-500",
    preview: "Make progress, every day",
  },
  {
    number: "03",
    title: "Qflow",
    description: "A digital queue platform for reducing wait times and managing busy queues.",
    stack: "Flutter · Next.js · Supabase",
    href: "https://github.com/Rishu-xd",
    accent: "from-sky-200 via-cyan-400 to-blue-500",
    preview: "Your place in line, made simple",
  },
];

const contactLinks = [
  { label: "GitHub", href: "https://github.com/Rishu-xd", icon: "/github.png", external: true },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "/linkedin.png", external: true },
  { label: "Twitter", href: "https://x.com", icon: "/x.png", external: true },
  { label: "Mail", href: "mailto:rishu99xd@gmail.com", icon: "/gmailnew.png", external: false },
];

const skills = [
  { name: "TypeScript", image: "typescript.png" },
  { name: "Tailwind CSS", image: "tailwindcss.png" },
  { name: "Supabase", image: "supabase.png" },
  { name: "React", image: "react.png" },
  { name: "Python", image: "python.png" },
  { name: "PostgreSQL", image: "postgresql.png" },
  { name: "Node.js", image: "nodejs.png" },
  { name: "Next.js", image: "next-js.png" },
  { name: "Git", image: "git.png" },
  { name: "Docker", image: "docker.png" },
  { name: "C++", image: "cpp.png" },
  { name: "C", image: "c-lang.png" },
];

const roles = ["Full-stack", "Product engineer"];

type ContributionActivity = {
  username: string;
  total: number;
  year: number;
  cells: { date: string; level: number; count: number }[];
};

const darkActivityColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const lightActivityColors = ["#f0f0f0", "#d0d0d0", "#a3a3a3", "#737373", "#333333"];

export default function AlternatePortfolio() {
  const [lightTheme, setLightTheme] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [activity, setActivity] = useState<ContributionActivity | null>(null);
  const [activityError, setActivityError] = useState(false);
  const skillsMarqueeRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const reveal = shouldReduceMotion
    ? { initial: false as const, whileInView: undefined }
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } };
  const itemReveal = shouldReduceMotion
    ? { initial: false as const, whileInView: undefined }
    : { initial: { opacity: 0, y: 12 }, whileInView: { opacity: 1, y: 0 } };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((currentIndex) => (currentIndex + 1) % roles.length);
    }, 3300);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => bind(), []);

  useEffect(() => {
    const marquee = skillsMarqueeRef.current;
    if (!marquee) return;

    const animations = Array.from(
      marquee.querySelectorAll(".skills-marquee-track"),
    ).flatMap((track) => track.getAnimations());
    const duration = 600;
    let playbackRate = 1;
    let animationFrame = 0;

    const rampPlaybackRate = (targetRate: number) => {
      window.cancelAnimationFrame(animationFrame);

      const startRate = playbackRate;
      const startTime = performance.now();

      const updatePlaybackRate = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        playbackRate = startRate + (targetRate - startRate) * progress;
        animations.forEach((animation) => animation.updatePlaybackRate(playbackRate));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(updatePlaybackRate);
        }
      };

      animationFrame = window.requestAnimationFrame(updatePlaybackRate);
    };

    const handlePointerEnter = () => rampPlaybackRate(0);
    const handlePointerLeave = () => rampPlaybackRate(1);

    marquee.addEventListener("pointerenter", handlePointerEnter);
    marquee.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      marquee.removeEventListener("pointerenter", handlePointerEnter);
      marquee.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const year = new Date().getFullYear();

    fetch(`/api/github-contributions?year=${year}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("GitHub activity is temporarily unavailable.");
        }

        const data: ContributionActivity = await response.json();
        setActivity(data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setActivityError(true);
      });

    return () => controller.abort();
  }, []);

  return (
    <motion.main
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className={`min-h-svh px-3 pb-12 pt-0 transition-colors sm:px-6 ${
        lightTheme ? "bg-[#f4f3ef] text-[#20211e]" : "bg-[#0b0b0b] text-[#ededed]"
      }`}
      id="home"
    >
     

      <div aria-hidden="true">
 

      <div className="dot-grid-area" id="dotGridArea"></div>
      
</div>
      <div
        className={`portfolio-frame mx-auto min-h-svh w-full max-w-[628px]  backdrop-blur-2xl`}
      >

        
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.08 }}
          className={`sticky top-0 z-10 flex h-10 items-center justify-between  px-2 backdrop-blur-sm sm:px-3 `}
        >
          <motion.a href="#home" data-cuelume-navigate whileHover={shouldReduceMotion ? undefined : { y: -1 }} className="font-serif text-lg leading-none tracking-tight">
            Rishu
          </motion.a>
          <nav className="flex h-full items-center gap-3 text-[10px] text-current/60 sm:gap-5 sm:text-xs" aria-label="Main navigation">
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} className="text-current transition-colors hover:text-current" href="#home" data-cuelume-navigate>Home</motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} className="transition-colors hover:text-current" href="#projects" data-cuelume-navigate>Projects</motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} className="transition-colors hover:text-current" href="#experience" data-cuelume-navigate>Experience</motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} className="transition-colors hover:text-current" href="#contact" data-cuelume-navigate>Contact</motion.a>
            <button
              type="button"
              aria-label={lightTheme ? "Switch to dark theme" : "Switch to light theme"}
              aria-pressed={lightTheme}
              data-cuelume-toggle
              onClick={() => setLightTheme((currentTheme) => !currentTheme)}
              className="ml-1 grid size-7 place-items-center rounded-full transition-colors hover:bg-current/10"
            >
              <motion.span key={lightTheme ? "sun" : "moon"} initial={shouldReduceMotion ? false : { scale: 0.5, rotate: -35, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}>
                {lightTheme ? <Sun className="size-3.5" aria-hidden="true" /> : <Moon className="size-3.5" aria-hidden="true" />}
              </motion.span>
            </button>
          </nav>
        </motion.header>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scaleY: 0.7 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.15 }}
          className={`relative h-[100px] rounded-xl  ${
              lightTheme
                ? "shadow-[0_8px_5px_rgba(0,0,0,0.2)]"
                : "shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            } overflow-hidden border-b border-white/10 bg-[#142321]`}
          aria-hidden="true"
        >
          <video
            src="/video/banner.mp4"
            autoPlay={!shouldReduceMotion}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/15" />
          <motion.div
            initial={false}
            animate={shouldReduceMotion ? undefined : { x: [-90, 90] }}
            transition={shouldReduceMotion ? undefined : { duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className="absolute left-[48%] top-0 h-full w-16 -skew-x-12 bg-white/15 blur-xl"
          />
        </motion.div>

        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.2 }}
          className={`flex items-center gap-4  px-4 py-4 sm:px-5
          `}
          aria-labelledby="profile-name"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 210, damping: 18, delay: shouldReduceMotion ? 0 : 0.28 }}
          >
          <Image
            src="/images/hero.jpg"
            alt="Akhand Veer Singh"
            width={76}
            height={76}
            className={`size-[76px] shrink-0 rounded-lg border-[2px] border-white/90  object-cover ${
              lightTheme
                ? "shadow-[0_8px_8px_rgba(0,0,0,0.2)]"
                : "shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
            }`}
          />

          
          </motion.div>
          <div className="min-w-0">
            <p className="text-[10px] text-current/50">✦</p>
            <h1 id="profile-name" className="mt-0.5 font-serif text-[22px] leading-tight">Akhand Veer Singh</h1>
            <p className="mt-0.5 h-5 overflow-hidden text-sm font-medium text-current/55" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={shouldReduceMotion ? false : { y: -16, opacity: 0, filter: "blur(5px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: 8, opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeInOut" }}
                  className="block"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </p>
            <p className="mt-1 text-[10px] text-current/40">India</p>
          </div>
          <span className="ml-auto hidden items-center gap-1 text-[10px] text-current/35 sm:flex" aria-label="Portfolio profile">
            <svg className="size-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1.7 8s2.3-4 6.3-4 6.3 4 6.3 4-2.3 4-6.3 4-6.3-4-6.3-4Z" stroke="currentColor" />
              <circle cx="8" cy="8" r="1.7" stroke="currentColor" />
            </svg>
            Views
          </span>
        </motion.section>
        <motion.section
          {...reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          id="about"
          className={` px-4 py-5 sm:px-5 `}
          aria-labelledby="about-title"
        >
          {/* <h2 id="about-title" className="font-serif text-[22px] leading-tight">About</h2> */}
          <ul className="mt-4 list-disc space-y-2.5 pl-4 text-[13px] leading-[1.5] text-current/80 marker:text-current/35 text-gray-400">
            <motion.li {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.08 }}>
              I&apos;m a <strong className={`font-semibold text-current ${lightTheme? "text-gray-800":"text-white"}`}>Product Engineer</strong> passionate about crafting digital products where thoughtful design meets clean, scalable code.
            </motion.li>
            <motion.li {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.16 }}>
              I design and develop modern interfaces with <strong className={`font-semibold text-current ${lightTheme? "text-gray-800":"text-white"}`}>TypeScript, React, Next.js, and Tailwind CSS</strong>, focusing on usability, performance, and delightful interactions.
            </motion.li>
            <motion.li {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.24 }}>
              I enjoy transforming ideas into polished products, exploring new technologies, refining details, and creating intuitive experiences.
            </motion.li>
          </ul>

        
          <GlassDock
             magnify={1.3}
             spread={2}
             lift={10}
           />

          <motion.div id="gitb" {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.16 }} className={`mt-3 rounded-lg border-2 p-3 border-dashed  ${
            lightTheme ? "border-black/[0.2] bg-black/[0.1] hover:border-gray-700"  : "border-white/[0.08] bg-white/[0.02] hover:border-white/50"
          }`}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-serif text-sm">GitHub activity</h2>
              {activity && (
                <span className="text-[10px] text-current/50">
                  {activity.total.toLocaleString()} contributions in {activity.year}
                </span>
              )}
            </div>
            {activity ? (
              <div
                className="activity-scroll mt-3 overflow-x-auto pt-8 pb-1"
                role="img"
                aria-label={`${activity.total.toLocaleString()} GitHub contributions in ${activity.year}`}
              >
                <div className="grid w-max grid-rows-7 grid-flow-col gap-[3px]">
                  {activity.cells.map(({ date, level, count }) => {
                    const intensity = Math.min(Math.max(level, 0), 4);

                    return (
                      <motion.span
                        key={date}
                        aria-hidden="true"
                        className={`size-[9px] rounded-[2px]  ${count > 0 ? "relative" : ""}`}
                        style={{ backgroundColor: (lightTheme ? lightActivityColors : darkActivityColors)[intensity] }}
                        initial={count > 0 ? "rest" : false}
                        animate={count > 0 ? "rest" : undefined}
                        whileHover={count > 0 ? "hover" : undefined}
                        variants={{
                          rest: { scale: 1, zIndex: 0, boxShadow: "0 0 0 rgba(57, 211, 83, 0)" },
                          hover: {
                            scale: shouldReduceMotion ? 1 : 1.5,
                            zIndex: 30,
                            boxShadow: lightTheme
                              ? "0 0 8px rgba(0, 0, 0, 0.45)"
                              : "0 0 8px rgba(57, 211, 83, 0.85)",
                          },
                        }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
                      >
                        {count > 0 && (
                          <motion.span
                            aria-hidden="true"
                            className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-[#242f28] bg-[#000d05] px-2 py-1 text-[5px] leading-tight text-white shadow-lg"
                            variants={{
                              rest: { opacity: 0, y: 4, scale: 0.95 },
                              hover: { opacity: 1, y: 0, scale: 1 },
                            }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                          >
                            {count} contribution{count === 1 ? "" : "s"}
                            {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                            {" · "}
                          </motion.span>
                        )}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            ) : activityError ? (
              <p className="mt-3 text-xs text-current/50">
                GitHub activity is temporarily unavailable.
              </p>
            ) : (
              <p className="mt-3 text-xs text-current/50" role="status">
                Loading GitHub activity…
              </p>
            )}
            <a
              href="https://github.com/Rishu-xd"
              target="_blank"
              rel="noreferrer"
              data-cuelume-navigate
              className="mt-3 inline-block text-[10px] text-current/50 transition-colors hover:text-current"
            >
              View GitHub profile
            </a>
          </motion.div>
        </motion.section>
        
        <motion.section
          {...reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.25 }}
          id="skills"
          className={`overflow-hidden py-4 `}
          aria-labelledby="skills-title"
        >
          <h2 id="skills-title" className="mb-3 px-4 font-serif text-[22px] leading-tight sm:px-5  ">Skills</h2>
          <div ref={skillsMarqueeRef} className="skills-marquee grid gap-1 border-gray-500 border-dashed border-t border-b  p-1 " aria-label="Skills and technologies">
            {[false, true].map((reverse) => (
              <div className="skills-marquee-window "  key={reverse ? "right" : "left" }>
                <div className={`skills-marquee-track ${reverse ? "skills-marquee-track--right" : ""}`}>
                  {[0, 1].map((copy) => (
                    <div className="skills-marquee-group" key={copy} aria-hidden={copy === 1}>
                      {skills.map((skill) => (
                        <div
                          className={`flex h-10 w-[104px] shrink-0 items-center cursor-pointer gap-2 rounded-md border border-dashed px-2 transition-colors duration-200 ${
                            lightTheme
                              ? "border-black/20 hover:border-gray-300 hover:bg-emerald-700/10 hover:text-gray-300"
                              : "border-white/20 hover:border-gray-300 hover:bg-lime-300/10 hover:text-gray-300"
                          }`}
                          key={skill.name}
                        >
                          <Image
                            src={`/skills/${skill.image}`}
                            alt=""
                            width={25}
                            height={25}
                            className="size-6 shrink-0 object-contain"
                          />
                          <span className="text-[12px] leading-tight text-current/75 ">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          {...reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.35 }}
          id="experience"
          className={`border-b px-4 py-4 sm:px-5 ${
            lightTheme ? "border-black/[0.1]" : "border-white/[0.1]"
          }`}
          aria-labelledby="experience-title"
        >
          <h2 id="experience-title" className="font-serif text-[22px] leading-tight">Experience</h2>
          <motion.div {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.08 }} className={`mt-3 flex flex-wrap items-center justify-between gap-2 border p-3 ${
            lightTheme ? "border-black/[0.08] bg-black/[0.02]" : "border-white/[0.08] bg-white/[0.02]"
          }`}>
            <div>
              <p className="text-sm font-medium">Qflow</p>
              <p className="mt-1 text-xs text-current/50">Queue-management product · Product engineering</p>
            </div>
             <div className="flex items-center gap-1 justify-center ">
              <span className="grid size-2 shrink-0 place-items-center rounded-full border border-current/30 bg-green-500"></span>
              <span className="text-[10px] text-current/40">In progress</span>
            </div>
          </motion.div>

         
        </motion.section>


        <motion.section
          {...reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.15 }}
          id="projects"
          className="px-3 py-4 sm:px-3.5"
          aria-labelledby="projects-title"
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 id="projects-title" className="font-serif text-[22px] leading-tight">Projects</h2>
            <motion.a whileHover={shouldReduceMotion ? undefined : { x: 2 }} className="inline-flex items-center gap-1 text-[10px] text-current/45 transition-colors hover:text-current" href="https://github.com/Rishu-xd" target="_blank" rel="noreferrer" data-cuelume-navigate>
              View all <ArrowUpRight className="size-3" aria-hidden="true" />
            </motion.a>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.map((project, index) => (
              <motion.a
                key={project.number}
                {...itemReveal}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.09 }}
                href={project.href}
                data-cuelume-navigate
                target="_blank"
                rel="noreferrer"
                className={`group overflow-hidden rounded-md border transition-transform hover:-translate-y-0.5 ${
                  lightTheme ? "border-black/10 bg-white/50" : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <div className={`relative aspect-[1.75] overflow-hidden bg-gradient-to-br ${project.accent} p-3`}>
                  <div className="absolute inset-x-0 top-0 h-5 bg-black/[0.12]" />
                  <div className="absolute left-2 top-1.5 flex gap-1" aria-hidden="true">
                    <span className="size-1 rounded-full bg-white/80" />
                    <span className="size-1 rounded-full bg-white/55" />
                    <span className="size-1 rounded-full bg-white/35" />
                  </div>
                  <div className="absolute inset-x-5 bottom-[-18%] top-[27%] rounded-t-md border border-black/10 bg-[#f7f8f5] p-2.5 shadow-xl transition-transform duration-300 group-hover:translate-y-1">
                    <div className="flex items-center justify-between">
                      <span className="h-1.5 w-9 rounded-full bg-[#20211e]/75" />
                      <span className="flex gap-1">
                        <span className="h-1 w-3 rounded-full bg-[#20211e]/20" />
                        <span className="h-1 w-3 rounded-full bg-[#20211e]/20" />
                        <span className="h-1 w-3 rounded-full bg-lime-500" />
                      </span>
                    </div>
                    <div className="mt-5 flex h-[55%] flex-col items-center justify-center rounded-sm bg-gradient-to-b from-sky-100 to-emerald-100 text-center">
                      <span className="max-w-[85%] font-serif text-[10px] leading-tight text-[#20211e] sm:text-xs">{project.preview}</span>
                      <span className="mt-2 rounded-full bg-[#b7e64d] px-2 py-1 text-[6px] font-semibold text-[#20211e]">Explore project</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-2 p-3">
                  <div>
                    <span className="text-[9px] text-current/35">{project.number}</span>
                    <h3 className="mt-0.5 text-sm font-medium">{project.title}</h3>
                    <p className="mt-1 text-[10px] leading-relaxed text-current/50">{project.description}</p>
                    <p className="mt-2 text-[9px] text-current/35">{project.stack}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-3.5 text-current/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>



        <motion.footer {...reveal} transition={{ duration: shouldReduceMotion ? 0 : 0.45 }} viewport={{ once: true, amount: 0.7 }} className={`flex items-center justify-between border-t px-4 py-3 text-[10px] text-current/40 ${
          lightTheme ? "border-black/[0.1]" : "border-white/[0.1]"
        }`}>
          <span>Designed & built by Akhand Veer Singh</span>
          <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} className="inline-flex items-center gap-1 transition-colors hover:text-current" href="#home" data-cuelume-navigate>Back to top <ArrowUpRight className="size-3" aria-hidden="true" /></motion.a>
        </motion.footer>
      </div>
    </motion.main>
  );
}