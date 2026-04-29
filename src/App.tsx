import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MainScene from './scenes/MainScene';
import BootScreen from './components/BootScreen';
import Loader from './components/Loader';
import CRTOverlay from './components/CRTOverlay';
import { useBootStore } from './store/useBootStore';
// import './styles/globals.css';

export default function App() {
  const { isBooted, isBooting, setBooting } = useBootStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setBooting(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setBooting]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {isLoading && <Loader />}
      
      {!isLoading && isBooting && <BootScreen />}

      {!isLoading && isBooted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full"
        >
          <MainScene />
          <CRTOverlay />
        </motion.div>
      )}

      {/* Access overlay for mobile message or other global alerts */}
      <div className="fixed bottom-4 right-4 text-[10px] text-white/20 font-mono pointer-events-none">
        SayanOS v1.0.0
      </div>
    </div>
  );
}
