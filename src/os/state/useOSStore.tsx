import {create} from 'zustand';
import type { WindowInstance } from "../../types/window";

export type AppId = 
  | 'terminal' 
  | 'explorer' 
  | 'browser' 
  | 'settings' 
  | 'vscode' 
  | 'music' 
  | 'about' 
  | 'projects' 
  | 'resume'
  | 'skills'
  | 'contact'
  | 'education'
  | 'certifications'
  | 'snake';

interface OSState {
  // Auth & Boot
  isBooted: boolean;
  isLocked: boolean;
  bootProgress: number;
  
  // System Settings
  wallpaper: string;
  theme: 'dark' | 'light' | 'luxury';
  accentColor: string;
  volume: number;
  isMuted: boolean;
  
  // Window Management
  windows: WindowInstance[];
  activeWindowId: string | null;
  maxZIndex: number;
  
  // Actions
  setBooted: (val: boolean) => void;
  setLocked: (val: boolean) => void;
  setBootProgress: (val: number) => void;
  
  openApp: (appId: AppId, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string, val?: boolean) => void;
  focusWindow: (id: string) => void;
  
  setVolume: (val: number) => void;
  setTheme: (theme: 'dark' | 'light' | 'luxury') => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  isBooted: false,
  isLocked: true,
  bootProgress: 0,
  wallpaper: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964',
  theme: 'luxury',
  accentColor: '#DAA520', // Golden accent
  volume: 80,
  isMuted: false,
  
  windows: [],
  activeWindowId: null,
  maxZIndex: 10,

  setBooted: (val) => set({ isBooted: val }),
  setLocked: (val) => set({ isLocked: val }),
  setBootProgress: (val) => set({ bootProgress: val }),

  openApp: (appId, title) => {
    const { windows, maxZIndex } = get();
    const existing = windows.find(w => w.appId === appId);
    
    if (existing) {
      set({ 
        activeWindowId: existing.id,
        windows: windows.map(w => w.id === existing.id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w),
        maxZIndex: maxZIndex + 1
      });
      return;
    }

    const newId = `${appId}-${Date.now()}`;
    const newWindow: WindowInstance = {
      id: newId,
      appId,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZIndex + 1
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newId,
      maxZIndex: maxZIndex + 1
    });
  },

  closeWindow: (id) => set(state => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  minimizeWindow: (id) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  maximizeWindow: (id, val) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: val ?? !w.isMaximized } : w)
  })),

  focusWindow: (id) => {
    const { maxZIndex, windows } = get();
    set({
      activeWindowId: id,
      maxZIndex: maxZIndex + 1,
      windows: windows.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w)
    });
  },

  setVolume: (val) => set({ volume: val }),
  setTheme: (theme) => set({ theme })
}));
