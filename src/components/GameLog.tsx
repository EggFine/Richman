import React, { useEffect, useRef } from 'react';

const GameLog: React.FC<{ logs: string[] }> = ({ logs }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div ref={containerRef} className="flex-1 bg-slate-900/80 text-green-400 p-3 font-mono text-[10px] sm:text-xs overflow-y-auto rounded-xl border border-slate-700 shadow-inner scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent h-full">
      {logs.length === 0 && <div className="text-slate-600 text-center italic mt-4">游戏记录将显示在这里...</div>}
      {logs.map((log, i) => (
        <div key={i} className="mb-1.5 border-b border-slate-800/50 pb-1 last:border-0 leading-relaxed break-words">
            <span className="text-slate-500 mr-2 opacity-50">[{String(i + 1).padStart(2, '0')}]</span>
            <span className={log.includes('破产') ? 'text-red-500 font-bold' : log.includes('获胜') ? 'text-yellow-400 font-bold' : ''}>
                {log}
            </span>
        </div>
      ))}
    </div>
  );
};

export default GameLog;