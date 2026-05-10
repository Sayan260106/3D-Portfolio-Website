import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(35);

  const playlist = [
    { title: "Neon Nights", artist: "Sayan Sinha", duration: "3:45", color: "from-blue-500" },
    { title: "Digital Zen", artist: "Lofi Architect", duration: "4:20", color: "from-gold" },
    { title: "Kernel Panic", artist: "Cyber Dream", duration: "2:50", color: "from-red-500" },
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p + 0.1) % 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="h-full flex flex-col bg-[#080808] text-white">
      {/* Player Header - Vinyl Effect */}
      <div className={cn(
        "relative h-64 flex flex-col items-center justify-center p-8 overflow-hidden bg-gradient-to-b via-transparent to-[#080808]",
        playlist[currentTrack].color + "/10"
      )}>
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-40 h-40 rounded-full border-8 border-black/40 shadow-2xl flex items-center justify-center bg-black overflow-hidden"
        >
          <div className="absolute inset-0 bg-[repeating-radial-gradient(circle,transparent,transparent_2px,rgba(255,255,255,0.02)_3px)]" />
          <div className="z-10 w-12 h-12 rounded-full border-4 border-white/10 bg-[#111] flex items-center justify-center">
             <Disc size={20} className="text-gold" />
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-serif italic tracking-tight">{playlist[currentTrack].title}</h2>
          <p className="text-gold font-mono text-[10px] uppercase tracking-[0.3em] mt-1">{playlist[currentTrack].artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 pb-8 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold shadow-[0_0_10px_rgba(218,165,32,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest">
            <span>01:24</span>
            <span>{playlist[currentTrack].duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <button className="text-white/40 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg overflow-hidden relative group"
          >
             <motion.div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
             {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button className="text-white/40 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-4 justify-center text-white/20">
          <Volume2 size={16} />
          <div className="w-24 h-1 bg-white/5 rounded-full relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-3/4 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Mini Playlist */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1">
        {playlist.map((track, i) => (
          <button 
            key={track.title}
            onClick={() => setCurrentTrack(i)}
            className={cn(
              "w-full flex items-center justify-between p-3 rounded-xl transition-all",
              currentTrack === i ? "bg-white/10 text-gold" : "hover:bg-white/5 text-white/40 underline-offset-4"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="text-[10px] font-mono opacity-50">0{i+1}</div>
              <div className="text-left">
                <div className="text-xs font-medium">{track.title}</div>
                <div className="text-[9px] opacity-40 uppercase tracking-widest">{track.artist}</div>
              </div>
            </div>
            <MusicIcon size={14} className={cn(currentTrack === i ? "opacity-100" : "opacity-0")} />
          </button>
        ))}
      </div>
    </div>
  );
}
