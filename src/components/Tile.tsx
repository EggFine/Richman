import React from 'react';
import type { Tile as TileType, Player } from '../game/types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Home, Building2, Sparkles, Rocket, Lock, Ticket, Coffee, Flag, Ban, User, Bot } from 'lucide-react';
import { useTranslation } from '../i18n';

interface TileProps {
  tile: TileType;
  players: Player[];
}

const Tile: React.FC<TileProps> = ({ tile, players }) => {
  const t = useTranslation();
  const isProperty = tile.type === 'PROPERTY';
  
  const colorMap: Record<string, string> = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-700',
    green: 'bg-gradient-to-br from-green-500 to-green-700',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    rose: 'bg-gradient-to-br from-rose-500 to-rose-700',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-700',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-700',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-700',
    gray: 'bg-gradient-to-br from-slate-400 to-slate-600',
  };
  
  const headerColor = colorMap[tile.color || 'gray'] || 'bg-gradient-to-br from-slate-400 to-slate-600';

  const iconClass = "w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5";

  const getIcon = () => {
      switch(tile.type) {
          case 'START': return <Flag className={iconClass} />;
          case 'JAIL': return <Lock className={iconClass} />;
          case 'TO_JAIL': return <Ban className={iconClass} />;
          case 'FATE': return <Sparkles className={iconClass} />;
          case 'CHANCE': return <Rocket className={iconClass} />;
          case 'LOTTERY': return <Ticket className={iconClass} />;
          case 'CORNER': return <Coffee className={iconClass} />;
          default: return null;
      }
  };

  // Special styling for non-property tiles
  const getTileBackground = () => {
    if (isProperty) return "bg-white";
    switch (tile.type) {
        case 'START': return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200";
        case 'JAIL': return "bg-slate-100 border-slate-300 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px]";
        case 'TO_JAIL': return "bg-slate-50 border-slate-200";
        case 'FATE': return "bg-gradient-to-br from-fuchsia-50 to-purple-100 border-purple-200";
        case 'CHANCE': return "bg-gradient-to-br from-sky-50 to-blue-100 border-blue-200";
        case 'LOTTERY': return "bg-gradient-to-br from-pink-50 to-rose-100 border-rose-200";
        case 'CORNER': return "bg-slate-50 border-slate-200";
        default: return "bg-white";
    }
  };

  return (
    <div className={twMerge(
        "relative flex flex-col border-[1px] sm:border-2 border-slate-800/80 h-10 w-10 sm:h-16 sm:w-16 md:h-20 md:w-20 xl:h-28 xl:w-28 shadow-[0_2px_4px_rgba(0,0,0,0.1)] select-none overflow-hidden transition-all duration-200 hover:z-20 hover:scale-110 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] rounded sm:rounded-xl",
        getTileBackground()
    )}>
      {/* Header Color Strip */}
      <div className={clsx(headerColor, "h-2.5 sm:h-5 xl:h-7 w-full flex items-center justify-center font-black border-b-[0.5px] sm:border-b-2 border-slate-800/20 text-white shadow-sm")}>
        {tile.level && tile.level > 0 ? (
            <span className="drop-shadow-md flex gap-0.5 items-center">
                {Array.from({length: Math.min(tile.level, 4)}).map((_, i) => <Home key={i} className="w-2 h-2 sm:w-3 sm:h-3" fill="currentColor" />)}
                {tile.level === 5 && <Building2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="currentColor" />}
            </span>
        ) : (
            <span className="opacity-90 drop-shadow-sm">{getIcon()}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-0.5 sm:p-1 text-center leading-tight relative">
        <div className="font-black text-slate-800 text-[6px] sm:text-[10px] xl:text-sm mb-0 sm:mb-0.5 tracking-tight leading-none sm:leading-tight truncate w-full px-0.5">{tile.name}</div>
        {isProperty ? (
          <div className="flex flex-col items-center">
            <span className="text-slate-700 font-mono font-black text-[5px] sm:text-[8px] xl:text-xs bg-slate-100 px-0.5 sm:px-1 rounded leading-none">${tile.price}</span>
            {tile.baseRent && tile.level !== undefined && tile.ownerId && (
                <span className="hidden sm:block text-[8px] sm:text-[10px] text-slate-500 mt-0.5 font-semibold">
                    {t.assets.rent}:${tile.baseRent * Math.pow(3, tile.level)}
                </span>
            )}
          </div>
        ) : (
             tile.description && <span className="hidden sm:block text-[8px] sm:text-[10px] font-bold text-slate-500 leading-3 px-2">{tile.description}</span>
        )}
        
        {/* Owner Marker Overlay */}
        {tile.ownerId && (
            <div className={clsx(
                "absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply",
                tile.ownerId.endsWith('0') ? 'bg-blue-500' : 'bg-red-500'
            )}></div>
        )}
         {tile.ownerId && (
            <div className={clsx(
                "absolute bottom-0 w-full h-0.5 sm:h-1",
                tile.ownerId.endsWith('0') ? 'bg-blue-600' : 'bg-red-600'
            )}></div>
        )}
      </div>

      {/* Mortgage Overlay */}
      {tile.isMortgaged && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-grayscale">
            <div className={clsx(
                "border-2 px-1 sm:px-2 py-0.5 rounded text-[8px] sm:text-xs font-bold transform -rotate-12 shadow-xl backdrop-blur-sm flex flex-col items-center leading-none gap-0.5",
                tile.ownerId?.endsWith('0') 
                    ? "border-blue-300 bg-blue-900/90 text-blue-50" 
                    : "border-red-300 bg-red-900/90 text-red-50"
            )}>
                <span>{t.assets.mortgage}</span>
                <span className="text-[6px] sm:text-[8px] opacity-90 font-medium">
                    {tile.ownerId?.endsWith('0') ? t.common.me : t.common.ai}
                </span>
            </div>
        </div>
      )}

      {/* Players - Improved Visibility */}
      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex flex-col-reverse items-end gap-0.5 sm:gap-1 z-30 pointer-events-none p-1 sm:p-2">
        {players.map(p => (
          <motion.div 
            layoutId={`player-${p.id}`}
            key={p.id} 
            className={clsx(
                "w-3 h-3 sm:w-6 sm:h-6 xl:w-8 xl:h-8 rounded-full border-[1px] sm:border-2 border-white shadow-lg flex items-center justify-center text-white relative",
                p.color === 'blue' ? 'bg-blue-600 ring-1 sm:ring-2 ring-blue-400' : 'bg-red-600 ring-1 sm:ring-2 ring-red-400'
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
             {p.id === 'p0' ? <User className="w-2 h-2 sm:w-4 sm:h-4" /> : <Bot className="w-2 h-2 sm:w-4 sm:h-4" />}
             <div className="hidden sm:block absolute -bottom-1 bg-black/60 text-[8px] px-1 rounded text-white font-bold">
                 {p.id === 'p0' ? t.common.me : t.common.ai}
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tile;
