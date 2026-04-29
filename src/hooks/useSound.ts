import { useAudioStore } from '../store/useAudioStore';

export function useSound() {
  const { volume, isMuted } = useAudioStore();

  const playSound = (path: string) => {
    if (isMuted) return;
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch(e => console.log("Audio play blocked"));
  };

  return { playSound };
}
