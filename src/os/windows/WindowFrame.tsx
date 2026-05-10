import { motion } from 'motion/react';
import { Rnd } from 'react-rnd';
import type { WindowInstance } from "../../types/window";
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useOSStore } from '../state/useOSStore';

interface WindowFrameProps {
  window: WindowInstance;
  children?: ReactNode;
}

const DEFAULT_WINDOW_WIDTH = 800;
const DEFAULT_WINDOW_HEIGHT = 550;

export default function WindowFrame({
  window,
  children,
}: WindowFrameProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    activeWindowId,
  } = useOSStore();

  const isActive = activeWindowId === window.id;

  const boundsRef = useRef<HTMLDivElement | null>(null);

  const [boundsSize, setBoundsSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  /**
   * IMPORTANT FIX:
   * Instead of returning null instantly when minimized,
   * we animate the window out first.
   *
   * Returning null immediately was causing the virtual monitor
   * render texture to go black because the content disappeared
   * abruptly from the scene.
   */
  const [isVisible, setIsVisible] = useState(!window.isMinimized);

  useLayoutEffect(() => {
    const el = boundsRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();

      setBoundsSize({
        width: rect.width,
        height: rect.height,
      });
    };

    update();

    const ro = new ResizeObserver(() => update());

    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  /**
   * Handle minimize visibility safely
   */
  useLayoutEffect(() => {
    if (!window.isMinimized) {
      setIsVisible(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 180);

    return () => clearTimeout(timeout);
  }, [window.isMinimized]);

  const canComputePosition =
    !!boundsSize && !window.isMaximized;

  const computedDefault = useMemo(() => {
    if (!boundsSize) {
      return {
        x: 100,
        y: 100,
        width: DEFAULT_WINDOW_WIDTH,
        height: DEFAULT_WINDOW_HEIGHT,
      };
    }

    const { width: parentW, height: parentH } = boundsSize;

    const baseX =
      (parentW - DEFAULT_WINDOW_WIDTH) / 2;

    const baseY =
      (parentH - DEFAULT_WINDOW_HEIGHT) / 2;

    const maxX = Math.max(
      0,
      parentW - DEFAULT_WINDOW_WIDTH
    );

    const maxY = Math.max(
      0,
      parentH - DEFAULT_WINDOW_HEIGHT
    );

    return {
      x: Math.min(maxX, Math.max(0, baseX)),
      y: Math.min(maxY, Math.max(0, baseY)),
      width: DEFAULT_WINDOW_WIDTH,
      height: DEFAULT_WINDOW_HEIGHT,
    };
  }, [boundsSize]);

  /**
   * Prevent hard unmount immediately
   */
  if (!isVisible && window.isMinimized) {
    return null;
  }

  return (
    <div
      ref={boundsRef}
      className="absolute inset-0"
    >
      <Rnd
        key={`${window.id}-${window.isMaximized ? 'max' : 'norm'}`}
        default={
          canComputePosition
            ? computedDefault
            : undefined
        }
        size={
          window.isMaximized
            ? {
                width: '100%',
                height: '100%',
              }
            : undefined
        }
        position={
          window.isMaximized
            ? { x: 0, y: 0 }
            : undefined
        }
        onDragStart={() =>
          focusWindow(window.id)
        }
        onResizeStart={() =>
          focusWindow(window.id)
        }
        minWidth={400}
        minHeight={300}
        dragHandleClassName="handle"
        bounds="parent"
        enableResizing={!window.isMaximized}
        disableDragging={window.isMaximized}
        style={{
          zIndex: window.zIndex,
        }}
      >
        <motion.div
          initial={{
            scale: 0.92,
            opacity: 0,
            y: 10,
          }}
          animate={{
            scale: window.isMinimized ? 0.9 : 1,
            opacity: window.isMinimized ? 0 : 1,
            y: window.isMinimized ? 20 : 0,
          }}
          transition={{
            duration: 0.18,
            ease: 'easeOut',
          }}
          className={cn(
            'h-full w-full flex flex-col rounded-xl overflow-hidden glass-dark os-window transition-shadow duration-300',
            isActive
              ? 'border-white/20 shadow-2xl ring-1 ring-gold/20'
              : 'border-white/5 opacity-80'
          )}
          onClick={() =>
            focusWindow(window.id)
          }
        >
          {/* Title Bar */}
          <div className="h-10 flex items-center justify-between px-4 bg-white/5 cursor-default select-none border-b border-white/5">
            {/* Drag handle area: the whole left+center title region, excluding the control buttons */}
            <div className="handle flex items-center gap-2 flex-1 min-w-0">
              <div className="w-3 h-3 rounded-full bg-gold/50" />
              <span className="text-xs font-medium text-white/70 tracking-wide uppercase truncate">
                {window.title}
              </span>
            </div>

            <div className="flex items-center gap-2" aria-label="window-controls">
              {/* Minimize */}
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  minimizeWindow(window.id);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <Minus size={14} />
              </button>

              {/* Maximize */}
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  maximizeWindow(window.id);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <Maximize2 size={12} />
              </button>

              {/* Close */}
              <button
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  closeWindow(window.id);
                }}
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
    </div>
  );
}
