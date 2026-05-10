import { portfolioData } from '../data/portfolio';

export default function CertificationWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] p-8 text-[#17251d]">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8b6f35]">Credentials</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold">Certifications</h1>
        <div className="mt-8 space-y-4">
          {portfolioData.certifications.map((cert) => (
            <article key={cert.title} className="flex flex-wrap items-start justify-between gap-3 border border-[#18422f]/15 bg-white/35 p-5">
              <div>
                <h2 className="font-serif text-xl text-[#18422f]">{cert.title}</h2>
                <p className="mt-1 text-[#8b6f35]">{cert.issuer}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#4b5b51]">{cert.date}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
