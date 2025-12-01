import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoneyIcon from './MoneyIcon';
import type { GameState } from '../game/types';
import Tile from './Tile';

interface GameBoardProps {
  gameState: GameState;
  children?: React.ReactNode;
}

const getGridStyle = (index: number): React.CSSProperties => {
  let row = 1;
  let col = 1;

  if (index >= 0 && index <= 7) {
    row = 8;
    col = 8 - index;
  } else if (index >= 8 && index <= 13) {
    col = 1;
    row = 8 - (index - 7);
  } else if (index >= 14 && index <= 21) {
    row = 1;
    col = 1 + (index - 14);
  } else if (index >= 22 && index <= 27) {
    col = 8;
    row = 1 + (index - 21);
  }

  return {
    gridRowStart: row,
    gridColumnStart: col,
  };
};

const GameBoard: React.FC<GameBoardProps> = ({ gameState, children }) => {
  return (
    <div className="relative inline-grid grid-cols-8 grid-rows-8 gap-0.5 sm:gap-1.5 md:gap-2 bg-slate-900 p-1 sm:p-4 md:p-6 rounded-xl sm:rounded-[3rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 sm:border-[12px] border-slate-800 overflow-visible ring-1 ring-white/10">
      {/* Board Background Decor - Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 rounded-xl sm:rounded-[2.5rem] -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      
      {gameState.tiles.map((tile, index) => {
         const activePlayer = gameState.players.find(p => p.position === index);
         const hasEffect = gameState.visualEffects.some(e => e.position === index);
         return (
            <motion.div 
                key={tile.id} 
                style={{
                    ...getGridStyle(index),
                    zIndex: hasEffect ? 100 : 10  // 有效果时提升层级
                }} 
                className="relative overflow-visible"
                animate={activePlayer ? { scale: 0.95, y: 2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <Tile 
                    tile={tile} 
                    players={gameState.players.filter(p => p.position === index)} 
                />
                
                {/* Floating Money Effects Layer attached to Tile position */}
                {/* 飘字效果 - 单独的 AnimatePresence */}
                <AnimatePresence>
                    {gameState.visualEffects
                        .filter(effect => effect.position === index && effect.type === 'FLOAT_TEXT')
                        .map(effect => (
                            <motion.div
                                key={`float-${effect.id}`}
                                initial={{ opacity: 0, y: 10, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, y: -60, scale: 1.5, rotate: 0 }}
                                exit={{ opacity: 0, y: -100, scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className={`absolute left-1/2 -translate-x-1/2 -top-4 sm:-top-8 font-black text-sm sm:text-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] pointer-events-none whitespace-nowrap ${effect.value >= 0 ? 'text-green-400' : 'text-red-500'}`}
                                style={{ 
                                    zIndex: 60,
                                    textShadow: '0 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' // Heavy outline
                                }}
                            >
                                {effect.text}
                            </motion.div>
                        ))
                    }
                </AnimatePresence>
                
                {/* 仙女散花钞票图标效果 - 单独的 AnimatePresence */}
                <AnimatePresence>
                    {gameState.visualEffects
                        .filter(effect => effect.position === index && effect.type === 'MONEY_SHOWER' && effect.particles)
                        .map(effect => (
                            <div key={`shower-${effect.id}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 55 }}>
                                {effect.particles!.map((particle) => (
                                    <motion.div
                                        key={particle.id}
                                        initial={{ 
                                            opacity: 0, 
                                            x: 0, 
                                            y: 0,
                                            rotate: 0,
                                            scale: 0
                                        }}
                                        animate={{ 
                                            opacity: [0, 1, 1, 0],
                                            x: particle.x,
                                            y: particle.y,
                                            rotate: particle.rotation,
                                            scale: particle.scale * 1.4
                                        }}
                                        transition={{ 
                                            duration: 1.8,
                                            delay: particle.delay,
                                            ease: "easeOut"
                                        }}
                                        className={`absolute ${effect.value >= 0 ? 'text-green-400' : 'text-red-500'}`}
                                        style={{ 
                                            filter: effect.value >= 0 
                                                ? 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.7))' 
                                                : 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.7))'
                                        }}
                                    >
                                        <MoneyIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </motion.div>
                                ))}
                            </div>
                        ))
                    }
                </AnimatePresence>
            </motion.div>
         )
      })}
      
      {/* Center Area */}
      <div className="col-start-2 col-end-8 row-start-2 row-end-8 bg-slate-900/30 backdrop-blur-md rounded-lg sm:rounded-3xl m-1 sm:m-3 shadow-inner flex flex-col overflow-hidden relative border border-white/10">
         {children}
      </div>
    </div>
  );
};

export default GameBoard;