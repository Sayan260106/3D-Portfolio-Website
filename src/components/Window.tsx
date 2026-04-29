import React from 'react';
import { Minus, Square, X, GripVertical } from 'lucide-react';
import { useWindowStore, WindowInstance } from '../store/useWindowStore';
import { motion, AnimatePresence, useDragControls } from 'motion/react';

interface WindowProps {
  window: WindowInstance;
}

import { AboutContent, ProjectsContent, SkillsContent, ContactContent } from './WindowContent';

export default function Window({ window }: WindowProps) {
  const { closeWindow, toggleMaximize, toggleMinimize, focusWindow, activeWindowId } = useWindowStore();
  const controls = useDragControls();
  const isActive = activeWindowId === window.id;

  const renderContent = () => {
    switch (window.id) {
      case 'about': return <AboutContent />;
      case 'projects': return <ProjectsContent />;
      case 'skills': return <SkillsContent />;
      case 'contact': return <ContactContent />;
      default: return (
        <div className="space-y-6">
          <h2 className="luxury-title text-3xl text-white underline decoration-[#c5a059]/30 underline-offset-8">
            {window.title}
          </h2>
          <div className="luxury-text text-white/60 text-lg">
            {window.content || `Subsystem active. Monitoring data stream for ${window.id.toUpperCase()}...`}
          </div>
        </div>
      );
    }
  };

  if (window.isMinimized) return null;

  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      initial={{ scale: 0.9, opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ scale: 0.9, opacity: 0, y: 30, filter: 'blur(10px)' }}
      transition={{ 
        type: 'spring', 
        damping: 30, 
        stiffness: 250, 
        mass: 0.8,
        opacity: { duration: 0.3 },
        filter: { duration: 0.3 }
      }}
      className={`absolute glass overflow-hidden flex flex-col rounded-2xl border border-white/5 shadow-2xl ${
        window.isMaximized ? 'inset-4 !translate-x-0 !translate-y-0' : 'w-[800px] h-[550px] top-20 left-20'
      } ${isActive ? 'soft-shadow border-white/10' : 'opacity-40 shadow-lg'}`}
      style={{ zIndex: window.zIndex }}
      onPointerDown={() => focusWindow(window.id)}
    >
      {/* Elegant Title Bar */}
      <div 
        className="h-14 bg-white/[0.01] border-b border-white/5 px-6 flex items-center justify-between cursor-move group"
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-[#c5a059] shadow-[0_0_8px_#c5a059]' : 'bg-white/10'}`} />
          <span className="luxury-mono text-[#c5a059] opacity-70">
            {window.title}
          </span>
        </div>

        {/* Distinct Drag Handle */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-4 border-l border-white/40" />
          ))}
        </div>

        <div className="flex gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button onClick={() => toggleMinimize(window.id)} className="text-white/20 hover:text-white transition-colors">
            <Minus size={16} strokeWidth={1} />
          </button>
          <button onClick={() => toggleMaximize(window.id)} className="text-white/20 hover:text-white transition-colors">
            <Square size={12} strokeWidth={1.5} />
          </button>
          <button onClick={() => closeWindow(window.id)} className="text-white/20 hover:text-[#c5a059] transition-colors">
            <X size={16} strokeWidth={1} />
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-black/20 backdrop-blur-3xl overflow-auto p-12 custom-scrollbar">
        {renderContent()}
      </div>
    </motion.div>
  );
}
