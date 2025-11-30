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
    <div className="relative inline-grid grid-cols-8 grid-rows-8 gap-1.5 bg-slate-900 p-4 rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 overflow-visible">
      {/* Board Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 rounded-[2rem] -z-10"></div>
      
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
                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                animate={{ opacity: 1, y: -50, scale: 1.2 }}
                                exit={{ opacity: 0, y: -80 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`absolute left-1/2 -translate-x-1/2 -top-6 font-black text-xl drop-shadow-md pointer-events-none whitespace-nowrap ${effect.value >= 0 ? 'text-green-400' : 'text-red-500'}`}
                                style={{ 
                                    zIndex: 60,
                                    textShadow: effect.value >= 0 
                                        ? '0 0 10px rgba(74, 222, 128, 0.8), 0 2px 4px rgba(0,0,0,0.5)' 
                                        : '0 0 10px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0,0,0,0.5)'
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
                                        <MoneyIcon size={26} />
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
      <div className="col-start-2 col-end-8 row-start-2 row-end-8 bg-slate-50/95 backdrop-blur-sm rounded-3xl m-2 shadow-inner flex flex-col overflow-hidden relative border border-slate-200">
         {children}
      </div>
    </div>
  );
};

export default GameBoard;