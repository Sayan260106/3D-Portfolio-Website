import React from 'react';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import DesktopIcon from './DesktopIcon';
import { motion } from 'motion/react';
import { useWindowStore } from '../store/useWindowStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', damping: 20 } }
};

export default function Desktop() {
  const { openWindow } = useWindowStore();

  React.useEffect(() => {
    // Slight delay to allow for animations to settle
    const timer = setTimeout(() => {
      openWindow('about');
    }, 500);
    return () => clearTimeout(timer);
  }, [openWindow]);

  return (
    <div className="relative w-full h-full bg-[#080808] overflow-hidden select-none font-sans">
      {/* Ambient background accent */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#c5a059]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Icon Grid with generous spacing */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="p-12 grid grid-rows-6 grid-flow-col gap-8 w-fit h-full content-start"
      >
        <motion.div variants={item}><DesktopIcon id="about" title="Curriculum" icon="User" /></motion.div>
        <motion.div variants={item}><DesktopIcon id="projects" title="Exhibitions" icon="Briefcase" /></motion.div>
        <motion.div variants={item}><DesktopIcon id="skills" title="Technique" icon="Award" /></motion.div>
        <motion.div variants={item}><DesktopIcon id="contact" title="Correspondence" icon="Mail" /></motion.div>
        <motion.div variants={item}><DesktopIcon id="terminal" title="System" icon="Terminal" /></motion.div>
        <motion.div variants={item}><DesktopIcon id="snake" title="Diversion" icon="Gamepad2" /></motion.div>
      </motion.div>
      
      <WindowManager />
      <Taskbar />
    </div>
  );
}
