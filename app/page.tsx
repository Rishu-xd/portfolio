"use client";

import { motion, useReducedMotion } from "motion/react";

const socials = [
  { label: "GitHub", icon: "GH", href: "https://github.com" },
  { label: "X", icon: "X", href: "https://x.com" },
  { label: "LinkedIn", icon: "in", href: "https://linkedin.com" },
  { label: "Email", icon: "@", href: "mailto:hello@thorfin.studio" },
];

const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const contributionCells = Array.from({ length: 364 }, (_, index) => {
  const week = Math.floor(index / 7);
  const day = index % 7;
  const intensity = (week * 7 + day * 13) % 17;

  return intensity > 14 ? 4 : intensity > 11 ? 3 : intensity > 7 ? 2 : intensity > 3 ? 1 : 0;
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function Page() {
  const shouldReduceMotion = useReducedMotion();

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
            className="grid size-16 shrink-0 place-items-center rounded-[17px] bg-[#ae1488] text-2xl font-bold text-[#101010] shadow-[0_0_30px_rgba(174,20,136,0.16)] sm:size-[64px]"
            whileHover={shouldReduceMotion ? undefined : { rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            A
          </motion.div>
          <div>
            <h1 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[31px]">Akhand Veer Singh</h1>
            <p className="mt-2 text-[14px] text-white/40">Full-Stack Developer</p>
          </div>
        </motion.header>

        <motion.div className="mt-11 grid grid-cols-2 gap-y-6 sm:grid-cols-3 sm:gap-x-16" variants={fadeUp} transition={{ duration: 0.65 }}>
          <Info label="LOCATION" value="India" icon="⌖" />
          <Info label="EMAIL" value="hello@thorfin.studio" icon="✉" />
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
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        <motion.section className="mt-12 overflow-hidden" variants={fadeUp} transition={{ duration: 0.65 }} aria-label="Contribution activity">
          <div className="mb-2 flex min-w-[660px] justify-between px-0.5 text-[12px] font-semibold text-white/75">
            {months.map((month, index) => <span key={`${month}-${index}`}>{month}</span>)}
          </div>
          <div className="contribution-scroll overflow-x-auto pb-2">
            <div className="grid w-[770px] grid-flow-col grid-rows-7 gap-[3px]">
              {contributionCells.map((level, index) => (
                <motion.span
                  key={index}
                  className={`contribution-cell level-${level}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: shouldReduceMotion ? 0 : index * 0.0015, duration: 0.28 }}
                  title={`${level} contributions`}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-white/70">
            <span><strong className="font-semibold text-white">354</strong> Contributions · 2025-26</span>
            <span className="hidden items-center gap-1.5 sm:flex">Less <i className="contribution-cell level-0" /><i className="contribution-cell level-1" /><i className="contribution-cell level-2" /><i className="contribution-cell level-3" /><i className="contribution-cell level-4" /> More</span>
          </div>
        </motion.section>

        <motion.section id="projects" className="mt-16 border-t border-white/[0.06] pt-6" variants={fadeUp} transition={{ duration: 0.65 }}>
          <p className="text-[12px] font-semibold tracking-[0.14em] text-white/45">TECH STACK</p>
          <div className="mt-5 flex flex-wrap gap-2" id="blogs">
            {["TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js"].map((tech) => <span key={tech} className="rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-white/50">{tech}</span>)}
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
