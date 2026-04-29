import React from 'react';
import * as Icons from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';
import { motion } from 'motion/react';

interface DesktopIconProps {
  id: string;
  title: string;
  icon: keyof typeof Icons;
}

export default function DesktopIcon({ id, title, icon }: DesktopIconProps) {
  const { openWindow, focusWindow } = useWindowStore();
  const Icon = Icons[icon] as any;

  const handleClick = () => {
    openWindow(id);
    focusWindow(id);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group flex flex-col items-center gap-4 p-4 w-32 cursor-pointer transition-all"
      onDoubleClick={handleClick}
    >
      <div className="relative w-14 h-14 flex items-center justify-center rounded-[1.25rem] glass border-white/5 group-hover:border-[#c5a059]/40 group-hover:bg-[#c5a059]/10 transition-all duration-700 overflow-hidden shadow-2xl group-hover:shadow-[#c5a059]/10">
        {/* Subtle inner shadow for depth */}
        <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] pointer-events-none" />
        
        <div className="text-white/40 group-hover:text-[#c5a059] transition-all duration-700 group-hover:drop-shadow-[0_0_12px_rgba(197,160,89,0.4)]">
          <Icon size={22} strokeWidth={0.75} />
        </div>
        
        {/* Minimal metallic polish line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <span className="text-white/20 group-hover:text-[#c5a059] text-[8px] uppercase font-medium tracking-[0.5em] text-center transition-all duration-700 luxury-mono pl-[0.5em]">
        {title}
      </span>
    </motion.div>
  );
}
