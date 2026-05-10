import { create } from 'zustand';
import type { WindowInstance } from "../types/window";

interface WindowState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  toggleMinimize: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useWindowStore = create<WindowState>((set) => ({
  windows: [
    { id: 'about', title: 'Curriculum', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 1, content: '' },
    { id: 'projects', title: 'Exhibitions', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 1, content: '' },
    { id: 'skills', title: 'Technique', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 1, content: '' },
    { id: 'contact', title: 'Correspondence', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 1, content: '' },
    { id: 'terminal', title: 'System', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 1, content: '' },
    { id: 'snake', title: 'Diversion', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 1, content: '' },
  ],
  activeWindowId: null,
  openWindow: (id) => set((state) => {
    const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
    return {
      activeWindowId: id,
      windows: state.windows.map(w => 
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
      )
    };
  }),
  closeWindow: (id) => set((state) => ({ 
    windows: state.windows.map(w => w.id === id ? { ...w, isOpen: false } : w) 
  })),
  toggleMaximize: (id) => set((state) => ({ 
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w) 
  })),
  toggleMinimize: (id) => set((state) => ({ 
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w) 
  })),
  focusWindow: (id) => set((state) => {
    const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
    return {
      activeWindowId: id,
      windows: state.windows.map(w => 
        w.id === id ? { ...w, zIndex: maxZ + 1 } : w
      )
    };
  }),
}));
