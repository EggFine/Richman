import React from 'react';
import type { Player } from '../game/types';
import { clsx } from 'clsx';
import { User, Bot, TrendingUp, Ticket, Lock } from 'lucide-react';

const PlayerInfo: React.FC<{ player: Player, isCurrent: boolean }> = ({ player, isCurrent }) => {
  return (
    <div className={clsx(
        "p-3 rounded-xl border-2 transition-all flex flex-col gap-1 relative overflow-hidden",
        isCurrent ? 'border-yellow-400 bg-white shadow-lg scale-105 z-10' : 'border-transparent bg-slate-100 opacity-90 grayscale-[0.3]',
        player.isBankrupt && "opacity-50 bg-red-100 grayscale"
    )}>
      {/* Active Indicator */}
      {isCurrent && <div className="absolute top-0 right-0 p-1 bg-yellow-400 text-[8px] font-bold text-yellow-900 rounded-bl-lg">当前回合</div>}

      <div className="flex items-center gap-2">
        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md", 
            player.color === 'blue' ? 'bg-blue-600' : 'bg-red-600'
        )}>
            {player.color === 'blue' ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-slate-800">{player.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">ID: {player.id}</span>
        </div>
      </div>
      
      <div className="mt-2 text-2xl font-mono font-black text-green-600 tracking-tighter">
        ${player.money.toLocaleString()}
      </div>
      
      <div className="flex gap-2 text-[10px] text-slate-500 font-medium flex-wrap">
          {Object.values(player.portfolio).reduce((a, b) => a + b, 0) > 0 && (
            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp size={10} /> {Object.values(player.portfolio).reduce((a, b) => a + b, 0)}股
            </span>
          )}
          {player.lotteryTickets.length > 0 && (
            <span className="bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Ticket size={10} /> {player.lotteryTickets.length}张
            </span>
          )}
          {player.jailTurns > 0 && (
            <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Lock size={10} /> 坐牢({player.jailTurns})
            </span>
          )}
      </div>

      {player.isBankrupt && <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex items-center justify-center text-red-700 font-black text-xl uppercase rotate-12 border-4 border-red-600 rounded-xl">破产 BANKRUPT</div>}
    </div>
  );
};

export default PlayerInfo;
