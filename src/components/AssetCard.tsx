import React from 'react';
import { Home, DollarSign, Ban, RefreshCcw } from 'lucide-react';
import type { Tile } from '../game/types';
import { clsx } from 'clsx';
import { useTranslation } from '../i18n';

interface AssetCardProps {
  tile: Tile;
  onSell?: (id: number) => void;
  onMortgage?: (id: number) => void;
  onRedeem?: (id: number) => void;
  compact?: boolean;
  crisisMode?: boolean;
}

const AssetCard: React.FC<AssetCardProps> = ({ tile, onSell, onMortgage, onRedeem, compact = false, crisisMode = false }) => {
  const t = useTranslation();
  const level = tile.level || 0;
  const base = tile.baseRent || 0;
  const currentRent = base * Math.pow(3, level);
  const price = tile.price || 0;
  const mortgageValue = Math.floor(price * 0.5);
  const totalValue = price * (1 + level);
  const sellValue = Math.floor(totalValue * 0.8);

  // Color mapping with gradients
  const bgColors: Record<string, string> = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-700',
    green: 'bg-gradient-to-br from-green-500 to-green-700',
    indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    rose: 'bg-gradient-to-br from-rose-500 to-rose-700',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-700',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-700',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-700',
    gray: 'bg-gradient-to-br from-slate-500 to-slate-700',
  };
  const headerColor = bgColors[tile.color || 'gray'] || 'bg-gradient-to-br from-slate-500 to-slate-700';

  if (compact) {
      return (
        <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md hover:shadow-lg transition-shadow flex flex-col relative">
            <div className={clsx("h-3 w-full", headerColor)}></div>
            <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <div className="font-black text-slate-100 text-sm truncate">{tile.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <div className="flex gap-0.5">
                             {Array.from({length: Math.min(level, 5)}).map((_, i) => <Home key={i} size={8} fill="currentColor" className="text-yellow-500" />)}
                             {level === 0 && <span className="text-slate-600">{t.assets.noHouses}</span>}
                        </div>
                    </div>
                </div>
                <div className="mt-2 text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">{t.assets.rent}</div>
                    <div className="text-xl font-black text-green-400 leading-none">${currentRent}</div>
                </div>
            </div>
            {tile.isMortgaged && (
                <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="border-2 border-red-500 text-red-500 font-black px-2 py-1 transform -rotate-12 text-xs uppercase">
                        {t.assets.mortgaged}
                    </div>
                </div>
            )}
        </div>
      );
  }

  // Full Card
  return (
    <div className="bg-slate-100 text-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-200/50 max-w-xs w-full flex flex-col relative transform transition-all hover:scale-[1.02] hover:shadow-purple-500/20">
       {/* Header */}
       <div className={clsx("py-4 px-4 text-white font-black text-xl text-center shadow-lg uppercase tracking-wide relative z-10 flex flex-col items-center", headerColor)}>
           <span className="drop-shadow-md">{tile.name}</span>
           <div className="w-8 h-1 bg-white/30 rounded-full mt-2"></div>
       </div>

       <div className="p-5 flex-1 flex flex-col items-center relative bg-gradient-to-b from-white to-slate-50">
           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">{t.assets.currentRent}</div>
           <div className={clsx("text-5xl font-black mb-6 tracking-tighter drop-shadow-sm", tile.isMortgaged ? "text-slate-300 line-through decoration-red-500 decoration-4" : "text-green-600")}>
               ${currentRent}
           </div>

           <div className="w-full space-y-2 mb-6 bg-slate-100 p-3 rounded-xl border border-slate-200/50">
               <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 pb-2">
                   <span className="text-slate-500">{t.assets.level}</span>
                   <div className="flex gap-1 text-yellow-500 drop-shadow-sm">
                        {Array.from({length: 5}).map((_, i) => (
                            i < level 
                            ? <Home key={i} size={16} fill="currentColor" /> 
                            : <div key={i} className="w-4 h-4 rounded bg-slate-200/50 border border-slate-300/50"></div>
                        ))}
                   </div>
               </div>
               <div className="flex justify-between text-xs text-slate-500 pt-1">
                   <span className="font-bold">{t.assets.valuation}</span>
                   <span className="font-mono font-bold text-slate-700">${price + (level * price)}</span>
               </div>
           </div>

           {/* Actions */}
           <div className="grid grid-cols-2 gap-3 w-full mt-auto">
               {!tile.isMortgaged ? (
                   <button 
                     onClick={() => onMortgage && onMortgage(tile.id)}
                     className={clsx(
                       "flex flex-col items-center justify-center py-3 rounded-xl font-bold transition-all shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 border",
                       crisisMode 
                         ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-400 animate-pulse" 
                         : "bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                     )}
                   >
                       <span className="flex items-center gap-1 text-sm font-black uppercase"><Ban size={14}/> {t.assets.mortgage}</span>
                       <span className="text-[10px] font-mono opacity-75 bg-black/5 px-1 rounded mt-0.5">+${mortgageValue}</span>
                   </button>
               ) : !crisisMode ? (
                    <button 
                     onClick={() => onRedeem && onRedeem(tile.id)}
                     className="col-span-2 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:brightness-110 transition-all shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1"
                   >
                       <span className="flex items-center gap-1 text-sm font-black uppercase"><RefreshCcw size={14}/> {t.assets.redeem}</span>
                       <span className="text-[10px] font-mono opacity-90 bg-black/20 px-1 rounded mt-0.5">-${Math.floor(price * 0.6)}</span>
                   </button>
               ) : (
                   <div className="col-span-2 text-center text-slate-400 text-xs py-3 font-bold italic bg-slate-100 rounded-xl">
                       {t.assets.mortgaged}
                   </div>
               )}

               {!tile.isMortgaged && (
                   <button 
                     onClick={() => onSell && onSell(tile.id)}
                     className={clsx(
                       "flex flex-col items-center justify-center py-3 rounded-xl font-bold transition-all shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 border",
                       crisisMode 
                         ? "bg-red-500 text-white border-red-600 hover:bg-red-400 animate-pulse" 
                         : "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                     )}
                   >
                       <span className="flex items-center gap-1 text-sm font-black uppercase"><DollarSign size={14}/> {t.assets.sell}</span>
                       <span className="text-[10px] font-mono opacity-75 bg-black/5 px-1 rounded mt-0.5">+${sellValue}</span>
                   </button>
               )}
           </div>
       </div>
       
       {tile.isMortgaged && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                <div className="border-[6px] border-red-500/90 text-red-500/90 font-black text-3xl px-6 py-3 transform -rotate-12 uppercase rounded-xl bg-white/80 backdrop-blur-sm shadow-2xl tracking-widest">
                    {t.assets.mortgaged}
                </div>
            </div>
       )}
    </div>
  );
};

export default AssetCard;
