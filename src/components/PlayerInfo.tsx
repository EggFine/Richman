import React from 'react';
import type { Player } from '../game/types';
import { clsx } from 'clsx';
import { User, Bot, TrendingUp, Ticket, Lock, Coffee } from 'lucide-react';

const PlayerInfo: React.FC<{ player: Player, isCurrent: boolean }> = ({ player, isCurrent }) => {
  return (
    <div className={clsx(
        "p-2 sm:p-3 rounded-xl border-2 transition-all flex flex-col gap-0.5 sm:gap-1 relative overflow-hidden",
        isCurrent ? 'border-yellow-400 bg-white shadow-lg scale-105 z-10' : 'border-transparent bg-slate-100 opacity-90 grayscale-[0.3]',
        player.isBankrupt && "opacity-50 bg-red-100 grayscale"
    )}>
      {/* Active Indicator */}
      {isCurrent && <div className="absolute top-0 right-0 p-0.5 sm:p-1 bg-yellow-400 text-[6px] sm:text-[8px] font-bold text-yellow-900 rounded-bl-lg">当前回合</div>}

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className={clsx("w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md", 
            player.color === 'blue' ? 'bg-blue-600' : 'bg-red-600'
        )}>
            {player.color === 'blue' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
        </div>
        <div className="flex flex-col leading-none">
            <span className="font-bold text-xs sm:text-sm text-slate-800">{player.name}</span>
            <span className="text-[8px] sm:text-[10px] text-slate-500 font-mono">ID: {player.id}</span>
        </div>
      </div>
      
      <div className="mt-1 sm:mt-2 text-lg sm:text-2xl font-mono font-black text-green-600 tracking-tighter">
        ${player.money.toLocaleString()}
      </div>
      
      <div className="flex gap-1 sm:gap-2 text-[8px] sm:text-[10px] text-slate-500 font-medium flex-wrap">
          {Object.values(player.portfolio).reduce((a, b) => a + b, 0) > 0 && (
            <span className="bg-blue-100 text-blue-700 px-1 sm:px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> {Object.values(player.portfolio).reduce((a, b) => a + b, 0)}股
            </span>
          )}
          {player.lotteryTickets.length > 0 && (
            <span className="bg-pink-100 text-pink-700 px-1 sm:px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Ticket className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> {player.lotteryTickets.length}张
            </span>
          )}
          {player.jailTurns > 0 && (
            <span className="bg-gray-800 text-white px-1 sm:px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> 坐牢({player.jailTurns})
            </span>
          )}
          {player.restTurns > 0 && (
            <span className="bg-amber-200 text-amber-800 px-1 sm:px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Coffee className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> 休息({player.restTurns})
            </span>
          )}
      </div>

      {player.isBankrupt && <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex items-center justify-center text-red-700 font-black text-lg sm:text-xl uppercase rotate-12 border-4 border-red-600 rounded-xl">破产 BANKRUPT</div>}
    </div>
  );
};

export default PlayerInfo;
