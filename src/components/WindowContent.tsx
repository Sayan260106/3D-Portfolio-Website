import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, Github, Code, Sparkles, Layers, Terminal, Mail, Linkedin, Twitter } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';

export function AboutContent() {
  const { openWindow } = useWindowStore();

  return (
    <div className="space-y-12 max-w-2xl">
      <section className="space-y-6">
        <h1 className="luxury-title text-5xl text-white">Sayan Sinha</h1>
        <p className="luxury-text text-xl text-white/50 leading-relaxed">
          Creative technologist and software architect specializing in 
          <span className="text-[#c5a059] font-medium opacity-100"> immersive digital experiences </span> 
          and high-performance web applications.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
        <div>
          <h3 className="luxury-mono text-[#c5a059]/40 mb-2">Location</h3>
          <p className="luxury-text text-white/80">Singapore / Remote</p>
        </div>
        <div>
          <h3 className="luxury-mono text-[#c5a059]/40 mb-2">Discipline</h3>
          <p className="luxury-text text-white/80">Fullstack • Creative UI • WebGL</p>
        </div>
      </section>

      <motion.button
        whileHover={{ x: 10 }}
        onClick={() => openWindow('skills')}
        className="flex items-center gap-4 group cursor-pointer"
      >
        <span className="luxury-mono text-[#c5a059] tracking-[0.4em]">View Technical Stack</span>
        <ArrowRight size={16} className="text-[#c5a059] group-hover:translate-x-2 transition-transform" />
      </motion.button>
    </div>
  );
}

const ProjectCard = ({ title, description, tags, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group relative glass p-6 rounded-2xl border-white/5 hover:border-[#c5a059]/20 transition-all duration-500 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] pointer-events-none" />
    
    <div className="flex justify-between items-start mb-6">
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500 group-hover:scale-110 transition-transform`}>
        <Code size={20} strokeWidth={1.5} />
      </div>
      <div className="flex gap-4">
        <Github size={16} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
        <ExternalLink size={16} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
      </div>
    </div>

    <h3 className="luxury-title text-xl text-white mb-2 group-hover:text-[#c5a059] transition-colors">{title}</h3>
    <p className="luxury-text text-sm text-white/40 mb-6 line-clamp-2">{description}</p>

    <div className="flex flex-wrap gap-2">
      {tags.map((tag: string) => (
        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] luxury-mono text-white/40">
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

export function ProjectsContent() {
  const { openWindow } = useWindowStore();
  const projects = [
    {
      title: "Solstice Engine",
      description: "A custom WebGL rendering environment focusing on generative lighting and physical simulations.",
      tags: ["Three.js", "GLSL", "Physical"],
      color: "blue"
    },
    {
      title: "Aether OS",
      description: "Minimalist desktop interface with cloud-synced terminal and real-time collaboration features.",
      tags: ["React", "Zustand", "Framermotion"],
      color: "amber"
    },
    {
      title: "Neural Canvas",
      description: "AI-driven design tool that bridges high-fidelity prototyping with latent stable diffusion.",
      tags: ["PyTorch", "Next.js", "Websocket"],
      color: "emerald"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 gap-6">
        {projects.map(p => <ProjectCard key={p.title} {...p} />)}
      </div>
      
      <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
        <motion.button
          whileHover={{ x: 10 }}
          onClick={() => openWindow('contact')}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <span className="luxury-mono text-[#c5a059] tracking-[0.4em]">Initialize Correspondence</span>
          <ArrowRight size={16} className="text-[#c5a059] group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="space-y-12 max-w-xl">
      <section className="space-y-6">
        <h2 className="luxury-title text-4xl text-white">Let's build something exceptional.</h2>
        <p className="luxury-text text-lg text-white/50">
          I'm currently accepting selective inquiries for high-impact projects 
          starting in late 2026.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: Mail, label: 'Email', value: 'sayan@studio.os', link: 'mailto:sayan@studio.os' },
          { icon: Linkedin, label: 'LinkedIn', value: 'sayan-sinha', link: '#' },
          { icon: Twitter, label: 'Twitter', value: '@sayansinha', link: '#' },
        ].map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="flex items-center justify-between p-6 glass rounded-2xl border-white/5 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="text-[#c5a059]/40">
                <item.icon size={20} strokeWidth={1.5} />
              </div>
              <div>
                <span className="luxury-mono text-[10px] text-white/20 block mb-1">{item.label}</span>
                <span className="luxury-text text-white/80">{item.value}</span>
              </div>
            </div>
            <ExternalLink size={14} className="text-white/10" />
          </motion.a>
        ))}
      </div>

      <div className="pt-8 opacity-20 flex justify-center">
        <span className="luxury-mono text-[8px] tracking-[0.8em]">SECURE CHANNEL • ENCRYPTED</span>
      </div>
    </div>
  );
}

export function SkillsContent() {
  const skills = [
    { name: "Frontend Architecture", items: ["React", "TypeScript", "Next.js", "Tailwind"] },
    { name: "Visual Engineering", items: ["Three.js", "GLSL", "Post-processing", "D3.js"] },
    { name: "Core Systems", items: ["Node.js", "PostgreSQL", "Firebase", "Redis"] },
  ];

  const { openWindow } = useWindowStore();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-12">
        {skills.map(section => (
          <div key={section.name}>
            <h3 className="luxury-mono text-[#c5a059]/40 mb-6">{section.name}</h3>
            <div className="flex flex-wrap gap-4">
              {section.items.map(item => (
                <motion.div 
                  key={item}
                  whileHover={{ y: -5, borderColor: 'rgba(197, 160, 89, 0.4)' }}
                  className="px-6 py-4 glass rounded-xl border-white/5 transition-all cursor-default"
                >
                  <span className="luxury-text text-white/70">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ x: 10 }}
        onClick={() => openWindow('projects')}
        className="flex items-center gap-4 group cursor-pointer pt-8"
      >
        <span className="luxury-mono text-[#c5a059] tracking-[0.4em]">Explore Exhibitions</span>
        <ArrowRight size={16} className="text-[#c5a059] group-hover:translate-x-2 transition-transform" />
      </motion.button>
    </div>
  );
}
