const projects = [
	{
		title: "Betterclock",
		description: "A quiet, focused timer app the lets your frinds gind together and even video chat ",
		tags: ["Next.js", "TypeScript", "Tailwind CSS"],
		href: "https://www.betterclock.xyz",
	},
	{
		title: "GitHub Activity",
		description: "A contribution explorer with year selection, responsive scrolling, and graceful API fallbacks.",
		tags: ["GitHub API", "React", "Motion"],
		href: "https://github.com/Rishu-xd",
	},
	{
		title: "Now Playing",
		description: "A small Spotify integration that surfaces the track currently playing without interrupting the page.",
		tags: ["Spotify API", "Next.js", "REST"],
		href: "/api/spotify-now-playing",
	},
];

export default function Projects() {
	return (
		<section id="projects" className="mt-16 border-t border-white/[0.06] pt-6">
			<div className="flex items-end justify-between gap-4">
				<div>
					<p className="text-[12px] font-semibold tracking-[0.14em] text-white/45">SELECTED WORK</p>
					<h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-white">Projects</h2>
				</div>
				<a
					className="inline-flex shrink-0 items-center gap-1 text-xs text-white/45 transition-colors hover:text-white"
					href="https://github.com/Rishu-xd"
					target="_blank"
					rel="noreferrer"
				>
					View GitHub
					  <span aria-hidden="true">-&gt;</span>
				</a>
			</div>

			<div className="mt-6 grid gap-3 sm:grid-cols-3">
				{projects.map((project) => (
					<a
						key={project.title}
						className="group flex min-h-[190px] flex-col rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
						href={project.href}
						target={project.href.startsWith("http") ? "_blank" : undefined}
						rel={project.href.startsWith("http") ? "noreferrer" : undefined}
					>
						<div className="flex items-start justify-between gap-3">
							<h3 className="text-[15px] font-medium text-white/85">{project.title}</h3>
							<span className="shrink-0 text-white/30 transition-colors group-hover:text-white/75" aria-hidden="true">-&gt;</span>
						</div>
						<p className="mt-3 text-[13px] leading-6 text-white/45">{project.description}</p>
						<div className="mt-auto flex flex-wrap gap-1.5 pt-5">
							{project.tags.map((tag) => (
								<span key={tag} className="rounded border border-white/[0.08] px-2 py-1 text-[10px] text-white/40">
									{tag}
								</span>
							))}
						</div>
					</a>
				))}
			</div>
		</section>
	);
}