import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Building2, TrendingDown, DollarSign } from 'lucide-react';
import type { Tile, Player, Company, DebtCrisis } from '../game/types';
import AssetCard from './AssetCard';
import { useTranslation } from '../i18n';

interface DebtCrisisModalProps {
  isOpen: boolean;
  debtCrisis: DebtCrisis | null;
  player: Player;
  tiles: Tile[];
  companies: Company[];
  onSell: (id: number) => void;
  onMortgage: (id: number) => void;
  onSellStock: (companyId: string, shares: number) => void;
  onDeclareFailure: () => void;
}

const DebtCrisisModal: React.FC<DebtCrisisModalProps> = ({ 
  isOpen, 
  debtCrisis,
  player, 
  tiles, 
  companies,
  onSell, 
  onMortgage,
  onSellStock,
  onDeclareFailure
}) => {
  const t = useTranslation();

  if (!isOpen || !debtCrisis) return null;

  const myProperties = tiles.filter(t => t.ownerId === player.id);
  const debtAmount = debtCrisis.amount;
  const currentMoney = player.money;
  const needMore = Math.abs(currentMoney);

  // 计算股票持仓
  const stockHoldings = companies.filter(c => (player.portfolio[c.id] || 0) > 0).map(c => ({
    ...c,
    shares: player.portfolio[c.id] || 0,
    value: (player.portfolio[c.id] || 0) * c.price
  }));

  const canResolve = currentMoney >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-red-950 to-slate-900 text-slate-100 p-6 rounded-[2.5rem] shadow-2xl max-w-5xl w-full border-2 border-red-500/50 flex flex-col max-h-[90vh]"
      >
        {/* 警告头部 */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-red-800/50">
          <div className="flex items-center gap-4">
            <motion.span 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-gradient-to-br from-red-500 to-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/30"
            >
              <AlertTriangle size={28} />
            </motion.span>
            <div>
              <h2 className="text-2xl font-black text-red-400 tracking-tight">{t.debtCrisis.title}</h2>
              <p className="text-slate-400 text-sm">{t.debtCrisis.subtitle}</p>
            </div>
          </div>
        </div>

        {/* 债务状态面板 */}
        <div className="bg-black/40 rounded-2xl p-4 mb-4 border border-red-900/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-900/30 rounded-xl p-3">
              <div className="text-red-400 text-xs font-mono mb-1">{t.debtCrisis.debtAmount}</div>
              <div className="text-2xl font-black text-red-300">${debtAmount.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3">
              <div className="text-slate-400 text-xs font-mono mb-1">{t.debtCrisis.currentBalance}</div>
              <div className={`text-2xl font-black ${currentMoney >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${currentMoney.toLocaleString()}
              </div>
            </div>
            <div className={`rounded-xl p-3 ${canResolve ? 'bg-green-900/30' : 'bg-orange-900/30'}`}>
              <div className={`text-xs font-mono mb-1 ${canResolve ? 'text-green-400' : 'text-orange-400'}`}>
                {canResolve ? t.debtCrisis.status : t.debtCrisis.needMore}
              </div>
              <div className={`text-2xl font-black ${canResolve ? 'text-green-300' : 'text-orange-300'}`}>
                {canResolve ? t.debtCrisis.resolved : `$${needMore.toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>

        {/* 资产列表 */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* 房产 */}
          {myProperties.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-slate-300 font-bold mb-3">
                <Building2 size={18} />
                <span>{t.debtCrisis.myProperties}</span>
                <span className="text-xs text-slate-500 font-normal">{t.debtCrisis.clickToMortgageOrSell}</span>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {myProperties.map(prop => (
                  <AssetCard 
                    key={prop.id} 
                    tile={prop} 
                    onSell={onSell}
                    onMortgage={onMortgage}
                    onRedeem={() => {}} // 危机时不能赎回
                    crisisMode={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 股票 */}
          {stockHoldings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-slate-300 font-bold mb-3">
                <TrendingDown size={18} />
                <span>{t.debtCrisis.myStocks}</span>
                <span className="text-xs text-slate-500 font-normal">{t.debtCrisis.clickToSellStocks}</span>
              </div>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                {stockHoldings.map(stock => (
                  <div 
                    key={stock.id}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: stock.color }}
                      >
                        {stock.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{stock.name}</div>
                        <div className="text-xs text-slate-400">
                          {stock.shares} {t.common.shares} × ${stock.price} = <span className="text-green-400">${stock.value.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSellStock(stock.id, stock.shares)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                    >
                      <DollarSign size={14} />
                      {t.debtCrisis.sellAll}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 无资产提示 */}
          {myProperties.length === 0 && stockHoldings.length === 0 && (
            <div className="text-center py-10 text-red-400">
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-bold">{t.debtCrisis.noAssetsToSell}</p>
              <p className="text-sm text-slate-500 mt-2">{t.debtCrisis.cannotRepay}</p>
            </div>
          )}
        </div>

        {/* 底部操作 */}
        <div className="mt-4 pt-4 border-t border-red-900/50 flex justify-between items-center">
          <div className="text-sm text-slate-400">
            {t.debtCrisis.tip}
          </div>
          {!canResolve && myProperties.length === 0 && stockHoldings.length === 0 && (
            <button
              onClick={onDeclareFailure}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              {t.debtCrisis.declareBankruptcy}
            </button>
          )}
          {canResolve && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-green-400 font-bold text-lg flex items-center gap-2"
            >
              {t.debtCrisis.debtCleared}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DebtCrisisModal;
