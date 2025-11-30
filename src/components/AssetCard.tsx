import React from 'react';
import { Home, DollarSign, Ban, RefreshCcw } from 'lucide-react';
import type { Tile } from '../game/types';
import { clsx } from 'clsx';

interface AssetCardProps {
  tile: Tile;
  onSell?: (id: number) => void;
  onMortgage?: (id: number) => void;
  onRedeem?: (id: number) => void;
  compact?: boolean; // For Top Assets Widget
  crisisMode?: boolean; // 危机模式：禁用赎回，强调变现
}

const AssetCard: React.FC<AssetCardProps> = ({ tile, onSell, onMortgage, onRedeem, compact = false, crisisMode = false }) => {
  const level = tile.level || 0;
  const base = tile.baseRent || 0;
  const currentRent = base * Math.pow(3, level);
  const price = tile.price || 0;
  const mortgageValue = Math.floor(price * 0.5);
  // 卖出价格 = (地价 + 等级 * 地价) * 80%，与 logic.ts 中的 sellProperty 保持一致
  const totalValue = price * (1 + level);
  const sellValue = Math.floor(totalValue * 0.8);

  // Color mapping
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    indigo: 'bg-indigo-600',
    rose: 'bg-rose-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
    gray: 'bg-slate-500',
  };
  const headerColor = bgColors[tile.color || 'gray'] || 'bg-slate-500';

  if (compact) {
      return (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md hover:shadow-lg transition-shadow flex flex-col relative">
            <div className={clsx("h-3 w-full", headerColor)}></div>
            <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <div className="font-black text-slate-100 text-sm">{tile.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Home size={10}/> Lv.{level}
                    </div>
                </div>
                <div className="mt-2 text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">当前租金</div>
                    <div className="text-xl font-black text-green-400 leading-none">${currentRent}</div>
                </div>
            </div>
            {tile.isMortgaged && (
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                    <div className="border-2 border-red-500 text-red-500 font-black px-2 py-1 transform -rotate-12 text-sm">
                        已抵押
                    </div>
                </div>
            )}
        </div>
      );
  }

  // Full Card
  return (
    <div className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-200 max-w-xs w-full flex flex-col relative transform transition-transform hover:scale-[1.02]">
       {/* Header */}
       <div className={clsx("py-3 px-4 text-white font-black text-xl text-center shadow-sm uppercase tracking-wide", headerColor)}>
           {tile.name}
       </div>

       <div className="p-5 flex-1 flex flex-col items-center relative">
           <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Current Rent</div>
           <div className={clsx("text-5xl font-black mb-4 tracking-tighter", tile.isMortgaged ? "text-slate-300 line-through decoration-red-500" : "text-green-600")}>
               ${currentRent}
           </div>

           <div className="w-full space-y-1 mb-6">
               <div className="flex justify-between text-sm font-bold border-b border-slate-100 pb-1">
                   <span>当前等级</span>
                   <div className="flex gap-0.5 text-slate-800">
                        {Array.from({length: 5}).map((_, i) => (
                            i < level ? <Home key={i} size={14} fill="currentColor" /> : <div key={i} className="w-3.5 h-3.5 rounded-sm bg-slate-100"></div>
                        ))}
                   </div>
               </div>
               <div className="flex justify-between text-xs text-slate-500 pt-1">
                   <span>房产估值</span>
                   <span>${price + (level * price)}</span>
               </div>
           </div>

           {/* Actions */}
           <div className="grid grid-cols-2 gap-3 w-full mt-auto">
               {!tile.isMortgaged ? (
                   <button 
                     onClick={() => onMortgage && onMortgage(tile.id)}
                     className={clsx(
                       "flex flex-col items-center justify-center py-3 rounded-lg font-bold transition-colors",
                       crisisMode 
                         ? "bg-orange-500 text-white hover:bg-orange-400 animate-pulse" 
                         : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                     )}
                   >
                       <span className="flex items-center gap-1 text-sm"><Ban size={14}/> 抵押</span>
                       <span className="text-xs opacity-75">+${mortgageValue}</span>
                   </button>
               ) : !crisisMode ? (
                    <button 
                     onClick={() => onRedeem && onRedeem(tile.id)}
                     className="col-span-2 flex flex-col items-center justify-center bg-blue-100 text-blue-700 py-3 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                   >
                       <span className="flex items-center gap-1 text-sm"><RefreshCcw size={14}/> 赎回地产</span>
                       <span className="text-xs opacity-75">-${Math.floor(price * 0.6)}</span>
                   </button>
               ) : (
                   <div className="col-span-2 text-center text-slate-400 text-xs py-3">
                       已抵押，无法再次变现
                   </div>
               )}

               {!tile.isMortgaged && (
                   <button 
                     onClick={() => onSell && onSell(tile.id)}
                     className={clsx(
                       "flex flex-col items-center justify-center py-3 rounded-lg font-bold transition-colors",
                       crisisMode 
                         ? "bg-red-500 text-white hover:bg-red-400 animate-pulse" 
                         : "bg-red-100 text-red-700 hover:bg-red-200"
                     )}
                   >
                       <span className="flex items-center gap-1 text-sm"><DollarSign size={14}/> 出售</span>
                       <span className="text-xs opacity-75">+${sellValue}</span>
                   </button>
               )}
           </div>
       </div>
       
       {tile.isMortgaged && (
            <div className="absolute top-20 left-0 right-0 flex justify-center pointer-events-none">
                <div className="border-4 border-red-500/80 text-red-500/80 font-black text-4xl px-4 py-2 transform -rotate-12 uppercase rounded-xl bg-white/50 backdrop-blur-sm">
                    MORTGAGED
                </div>
            </div>
       )}
    </div>
  );
};

export default AssetCard;
