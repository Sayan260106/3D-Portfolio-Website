import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useBootStore } from '../store/useBootStore';

export default function BootScreen() {
  const { setBooted, setBooting } = useBootStore();
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const bootLogs = [
      "Starting SayanOS v1.0.0...",
      "Searching for peripherals...",
      "Mouse found at 0x64",
      "Keyboard found at 0x60",
      "Loading drivers...",
      "Initializing VGA graphics mode...",
      "Mounting file system...",
      "Boot complete."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBooting(false);
          setBooted(true);
        }, 300);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [setBooted, setBooting]);

  return (
    <div className="fixed inset-0 bg-[#050505] text-[#c5a059]/60 p-12 luxury-mono overflow-hidden flex items-center justify-center">
      <div className="max-w-xl w-full space-y-2 opacity-80">
        <div className="mb-8 border-b border-[#c5a059]/10 pb-4">
          <h1 className="luxury-title text-xl text-[#c5a059] tracking-[0.3em] font-medium">SAYAN.OS <span className="text-[10px] opacity-40 font-mono">v1.0.0</span></h1>
        </div>
        <div className="space-y-1 text-[9px] tracking-widest leading-relaxed">
          {logs.map((log, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={index} 
              className="flex gap-4"
            >
              <span className="text-white/10 italic">[{index.toString().padStart(2, '0')}]</span>
              <span>{log}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
