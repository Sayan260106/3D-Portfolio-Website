import { portfolioData } from '../data/portfolio';

export default function AboutWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] p-8 text-[#17251d]">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="border-b border-[#18422f]/20 pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8b6f35]">About Me</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">{portfolioData.name}</h1>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#18422f]/70">{portfolioData.role}</p>
        </header>
        <p className="text-lg leading-8 text-[#28392f]">{portfolioData.about}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Info label="Location" value={portfolioData.location} />
          <Info label="Focus" value="Machine Learning & AI" />
          <Info label="Style" value="Data-driven web applications" />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#18422f]/15 bg-white/35 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8b6f35]">{label}</div>
      <div className="mt-2 font-serif text-lg">{value}</div>
    </div>
  );
}
