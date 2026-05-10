import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  Terminal, 
  Folder, 
  Cpu, 
  LogOut, 
  Search,
  ChevronRight,
  Monitor,
  Github,
  Linkedin,
  Mail,
  Code,
  Sparkles,
  BadgeCheck,
  GraduationCap,
  Gamepad2
} from 'lucide-react';
import { useOSStore, AppId } from '../state/useOSStore';
import { cn } from '../../lib/utils';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { openApp, setLocked } = useOSStore();

  const handleAppClick = (appId: AppId, title: string) => {
    openApp(appId, title);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="absolute inset-0 z-[1001]" onClick={onClose} />
          
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[540px] glass-dark rounded-3xl z-[1002] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Search Bar */}
            <div className="p-6 pb-0">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search systems and archives..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-gold/30 transition-all font-light"
                  />
               </div>
            </div>

            <div className="p-6 flex gap-8">
              {/* Pinned Apps Grid */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">Core Systems</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <PinnedApp icon={User} label="About" onClick={() => handleAppClick('about', 'About')} color="text-gold" />
                    <PinnedApp icon={Cpu} label="Projects" onClick={() => handleAppClick('projects', 'Projects')} color="text-amber-400" />
                    <PinnedApp icon={Terminal} label="Terminal" onClick={() => handleAppClick('terminal', 'Sayan@Shell')} color="text-emerald-400" />
                    <PinnedApp icon={Folder} label="Archive" onClick={() => handleAppClick('explorer', 'Explorer')} color="text-blue-400" />
                    <PinnedApp icon={Monitor} label="Resume" onClick={() => handleAppClick('resume', 'Resume')} color="text-emerald-300" />
                    <PinnedApp icon={Sparkles} label="Skills" onClick={() => handleAppClick('skills', 'Skills')} color="text-violet-300" />
                    <PinnedApp icon={GraduationCap} label="Education" onClick={() => handleAppClick('education', 'Education')} color="text-cyan-300" />
                    <PinnedApp icon={BadgeCheck} label="Certs" onClick={() => handleAppClick('certifications', 'Certifications')} color="text-lime-300" />
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-4">Recommended</h3>
                  <div className="space-y-1">
                    <RecommendedItem icon={Github} label="GitHub" sub="Project archive" />
                    <RecommendedItem icon={Mail} label="Contact Sayan" sub="Direct correspondence" />
                  </div>
                </div>
              </div>

              {/* Sidebar / Quick Actions */}
              <div className="w-32 flex flex-col justify-between border-l border-white/5 pl-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/20">
                     <User size={32} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-sm font-medium tracking-tight">Sayan Sinha</div>
                    <div className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">Administrator</div>
                  </div>
                </div>

                <div className="space-y-2">
                   <button 
                    onClick={() => setLocked(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-[10px] font-mono uppercase tracking-widest border border-white/5"
                   >
                     <LogOut size={14} /> Lock
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PinnedApp({ icon: Icon, label, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-white/5 transition-all text-center group"
    >
      <div className={cn("w-12 h-12 flex items-center justify-center rounded-2xl bg-black/40 border border-white/5 group-hover:border-white/10 group-hover:scale-105 transition-all", color)}>
        <Icon size={24} />
      </div>
      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white">{label}</span>
    </button>
  );
}

function RecommendedItem({ icon: Icon, label, sub }: any) {
  return (
    <button className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group text-left">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/30 group-hover:text-gold transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs font-medium">{label}</div>
        <div className="text-[9px] text-white/20 uppercase tracking-widest mt-0.5">{sub}</div>
      </div>
    </button>
  );
}
