"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  CodeXml,
  Mail,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import useSound from "use-sound";

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
  { label: "GitHub", href: "https://github.com/Rishu-xd", icon: CodeXml, external: true },
  { label: "LinkedIn", href: "https://linkedin.com", icon: BriefcaseBusiness, external: true },
  { label: "Twitter", href: "https://x.com", icon: ArrowUpRight, external: true },
  { label: "Mail", href: "mailto:rishu99xd@gmail.com", icon: Mail, external: false },
];

const roles = ["Full-stack", "Product engineer"];

export default function AlternatePortfolio() {
  const [lightTheme, setLightTheme] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const [playUiSound] = useSound("/sounds/interface-pop.wav", {
    volume: 0.18,
    interrupt: true,
  });
  const playEnabledSound = () => {
    if (soundEnabled) playUiSound();
  };
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
      <div
        className={`mx-auto min-h-svh w-full max-w-[628px] border-x ${
          lightTheme ? "border-black/[0.08]" : "border-white/[0.08]"
        }`}
      >
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.08 }}
          className={`sticky top-0 z-10 flex h-10 items-center justify-between border-b px-2 backdrop-blur-md sm:px-3 ${
            lightTheme
              ? "border-black/[0.1] bg-[#f4f3ef]/90"
              : "border-white/[0.1] bg-[#0b0b0b]/90"
          }`}
        >
          <motion.a href="#home" onClick={playEnabledSound} whileHover={shouldReduceMotion ? undefined : { y: -1 }} className="font-serif text-lg leading-none tracking-tight">
            Rishu
          </motion.a>
          <nav className="flex h-full items-center gap-3 text-[10px] text-current/60 sm:gap-5 sm:text-xs" aria-label="Main navigation">
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} onClick={playEnabledSound} className="text-current transition-colors hover:text-current" href="#home">Home</motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} onClick={playEnabledSound} className="transition-colors hover:text-current" href="#projects">Projects</motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { y: -2 }} onClick={playEnabledSound} className="transition-colors hover:text-current" href="#experience">Experience</motion.a>
            <details className="group relative h-full">
              <summary onClick={playEnabledSound} className="flex h-full cursor-pointer list-none items-center gap-1 transition-colors hover:text-current">
                More
                <ChevronDown className="size-3 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className={`absolute right-0 top-full mt-1 grid min-w-32 gap-1 rounded-md border p-1.5 shadow-xl ${
                lightTheme ? "border-black/10 bg-[#f4f3ef]" : "border-white/10 bg-[#141414]"
              }`}>
                <a onClick={playEnabledSound} className="rounded px-2 py-1.5 hover:bg-current/5" href="#contact">Contact</a>
                <a onClick={playEnabledSound} className="rounded px-2 py-1.5 hover:bg-current/5" href="#chooser">Choose portfolio</a>
                <a onClick={playEnabledSound} className="rounded px-2 py-1.5 hover:bg-current/5" href="#current">Original design</a>
              </div>
            </details>
            <button
              type="button"
              aria-label={lightTheme ? "Switch to dark theme" : "Switch to light theme"}
              aria-pressed={lightTheme}
              onClick={() => {
                playEnabledSound();
                setLightTheme((currentTheme) => !currentTheme);
              }}
              className="ml-1 grid size-7 place-items-center rounded-full transition-colors hover:bg-current/10"
            >
              <motion.span key={lightTheme ? "sun" : "moon"} initial={shouldReduceMotion ? false : { scale: 0.5, rotate: -35, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}>
                {lightTheme ? <Sun className="size-3.5" aria-hidden="true" /> : <Moon className="size-3.5" aria-hidden="true" />}
              </motion.span>
            </button>
            <button
              type="button"
              aria-label={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
              aria-pressed={soundEnabled}
              onClick={() => {
                if (!soundEnabled) playUiSound();
                setSoundEnabled((enabled) => !enabled);
              }}
              className="grid size-7 place-items-center rounded-full transition-colors hover:bg-current/10"
            >
              <motion.span key={soundEnabled ? "sound-on" : "sound-off"} initial={shouldReduceMotion ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}>
                {soundEnabled ? <Volume2 className="size-3.5" aria-hidden="true" /> : <VolumeX className="size-3.5" aria-hidden="true" />}
              </motion.span>
            </button>
          </nav>
        </motion.header>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scaleY: 0.7 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : 0.15 }}
          className="relative h-[68px] overflow-hidden border-b border-white/10 bg-[#142321]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(180deg, transparent 45%, rgba(7, 11, 13, .48)), radial-gradient(ellipse at 12% 100%, #234438 0 18%, transparent 19%), radial-gradient(ellipse at 36% 110%, #294b3b 0 22%, transparent 23%), radial-gradient(ellipse at 83% 100%, #1c3c35 0 23%, transparent 24%), linear-gradient(112deg, #152522, #49675e 35%, #b7c8bf 51%, #38564d 68%, #182723)",
          }}
        >
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
          className={`flex items-center gap-4 border-b px-4 py-4 sm:px-5 ${
            lightTheme ? "border-black/[0.1]" : "border-white/[0.1]"
          }`}
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
            className={`size-[76px] shrink-0 rounded-lg border-[3px] object-cover ${
              lightTheme ? "border-black/10" : "border-white/15"
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
            Portfolio
          </span>
        </motion.section>

        <motion.section
          {...reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          id="about"
          className={`border-b px-4 py-5 sm:px-5 ${
            lightTheme ? "border-black/[0.1]" : "border-white/[0.1]"
          }`}
          aria-labelledby="about-title"
        >
          <h2 id="about-title" className="font-serif text-[22px] leading-tight">About</h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-4 text-[13px] leading-[1.5] text-current/80 marker:text-current/35">
            <motion.li {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.08 }}>
              I&apos;m a <strong className="font-semibold text-current">Product Engineer</strong> passionate about crafting digital products where thoughtful design meets clean, scalable code.
            </motion.li>
            <motion.li {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.16 }}>
              I design and develop modern interfaces with <strong className="font-semibold text-current">TypeScript, React, Next.js, and Tailwind CSS</strong>, focusing on usability, performance, and delightful interactions.
            </motion.li>
            <motion.li {...itemReveal} transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : 0.24 }}>
              I enjoy transforming ideas into polished products, exploring new technologies, refining details, and creating intuitive experiences.
            </motion.li>
          </ul>
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
          viewport={{ once: true, amount: 0.35 }}
          id="contact"
          className={`border-b px-4 py-4 sm:px-5 ${
            lightTheme ? "border-black/[0.1]" : "border-white/[0.1]"
          }`}
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title" className="font-serif  text-[22px] leading-tight">Contact</h2>
          <div className="mt-3 grid grid-cols-2   border-gray-800 border-t-1  sm:grid-cols-4">
            {contactLinks.map((link, index) => {
              const Icon = link.icon;
              return (
              <motion.a
                key={link.label}
                {...itemReveal}
                onClick={playEnabledSound}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                className={`flex min-h-10 items-center gap-2 border-b border-r px-2 text-xs transition-colors ${
                  lightTheme
                    ? "border-black/[0.1] hover:bg-black/[0.04]"
                    : "border-white/[0.1] hover:bg-white/[0.05]"
                }`}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
              >
                <span className={`grid size-6 shrink-0 place-items-center rounded-md border ${
                  lightTheme ? "border-black/10 bg-black/[0.02]" : "border-white/10 bg-white/[0.02]"
                }`}>
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <span>{link.label}</span>
                {link.external && <ArrowUpRight className="ml-auto size-3 text-current/40" aria-hidden="true" />}
              </motion.a>
              );
            })}
          </div>
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
            <motion.a onClick={playEnabledSound} whileHover={shouldReduceMotion ? undefined : { x: 2 }} className="inline-flex items-center gap-1 text-[10px] text-current/45 transition-colors hover:text-current" href="https://github.com/Rishu-xd" target="_blank" rel="noreferrer">
              View all <ArrowUpRight className="size-3" aria-hidden="true" />
            </motion.a>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.map((project, index) => (
              <motion.a
                key={project.number}
                {...itemReveal}
                onClick={playEnabledSound}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.09 }}
                href={project.href}
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
          <motion.a onClick={playEnabledSound} whileHover={shouldReduceMotion ? undefined : { y: -2 }} className="inline-flex items-center gap-1 transition-colors hover:text-current" href="#home">Back to top <ArrowUpRight className="size-3" aria-hidden="true" /></motion.a>
        </motion.footer>
      </div>
    </motion.main>
  );
}
