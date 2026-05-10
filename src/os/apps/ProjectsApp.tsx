import { motion } from 'motion/react';
import { BarChart3, Beaker, Brain, Cpu, HeartPulse, Mic2, Trophy } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

const projectIcons = [Beaker, HeartPulse, Trophy, BarChart3, Cpu, Mic2];

export default function ProjectsApp() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[#08110c] text-[#f5efe1]">
      <div className="mx-auto max-w-5xl space-y-10 px-8 py-10">
        <header className="border-b border-[#c5a059]/20 pb-8">
          <div className="mb-4 flex items-center gap-2 text-[#c5a059]">
            <Brain size={18} />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Selected Work</span>
          </div>
          <h1 className="font-serif text-4xl font-semibold text-[#f8f1df]">Projects with practical polish.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#d8cfbb]">
            A focused collection across virtual learning, habit design, wellness, data analysis,
            prediction, and Python automation.
          </p>
        </header>

        <div className="grid gap-5">
          {portfolioData.projects.map((project, index) => {
            const Icon = projectIcons[index] ?? Cpu;

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid gap-5 border border-[#c5a059]/18 bg-[#f5efe1]/[0.035] p-5 transition-colors hover:border-[#c5a059]/45 md:grid-cols-[56px_1fr]"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-[#c5a059]/25 bg-[#c5a059]/10 text-[#c5a059]">
                  <Icon size={24} />
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl text-[#f8f1df]">{project.title}</h2>
                      <p className="mt-1 text-sm text-[#d8cfbb]/80">{project.subtitle}</p>
                    </div>
                    <span className="border border-[#c5a059]/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#c5a059]">
                      {project.period}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm leading-6 text-[#d8cfbb]">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#c5a059]" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="bg-[#f5efe1]/10 px-3 py-1 text-[11px] text-[#efe6d0]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
