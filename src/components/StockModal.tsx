import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, X, ChevronRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { Player, Company } from '../game/types';
import { clsx } from 'clsx';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  player: Player;
  onBuy: (companyId: string, amount: number) => void;
  onSell: (companyId: string, amount: number) => void;
}

const StockModal: React.FC<StockModalProps> = ({ isOpen, onClose, companies, player, onBuy, onSell }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [amount, setAmount] = useState(10);

  if (!isOpen) return null;

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  
  const renderList = () => (
      <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
          {companies.map(comp => {
              const trend = comp.price - comp.history[comp.history.length - 2];
              const isUp = trend >= 0;
              const shares = player.portfolio[comp.id] || 0;
              
              return (
                  <div 
                    key={comp.id}
                    onClick={() => { setSelectedCompanyId(comp.id); setAmount(10); }}
                    className="bg-slate-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-500"
                  >
                      <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-900 font-bold text-lg ${comp.color}`}>
                              {comp.name[0]}
                          </div>
                          <div>
                              <div className="font-bold text-slate-200">{comp.name}</div>
                              <div className="text-xs text-slate-400">{comp.industry}</div>
                          </div>
                      </div>
                      
                      <div className="text-right flex items-center gap-4">
                          <div>
                              <div className={clsx("font-mono font-bold text-lg", isUp ? "text-green-400" : "text-red-400")}>
                                  ${comp.price}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                  {isUp ? '▲' : '▼'} {Math.abs(trend)}
                              </div>
                          </div>
                          {shares > 0 && (
                              <div className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                                  {shares}股
                              </div>
                          )}
                          <ChevronRight size={16} className="text-slate-600" />
                      </div>
                  </div>
              );
          })}
      </div>
  );

  const renderDetail = () => {
      if (!selectedCompany) return null;
      const shares = player.portfolio[selectedCompany.id] || 0;
      const trend = selectedCompany.price - selectedCompany.history[selectedCompany.history.length - 2];
      const isUp = trend >= 0;

      const data = selectedCompany.history.map((val, i) => ({ day: i, price: val }));

      return (
          <div className="flex flex-col h-full">
              <button onClick={() => setSelectedCompanyId(null)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-4 text-sm font-bold">
                  ← 返回市场列表
              </button>

              <div className="bg-slate-800 p-6 rounded-2xl mb-6">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h3 className={`text-2xl font-bold ${selectedCompany.color}`}>{selectedCompany.name}</h3>
                          <span className="text-slate-400 text-xs bg-slate-900 px-2 py-1 rounded-full mt-1 inline-block">{selectedCompany.industry}</span>
                      </div>
                      <div className="text-right">
                          <div className={`text-4xl font-mono font-black ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                              ${selectedCompany.price}
                          </div>
                           <div className="text-sm font-bold text-slate-500 mt-1">
                              波动率: {(selectedCompany.volatility * 100).toFixed(0)}%
                          </div>
                      </div>
                  </div>
                  
                  {/* Recharts Graph */}
                  <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isUp ? "#4ade80" : "#f87171"} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={isUp ? "#4ade80" : "#f87171"} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="day" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                                formatter={(value: number) => [`$${value}`, '股价']}
                                labelFormatter={(label) => `第 ${label + 1} 天`}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="price" 
                                stroke={isUp ? "#4ade80" : "#f87171"} 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorPrice)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between mb-4">
                   <div className="text-slate-400 text-sm">当前持仓</div>
                   <div className="font-mono font-bold text-xl text-blue-300">{shares} 股</div>
              </div>

              <div className="mt-auto">
                  <div className="flex items-center justify-between bg-slate-800 p-2 rounded-xl mb-4 border border-slate-700">
                        <button onClick={() => setAmount(Math.max(10, amount - 10))} className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 font-bold text-xl text-slate-300">-</button>
                        <span className="font-mono font-bold text-xl">{amount} 股</span>
                        <button onClick={() => setAmount(amount + 10)} className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-lg hover:bg-slate-600 font-bold text-xl text-slate-300">+</button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => onBuy(selectedCompany.id, amount)}
                            disabled={player.money < amount * selectedCompany.price}
                            className="bg-green-600 py-4 rounded-xl font-bold hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center shadow-lg transition-all active:scale-95"
                        >
                            <span className="text-lg">买入</span>
                            <span className="text-xs font-normal opacity-80">-${(amount * selectedCompany.price).toLocaleString()}</span>
                        </button>
                        <button 
                            onClick={() => onSell(selectedCompany.id, amount)}
                            disabled={shares < amount}
                            className="bg-red-600 py-4 rounded-xl font-bold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center shadow-lg transition-all active:scale-95"
                        >
                            <span className="text-lg">卖出</span>
                            <span className="text-xs font-normal opacity-80">+${(amount * selectedCompany.price).toLocaleString()}</span>
                        </button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 text-slate-100 p-6 rounded-3xl shadow-2xl max-w-lg w-full border border-slate-700 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight">
                <TrendingUp className="text-blue-500" /> 证券交易所
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X /></button>
        </div>

        {selectedCompanyId ? renderDetail() : renderList()}
      </motion.div>
    </div>
  );
};

export default StockModal;
