import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, X } from 'lucide-react';
import type { Player } from '../game/types';
import { clsx } from 'clsx';
import { useTranslation } from '../i18n';

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
  const t = useTranslation();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-2xl max-w-md w-full border border-pink-500/30 relative overflow-hidden"
      >
        {/* Background Decor */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-2xl font-black flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 drop-shadow-sm">
            <Ticket className="text-pink-500" /> {t.lottery.title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
        </div>

        {/* Jackpot Display */}
        <div className="relative bg-gradient-to-b from-pink-900 to-purple-900 p-6 rounded-2xl mb-6 text-center shadow-inner border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30"></div>
            <div className="relative z-10">
                <div className="text-[10px] font-bold text-pink-200 uppercase tracking-[0.3em] mb-2">{t.lottery.currentJackpot}</div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] filter tracking-tighter">
                    ${jackpot.toLocaleString()}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-mono text-pink-200">{t.lottery.drawIn} <span className="text-white font-bold">{daysUntilDraw}</span> {t.common.days}</span>
                </div>
            </div>
        </div>

        {/* Number Selection */}
        <div className="mb-6 relative z-10">
          <div className="flex justify-between items-end mb-3">
              <div className="text-sm font-bold text-slate-400">{t.lottery.pickNumbers}</div>
              <div className="text-xs text-pink-400 font-mono">{selectedNumbers.length}/3 {t.lottery.selected}</div>
          </div>
          
          <div className="grid grid-cols-5 gap-3 place-items-center">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleNumber(num)}
                  className={clsx(
                      "w-12 h-12 rounded-full font-black text-lg shadow-lg flex items-center justify-center transition-all relative",
                      isSelected 
                        ? "text-white shadow-pink-500/50 ring-2 ring-pink-300 ring-offset-2 ring-offset-slate-900" 
                        : "text-slate-400 hover:text-white shadow-black/50",
                  )}
                  style={{
                      background: isSelected 
                        ? 'radial-gradient(circle at 30% 30%, #f472b6, #db2777)' 
                        : 'radial-gradient(circle at 30% 30%, #475569, #1e293b)'
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute top-2 left-2 w-4 h-2 bg-white/30 rounded-full blur-[1px] transform -rotate-45"></div>
                  <span className="drop-shadow-md relative z-10">{num}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* My Tickets - Paper Style */}
        <div className="mb-6 relative z-10">
          <div className="text-sm font-bold text-slate-400 mb-3">{t.lottery.myTickets}</div>
          <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {player.lotteryTickets.length === 0 && (
              <div className="text-slate-600 text-xs text-center py-4 border-2 border-dashed border-slate-800 rounded-xl">
                  {t.lottery.noTickets}
              </div>
            )}
            {player.lotteryTickets.map((ticket, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-100 text-slate-900 p-2.5 rounded-lg shadow-md relative overflow-hidden group">
                {/* Ticket Holes/Serration visual trick */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rounded-full"></div>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rounded-full"></div>
                
                <div className="ml-3 flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.lottery.ticketNum.replace('{num}', String(i + 1))}</span>
                    <div className="text-[10px] text-slate-400">{t.lottery.cost}: ${ticket.cost}</div>
                </div>
                
                <div className="flex gap-1.5 mr-3">
                  {ticket.numbers.map((num, j) => (
                    <div key={j} className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 text-white text-xs font-bold flex items-center justify-center shadow-sm border border-pink-400">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buy Button */}
        <button 
          onClick={handleBuy}
          disabled={!canBuy}
          className={`
            w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden group z-10
            ${canBuy 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-orange-500/30' 
              : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }
          `}
        >
           {/* Shine animation */}
          {canBuy && <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>}
          
          {canBuy ? (
            <>
              <span className="relative z-10 flex items-center gap-2">
                  {t.lottery.buyTicket} <span className="bg-black/20 px-2 rounded text-sm font-mono text-yellow-100">-${LOTTERY_PRICE}</span>
              </span>
            </>
          ) : selectedNumbers.length < 3 ? (
            t.lottery.pickMore.replace('{count}', String(3 - selectedNumbers.length))
          ) : (
            t.lottery.notEnoughCash
          )}
        </button>

      </motion.div>
    </div>
  );
};

export default LotteryModal;
