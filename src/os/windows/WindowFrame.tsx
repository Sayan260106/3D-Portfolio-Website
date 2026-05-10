import { motion, AnimatePresence } from 'motion/react';
import { Rnd } from 'react-rnd';
import type { WindowInstance } from "../../types/window";
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ReactNode } from 'react';
import { useOSStore } from '../state/useOSStore';

interface WindowFrameProps {
  window: WindowInstance;
  children?: ReactNode;
}

export default function WindowFrame({ window, children }: WindowFrameProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, activeWindowId } = useOSStore();
  const isActive = activeWindowId === window.id;

  if (window.isMinimized) return null;

  return (
    <Rnd
      default={{
        x: 100 + (window.zIndex * 20),
        y: 100 + (window.zIndex * 10),
        width: 800,
        height: 550,
      }}
      size={window.isMaximized ? { width: '100%', height: 'calc(100% - 48px)' } : undefined}
      position={window.isMaximized ? { x: 0, y: 0 } : undefined}
      onDragStart={() => focusWindow(window.id)}
      onResizeStart={() => focusWindow(window.id)}
      minWidth={400}
      minHeight={300}
      dragHandleClassName="handle"
      bounds="parent"
      enableResizing={!window.isMaximized}
      disableDragging={window.isMaximized}
      style={{ zIndex: window.zIndex }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          "h-full w-full flex flex-col rounded-xl overflow-hidden glass-dark os-window transition-shadow duration-300",
          isActive ? "border-white/20 shadow-2xl ring-1 ring-gold/20" : "border-white/5 opacity-80"
        )}
        onClick={() => focusWindow(window.id)}
      >
        {/* Title Bar */}
        <div className="handle h-10 flex items-center justify-between px-4 bg-white/5 cursor-default select-none border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold/50" />
            <span className="text-xs font-medium text-white/70 tracking-wide uppercase">{window.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/40 transition-colors"
            >
              <Minus size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/40 transition-colors"
            >
              <Maximize2 size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
              className="p-1.5 rounded-full hover:bg-red-500/80 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto bg-black/20">
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
}
