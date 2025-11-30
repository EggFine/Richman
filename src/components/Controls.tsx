import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Dice5, TrendingUp, Ticket, RotateCcw } from 'lucide-react';

interface ControlsProps {
  onRoll: () => void;
  onBuy: () => void;
  onPass: () => void;
  onUpgrade: () => void;
  onOpenStock: () => void;
  onOpenLottery: () => void;
  onReset: () => void;
  canRoll: boolean;
  canBuy: boolean;
  canUpgrade: boolean;
  canPass: boolean;
  diceValue: number[] | null;
}

const Controls: React.FC<ControlsProps> = ({ 
  onRoll, onBuy, onPass, onUpgrade, 
  onOpenStock, onOpenLottery, onReset,
  canRoll, canBuy, canUpgrade, canPass, 
  diceValue 
}) => {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-3 items-center w-full max-w-xs mx-auto p-1 sm:p-0">
      {/* Top Action Bar */}
      <div className="flex gap-1 sm:gap-2 w-full justify-center mb-0.5 sm:mb-1">
          <button onClick={onOpenStock} className="flex items-center gap-0.5 sm:gap-1 bg-blue-900/50 text-blue-300 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded sm:rounded-lg text-[10px] sm:text-xs font-bold hover:bg-blue-800 border border-blue-700">
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 股市
          </button>
          <button onClick={onOpenLottery} className="flex items-center gap-0.5 sm:gap-1 bg-pink-900/50 text-pink-300 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded sm:rounded-lg text-[10px] sm:text-xs font-bold hover:bg-pink-800 border border-pink-700">
              <Ticket className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 彩票
          </button>
          <button onClick={onReset} className="flex items-center gap-0.5 sm:gap-1 bg-red-900/30 text-red-400 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded sm:rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-900/50 border border-red-900/50 ml-auto">
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">重开</span><span className="sm:hidden">重置</span>
          </button>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center mb-1 sm:mb-2 justify-center h-12 sm:h-20 w-full">
        <motion.button 
          whileHover={canRoll ? { scale: 1.05 } : {}}
          whileTap={canRoll ? { scale: 0.95 } : {}}
          onClick={onRoll} 
          disabled={!canRoll}
          className={clsx(
              "flex-1 h-10 sm:h-16 rounded-lg sm:rounded-2xl font-black text-white shadow-xl border-b-2 sm:border-b-4 transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-lg",
              canRoll 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-800 hover:brightness-110 hover:border-b-0 hover:translate-y-1' 
                : 'bg-slate-700 border-slate-800 cursor-not-allowed opacity-50'
          )}
        >
          {canRoll ? <><Dice5 className="w-4 h-4 sm:w-6 sm:h-6" /> 掷骰子</> : <span className="text-[10px] sm:text-sm animate-pulse">等待...</span>}
        </motion.button>
        
        {diceValue && (
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            {diceValue.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ rotate: 180, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-8 h-8 sm:w-14 sm:h-14 bg-white rounded-md sm:rounded-xl border-2 sm:border-4 border-slate-200 shadow-lg flex items-center justify-center text-lg sm:text-3xl font-bold text-indigo-600"
              >
                {value}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-6 h-8 sm:w-10 sm:h-14 bg-indigo-100 rounded sm:rounded-lg flex items-center justify-center text-xs sm:text-lg font-bold text-indigo-800"
            >
              ={diceValue[0] + diceValue[1]}
            </motion.div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1 sm:gap-2 w-full">
        {canBuy && (
          <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onBuy} className="col-span-2 py-1.5 sm:py-3 bg-green-500 border-b-2 sm:border-b-4 border-green-700 text-white rounded-lg sm:rounded-xl font-bold hover:bg-green-400 active:border-b-0 active:translate-y-1 transition-all shadow-md text-xs sm:text-base">
            💰 购买地产
          </motion.button>
        )}
        {canUpgrade && (
            <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onUpgrade} className="col-span-2 py-1.5 sm:py-3 bg-blue-500 border-b-2 sm:border-b-4 border-blue-700 text-white rounded-lg sm:rounded-xl font-bold hover:bg-blue-400 active:border-b-0 active:translate-y-1 transition-all shadow-md text-xs sm:text-base">
              🔨 升级建筑
            </motion.button>
        )}
        {canPass && (
          <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onPass} className="col-span-2 py-1 sm:py-2 bg-slate-400 border-b-2 sm:border-b-4 border-slate-600 text-white rounded-lg sm:rounded-xl font-bold hover:bg-slate-300 active:border-b-0 active:translate-y-1 transition-all shadow-sm text-[10px] sm:text-sm">
            ⏭️ 跳过回合
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Controls;
