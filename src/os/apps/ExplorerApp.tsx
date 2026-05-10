import { useState } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  Search, 
  Clock, 
  Star, 
  HardDrive,
  FileText,
  Image as ImageIcon,
  Cpu
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  icon?: any;
}

const initialFiles: FileItem[] = [
  { name: 'Projects', type: 'folder', modified: '2 days ago' },
  { name: 'Manifesto.pdf', type: 'file', size: '1.2 MB', modified: '1 week ago', icon: FileText },
  { name: 'Certificates', type: 'folder', modified: '1 month ago' },
  { name: 'Identity_Shot.png', type: 'file', size: '4.5 MB', modified: '3 days ago', icon: ImageIcon },
  { name: 'Arsenal.config', type: 'file', size: '2 KB', modified: 'Just now', icon: Cpu },
];

export default function ExplorerApp() {
  const [path, setPath] = useState(['Archive']);
  const [search, setSearch] = useState('');

  return (
    <div className="h-full flex flex-col bg-luxury-black text-white/90">
      {/* Search & Breadcrumbs */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-2 flex-1 text-xs font-mono text-white/40">
          {path.map((p, i) => (
            <div key={p} className="flex items-center gap-2">
              <span className={cn("hover:text-gold cursor-pointer transition-colors", i === path.length - 1 && "text-gold")}>
                {p}
              </span>
              {i < path.length - 1 && <ChevronRight size={12} />}
            </div>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
          <input 
            type="text" 
            placeholder="Search archive..."
            className="bg-black/40 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs focus:border-gold/50 outline-none transition-all w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-48 border-r border-white/5 p-4 space-y-6 bg-black/20">
          <section>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mb-4 px-2">Favorites</h3>
            <div className="space-y-1">
              <SidebarItem icon={Star} label="Starry" />
              <SidebarItem icon={Clock} label="Recent" />
              <SidebarItem icon={HardDrive} label="Core Drive" active />
            </div>
          </section>
          <section>
            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20 mb-4 px-2">Categories</h3>
            <div className="space-y-1">
              <SidebarItem icon={ImageIcon} label="Visuals" />
              <SidebarItem icon={FileText} label="Documents" />
              <SidebarItem icon={Cpu} label="System" />
            </div>
          </section>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6">
            {initialFiles.map((file, i) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-white/5 transition-all text-center cursor-default border border-transparent hover:border-white/5"
              >
                <div className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-gold/20 transition-all",
                  file.type === 'folder' ? "text-blue-400" : "text-gold"
                )}>
                  {file.type === 'folder' ? <Folder size={28} /> : (file.icon ? <file.icon size={28} /> : <File size={28} />)}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium truncate max-w-[100px]">{file.name}</div>
                  <div className="text-[9px] text-white/30 uppercase tracking-widest">{file.size || 'Folder'}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
      active ? "bg-gold/10 text-gold shadow-[inset_0_0_10px_rgba(218,165,32,0.1)]" : "text-white/40 hover:bg-white/5 hover:text-white"
    )}>
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );
}
