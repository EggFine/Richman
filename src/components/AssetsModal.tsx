import React from 'react';
import { motion } from 'framer-motion';
import { X, Building2 } from 'lucide-react';
import type { Tile, Player } from '../game/types';
import AssetCard from './AssetCard';

interface AssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player;
  tiles: Tile[];
  onSell: (id: number) => void;
  onMortgage: (id: number) => void;
  onRedeem: (id: number) => void;
}

const AssetsModal: React.FC<AssetsModalProps> = ({ isOpen, onClose, player, tiles, onSell, onMortgage, onRedeem }) => {
  if (!isOpen) return null;

  const myProperties = tiles.filter(t => t.ownerId === player.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 text-slate-100 p-6 rounded-[2.5rem] shadow-2xl max-w-5xl w-full border border-slate-700 flex flex-col h-[90vh]"
      >
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
            <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight text-slate-100">
                <span className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center text-black shadow-lg">
                    <Building2 />
                </span>
                我的不动产管理
            </h2>
            <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-full transition-colors bg-slate-800/50"><X /></button>
        </div>

        <div className="overflow-y-auto pr-2 flex-1 bg-slate-950/30 rounded-3xl p-4 border border-slate-800/50">
            {myProperties.length === 0 ? (
                <div className="text-center py-20 text-slate-500 italic flex flex-col items-center gap-4">
                    <Building2 size={64} className="opacity-20"/>
                    <p>您名下暂无房产，快去大富翁地图上跑马圈地吧！</p>
                </div>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center sm:place-items-stretch">
                    {myProperties.map(prop => (
                        <AssetCard 
                            key={prop.id} 
                            tile={prop} 
                            onSell={onSell}
                            onMortgage={onMortgage}
                            onRedeem={onRedeem}
                        />
                    ))}
                </div>
            )}
        </div>
        
        <div className="mt-6 flex justify-between items-center text-slate-400 font-mono text-sm px-4">
             <div>房产数量: {myProperties.length}</div>
             <div>总资产估值: <span className="text-green-400 font-bold">${myProperties.reduce((sum, p) => sum + (p.price || 0) + ((p.level || 0) * (p.price || 0)), 0).toLocaleString()}</span></div>
        </div>

      </motion.div>
    </div>
  );
};

export default AssetsModal;