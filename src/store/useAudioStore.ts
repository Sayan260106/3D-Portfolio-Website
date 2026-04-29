import { create } from 'zustand';

interface AudioState {
  volume: number;
  isMuted: boolean;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  volume: 0.5,
  isMuted: false,
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));
