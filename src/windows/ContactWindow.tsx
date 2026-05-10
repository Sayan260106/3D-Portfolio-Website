import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

export default function ContactWindow() {
  return (
    <div className="min-h-full bg-[#f5efe1] p-8 text-[#17251d]">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8b6f35]">Correspondence</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold">Contact</h1>
        </header>
        <div className="grid gap-4">
          <ContactItem icon={Mail} label="Email" value={portfolioData.contact.email} href={`mailto:${portfolioData.contact.email}`} />
          <ContactItem icon={Phone} label="Phone" value={portfolioData.contact.phone} href={`tel:${portfolioData.contact.phone.replace(/\s/g, '')}`} />
          <ContactItem icon={MapPin} label="Address" value={portfolioData.contact.address} />
          <ContactItem icon={Linkedin} label="LinkedIn" value={portfolioData.contact.linkedin} href="#" />
          <ContactItem icon={Github} label="GitHub" value={portfolioData.contact.github} href="#" />
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4 border border-[#18422f]/15 bg-white/35 p-5 transition-colors hover:border-[#8b6f35]/35">
      <Icon size={18} className="mt-1 text-[#8b6f35]" />
      <div>
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#8b6f35]">{label}</div>
        <div className="mt-1 text-[#28392f]">{value}</div>
      </div>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
