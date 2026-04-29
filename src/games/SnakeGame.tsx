import React, { useState, useEffect, useCallback } from 'react';

export default function SnakeGame() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-green-500 font-mono">
      <div className="mb-2">Score: {score}</div>
      <div className="border border-green-500 w-48 h-48 flex items-center justify-center">
        {gameOver ? "GAME OVER" : "[ Snake Game UI ]"}
      </div>
      <button 
        className="mt-4 px-4 py-2 border border-green-500 hover:bg-green-500/20"
        onClick={() => { setGameOver(false); setScore(0); }}
      >
        Restart
      </button>
    </div>
  );
}
