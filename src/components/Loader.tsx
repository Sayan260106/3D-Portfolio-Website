import { motion } from 'motion/react';


interface LoaderProps {
  progress?: number;
  phase?: string;
}

export default function Loader({
  progress = 0,
  phase = 'Loading Workspace',
}: LoaderProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  const bootLogs = [
    'SAYAN BIOS v1.0.0 initializing',
    'CPU: creative runtime online',
    'Memory test: portfolio modules verified',
    'Detecting display adapter: 3D monitor ready',
    'Mounting /projects workspace',
    'Loading WebGL drivers',
    'Starting SayanOS desktop services',
    "Entering Sayan's World...",
  ];
  const visibleLogCount = Math.min(
    bootLogs.length,
    Math.max(1, Math.ceil((pct / 100) * bootLogs.length))
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030303] text-[#c5a059]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08),transparent_46%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:100%_4px] opacity-25" />

      <div className="relative w-[min(88vw,760px)] border border-[#c5a059]/20 bg-black/65 p-5 shadow-[0_0_80px_rgba(0,0,0,0.85)] md:p-7">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#c5a059]/15 pb-4">
          <div>
            <div className="luxury-mono text-[10px] uppercase tracking-[0.35em] text-[#c5a059]/55">
              SayanOS Secure Boot
            </div>
            <div className="mt-2 luxury-title text-2xl tracking-[0.18em] text-[#c5a059] md:text-3xl">
              SAYAN.OS
            </div>
          </div>
          <div className="text-right luxury-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
            <div>POST</div>
            <div className="mt-1 text-[#c5a059]/70">{pct.toString().padStart(3, '0')}%</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_190px]">
          <div className="min-h-[220px] space-y-2 luxury-mono text-[11px] leading-relaxed tracking-[0.12em] text-[#c5a059]/70">
            {bootLogs.slice(0, visibleLogCount).map((log, index) => (
              <motion.div
                key={log}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <span className="w-12 shrink-0 text-white/18">
                  [{index.toString().padStart(2, '0')}]
                </span>
                <span>{log}</span>
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="pt-1 text-white/35"
            >
              _
            </motion.div>
          </div>

          <div className="flex flex-col justify-between border border-[#c5a059]/10 bg-white/[0.025] p-4">
            <div>
              <div className="luxury-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                Boot Status
              </div>
              <div className="mt-3 text-5xl font-light tabular-nums text-[#c5a059]">
                {pct}
                <span className="text-xl text-[#c5a059]/45">%</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#c5a059]/55">
                {phase}
              </div>
              <div className="h-1 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#c5a059]/25 via-[#c5a059] to-white/70"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#c5a059]/15 pt-4 text-center luxury-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
          Entering Sayan&apos;s World...
        </div>
      </div>
    </motion.div>
  );
}
