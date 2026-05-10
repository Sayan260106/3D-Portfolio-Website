import React from 'react';

export default function CRTOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden mix-blend-screen opacity-[0.15]">
      {/* Dynamic Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px] animate-[scanline_10s_linear_infinite]" />
      
      {/* Noise / Grain */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      
      {/* Subtle screen overlay (no flicker) */}
      <div className="absolute inset-0 opacity-[0.01] bg-white pointer-events-none" />
      
      {/* Large Corner Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)] pointer-events-none" />

      {/* Global Chromatic Aberration Simulation (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,transparent_50%,rgba(255,0,0,0.4)_75%,rgba(0,0,255,0.4)_100%)]" />
      
      <style>{`
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
    </div>
  );
}
