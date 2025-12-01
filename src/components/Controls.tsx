import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Dice5, TrendingUp, Ticket, RotateCcw } from 'lucide-react';
import { useTranslation } from '../i18n';

interface ControlsProps {
  onRoll: () => void;
  onBuy: () => void;
  onPass: () => void;
  onUpgrade: () => void;
  onOpenStock: () => void;
  onOpenLottery: () => void;
  onReset: () => void;
  onUseJailCard?: () => void;
  canRoll: boolean;
  canBuy: boolean;
  canUpgrade: boolean;
  canPass: boolean;
  canUseJailCard?: boolean;
  diceValue: number[] | null;
}

const Controls: React.FC<ControlsProps> = ({ 
  onRoll, onBuy, onPass, onUpgrade, 
  onOpenStock, onOpenLottery, onReset, onUseJailCard,
  canRoll, canBuy, canUpgrade, canPass, canUseJailCard,
  diceValue 
}) => {
  const t = useTranslation();

  return (
    <div className="flex flex-col gap-2 sm:gap-3 items-center w-full max-w-xs mx-auto p-1 sm:p-0">
      {/* Top Action Bar - Touch Optimized */}
      <div className="flex gap-2 sm:gap-2 w-full justify-center mb-1">
          <button onClick={onOpenStock} className="flex items-center justify-center gap-1 flex-1 bg-blue-900/60 text-blue-200 px-1 py-2 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-blue-800 border border-blue-700 active:bg-blue-700 transition-colors">
              <TrendingUp className="w-3.5 h-3.5" /> {t.controls.stock}
          </button>
          <button onClick={onOpenLottery} className="flex items-center justify-center gap-1 flex-1 bg-pink-900/60 text-pink-200 px-1 py-2 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-pink-800 border border-pink-700 active:bg-pink-700 transition-colors">
              <Ticket className="w-3.5 h-3.5" /> {t.controls.lottery}
          </button>
          <button onClick={onReset} className="flex items-center justify-center gap-1 w-10 sm:w-auto bg-red-900/40 text-red-400 px-1 py-2 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-900/60 border border-red-900/60 active:bg-red-900/80 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t.controls.restart}</span>
          </button>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center mb-1 sm:mb-2 justify-center h-14 sm:h-20 w-full">
        <motion.button 
          whileHover={canRoll ? { scale: 1.02 } : {}}
          whileTap={canRoll ? { scale: 0.95 } : {}}
          onClick={onRoll} 
          disabled={!canRoll}
          className={clsx(
              "flex-1 h-12 sm:h-16 rounded-xl sm:rounded-2xl font-black text-white shadow-[0_4px_0_rgb(0,0,0,0.3)] border-b-0 transition-all flex items-center justify-center gap-2 text-sm sm:text-lg active:shadow-none active:translate-y-1",
              canRoll 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:brightness-110' 
                : 'bg-slate-800/50 text-slate-500 cursor-not-allowed shadow-none border border-slate-700'
          )}
        >
          {canRoll ? <><Dice5 className="w-5 h-5 sm:w-6 sm:h-6" /> {t.controls.rollDice}</> : <span className="text-xs sm:text-sm animate-pulse font-mono">{t.controls.waiting}</span>}
        </motion.button>
        
        {diceValue && (
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            {diceValue.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ rotate: 180, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 rounded-lg sm:rounded-xl border-2 sm:border-4 border-slate-300 shadow-lg flex items-center justify-center text-xl sm:text-3xl font-black text-indigo-600"
              >
                {value}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-8 h-10 sm:w-10 sm:h-14 bg-indigo-500/20 border border-indigo-500/30 rounded-lg sm:rounded-lg flex items-center justify-center text-sm sm:text-lg font-bold text-indigo-300"
            >
              ={diceValue[0] + diceValue[1]}
            </motion.div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        {canUseJailCard && onUseJailCard && (
          <motion.button 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            onClick={onUseJailCard} 
            className="col-span-2 py-2.5 sm:py-3 bg-amber-500 shadow-[0_3px_0_rgb(180,83,9)] text-white rounded-xl sm:rounded-xl font-bold hover:bg-amber-400 active:shadow-none active:translate-y-[3px] transition-all text-sm sm:text-base flex items-center justify-center gap-2"
          >
            {t.playerInfo.useJailCard}
          </motion.button>
        )}
        {canBuy && (
          <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onBuy} className="col-span-2 py-2.5 sm:py-3 bg-green-500 shadow-[0_3px_0_rgb(21,128,61)] text-white rounded-xl sm:rounded-xl font-bold hover:bg-green-400 active:shadow-none active:translate-y-[3px] transition-all text-sm sm:text-base flex items-center justify-center gap-2">
            {t.controls.buyProperty}
          </motion.button>
        )}
        {canUpgrade && (
            <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onUpgrade} className="col-span-2 py-2.5 sm:py-3 bg-blue-500 shadow-[0_3px_0_rgb(29,78,216)] text-white rounded-xl sm:rounded-xl font-bold hover:bg-blue-400 active:shadow-none active:translate-y-[3px] transition-all text-sm sm:text-base flex items-center justify-center gap-2">
              {t.controls.upgradeBuilding}
            </motion.button>
        )}
        {canPass && (
          <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onPass} className="col-span-2 py-2 sm:py-2 bg-slate-600 shadow-[0_3px_0_rgb(51,65,85)] text-slate-200 rounded-xl sm:rounded-xl font-bold hover:bg-slate-500 active:shadow-none active:translate-y-[3px] transition-all text-xs sm:text-sm flex items-center justify-center gap-2">
            {t.controls.skip}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Controls;
