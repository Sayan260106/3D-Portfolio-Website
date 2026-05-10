import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { useOSStore } from './state/useOSStore';
import { cn } from '../lib/utils';
import { User, Lock as LockIcon } from 'lucide-react';

import Desktop from './desktop/Desktop';
import Taskbar from './taskbar/Taskbar';
import WindowFrame from './windows/WindowFrame';

// We'll lazy load apps for performance
const TerminalApp = lazy(() => import('./apps/TerminalApp'));
const AboutApp = lazy(() => import('./apps/AboutApp'));
const ExplorerApp = lazy(() => import('./apps/ExplorerApp'));
const MusicApp = lazy(() => import('./apps/MusicApp'));
const ProjectsApp = lazy(() => import('./apps/ProjectsApp'));
const ResumeWindow = lazy(() => import('../windows/ResumeWindow'));
const SkillsWindow = lazy(() => import('../windows/SkillsWindow'));
const ContactWindow = lazy(() => import('../windows/ContactWindow'));
const EducationWindow = lazy(() => import('../windows/EducationWindow'));
const CertificationWindow = lazy(() => import('../windows/CertificationWindow'));
const SnakeWindow = lazy(() => import('../windows/SnakeWindow'));

// Helper to render app content based on ID
function AppRenderer({ appId }: { appId: string }) {
  switch (appId) {
    case 'terminal': return <Suspense fallback={<div className="p-4 text-white/50">Loading Terminal...</div>}><TerminalApp /></Suspense>;
    case 'about': return <Suspense fallback={<div className="p-4 text-white/50">Loading Identity...</div>}><AboutApp /></Suspense>;
    case 'explorer': return <Suspense fallback={<div className="p-4 text-white/50">Loading Explorer...</div>}><ExplorerApp /></Suspense>;
    case 'music': return <Suspense fallback={<div className="p-4 text-white/50">Loading Music...</div>}><MusicApp /></Suspense>;
    case 'projects': return <Suspense fallback={<div className="p-4 text-white/50">Loading Arsenal...</div>}><ProjectsApp /></Suspense>;
    case 'resume': return <Suspense fallback={<div className="p-4 text-white/50">Loading Resume...</div>}><ResumeWindow /></Suspense>;
    case 'skills': return <Suspense fallback={<div className="p-4 text-white/50">Loading Skills...</div>}><SkillsWindow /></Suspense>;
    case 'contact': return <Suspense fallback={<div className="p-4 text-white/50">Loading Contact...</div>}><ContactWindow /></Suspense>;
    case 'education': return <Suspense fallback={<div className="p-4 text-white/50">Loading Education...</div>}><EducationWindow /></Suspense>;
    case 'certifications': return <Suspense fallback={<div className="p-4 text-white/50">Loading Certifications...</div>}><CertificationWindow /></Suspense>;
    case 'snake': return <Suspense fallback={<div className="p-4 text-white/50">Loading Snake...</div>}><SnakeWindow /></Suspense>;
    default: return <div className="p-10 text-white/50 flex flex-col items-center justify-center">
      <div className="text-xl font-serif text-gold italic">System Archive</div>
      <div className="text-sm mt-2 font-mono">Module '{appId}' is under construction.</div>
    </div>;
  }
}

// ... existing BootScreen and LockScreen code ...
function BootScreen() {
  const { setBooted, setBootProgress } = useOSStore();
  const bootProgress = useOSStore(state => state.bootProgress);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentProgress = useOSStore.getState().bootProgress;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => setBooted(true), 1000);
      } else {
        setBootProgress(currentProgress + 2);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [setBooted, setBootProgress]);

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[9999] font-serif">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="text-gold text-6xl tracking-[0.2em] mb-8 select-none">SAYAN OS</div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-gold"
            style={{ width: `${bootProgress}%` }}
          />
        </div>
        <div className="mt-4 text-white/40 text-xs font-mono tracking-widest uppercase">Initializing Bio-Neural Interface...</div>
      </motion.div>
    </div>
  );
}

// Lock Screen Component
function LockScreen() {
  const { setLocked } = useOSStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      className="absolute inset-0 z-[9998] flex flex-col items-center justify-between p-12 pointer-events-auto overflow-hidden"
      onDoubleClick={() => setLocked(false)}
    >
      {/* Unique Opaque Lock Screen Wallpaper */}
      <div className="absolute inset-0 -z-10 select-none pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964" 
          className="w-full h-full object-cover"
          alt="Lock Screen Wallpaper"
        />
        {/* Dark overlay to make text pop and fully hide the 3D layer */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
      </div>

      <div className="text-center mt-20 relative z-10">
        <motion.h1 
          className="text-8xl font-light tracking-tighter text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.h1>
        <motion.p 
          className="text-lg text-white/60 font-serif"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </motion.p>
      </div>

      <motion.div 
        className="flex flex-col items-center gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
          <User className="text-white/60" size={32} />
        </div>
        <div className="text-center">
          <div className="text-xl text-white font-medium">Sayan Sinha</div>
          <div className="text-sm text-white/40 mt-1">Ready to explore</div>
        </div>
        <button 
          onClick={() => setLocked(false)}
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all backdrop-blur-md flex items-center gap-2 group shadow-xl"
        >
          <LockIcon size={16} className="group-hover:translate-y-[-2px] transition-transform" />
          Unlock Workspace
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function SayanOS({
  onReady,
}: {
  onReady?: () => void;
}) {
  const { isBooted, isLocked } = useOSStore();
  const windows = useOSStore(state => state.windows);
  const didNotifyReady = useRef(false);

  useEffect(() => {
    if (!isBooted || didNotifyReady.current) return;

    didNotifyReady.current = true;
    const frame = requestAnimationFrame(() => {
      onReady?.();
    });

    return () => cancelAnimationFrame(frame);
  }, [isBooted, onReady]);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <AnimatePresence mode="wait">
        {!isBooted ? (
          <BootScreen key="boot" />
        ) : (
          <motion.div 
            key="os-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <AnimatePresence>
              {isLocked && <LockScreen key="lock" />}
            </AnimatePresence>
            
            <div className={cn(
              "absolute inset-0 transition-all duration-1000 overflow-hidden",
              isLocked ? "scale-110 blur-xl opacity-0" : "scale-100 blur-0 opacity-100 pointer-events-auto"
            )}>
              {/* Dynamic Wallpaper */}
              <div className="absolute inset-0 -z-20 select-none pointer-events-none">
                <img 
                  src={useOSStore.getState().wallpaper} 
                  className="w-full h-full object-cover"
                  alt="Desktop Wallpaper"
                />
                {/* Subtle luxurious overlays */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
              </div>

              <Desktop />

              <AnimatePresence>
                {windows.map((window) => (
                  <WindowFrame key={window.id} window={window}>
                    <AppRenderer appId={window.appId} />
                  </WindowFrame>
                ))}
              </AnimatePresence>

              <Taskbar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
