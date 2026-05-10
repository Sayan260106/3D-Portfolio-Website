import { motion } from 'motion/react';
import { User, Shield, Zap, Globe, Github, Linkedin, Mail } from 'lucide-react';

export default function AboutApp() {
  return (
    <div className="h-full bg-[#050505] text-white overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <div className="relative h-[300px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850715649-1d0106293bd1?q=80&w=2070')] bg-cover bg-center grayscale"
        />
        <div className="z-10 text-center px-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-serif font-bold italic tracking-tighter"
          >
            Sayan Sinha
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-gold font-mono text-xs tracking-[0.3em] uppercase mt-4"
          >
            Creative Technologist • Digital Architect
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto py-16 px-8 space-y-20">
        {/* Intro */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-gold mb-2">
            <Shield size={18} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">The Identity</span>
          </div>
          <h2 className="text-3xl font-serif italic">Crafting immersive digital experiences where technology meets art.</h2>
          <p className="text-white/60 leading-relaxed font-light text-lg">
            I specialize in bridging the gap between design and high-performance engineering. My work focuses on building 3D environments for the browser, creating tools that feel intuitive, and interfaces that are visually cinematic.
          </p>
        </section>

        {/* Stats/Grid */}
        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <Zap className="text-gold" size={24} />
            <h3 className="font-medium text-lg">Performance First</h3>
            <p className="text-sm text-white/40">Optimizing 3D render loops for silky smooth frame rates across all devices.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <Globe className="text-gold" size={24} />
            <h3 className="font-medium text-lg">Global Vision</h3>
            <p className="text-sm text-white/40">Collaborating with elite teams worldwide to push the boundaries of what is possible on the web.</p>
          </div>
        </div>

        {/* Contact Links */}
        <section className="pt-10 border-t border-white/5">
          <div className="flex flex-wrap gap-4">
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm">
              <Github size={16} /> GitHub
            </a>
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 hover:bg-gold/20 transition-colors border border-gold/20 text-sm text-gold">
              <Mail size={16} /> Reach Out
            </a>
          </div>
        </section>
      </div>

      {/* Footer Decoration */}
      <div className="h-40 flex items-center justify-center opacity-30 select-none pointer-events-none">
        <span className="text-8xl font-serif italic font-bold">SAYAN</span>
      </div>
    </div>
  );
}
