import { motion } from 'motion/react';
import { useOSStore, AppId } from '../state/useOSStore';
import { 
  Terminal, 
  Folder, 
  Settings, 
  Music, 
  Layout, 
  Github, 
  Linkedin, 
  Code, 
  User,
  Cpu,
  Monitor,
  Sparkles,
  Mail,
  Gamepad2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import StartMenu from '../startmenu/StartMenu';

const apps: { id: AppId; icon: any; label: string; color: string }[] = [
  { id: 'about', icon: User, label: 'About', color: 'text-gold' },
  { id: 'projects', icon: Cpu, label: 'Projects', color: 'text-amber-400' },
  { id: 'explorer', icon: Folder, label: 'Explorer', color: 'text-blue-400' },
  { id: 'skills', icon: Sparkles, label: 'Skills', color: 'text-violet-300' },
  { id: 'contact', icon: Mail, label: 'Contact', color: 'text-rose-300' },
  { id: 'terminal', icon: Terminal, label: 'Terminal', color: 'text-green-400' },
  { id: 'music', icon: Music, label: 'Music', color: 'text-pink-400' },
  { id: 'snake', icon: Gamepad2, label: 'Snake', color: 'text-orange-300' },
];

export default function Taskbar() {
  const { openApp, windows, activeWindowId, focusWindow } = useOSStore();
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 p-1.5 rounded-2xl glass-dark border border-white/10 shadow-2xl pointer-events-auto">
        {/* Start Button */}
        <button 
          onClick={() => setIsStartOpen(!isStartOpen)}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            isStartOpen ? "bg-gold/10 text-gold shadow-[0_0_15px_rgba(218,165,32,0.2)]" : "hover:bg-white/10 text-white/60 hover:text-gold"
          )}
        >
          <Monitor size={20} />
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* App Icons */}
        <div className="flex items-center gap-1">
          {apps.map((app) => {
            const window = windows.find(w => w.appId === app.id);
            const isOpen = !!window;
            const isActive = activeWindowId === window?.id;

            return (
              <button
                key={app.id}
                onClick={() => {
                  if (isOpen) {
                    if (isActive) {
                      useOSStore.getState().minimizeWindow(window.id);
                    } else {
                      focusWindow(window.id);
                    }
                  } else {
                    openApp(app.id, app.label);
                  }
                }}
                className={cn(
                  "group relative p-2.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-white/10" : "hover:bg-white/5 underline-offset-8"
                )}
              >
                <app.icon size={22} className={cn("transition-transform group-hover:scale-110", app.color)} />
                
                {/* Indicators */}
                {isOpen && (
                  <motion.div 
                    layoutId={`indicator-${app.id}`}
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gold transition-all duration-300",
                      isActive ? "w-4 shadow-[0_0_5px_rgba(218,165,32,0.8)]" : "w-1 opacity-40"
                    )}
                  />
                )}

                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/90 text-white text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 shadow-xl">
                  {app.label}
                </div>
              </button>
            );
          })}
        </div>

      <div className="w-[1px] h-6 bg-white/10 mx-1" />

      {/* Clock Area */}
      <div className="px-3 flex flex-col items-center justify-center cursor-default min-w-[80px]">
        <div className="text-[11px] font-medium text-white tracking-widest">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-[8px] text-white/40 uppercase font-serif tracking-[0.2em] mt-0.5">
          {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  </>
  );
}
