import { motion } from 'motion/react';
import { ExternalLink, Github, Cpu, Globe, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

const projects = [
  {
    title: "NeuroLink",
    desc: "AI-driven neural interface for real-time data visualization.",
    tech: ["Three.js", "React", "Rust"],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070",
    color: "from-blue-500/20"
  },
  {
    title: "Quantum Ledger",
    desc: "Distributed ledger system with post-quantum cryptography.",
    tech: ["Go", "Solidity", "Web3"],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2078",
    color: "from-amber-500/20"
  },
  {
    title: "Lumina Engine",
    desc: "High-performance ray-tracing engine built for the web.",
    tech: ["WebGL", "GLSL", "WASM"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964",
    color: "from-purple-500/20"
  }
];

export default function ProjectsApp() {
  return (
    <div className="h-full bg-luxury-black overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <Cpu size={18} />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Arsenal</span>
          </div>
          <h1 className="text-4xl font-serif italic text-white/90 font-bold">Selected Operational Missions</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 hover:border-gold/30 transition-all duration-500",
                i === 0 && "md:col-span-2"
              )}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-white group-hover:text-gold transition-colors">{project.title}</h3>
                  <div className="flex gap-3">
                    <button className="text-white/40 hover:text-white transition-colors cursor-pointer"><Github size={18} /></button>
                    <button className="text-white/40 hover:text-white transition-colors cursor-pointer"><ExternalLink size={18} /></button>
                  </div>
                </div>
                
                <p className="text-sm text-white/50 leading-relaxed">{project.desc}</p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tech.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Glow */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", project.color)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
