import React, { useState } from 'react';

export default function TerminalWindow() {
  const [history, setHistory] = useState<string[]>(['Welcome to SayanOS v1.0.0 Terminal', 'Type "help" for commands']);

  return (
    <div className="bg-black text-green-500 font-mono h-full p-2 overflow-auto">
      {history.map((line, i) => <div key={i}>{line}</div>)}
      <div className="flex gap-2">
        <span>{">"}</span>
        <input className="bg-transparent border-none outline-none flex-1 text-green-500" autoFocus />
      </div>
    </div>
  );
}
