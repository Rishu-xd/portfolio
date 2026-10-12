import Image from "next/image";

export default function AlternatePortfolio() {
  return (
    <main className="min-h-svh bg-[#f2f0ea] px-6 py-24 text-[#20211e] sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="grid gap-12 border-b border-[#20211e]/15 pb-16 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#66715b]">Independent developer / India</p>
            <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-[0.98] tracking-[-0.04em] sm:text-8xl">
              Thoughtful software, made to feel simple.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#555750]">
              I&apos;m Akhand Veer Singh, a full-stack product engineer who builds useful web experiences with care for the details.
            </p>
          </div>
          <Image
            src="/images/hero.jpg"
            alt="Akhand Veer Singh"
            width={144}
            height={144}
            className="size-28 rounded-full object-cover md:size-36"
          />
        </header>

        <section className="grid gap-8 border-b border-[#20211e]/15 py-12 md:grid-cols-[1fr_2fr]" aria-labelledby="approach-title">
          <h2 id="approach-title" className="text-xs font-medium uppercase tracking-[0.24em] text-[#66715b]">A little about me</h2>
          <div>
            <p className="max-w-3xl font-serif text-2xl leading-relaxed sm:text-3xl">
              I work across the full product, from the first interface sketch to the last interaction polish.
            </p>
            <p className="mt-5 max-w-2xl leading-7 text-[#696b64]">
              My day-to-day tools include TypeScript, React, Next.js, and Tailwind CSS. I&apos;m especially interested in expressive interfaces, useful motion, and products that make everyday work easier.
            </p>
          </div>
        </section>

        <section className="border-b border-[#20211e]/15 py-12" aria-labelledby="work-title">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#66715b]">Selected projects</p>
              <h2 id="work-title" className="mt-3 font-serif text-4xl">Things I&apos;ve been making</h2>
            </div>
            <a className="text-sm underline decoration-[#66715b]/50 underline-offset-4 hover:text-[#66715b]" href="https://github.com/Rishu-xd" target="_blank" rel="noreferrer">
              More on GitHub
            </a>
          </div>
          <div className="divide-y divide-[#20211e]/15 border-y border-[#20211e]/15">
            {[
              { number: "01", name: "Betterclock", description: "A focused timer for getting things done together.", details: "Next.js / TypeScript", href: "https://www.betterclock.xyz" },
              { number: "02", name: "DoLog", description: "A productivity space for organizing tasks and building consistent habits.", details: "React / Motion", href: "https://github.com/Rishu-xd/DoLog" },
              { number: "03", name: "Qflow", description: "A digital queue platform designed to reduce wait times and help teams manage busy queues.", details: "Flutter / Next.js / Supabase", href: "https://github.com/Rishu-xd" },
            ].map((project) => (
              <a
                key={project.number}
                className="group grid gap-3 py-6 transition-colors hover:bg-[#20211e]/[0.03] sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-6"
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="font-mono text-sm text-[#85877f]">{project.number}</span>
                <span>
                  <span className="block font-serif text-2xl">{project.name}</span>
                  <span className="mt-1 block max-w-xl text-sm leading-6 text-[#696b64]">{project.description}</span>
                </span>
                <span className="flex items-center gap-5 text-xs text-[#85877f]">
                  {project.details}
                  <span className="text-base text-[#66715b] transition-transform group-hover:translate-x-1" aria-hidden="true">-&gt;</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <footer className="grid gap-6 py-12 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#66715b]">Have a good idea?</p>
            <a className="mt-3 inline-block font-serif text-3xl underline decoration-[#66715b]/40 underline-offset-8 sm:text-4xl" href="mailto:rishu99xd@gmail.com">
              Let&apos;s talk.
            </a>
          </div>
          <div className="flex gap-5 text-sm text-[#696b64]">
            <a className="hover:text-[#20211e]" href="https://github.com/Rishu-xd" target="_blank" rel="noreferrer">GitHub</a>
            <a className="hover:text-[#20211e]" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="hover:text-[#20211e]" href="https://x.com" target="_blank" rel="noreferrer">X</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
