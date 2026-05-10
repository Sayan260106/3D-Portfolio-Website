import { portfolioData } from '../data/portfolio';

export default function SkillsWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] p-8 text-[#17251d]">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8b6f35]">Technical Stack</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">Skills</h1>
        </header>
        <div className="grid gap-5 md:grid-cols-2">
          {portfolioData.skills.map((group) => (
            <section key={group.category} className="border border-[#18422f]/15 bg-white/35 p-5">
              <h2 className="font-serif text-xl text-[#18422f]">{group.category}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="border border-[#8b6f35]/25 bg-[#18422f]/5 px-3 py-1 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
        <section className="border-t border-[#18422f]/15 pt-6">
          <h2 className="font-serif text-xl text-[#18422f]">Languages</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {portfolioData.languages.map((language) => (
              <div key={language.name}>
                <div className="font-medium">{language.name}</div>
                <div className="text-sm text-[#8b6f35]">{language.level}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
