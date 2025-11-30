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
    <div className="flex flex-col gap-3 items-center w-full max-w-xs mx-auto">
      {/* Top Action Bar */}
      <div className="flex gap-2 w-full justify-center mb-1">
          <button onClick={onOpenStock} className="flex items-center gap-1 bg-blue-900/50 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-800 border border-blue-700">
              <TrendingUp size={14} /> 股市
          </button>
          <button onClick={onOpenLottery} className="flex items-center gap-1 bg-pink-900/50 text-pink-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-pink-800 border border-pink-700">
              <Ticket size={14} /> 彩票
          </button>
          <button onClick={onReset} className="flex items-center gap-1 bg-red-900/30 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-900/50 border border-red-900/50 ml-auto">
              <RotateCcw size={14} /> 重开
          </button>
      </div>

      <div className="flex gap-4 items-center mb-2 justify-center h-20 w-full">
        <motion.button 
          whileHover={canRoll ? { scale: 1.05 } : {}}
          whileTap={canRoll ? { scale: 0.95 } : {}}
          onClick={onRoll} 
          disabled={!canRoll}
          className={clsx(
              "flex-1 h-16 rounded-2xl font-black text-white shadow-xl border-b-4 transition-all flex items-center justify-center gap-2 text-lg",
              canRoll 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-800 hover:brightness-110 hover:border-b-0 hover:translate-y-1' 
                : 'bg-slate-700 border-slate-800 cursor-not-allowed opacity-50'
          )}
        >
          {canRoll ? <><Dice5 /> 掷骰子</> : <span className="text-sm animate-pulse">等待对手...</span>}
        </motion.button>
        
        {diceValue && (
          <div className="flex gap-2 flex-shrink-0">
            {diceValue.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ rotate: 180, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-14 h-14 bg-white rounded-xl border-4 border-slate-200 shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600"
              >
                {value}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-10 h-14 bg-indigo-100 rounded-lg flex items-center justify-center text-lg font-bold text-indigo-800"
            >
              ={diceValue[0] + diceValue[1]}
            </motion.div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 w-full">
        {canBuy && (
          <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onBuy} className="col-span-2 py-3 bg-green-500 border-b-4 border-green-700 text-white rounded-xl font-bold hover:bg-green-400 active:border-b-0 active:translate-y-1 transition-all shadow-md">
            💰 购买地产
          </motion.button>
        )}
        {canUpgrade && (
            <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onUpgrade} className="col-span-2 py-3 bg-blue-500 border-b-4 border-blue-700 text-white rounded-xl font-bold hover:bg-blue-400 active:border-b-0 active:translate-y-1 transition-all shadow-md">
              🔨 升级建筑
            </motion.button>
        )}
        {canPass && (
          <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onClick={onPass} className="col-span-2 py-2 bg-slate-400 border-b-4 border-slate-600 text-white rounded-xl font-bold hover:bg-slate-300 active:border-b-0 active:translate-y-1 transition-all shadow-sm text-sm">
            ⏭️ 跳过回合
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default Controls;
