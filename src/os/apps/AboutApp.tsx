import { motion } from 'motion/react';
import { BookOpen, Github, Linkedin, Mail, MapPin, Phone, Shield, Sparkles } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

export default function AboutApp() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-[#08110c] text-[#f5efe1]">
      <section className="relative min-h-[340px] overflow-hidden border-b border-[#c5a059]/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070')] bg-cover bg-center opacity-25 grayscale" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,12,0.98),rgba(8,17,12,0.82),rgba(8,17,12,0.55))]" />
        <div className="relative z-10 flex min-h-[340px] items-center px-8 py-12">
          <div className="max-w-3xl space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#c5a059]"
            >
              Computer Science / AI / Web Craft
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="font-serif text-5xl font-semibold leading-tight text-[#f8f1df]"
            >
              {portfolioData.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="max-w-2xl text-lg leading-8 text-[#d8cfbb]"
            >
              {portfolioData.about}
            </motion.p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-8 py-12">
        <section className="grid gap-5 md:grid-cols-3">
          <Stat icon={Shield} label="Discipline" value={portfolioData.role} />
          <Stat icon={Sparkles} label="Focus" value="Machine Learning & interactive web platforms" />
          <Stat icon={MapPin} label="Base" value={portfolioData.location} />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <SectionTitle icon={BookOpen} label="Profile" />
            <p className="text-base leading-8 text-[#d8cfbb]">
              I enjoy building systems that make complex ideas easier to understand: virtual labs,
              health support tools, data analysis notebooks, and small automation systems. The thread
              running through the work is practical curiosity: learn the subject, make the interface
              clear, and let the technology serve the person using it.
            </p>
          </div>
          <div className="space-y-3 border-l border-[#c5a059]/20 pl-6">
            <ContactRow icon={Mail} label={portfolioData.contact.email} href={`mailto:${portfolioData.contact.email}`} />
            <ContactRow icon={Phone} label={portfolioData.contact.phone} href={`tel:${portfolioData.contact.phone.replace(/\s/g, '')}`} />
            <ContactRow icon={Linkedin} label={portfolioData.contact.linkedin} href="#" />
            <ContactRow icon={Github} label={portfolioData.contact.github} href="#" />
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[#c5a059]">
      <Icon size={17} />
      <span className="font-mono text-[10px] uppercase tracking-[0.28em]">{label}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="border border-[#c5a059]/20 bg-[#f5efe1]/[0.04] p-5">
      <Icon size={20} className="mb-5 text-[#c5a059]" />
      <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#c5a059]/70">{label}</div>
      <div className="mt-2 font-serif text-lg leading-6 text-[#f8f1df]">{value}</div>
    </div>
  );
}

function ContactRow({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 py-2 text-sm text-[#d8cfbb] transition-colors hover:text-[#c5a059]">
      <Icon size={15} />
      <span>{label}</span>
    </a>
  );
}
