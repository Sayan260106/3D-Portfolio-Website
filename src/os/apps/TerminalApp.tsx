import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
}

export default function TerminalApp() {
  const [logs, setLogs] = useState<CommandLog[]>([
    { id: '1', type: 'output', content: 'SayanOS Kernel v4.2.0-neuro (64-bit)' },
    { id: '2', type: 'output', content: 'System initialized. Bio-neural interface online.' },
    { id: '3', type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newLogs = [...logs, { id: Date.now().toString(), type: 'input' as const, content: input }];
    const cmd = input.toLowerCase().trim();
    
    let output = '';
    let type: 'output' | 'error' = 'output';

    switch (cmd) {
      case 'help':
        output = 'Available commands:\n- about: Display developer identity\n- skills: List technical arsenal\n- projects: Show recent missions\n- resume: Access career manifesto\n- clear: Purge terminal logs\n- contact: Initialize communication';
        break;
      case 'about':
        output = 'Sayan Sinha. Creative Technologist. Master of the 3D-Web. Architecting digital dimensions.';
        break;
      case 'skills':
        output = 'Frontend: [React, Three.js, GSAP, Tailwind]\nBackend: [Node.js, Rust, Go]\nDesign: [Figma, Spline, Cinema4D]';
        break;
      case 'clear':
        setLogs([]);
        setInput('');
        return;
      case 'contact':
        output = 'Email: sayansinha2601@gmail.com\nLinkedIn: linkedin.com/in/sayansinha\nGitHub: github.com/sayan';
        break;
      default:
        output = `Command error: "${cmd}" is not recognized as a system operation. Type "help" for assistance.`;
        type = 'error';
    }

    setLogs([...newLogs, { id: (Date.now() + 1).toString(), type, content: output }]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col font-mono text-[13px] bg-black/40 backdrop-blur-sm p-4">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 custom-scrollbar"
      >
        {logs.map((log) => (
          <div key={log.id} className={cn(
            "whitespace-pre-wrap leading-relaxed",
            log.type === 'input' ? "text-white" : log.type === 'error' ? "text-red-400" : "text-emerald-400 opacity-90"
          )}>
            {log.type === 'input' ? (
              <span className="flex items-center gap-2">
                <span className="text-gold">guest@sayanos:~$</span>
                {log.content}
              </span>
            ) : log.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
        <span className="text-gold">guest@sayanos:~$</span>
        <input 
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white selection:bg-gold/30"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </form>
    </div>
  );
}

