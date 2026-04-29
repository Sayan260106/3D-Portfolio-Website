import React from 'react';
import { useWindowStore } from '../store/useWindowStore';
import Window from './Window';

import { AnimatePresence } from 'motion/react';

export default function WindowManager() {
  const { windows } = useWindowStore();

  return (
    <AnimatePresence>
      {windows.filter(w => w.isOpen).map(window => (
        <Window key={window.id} window={window} />
      ))}
    </AnimatePresence>
  );
}
