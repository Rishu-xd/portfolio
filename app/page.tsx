"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const socials = [
  { label: "GitHub", image: "/github.png", href: "https://github.com/Rishu-xd" },
  { label: "X", icon: "X", href: "https://x.com" },
  { label: "LinkedIn", image: "/linkedin.png", href: "https://linkedin.com" },
  { label: "Email", image: "/gmailnew.png", href: "mailto:rishu99xd@gmail.com" },
];

type ContributionData = {
  username: string;
  total: number;
  year: number;
  cells: { date: string; level: number }[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Page() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [contributions, setContributions] = useState<ContributionData | null>(null);
  const [contributionError, setContributionError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/github-contributions?year=${selectedYear}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load contributions");
        return response.json() as Promise<ContributionData>;
      })
      .then((data) => {
        setContributionError(false);
        setContributions(data);
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setContributionError(true);
      });

    return () => controller.abort();
  }, [selectedYear]);

  const contributionMonths = contributions
    ? Array.from(new Set(contributions.cells.map((cell) => new Date(`${cell.date}T00:00:00`).toLocaleString("en-US", { month: "short" }))))
    : [];

  return (
    <main className="min-h-screen bg-[#090909] px-5 pb-24 text-[#e8e8e8] sm:px-8">
      <motion.nav
        className="mx-auto flex h-14 max-w-[790px] items-center justify-between border-b border-white/[0.035] text-[13px] text-white/45"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-6">
          <a className="text-white transition-colors hover:text-white/70" href="#home">Home</a>
          <a className="transition-colors hover:text-white" href="#projects">Projects</a>
          <a className="transition-colors hover:text-white" href="#blogs">Blogs</a>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden h-8 items-center gap-2 rounded-lg border border-white/[0.09] px-3 text-xs text-white/45 transition-colors hover:border-white/20 hover:text-white sm:flex" type="button">
            <span className="text-sm">⌕</span>
            Search
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/25">Ctrl K</kbd>
          </button>
          <button className="grid size-8 place-items-center rounded-lg border border-white/[0.09] text-sm text-white/65 transition-colors hover:border-white/20 hover:text-white" type="button" aria-label="Toggle theme">
            ◔
          </button>
        </div>
      </motion.nav>

      <motion.div
        id="home"
        className="mx-auto max-w-[790px] pt-20 sm:pt-24"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 } } }}
      >
        <motion.header className="flex items-center gap-4" variants={fadeUp} transition={{ duration: 0.65 }}>
          <motion.div 
            className=" grid size-16 border-1 border-green-200 shrink-0 place-items-center rounded-[17px] bg-[url('/images/hero.jpg')] bg-cover bg-center text-2xl font-bold shadow-[0_0_30px_rgba(174,20,136,0.16)] sm:size-[64px]"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            
          </motion.div>
          <div>
            <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[31px]">Akhand Veer Singh</h1>
            <p className="mt-2 text-[14px] text-white/40">Full-Stack Developer</p>
          </div>
        </motion.header>

        <motion.div className="mt-11 grid grid-cols-2 gap-y-6 sm:grid-cols-3 sm:gap-x-16" variants={fadeUp} transition={{ duration: 0.65 }}>
          <Info label="LOCATION" value="India" icon="⌖" />
          <Info label="EMAIL" value="rishu99xd@gmail.com" icon="✉" />
          <Info label="PRONOUNS" value="he/him" icon="♙" />
        </motion.div>

        <motion.p className="mt-8 max-w-[735px] text-[15px] leading-7 text-white/55 sm:text-[16px]" variants={fadeUp} transition={{ duration: 0.65 }}>
          I build end-to-end web products, paying attention to the small details that make software feel polished and effortless to use. Currently working with <strong className="font-medium text-white/75">TypeScript, React, Next.js, Tailwind CSS.</strong>
        </motion.p>

        <motion.div className="mt-8 flex items-center gap-2 text-[13px] text-white/35" variants={fadeUp} transition={{ duration: 0.65 }}>
          <span className="grid size-4 place-items-center rounded-full bg-[#1ed760] text-[10px] text-black">●</span>
          Not listening to Spotify right now.
        </motion.div>

        <motion.div className="mt-7 flex items-center gap-5" variants={fadeUp} transition={{ duration: 0.65 }}>
          {socials.map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="text-[15px] font-semibold text-white/55 transition-colors hover:text-white"
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.12 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            >
              {social.image ? (
                <Image
                  src={social.image}
                  alt=""
                  width={22}
                  height={22}
                  className="size-[22px] object-contain"
                />
              ) : (
                social.icon
              )}
            </motion.a>
          ))}
        </motion.div>

        <motion.section className="mt-12 overflow-hidden" variants={fadeUp} transition={{ duration: 0.65 }} aria-label="Contribution activity">
          <div className="mb-5 flex items-center justify-between">
            <label className="flex items-center gap-2 text-[12px] text-white/50" htmlFor="contribution-year">
              Contribution settings
              <span aria-hidden="true">▾</span>
            </label>
            <select
              id="contribution-year"
              value={selectedYear}
              onChange={(event) => {
                setContributions(null);
                setContributionError(false);
                setSelectedYear(Number(event.target.value));
              }}
              className="rounded-md border border-[#2674df] bg-[#2674df] px-4 py-2 text-[13px] font-medium text-white outline-none transition-colors hover:bg-[#347fe5]"
            >
              {[2026, 2025, 2024, 2023].map((year) => <option key={year} value={year} className="bg-[#10151b] text-white">{year}</option>)}
            </select>
          </div>
          {contributions ? (
            <>
              <div className="mb-2 flex min-w-[660px] items-center justify-between px-0.5 text-[12px] font-semibold text-white/75">
                {contributionMonths.map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}
                <a className="ml-4 flex shrink-0 items-center gap-2 text-white/45 transition-colors hover:text-white" href="https://github.com/Rishu-xd" aria-label="View GitHub profile">
                  <Image src="/github.png" alt="" width={16} height={16} className="size-4 object-contain" />
                  GitHub
                </a>
              </div>
              <div className="contribution-scroll overflow-x-auto pb-2">
                <div className="contribution-grid grid grid-flow-col grid-rows-7">
                  {contributions.cells.map((cell) => (
                    <motion.span
                      key={cell.date}
                      className={`contribution-cell level-${cell.level}`}
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={cell.level === 0 || shouldReduceMotion ? undefined : { scale: 1.65, zIndex: 10 }}
                      viewport={{ once: true }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.0015, duration: 0.28, type: "spring", stiffness: 420, damping: 22 }}
                      title={`${cell.date}: GitHub contribution level ${cell.level}`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="h-[108px] pt-10 text-sm text-white/35">
              {contributionError ? "GitHub activity is unavailable right now." : "Loading GitHub activity..."}
            </p>
          )}
          {contributions && (
            <div className="mt-2 flex items-center justify-between text-[12px] text-white/70">
              <span><strong className="font-semibold text-white">{contributions.total}</strong> Contributions · {contributions.year}</span>
              <span className="hidden items-center gap-1.5 sm:flex">Less <i className="contribution-cell level-0" /><i className="contribution-cell level-1" /><i className="contribution-cell level-2" /><i className="contribution-cell level-3" /><i className="contribution-cell level-4" /> More</span>
            </div>
          )}
        </motion.section>

        <motion.section id="projects" className="mt-16 border-t border-white/[0.06] pt-6" variants={fadeUp} transition={{ duration: 0.65 }}>
          <p className="text-[12px] font-semibold tracking-[0.14em] text-white/45">TECH STACK</p>
          <div className="mt-5 flex flex-wrap gap-2" id="blogs">
            {["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "Python", "C++"].map((tech) => <span key={tech} className="rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-white/50">{tech}</span>)}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-white/45">{label}</p>
      <p className="flex items-center gap-2 whitespace-nowrap text-[14px] text-white/70"><span className="text-white/45">{icon}</span>{value}</p>
    </div>
  );
}
