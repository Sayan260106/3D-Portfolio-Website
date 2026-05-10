import { useOSStore, AppId } from '../state/useOSStore';
import { Terminal, Folder, FileText, Music, Cpu, User, BadgeCheck, GraduationCap, Mail, Gamepad2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface DesktopIconProps {
  appId: AppId;
  label: string;
  icon: any;
  color: string;
}

function DesktopIcon({ appId, label, icon: Icon, color }: DesktopIconProps) {
  const { openApp } = useOSStore();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openApp(appId, label);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleOpen}
      className="group flex flex-col items-center gap-2 p-3 w-24 rounded-xl hover:bg-white/5 transition-colors cursor-pointer select-none"
    >
      <div className={cn(
        "w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 transition-all group-hover:border-white/20 group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
        color
      )}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] text-white/70 font-medium tracking-widest uppercase text-center drop-shadow-lg group-hover:text-white">
        {label}
      </span>
    </motion.button>
  );
}

export default function Desktop() {
  return (
    <div className="h-full w-full p-8 pointer-events-auto">
      <div className="grid grid-flow-col grid-rows-6 gap-2 w-fit">
        <DesktopIcon appId="about" label="About" icon={User} color="text-gold" />
        <DesktopIcon appId="projects" label="Projects" icon={Cpu} color="text-amber-400" />
        <DesktopIcon appId="explorer" label="Archive" icon={Folder} color="text-blue-400" />
        <DesktopIcon appId="resume" label="Resume" icon={FileText} color="text-emerald-400" />
        <DesktopIcon appId="skills" label="Skills" icon={Sparkles} color="text-violet-300" />
        <DesktopIcon appId="education" label="Education" icon={GraduationCap} color="text-cyan-300" />
        <DesktopIcon appId="certifications" label="Certs" icon={BadgeCheck} color="text-lime-300" />
        <DesktopIcon appId="contact" label="Contact" icon={Mail} color="text-rose-300" />
        <DesktopIcon appId="music" label="Ambiance" icon={Music} color="text-pink-400" />
        <DesktopIcon appId="terminal" label="Terminal" icon={Terminal} color="text-green-400" />
        <DesktopIcon appId="snake" label="Snake" icon={Gamepad2} color="text-orange-300" />
      </div>
      
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(218,165,32,0.05)_0%,transparent_50%)]" />
    </div>
  );
}
