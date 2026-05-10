import { portfolioData } from '../data/portfolio';

export default function ProjectsWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] p-8 text-[#17251d]">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="border-b border-[#18422f]/15 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8b6f35]">Selected Work</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">Projects</h1>
        </header>
        {portfolioData.projects.map((project) => (
          <article key={project.title} className="border border-[#18422f]/15 bg-white/35 p-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-[#18422f]">{project.title}</h2>
                <p className="mt-1 text-sm text-[#4b5b51]">{project.subtitle}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8b6f35]">{project.period}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[#28392f]">
              {project.highlights.map((highlight) => (
                <li key={highlight}>- {highlight}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="bg-[#18422f]/8 px-3 py-1 text-xs text-[#18422f]">{tech}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
