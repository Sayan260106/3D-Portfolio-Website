import React from 'react';
import { motion } from 'motion/react';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-50">
      <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden mb-6">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" 
        />
      </div>
      <div className="text-[#c5a059] luxury-mono text-[10px] tracking-[0.5em] opacity-40">
        ESTABLISHING EQUILIBRIUM
      </div>
    </div>
  );
}
