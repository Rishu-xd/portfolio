"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

export default function Page() {
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("work");

  useEffect(() => {
    const sections = ["work", "about", "contact"]
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-35% 0px -55%", threshold: [0.1, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
    const sectionId = event.currentTarget.getAttribute("href")?.slice(1);
    const target = sectionId ? document.getElementById(sectionId) : null;

    if (!target) return;

    event.preventDefault();
    setActiveSection(sectionId ?? "work");
    target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  }

  return (
    <main className="scroll-smooth bg-[#101010] px-4 py-5 text-[#f5f1e8] sm:px-6 sm:py-6">
      <motion.nav
        className="sticky top-5 z-10 mx-auto flex max-w-6xl items-center justify-between"
        aria-label="Main navigation"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      >
        <motion.a
          className="grid size-12 place-items-center rounded-full border border-[#f5f1e8]/35 bg-[#f5f1e8] text-xl font-bold text-[#101010] transition-transform hover:scale-105"
          href="#top"
          aria-label="Thorfin home"
          onClick={scrollToSection}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: 8 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
        >
          T
        </motion.a>

        <motion.div
          className="absolute right-0 top-0 flex gap-1 rounded-full border border-[#f5f1e8]/15 bg-[#f5f1e8]/10 p-1 shadow-lg shadow-black/10 backdrop-blur-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 150, damping: 18 }}
        >
          {["work", "about", "contact"].map((sectionId) => {
            const isActive = activeSection === sectionId;
            const label = sectionId[0].toUpperCase() + sectionId.slice(1);

            return (
              <motion.a
                key={sectionId}
                className={`relative rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition-colors sm:px-4 sm:text-xs ${
                  isActive ? "text-[#101010]" : "text-[#f5f1e8]/65 hover:text-[#101010]"
                }`}
                href={`#${sectionId}`}
                onClick={scrollToSection}
                aria-current={isActive ? "page" : undefined}
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              >
                {isActive && (
                  <motion.span
                    className="absolute inset-0 -z-0 rounded-full bg-[#f5f1e8]"
                    layoutId="active-nav-pill"
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.nav>

      <motion.section
        id="top"
        className="mx-auto flex min-h-[calc(100vh-92px)] max-w-6xl flex-col justify-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="flex gap-3 m-10 ">
            <motion.div className="w-100 h-150 bg-white rounded-2xl">

            </motion.div>
            <motion.div className="w-100 h-150 bg-white rounded-2xl">

            </motion.div>
            <motion.div className="w-100 h-150 bg-white rounded-2xl">

            </motion.div>
            <motion.div className="w-100 h-150 bg-white rounded-2xl">

            </motion.div>
        </motion.div>
      </motion.section>


      <motion.section
        id="work"
        className="mx-auto flex min-h-[calc(100vh-92px)] flex-col justify-center bg-gray-600"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* <p className="mb-4 font-sans text-xs uppercase tracking-[0.14em] text-[#c5bcae]">
          Independent designer and developer
        </p>
        <h1 className="max-w-3xl font-serif text-6xl font-normal leading-[0.92] tracking-[-0.04em] sm:text-8xl lg:text-[8rem]">
          Ideas with a little more depth.
        </h1> */}
      </motion.section>


      <motion.section
        id="about"
        className="mx-auto flex min-h-[calc(100vh-92px)] flex-col justify-center bg-gray-900"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* <p className="mb-4 font-sans text-xs uppercase tracking-[0.14em] text-[#c5bcae]">
          Independent designer and developer
        </p>
        <h1 className="max-w-3xl font-serif text-6xl font-normal leading-[0.92] tracking-[-0.04em] sm:text-8xl lg:text-[8rem]">
          Ideas with a little more depth.
        </h1> */}
      </motion.section>

      <motion.section
        id="contact"
        className="mx-auto flex min-h-[calc(100vh-92px)] flex-col justify-center bg-[#f5f1e8] px-6 text-[#101010] sm:px-12"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-4 font-sans text-xs uppercase tracking-[0.14em] text-[#101010]/55">
          Start a conversation
        </p>
        <motion.a
          className="w-fit font-serif text-4xl underline decoration-[#101010]/25 underline-offset-8 transition-colors hover:decoration-[#101010] sm:text-7xl"
          href="mailto:hello@thorfin.studio"
          whileHover={shouldReduceMotion ? undefined : { x: 8 }}
        >
          hello@thorfin.studio
        </motion.a>
      </motion.section>
    </main>
  );
}