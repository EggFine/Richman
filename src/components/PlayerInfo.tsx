import React from 'react';
import type { Player } from '../game/types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { User, Bot, TrendingUp, Ticket, Lock, Coffee } from 'lucide-react';
import { useTranslation } from '../i18n';

const PlayerInfo: React.FC<{ player: Player, isCurrent: boolean }> = ({ player, isCurrent }) => {
  const t = useTranslation();
  const isBlue = player.color === 'blue';
  
  return (
    <motion.div 
        animate={{ 
            scale: isCurrent ? 1.02 : 1,
            opacity: player.isBankrupt ? 0.6 : 1,
        }}
        className={clsx(
            "p-2 sm:p-3 rounded-xl border transition-colors flex flex-col gap-1 relative overflow-hidden shadow-lg h-full",
            isCurrent 
                ? (isBlue ? 'border-blue-400 ring-1 sm:ring-2 ring-blue-300/50 bg-gradient-to-b from-blue-50 to-white' : 'border-red-400 ring-1 sm:ring-2 ring-red-300/50 bg-gradient-to-b from-red-50 to-white')
                : "border-slate-700 bg-slate-800/40 grayscale-[0.2]",
            player.isBankrupt && "grayscale bg-slate-900"
        )}
    >
      {/* Active Indicator Stripe */}
      {isCurrent && (
          <div className={clsx(
              "absolute top-0 inset-x-0 h-1",
              isBlue ? "bg-blue-500" : "bg-red-500"
          )}></div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <div className={clsx(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br", 
            isBlue ? 'from-blue-500 to-blue-700' : 'from-red-500 to-red-700'
        )}>
            {player.id === 'p0' ? <User className="w-4 h-4 sm:w-6 sm:h-6" /> : <Bot className="w-4 h-4 sm:w-6 sm:h-6" />}
        </div>
        <div className="flex flex-col leading-none min-w-0 flex-1">
            <span className={clsx("font-black text-sm sm:text-base truncate", isBlue ? "text-blue-900" : "text-red-900")}>
                {player.name}
            </span>
            <div className="flex justify-between items-center mt-0.5">
                <span className="text-[10px] text-slate-400 font-mono">#{player.id}</span>
                {isCurrent && <span className={clsx("text-[8px] px-1.5 rounded-full font-bold text-white", isBlue ? "bg-blue-500" : "bg-red-500")}>{t.playerInfo.yourTurn}</span>}
            </div>
        </div>
      </div>
      
      <div className="mt-1 py-1 sm:py-2 px-2 bg-slate-900 rounded-lg border border-slate-700 shadow-inner text-center">
        <div className="text-lg sm:text-2xl font-mono font-black text-green-400 tracking-tighter drop-shadow-sm">
            ${player.money.toLocaleString()}
        </div>
      </div>
      
      <div className="flex gap-1 flex-wrap content-start min-h-[1.5rem]">
          {Object.values(player.portfolio).reduce((a, b) => a + b, 0) > 0 && (
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" /> {Object.values(player.portfolio).reduce((a, b) => a + b, 0)}
            </span>
          )}
          {player.lotteryTickets.length > 0 && (
            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <Ticket className="w-3 h-3 text-pink-500" /> {player.lotteryTickets.length}
            </span>
          )}
          {player.jailTurns > 0 && (
            <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 animate-pulse">
                <Lock className="w-3 h-3" /> {t.playerInfo.jail} {player.jailTurns}
            </span>
          )}
          {player.restTurns > 0 && (
            <span className="bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <Coffee className="w-3 h-3" /> {t.playerInfo.rest} {player.restTurns}
            </span>
          )}
      </div>

      {player.isBankrupt && (
        <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
            <div className="border-4 border-red-600 text-red-600 font-black text-2xl px-4 py-1 rounded-lg -rotate-12 opacity-90 mix-blend-multiply shadow-xl bg-red-50">
                {t.playerInfo.bankrupt}
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlayerInfo;
