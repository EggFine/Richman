import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
    Dice5, DollarSign, Hammer, Skull, Trophy, 
    AlertCircle, Footprints, TrendingUp, Ticket,
    Ban
} from 'lucide-react';
import { clsx } from 'clsx';
import { useI18n } from '../i18n';

const LogItem: React.FC<{ text: string, index: number }> = ({ text, index }) => {
    const { language } = useI18n();
    
    // Parse log content for styling
    let type: 'neutral' | 'money' | 'upgrade' | 'danger' | 'win' | 'dice' | 'move' | 'stock' | 'lottery' = 'neutral';
    let Icon = AlertCircle;

    // Keywords for both languages
    const keywords = {
        dice: language === 'zh' ? '掷出' : 'rolled',
        buy: language === 'zh' ? '购买' : 'bought',
        upgrade: language === 'zh' ? '升级' : 'upgraded',
        rent: language === 'zh' ? ['过路费', '租金'] : ['rent', 'paid'],
        bankrupt: language === 'zh' ? '破产' : 'bankrupt',
        win: language === 'zh' ? '获胜' : 'wins',
        move: language === 'zh' ? '移动' : 'move',
        stock: language === 'zh' ? ['股市', '股票'] : ['stock', 'shares'],
        lottery: language === 'zh' ? '彩票' : 'lottery',
        jail: language === 'zh' ? ['坐牢', '监狱'] : ['jail', 'prison']
    };

    if (text.includes(keywords.dice)) { type = 'dice'; Icon = Dice5; }
    else if (text.includes(keywords.buy)) { type = 'money'; Icon = DollarSign; }
    else if (text.includes(keywords.upgrade)) { type = 'upgrade'; Icon = Hammer; }
    else if ((Array.isArray(keywords.rent) ? keywords.rent.some(k => text.toLowerCase().includes(k)) : text.includes(keywords.rent))) { type = 'danger'; Icon = DollarSign; }
    else if (text.toLowerCase().includes(keywords.bankrupt)) { type = 'danger'; Icon = Skull; }
    else if (text.includes(keywords.win)) { type = 'win'; Icon = Trophy; }
    else if (text.includes(keywords.move)) { type = 'move'; Icon = Footprints; }
    else if ((Array.isArray(keywords.stock) ? keywords.stock.some(k => text.toLowerCase().includes(k)) : text.toLowerCase().includes(keywords.stock))) { type = 'stock'; Icon = TrendingUp; }
    else if (text.toLowerCase().includes(keywords.lottery)) { type = 'lottery'; Icon = Ticket; }
    else if ((Array.isArray(keywords.jail) ? keywords.jail.some(k => text.includes(k)) : text.includes(keywords.jail))) { type = 'danger'; Icon = Ban; }

    const colors = {
        neutral: "text-slate-400 border-slate-800",
        money: "text-green-400 border-green-900/30 bg-green-900/10",
        upgrade: "text-blue-400 border-blue-900/30 bg-blue-900/10",
        danger: "text-red-400 border-red-900/30 bg-red-900/10",
        win: "text-yellow-400 border-yellow-900/30 bg-yellow-900/20 font-bold",
        dice: "text-indigo-400 border-indigo-900/30 bg-indigo-900/10",
        move: "text-slate-300 border-slate-800",
        stock: "text-cyan-400 border-cyan-900/30 bg-cyan-900/10",
        lottery: "text-pink-400 border-pink-900/30 bg-pink-900/10",
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            layout
            className={clsx(
                "mb-1.5 p-2 rounded-lg border text-[10px] sm:text-xs leading-relaxed flex items-start gap-2 shadow-sm",
                colors[type]
            )}
        >
            <Icon size={14} className="mt-0.5 flex-shrink-0 opacity-70" />
            <span className="flex-1">{text}</span>
        </motion.div>
    );
};

const GameLog: React.FC<{ logs: string[] }> = ({ logs }) => {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="flex-1 relative flex flex-col h-full min-h-0">
        <div 
            ref={containerRef} 
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pr-2 space-y-1"
            style={{ 
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)' 
            }}
        >
            {logs.length === 0 && (
                <div className="text-slate-600 text-center italic mt-10 text-xs flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-500 rounded-full animate-spin"></div>
                    {t.common.waiting}
                </div>
            )}
            
            <div className="pt-8 pb-2">
                {logs.map((log, i) => (
                    <LogItem key={i} text={log} index={i} />
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    </div>
  );
};

export default GameLog;
