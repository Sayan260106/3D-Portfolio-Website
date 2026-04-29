import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { motion, AnimatePresence } from 'motion/react';

export default function Taskbar() {
  const [time, setTime] = useState(new Date());
  const { windows, toggleMinimize, focusWindow } = useWindowStore();
  const openWindows = windows.filter(w => w.isOpen);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-[999]">
      {/* Main Dock */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="glass-dark h-14 flex items-center px-6 rounded-full gap-6 border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
      >
        {/* Discrete Brand Identifier */}
        <div className="flex items-center pr-6 border-r border-white/5 h-6">
          <span className="luxury-title text-xs tracking-[0.3em] text-[#c5a059] font-semibold opacity-80">S.OS</span>
        </div>

        {/* Dynamic App Indicators */}
        <div className="flex gap-4">
          <AnimatePresence mode="popLayout">
            {openWindows.map(window => (
              <motion.div
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                key={window.id}
                className={`group relative h-9 px-5 flex items-center rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                  window.isMinimized ? 'bg-white/[0.02] text-white/10 hover:text-white/40 hover:bg-white/[0.05]' : 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 shadow-[0_0_15px_rgba(197,160,89,0.1)]'
                }`}
                onClick={() => {
                  if (window.isMinimized) {
                    toggleMinimize(window.id);
                  }
                  focusWindow(window.id);
                }}
              >
                <span className="luxury-mono text-[9px] tracking-[0.25em]">{window.title}</span>
                {!window.isMinimized && (
                  <motion.div 
                    layoutId={`active-indicator-${window.id}`}
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-[#c5a059]/40" 
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {openWindows.length === 0 && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="luxury-mono text-white/5 tracking-[0.6em] ml-2 select-none"
            >
              Quietude
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Temporal Widget */}
      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', damping: 20 }}
        className="glass-dark h-14 px-10 flex items-center rounded-full border-white/5 shadow-2xl luxury-mono text-[#c5a059]/60 tracking-[0.4em] text-[10px]"
      >
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </motion.div>
    </div>
  );
}
