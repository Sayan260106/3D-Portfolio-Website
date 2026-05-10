import type { ReactNode } from 'react';
import { Award, BriefcaseBusiness, GraduationCap, Languages, Mail } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export default function ResumeWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] text-[#17251d]">
      <div className="grid min-h-full lg:grid-cols-[280px_1fr]">
        <aside className="bg-[#123524] p-8 text-[#f5efe1]">
          <h1 className="font-serif text-4xl font-semibold">{portfolioData.name}</h1>
          <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#d2b56f]">{portfolioData.role}</p>

          <div className="mt-10 space-y-8">
            <SideSection title="Contact">
              <p>{portfolioData.contact.email}</p>
              <p>{portfolioData.contact.phone}</p>
              <p>{portfolioData.contact.address}</p>
            </SideSection>
            <SideSection title="Skills">
              {portfolioData.skills.map((group) => (
                <div key={group.category} className="space-y-2">
                  <h3 className="font-medium text-[#d2b56f]">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="bg-white/10 px-2 py-1 text-xs">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </SideSection>
            <SideSection title="Interests">
              <div className="flex flex-wrap gap-2">
                {portfolioData.interests.map((interest) => (
                  <span key={interest} className="border border-white/20 px-2 py-1 text-xs">{interest}</span>
                ))}
              </div>
            </SideSection>
          </div>
        </aside>

        <main className="space-y-10 p-8">
          <section>
            <SectionHeading icon={Mail} title="About Me" />
            <p className="mt-4 max-w-3xl leading-7 text-[#28392f]">{portfolioData.about}</p>
          </section>

          <section>
            <SectionHeading icon={GraduationCap} title="Education" />
            <div className="mt-5 space-y-5">
              {portfolioData.education.map((item) => (
                <article key={item.degree} className="border-l-2 border-[#8b6f35] pl-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <h3 className="font-serif text-xl font-semibold">{item.degree}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b6f35]">{item.period}</span>
                  </div>
                  <p className="mt-1 font-medium text-[#18422f]">{item.school}</p>
                  <p className="mt-2 text-sm text-[#4b5b51]">{item.location}</p>
                  <p className="mt-1 text-sm font-semibold text-[#18422f]">{item.score}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <SectionHeading icon={BriefcaseBusiness} title="Projects" />
            <div className="mt-5 space-y-6">
              {portfolioData.projects.map((project) => (
                <article key={project.title}>
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-[#18422f]">{project.title}</h3>
                      <p className="text-sm text-[#4b5b51]">{project.subtitle}</p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b6f35]">{project.period}</span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm leading-6 text-[#28392f]">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>- {highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 md:grid-cols-2">
            <div>
              <SectionHeading icon={Award} title="Certifications" />
              <div className="mt-5 space-y-3">
                {portfolioData.certifications.map((cert) => (
                  <div key={cert.title} className="flex justify-between gap-3 border-b border-[#18422f]/10 pb-3">
                    <div>
                      <div className="font-medium">{cert.title}</div>
                      <div className="text-sm text-[#8b6f35]">{cert.issuer}</div>
                    </div>
                    <div className="text-right text-xs text-[#4b5b51]">{cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading icon={Languages} title="Languages" />
              <div className="mt-5 space-y-3">
                {portfolioData.languages.map((language) => (
                  <div key={language.name} className="flex justify-between border-b border-[#18422f]/10 pb-3">
                    <span>{language.name}</span>
                    <span className="text-[#8b6f35]">{language.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#d2b56f]">{title}</h2>
      <div className="space-y-3 text-sm leading-6 text-[#f5efe1]/85">{children}</div>
    </section>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#18422f]/15 pb-3">
      <Icon size={18} className="text-[#8b6f35]" />
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
    </div>
  );
}
