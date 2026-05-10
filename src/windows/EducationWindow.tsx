import { portfolioData } from '../data/portfolio';

export default function EducationWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] p-8 text-[#17251d]">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-3xl font-semibold">Education</h2>
        <div className="mt-8 space-y-5">
          {portfolioData.education.map((item) => (
            <article key={item.degree} className="border-l-2 border-[#8b6f35] bg-white/35 p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold">{item.degree}</h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8b6f35]">{item.period}</span>
              </div>
              <p className="mt-2 font-medium text-[#18422f]">{item.school}</p>
              <p className="mt-4 text-sm leading-6 text-[#4b5b51]">{item.location}</p>
              <p className="mt-1 text-sm font-semibold text-[#18422f]">{item.score}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
