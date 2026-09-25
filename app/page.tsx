"use client";

import Image from "next/image";
import { motion, useReducedMotion , AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const sections = ["home", "personal", "projects", "contact"] as const;
const words = ["Fullstack","Product engineer" ];
type SectionId = (typeof sections)[number];
type SpotifyNowPlaying = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

export default function Page() {
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [dialRotation, setDialRotation] = useState(0);
  const [index, setIndex] = useState(0);
  const [nowPlaying, setNowPlaying] = useState<SpotifyNowPlaying>({ isPlaying: false });
  const dialRotationRef = useRef(0);

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
              <div className="grid grid-cols-3 gap-8">
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
              <p className="mt-10 text-[18px] leading-8 text-white">
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

            <motion.a href={nowPlaying.songUrl ?? "https://open.spotify.com"} target="_blank" rel="noreferrer" className="absolute border-t-sky-100 border-t-1 bottom-[30px] left-[50px] flex h-[66px] w-[193px] items-center gap-2 rounded-full bg-[#454545] px-3" whileHover={shouldReduceMotion ? undefined : { x: 5, backgroundColor: "#505050" }} whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}>
              <Image src={nowPlaying.isPlaying && nowPlaying.albumImageUrl ? nowPlaying.albumImageUrl : "/spotify.png"} alt={nowPlaying.isPlaying ? `${nowPlaying.title} album artwork` : "Spotify"} width={45} height={45} className="size-[45px] rounded-md object-cover" />
              <span className="min-w-0 text-[12px] text-white" aria-live="polite">
                {nowPlaying.isPlaying ? <><span className="block truncate">{nowPlaying.title}</span><span className="block truncate text-white/60">{nowPlaying.artist}</span></> : "Not playing"}
              </span>
            </motion.a>
          </motion.section>

          <motion.section id="personal" className="absolute inset-0 flex itemcenter justify-center border-y border-black bg-[#181818] px-16" animate={sectionState("personal") ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" }} style={{ pointerEvents: sectionState("personal") ? "auto" : "none" }} aria-labelledby="personal-title">
            <motion.div className="max-w-[580px] text-center" initial={false} animate={sectionState("personal") ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, staggerChildren: shouldReduceMotion ? 0 : 0.08 }}>
              <motion.p className="text-sm uppercase tracking-[0.3em] text-white">A little about me</motion.p>
              <motion.h2 id="personal-title" className="mt-5 font-serif text-5xl text-white">Building thoughtful digital spaces.</motion.h2>
              <motion.p className="mt-6 text-lg leading-8 text-white">I am a frontend developer focused on expressive interfaces, useful motion, and the small details that make products feel natural.</motion.p>
            </motion.div>
          </motion.section>

          <motion.section id="projects" className="absolute inset-0 flex items-center justify-center border-y border-black bg-[#141414] px-16" animate={sectionState("projects") ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(12px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeInOut" }} style={{ pointerEvents: sectionState("projects") ? "auto" : "none" }} aria-labelledby="projects-title">
            <div className="w-full max-w-[760px]">
              <motion.p initial={false} animate={sectionState("projects") ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5 }} className="text-sm uppercase tracking-[0.3em] text-white">Selected work</motion.p>
              <motion.h2 id="projects-title" initial={false} animate={sectionState("projects") ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.08 }} className="mt-4 font-serif text-5xl text-white">Projects</motion.h2>
              <motion.div className="mt-10 grid grid-cols-3 gap-4" initial={false} animate={sectionState("projects") ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.15 }}>
                {[['Betterclock', 'A focused timer for getting things done.'], ['DoLog', 'A productivity space for consistent progress.'], ['Now Playing', 'A small Spotify integration for the page.']].map(([title, description]) => (
                  <motion.article key={title} className="min-h-[180px] border border-[#394139] bg-[#1b1b1b] p-5" whileHover={shouldReduceMotion ? undefined : { y: -8, borderColor: "#72f257" }} transition={{ duration: 0.2 }}>
                    <h3 className="text-lg text-white">{title}</h3>
                    <p className="mt-4 text-sm leading-6 text-white">{description}</p>
                  </motion.article>
                ))}
              </motion.div>
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
          <motion.button type="button" onClick={() => navigateTo("home")} className={`pointer-events-auto absolute left-1/2 top-[-36px] -translate-x-1/2 border-0 bg-transparent text-[16px] ${activeSection === "home" ? "text-[#72f257]" : "text-white"}`} whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}>
            <span className="absolute left-1/2 top-[23px] size-[17px] -translate-x-1/2 rounded-full bg-[#72f257]" aria-hidden="true" />
            <motion.span className="inline-block" animate={{ rotate: -dialRotation }}>Home</motion.span>
          </motion.button>
          <motion.button type="button" onClick={() => navigateTo("personal")} className={`pointer-events-auto absolute left-[-38px] top-[18%] border-0 bg-transparent text-[16px] ${activeSection === "personal" ? "text-[#72f257]" : "text-white"}`} whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}>
            <span className="absolute left-[66px] top-[5px] size-[17px] rounded-full bg-[#72f257]" aria-hidden="true" />
            <motion.span className="inline-block" animate={{ rotate: -dialRotation }}>Personal</motion.span>
          </motion.button>
          <motion.button type="button" onClick={() => navigateTo("projects")} className={`pointer-events-auto absolute right-[-47px] top-[18%] border-0 bg-transparent text-[16px] ${activeSection === "projects" ? "text-[#72f257]" : "text-white"}`} whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}>
            <span className="absolute right-[67px] top-[5px] size-[17px] rounded-full bg-[#72f257]" aria-hidden="true" />
            <motion.span className="inline-block" animate={{ rotate: -dialRotation }}>Projects</motion.span>
          </motion.button>
          <motion.button type="button" onClick={() => navigateTo("contact")} className={`pointer-events-auto absolute bottom-[-26px] left-1/2 -translate-x-1/2 border-0 bg-transparent text-[16px] ${activeSection === "contact" ? "text-[#72f257]" : "text-white"}`} whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}>
            <span className="absolute bottom-[23px] left-1/2 size-[17px] -translate-x-1/2 rounded-full bg-[#72f257]" aria-hidden="true" />
            <motion.span className="inline-block" animate={{ rotate: -dialRotation }}>Contact</motion.span>
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
}
