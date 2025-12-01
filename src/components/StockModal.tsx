import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import type { Player, Company } from '../game/types';
import { clsx } from 'clsx';
import { useTranslation } from '../i18n';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  player: Player;
  onBuy: (companyId: string, amount: number) => void;
  onSell: (companyId: string, amount: number) => void;
}

const StockModal: React.FC<StockModalProps> = ({ isOpen, onClose, companies, player, onBuy, onSell }) => {
  const t = useTranslation();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [amount, setAmount] = useState(10);
  const [stepSize, setStepSize] = useState(10);

  // 关闭时重置状态
  const handleClose = () => {
    setSelectedCompanyId(null);
    setAmount(10);
    setStepSize(10);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  
  // Grid List View
  const renderList = () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 pb-20">
          {companies.map((comp, index) => {
              const trend = comp.price - comp.history[comp.history.length - 2];
              const isUp = trend >= 0;
              const shares = player.portfolio[comp.id] || 0;
              const chartData = comp.history.map((val, i) => ({ i, val }));
              
              return (
                  <motion.div 
                    key={comp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => { setSelectedCompanyId(comp.id); setAmount(10); setStepSize(10); }}
                    className="bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all border border-slate-700/50 hover:border-slate-500 group relative overflow-hidden"
                  >
                      {/* Background Glow */}
                      <div className={clsx("absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", comp.color.replace('text-', 'bg-'))}></div>

                      <div className="flex justify-between items-start mb-2 relative z-10">
                          <div className="flex items-center gap-3">
                              <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg", comp.color.replace('text-', 'bg-'), "text-white")}>
                                  {comp.name[0]}
                              </div>
                              <div>
                                  <div className="font-bold text-slate-200 text-sm sm:text-base">{comp.name}</div>
                                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold bg-slate-900/50 px-1.5 py-0.5 rounded inline-block">{comp.industry}</div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className={clsx("font-mono font-black text-base sm:text-lg", isUp ? "text-green-400" : "text-red-400")}>
                                  ${comp.price}
                              </div>
                              <div className={clsx("text-[10px] font-bold flex items-center justify-end gap-0.5", isUp ? "text-green-500" : "text-red-500")}>
                                  {isUp ? '▲' : '▼'} {Math.abs(trend).toFixed(2)}
                              </div>
                          </div>
                      </div>

                      {/* Mini Sparkline */}
                      <div className="h-12 w-full opacity-50 group-hover:opacity-80 transition-opacity relative z-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id={`grad-${comp.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={isUp ? "#4ade80" : "#f87171"} stopOpacity={0.4}/>
                                        <stop offset="100%" stopColor={isUp ? "#4ade80" : "#f87171"} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area 
                                    type="monotone" 
                                    dataKey="val" 
                                    stroke={isUp ? "#4ade80" : "#f87171"} 
                                    strokeWidth={2} 
                                    fill={`url(#grad-${comp.id})`} 
                                    isAnimationActive={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-2 flex justify-between items-end relative z-10">
                          <div className="text-[10px] text-slate-500 font-bold">
                             {t.stock.volatility}: {(comp.volatility * 100).toFixed(0)}%
                          </div>
                          {shares > 0 && (
                              <div className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                                  {t.stock.holding}: {shares}
                              </div>
                          )}
                      </div>
                  </motion.div>
              );
          })}
      </div>
  );

  // Detail View
  const renderDetail = () => {
      if (!selectedCompany) return null;
      const shares = player.portfolio[selectedCompany.id] || 0;
      const trend = selectedCompany.price - selectedCompany.history[selectedCompany.history.length - 2];
      const isUp = trend >= 0;
      const data = selectedCompany.history.map((val, i) => ({ day: i, price: val }));
      
      const totalCost = amount * selectedCompany.price;
      const canBuy = player.money >= totalCost;
      const canSell = shares >= amount;

      return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full relative"
          >
              <button 
                onClick={() => setSelectedCompanyId(null)} 
                className="absolute -top-12 left-0 text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-full transition-colors"
              >
                  ← {t.common.back.toUpperCase()}
              </button>

              <div className="bg-slate-800/80 p-4 rounded-2xl mb-4 border border-slate-700 shadow-inner relative overflow-hidden">
                   {/* Header */}
                  <div className="flex justify-between items-center mb-2 relative z-10">
                      <div>
                          <h3 className={clsx("text-2xl font-black", selectedCompany.color.replace('bg-', 'text-'))}>{selectedCompany.name}</h3>
                          <span className="text-slate-400 text-[10px] font-mono uppercase">{t.stock.code}: {selectedCompany.id.substring(0, 3).toUpperCase()}</span>
                      </div>
                      <div className="text-right">
                          <div className={clsx("text-3xl font-mono font-black tracking-tight", isUp ? 'text-green-400' : 'text-red-400')}>
                              ${selectedCompany.price}
                          </div>
                      </div>
                  </div>
                  
                  {/* Main Chart */}
                  <div className="h-40 w-full relative z-10 bg-slate-900/50 rounded-xl border border-slate-700/50 p-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorDetail" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isUp ? "#4ade80" : "#f87171"} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={isUp ? "#4ade80" : "#f87171"} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                                formatter={(value: number) => [`$${value}`, t.stock.price]}
                                labelFormatter={() => ''}
                                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke={isUp ? "#4ade80" : "#f87171"} 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorDetail)" 
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              {/* Trading Controls */}
              <div className="mt-auto bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                  <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="text-slate-400">{t.stock.holding}: <span className="text-white font-bold">{shares}</span></span>
                      <span className="text-slate-400">{t.stock.cash}: <span className="text-green-400 font-bold">${player.money.toLocaleString()}</span></span>
                  </div>

                  {/* 步长选择器 */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-[10px] text-slate-500 font-bold">{t.stock.stepSize}:</span>
                      {[10, 50, 100].map(step => (
                          <button
                              key={step}
                              onClick={() => setStepSize(step)}
                              className={clsx(
                                  "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                                  stepSize === step 
                                      ? "bg-blue-600 text-white shadow-lg" 
                                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                              )}
                          >
                              ±{step}
                          </button>
                      ))}
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 p-1 rounded-xl mb-4 border border-slate-700">
                        <button onClick={() => setAmount(Math.max(1, amount - stepSize))} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 font-bold active:scale-95 transition-transform">-</button>
                        <div className="flex flex-col items-center w-24">
                            <span className="font-mono font-black text-xl text-white">{amount}</span>
                            <span className="text-[8px] text-slate-500 font-bold uppercase">{t.common.shares}</span>
                        </div>
                        <button onClick={() => setAmount(amount + stepSize)} className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 font-bold active:scale-95 transition-transform">+</button>
                  </div>

                  {/* 快捷按钮 */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                      {[10, 50, 100, 200].map(qty => (
                          <button
                              key={qty}
                              onClick={() => setAmount(qty)}
                              className={clsx(
                                  "px-2 py-1 rounded text-[10px] font-bold transition-all",
                                  amount === qty 
                                      ? "bg-emerald-600 text-white" 
                                      : "bg-slate-800/50 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
                              )}
                          >
                              {qty}{t.common.shares}
                          </button>
                      ))}
                      <button
                          onClick={() => {
                              const maxAffordable = Math.floor(player.money / selectedCompany!.price);
                              setAmount(Math.max(1, maxAffordable));
                          }}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition-all"
                      >
                          MAX
                      </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => onBuy(selectedCompany.id, amount)}
                            disabled={!canBuy}
                            className="bg-green-600 py-3 rounded-xl font-bold hover:bg-green-500 disabled:opacity-20 disabled:cursor-not-allowed flex flex-col items-center shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all group"
                        >
                            <span className="text-sm group-hover:scale-105 transition-transform">{t.stock.buy}</span>
                            <span className="text-[10px] font-normal opacity-80 font-mono">-${totalCost.toLocaleString()}</span>
                        </button>
                        <button 
                            onClick={() => onSell(selectedCompany.id, amount)}
                            disabled={!canSell}
                            className="bg-red-600 py-3 rounded-xl font-bold hover:bg-red-500 disabled:opacity-20 disabled:cursor-not-allowed flex flex-col items-center shadow-[0_4px_0_rgb(185,28,28)] active:shadow-none active:translate-y-1 transition-all group"
                        >
                            <span className="text-sm group-hover:scale-105 transition-transform">{t.stock.sell}</span>
                            <span className="text-[10px] font-normal opacity-80 font-mono">+${totalCost.toLocaleString()}</span>
                        </button>
                  </div>
              </div>
          </motion.div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-slate-900/95 text-slate-100 p-4 sm:p-6 rounded-[2rem] shadow-2xl max-w-lg w-full border border-slate-700 flex flex-col h-[600px] sm:h-auto overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/50 z-20 bg-slate-900/50">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600/20 p-2 rounded-xl">
                    <Activity className="text-blue-500 w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{t.stock.title}</h2>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t.stock.subtitle}</div>
                </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"><X /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative z-10">
            <AnimatePresence mode="wait">
                {selectedCompanyId ? (
                    <motion.div key="detail" className="h-full" exit={{ opacity: 0, x: 20 }}>{renderDetail()}</motion.div>
                ) : (
                    <motion.div key="list" className="h-full" exit={{ opacity: 0, x: -20 }}>{renderList()}</motion.div>
                )}
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default StockModal;
