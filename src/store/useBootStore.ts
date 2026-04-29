import { create } from 'zustand';

interface BootState {
  isBooted: boolean;
  isBooting: boolean;
  bootProgress: number;
  setBooted: (val: boolean) => void;
  setBooting: (val: boolean) => void;
  setBootProgress: (val: number) => void;
}

export const useBootStore = create<BootState>((set) => ({
  isBooted: false,
  isBooting: false,
  bootProgress: 0,
  setBooted: (isBooted) => set({ isBooted }),
  setBooting: (isBooting) => set({ isBooting }),
  setBootProgress: (bootProgress) => set({ bootProgress }),
}));
