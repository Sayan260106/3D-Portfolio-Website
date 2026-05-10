import { motion, AnimatePresence } from 'motion/react';
import { useMemo, useState, useEffect } from 'react';
import MainScene from './scenes/MainScene';
import Loader from './components/Loader';
import CRTOverlay from './os/effects/CRTOverlay';
// import './styles/globals.css';

const MIN_LOADING_TIME = 1400;

export default function App() {
  const [introReady, setIntroReady] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [monitorReady, setMonitorReady] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [loaderComplete, setLoaderComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroReady(true);
    }, MIN_LOADING_TIME);

    return () => clearTimeout(timer);
  }, []);

  const isReady = introReady && assetsReady && monitorReady;

  const targetProgress = useMemo(() => {
    if (isReady) return 100;
    if (!assetsReady) return Math.max(7, Math.min(82, sceneProgress * 0.82));
    if (!monitorReady) return 92;
    if (!introReady) return 97;
    return 98;
  }, [assetsReady, introReady, isReady, monitorReady, sceneProgress]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDisplayedProgress((current) => {
        if (current >= targetProgress) return current;

        const remaining = targetProgress - current;
        const step = Math.max(1, Math.ceil(remaining * 0.08));

        return Math.min(targetProgress, current + step);
      });
    }, 42);

    return () => window.clearInterval(timer);
  }, [targetProgress]);

  const loadingPhase = useMemo(() => {
    if (!assetsReady) return 'Loading 3D Workspace';
    if (!monitorReady) return 'Preparing Monitor Interface';
    if (!introReady) return 'Synchronizing Boot Sequence';
    return 'Finalizing Experience';
  }, [assetsReady, introReady, monitorReady]);

  useEffect(() => {
    if (!isReady || displayedProgress < 100) return;

    const timer = window.setTimeout(() => {
      setLoaderComplete(true);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [displayedProgress, isReady]);

  const showLoader = !loaderComplete;

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <motion.div
        initial={false}
        animate={{
          opacity: isReady ? 1 : 0.001,
          scale: isReady ? 1 : 1.01,
          filter: isReady ? 'blur(0px)' : 'blur(4px)',
        }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="w-full h-full"
      >
        <MainScene
          onLoadProgress={setSceneProgress}
          onAssetsReady={() => setAssetsReady(true)}
          onMonitorReady={() => setMonitorReady(true)}
        />
        <CRTOverlay />
      </motion.div>

      <AnimatePresence>
        {showLoader && (
          <Loader
            progress={displayedProgress}
            phase={loadingPhase}
          />
        )}
      </AnimatePresence>

      {/* Access overlay for mobile message or other global alerts */}
      <div className="fixed bottom-4 right-4 text-[10px] text-white/20 font-mono pointer-events-none">
        SayanOS v1.0.0
      </div>
    </div>
  );
}
