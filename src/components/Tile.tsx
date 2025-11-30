import React from 'react';
import type { Tile as TileType, Player } from '../game/types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Home, Building2, Sparkles, Rocket, Lock, Ticket, Coffee, Flag, Ban, User, Bot } from 'lucide-react';

interface TileProps {
  tile: TileType;
  players: Player[];
}

const Tile: React.FC<TileProps> = ({ tile, players }) => {
  const isProperty = tile.type === 'PROPERTY';
  
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
    gray: 'bg-slate-500',
  };
  
  const headerColor = colorMap[tile.color || 'gray'] || 'bg-slate-500';

  const getIcon = () => {
      switch(tile.type) {
          case 'START': return <Flag size={20} />;
          case 'JAIL': return <Lock size={20} />;
          case 'TO_JAIL': return <Ban size={20} />;
          case 'FATE': return <Sparkles size={20} />;
          case 'CHANCE': return <Rocket size={20} />;
          case 'LOTTERY': return <Ticket size={20} />;
          case 'CORNER': return <Coffee size={20} />;
          default: return null;
      }
  };

  return (
    <div className={twMerge(
        "relative flex flex-col border-2 border-slate-800 h-24 w-24 xl:h-28 xl:w-28 bg-white shadow-md select-none overflow-hidden transition-all hover:z-20 hover:scale-110 hover:shadow-2xl rounded-lg",
        tile.type === 'CORNER' && "bg-slate-100",
        tile.type === 'JAIL' && "bg-slate-200",
        tile.type === 'START' && "bg-slate-50"
    )}>
      {/* Header Color Strip */}
      <div className={clsx(headerColor, "h-7 w-full flex items-center justify-center font-black border-b-2 border-slate-800/20 text-white shadow-sm")}>
        {tile.level && tile.level > 0 ? (
            <span className="drop-shadow-md flex gap-0.5 items-center">
                {Array.from({length: Math.min(tile.level, 4)}).map((_, i) => <Home key={i} size={12} fill="currentColor" />)}
                {tile.level === 5 && <Building2 size={14} fill="currentColor" />}
            </span>
        ) : (
            <span className="opacity-90 drop-shadow-sm">{getIcon()}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-1 text-center leading-tight relative">
        <div className="font-black text-slate-800 text-sm mb-0.5 tracking-tight">{tile.name}</div>
        {isProperty ? (
          <div className="flex flex-col items-center">
            <span className="text-slate-700 font-mono font-black text-xs bg-slate-100 px-1 rounded">${tile.price}</span>
            {tile.baseRent && tile.level !== undefined && tile.ownerId && (
                <span className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                    租:${tile.baseRent * Math.pow(3, tile.level)}
                </span>
            )}
          </div>
        ) : (
             tile.description && <span className="text-[10px] font-bold text-slate-500 leading-3 px-2">{tile.description}</span>
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
                "absolute bottom-0 w-full h-1",
                tile.ownerId.endsWith('0') ? 'bg-blue-600' : 'bg-red-600'
            )}></div>
        )}
      </div>


      {/* Players - Improved Visibility */}
      <div className="absolute -top-2 -right-2 flex flex-col-reverse items-end gap-1 z-30 pointer-events-none p-2">
        {players.map(p => (
          <motion.div 
            layoutId={`player-${p.id}`}
            key={p.id} 
            className={clsx(
                "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white relative",
                p.color === 'blue' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-red-600 ring-2 ring-red-400'
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
             {p.id === 'p0' ? <User size={16} /> : <Bot size={16} />}
             <div className="absolute -bottom-1 bg-black/60 text-[8px] px-1 rounded text-white font-bold">
                 {p.id === 'p0' ? '我' : 'AI'}
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tile;