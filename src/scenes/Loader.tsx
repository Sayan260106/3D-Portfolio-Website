import { Html, useProgress } from '@react-three/drei';
import { useRef } from 'react';

const SIZE = 160;
const STROKE = 3;
const R = (SIZE - STROKE * 2) / 2;
const CIRC = 2 * Math.PI * R;

export default function Loader() {
  const { progress } = useProgress();
  const pct = Math.min(progress, 100);
  const offset = CIRC - (pct / 100) * CIRC;

  return (
    <Html center>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@200;300&display=swap');

        @keyframes spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.25; transform: scale(1);   }
          50%       { opacity: 0.55; transform: scale(1.08); }
        }
        @keyframes loader-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes shimmer-particle {
          0%   { opacity: 0;   transform: translateY(0)    scale(0.6); }
          40%  { opacity: 0.9; }
          100% { opacity: 0;   transform: translateY(-32px) scale(1.2); }
        }
        @keyframes dash-rotate {
          to { stroke-dashoffset: -${CIRC}px; }
        }

        .ldr-wrap {
          width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          animation: loader-fadein 0.6s ease both;
          user-select: none;
        }
        .ldr-ring-outer {
          position: relative;
          width: ${SIZE}px;
          height: ${SIZE}px;
        }
        .ldr-orbit {
          position: absolute;
          inset: -14px;
          animation: spin-cw 8s linear infinite;
        }
        .ldr-orbit-inner {
          position: absolute;
          inset: -8px;
          animation: spin-ccw 5s linear infinite;
          opacity: 0.5;
        }
        .ldr-glow {
          position: absolute;
          inset: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(214,168,95,0.18) 0%, transparent 70%);
          animation: pulse-glow 2.4s ease-in-out infinite;
        }
        .ldr-label {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .ldr-number {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 42px;
          line-height: 1;
          color: #d6a85f;
          letter-spacing: -0.02em;
        }
        .ldr-number sup {
          font-size: 18px;
          vertical-align: super;
          opacity: 0.7;
        }
        .ldr-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 200;
          font-size: 9px;
          letter-spacing: 0.45em;
          color: rgba(214,168,95,0.65);
          text-transform: uppercase;
        }
        .ldr-bar-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ldr-bar-track {
          position: relative;
          height: 1px;
          background: rgba(214,168,95,0.15);
          overflow: visible;
        }
        .ldr-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(214,168,95,0.4), #d6a85f);
          transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }
        .ldr-bar-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d6a85f;
          box-shadow: 0 0 8px 3px rgba(214,168,95,0.6);
        }
        .ldr-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #d6a85f;
          animation: shimmer-particle 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="ldr-wrap">
        {/* Ring section */}
        <div className="ldr-ring-outer">
          <div className="ldr-glow" />

          {/* Outer decorative dashed orbit */}
          <svg
            className="ldr-orbit"
            width={SIZE + 28}
            height={SIZE + 28}
            viewBox={`0 0 ${SIZE + 28} ${SIZE + 28}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <circle
              cx={(SIZE + 28) / 2}
              cy={(SIZE + 28) / 2}
              r={(SIZE + 28) / 2 - 2}
              fill="none"
              stroke="rgba(214,168,95,0.2)"
              strokeWidth="0.5"
              strokeDasharray="3 9"
            />
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cx2 = (SIZE + 28) / 2 + ((SIZE + 28) / 2 - 2) * Math.cos(rad);
              const cy2 = (SIZE + 28) / 2 + ((SIZE + 28) / 2 - 2) * Math.sin(rad);
              return (
                <circle key={deg} cx={cx2} cy={cy2} r="1.5" fill="#d6a85f" opacity="0.6" />
              );
            })}
          </svg>

          {/* Inner rotating accent ring */}
          <svg
            className="ldr-orbit-inner"
            width={SIZE + 16}
            height={SIZE + 16}
            viewBox={`0 0 ${SIZE + 16} ${SIZE + 16}`}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <circle
              cx={(SIZE + 16) / 2}
              cy={(SIZE + 16) / 2}
              r={(SIZE + 16) / 2 - 2}
              fill="none"
              stroke="rgba(214,168,95,0.12)"
              strokeWidth="0.5"
              strokeDasharray="1 14"
            />
          </svg>

          {/* Progress arc */}
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <defs>
              <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d6a85f" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d6a85f" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="rgba(214,168,95,0.08)"
              strokeWidth={STROKE}
            />

            {/* Progress fill */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="url(#arc-grad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${CIRC}`}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.35s cubic-bezier(0.4,0,0.2,1)' }}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />

            {/* Glowing tip dot */}
            {pct > 2 && (() => {
              const angle = (pct / 100) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const tx = SIZE / 2 + R * Math.cos(rad);
              const ty = SIZE / 2 + R * Math.sin(rad);
              return (
                <>
                  <circle cx={tx} cy={ty} r="5" fill="rgba(214,168,95,0.2)" />
                  <circle cx={tx} cy={ty} r="2" fill="#d6a85f" />
                </>
              );
            })()}
          </svg>

          {/* Floating particles */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="ldr-particle"
              style={{
                left: `${22 + i * 18}%`,
                bottom: '15%',
                animationDelay: `${i * 0.45}s`,
                animationDuration: `${1.6 + i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Number */}
        <div className="ldr-label">
          <span className="ldr-number">
            {Math.floor(pct)}<sup>%</sup>
          </span>
          <span className="ldr-text">Loading</span>
        </div>

        {/* Bottom bar */}
        <div className="ldr-bar-wrap">
          <div className="ldr-bar-track">
            <div className="ldr-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </Html>
  );
}