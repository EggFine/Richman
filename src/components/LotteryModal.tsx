import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, Check, Trash2 } from 'lucide-react';
import type { Player } from '../game/types';

interface LotteryModalProps {
  isOpen: boolean;
  onClose: () => void;
  jackpot: number;
  daysUntilDraw: number;
  player: Player;
  onBuy: (numbers: number[]) => void;
}

const LOTTERY_PRICE = 300;

const LotteryModal: React.FC<LotteryModalProps> = ({ isOpen, onClose, jackpot, daysUntilDraw, player, onBuy }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else if (selectedNumbers.length < 3) {
      setSelectedNumbers(prev => [...prev, num]);
    }
  };

  const handleBuy = () => {
    if (selectedNumbers.length === 3 && player.money >= LOTTERY_PRICE) {
      onBuy(selectedNumbers);
      setSelectedNumbers([]);
    }
  };

  const canBuy = selectedNumbers.length === 3 && player.money >= LOTTERY_PRICE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-pink-500/50"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-pink-400">
            <Ticket /> 大乐透彩票站
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full"><X /></button>
        </div>

        {/* 奖池显示 */}
        <div className="bg-gradient-to-r from-pink-900 to-purple-900 p-4 rounded-xl mb-4 text-center shadow-inner border border-white/10">
          <div className="text-xs text-pink-200 uppercase tracking-widest mb-1">当前奖池 Jackpot</div>
          <div className="text-3xl font-black text-yellow-400 drop-shadow-lg">
            ${jackpot.toLocaleString()}
          </div>
          <div className="text-xs text-pink-300 mt-2 bg-black/20 inline-block px-3 py-1 rounded-full">
            距离开奖还有 {daysUntilDraw} 天
          </div>
        </div>

        {/* 玩法说明 */}
        <div className="bg-slate-800/50 p-3 rounded-lg mb-4 text-xs">
          <div className="text-slate-400 mb-2 font-bold">🎯 玩法说明：选择 3 个号码</div>
          <div className="grid grid-cols-3 gap-1 text-slate-500">
            <div className="flex items-center gap-1"><span className="text-green-400">●</span> 中1个: 返还票价</div>
            <div className="flex items-center gap-1"><span className="text-yellow-400">●</span> 中2个: 5倍奖金</div>
            <div className="flex items-center gap-1"><span className="text-pink-400">●</span> 中3个: 瓜分奖池</div>
          </div>
        </div>

        {/* 号码选择 */}
        <div className="mb-4">
          <div className="text-sm text-slate-400 mb-2">选择号码 ({selectedNumbers.length}/3)</div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleNumber(num)}
                  className={`
                    w-12 h-12 rounded-full font-bold text-lg transition-all border-2
                    ${isSelected 
                      ? 'bg-pink-500 border-pink-300 text-white shadow-lg shadow-pink-500/50' 
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-pink-500/50'
                    }
                  `}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 已选号码预览 */}
        <AnimatePresence>
          {selectedNumbers.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-800 p-3 rounded-lg mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">已选:</span>
                <div className="flex gap-2">
                  {selectedNumbers.sort((a, b) => a - b).map(num => (
                    <span key={num} className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setSelectedNumbers([])}
                className="text-slate-500 hover:text-red-400 p-1"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 我的彩票 */}
        <div className="mb-4">
          <div className="text-sm text-slate-400 mb-2">我的彩票 ({player.lotteryTickets.length} 张)</div>
          <div className="max-h-24 overflow-y-auto space-y-2">
            {player.lotteryTickets.length === 0 && (
              <div className="text-slate-600 text-sm italic">暂无彩票, 选个好运号码吧!</div>
            )}
            {player.lotteryTickets.map((ticket, i) => (
              <div key={i} className="flex gap-2 items-center bg-slate-800/50 p-2 rounded-lg">
                <span className="text-xs text-slate-500">#{i + 1}</span>
                {ticket.numbers.map((num, j) => (
                  <span key={j} className="w-7 h-7 bg-pink-600/80 rounded-full flex items-center justify-center font-bold text-xs border border-white/20">
                    {num}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 购买按钮 */}
        <button 
          onClick={handleBuy}
          disabled={!canBuy}
          className={`
            w-full py-3 rounded-xl font-black text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
            ${canBuy 
              ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-400' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {canBuy ? (
            <>
              <Check size={20} /> 购买彩票 (${LOTTERY_PRICE})
            </>
          ) : selectedNumbers.length < 3 ? (
            `请选择 ${3 - selectedNumbers.length} 个号码`
          ) : (
            '余额不足'
          )}
        </button>

      </motion.div>
    </div>
  );
};

export default LotteryModal;
