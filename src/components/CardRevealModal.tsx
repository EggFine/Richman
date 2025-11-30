import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActiveCard } from '../game/types';

interface CardRevealModalProps {
  isOpen: boolean;
  activeCard: ActiveCard | null;
  playerName: string;
  onClose: () => void;
}

const CardRevealModal = ({ isOpen, activeCard, playerName, onClose }: CardRevealModalProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(false);
      setShowContent(false);
      // 延迟翻转卡牌
      const flipTimer = setTimeout(() => {
        setIsFlipped(true);
      }, 500);
      // 翻转后显示内容
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 1100);
      return () => {
        clearTimeout(flipTimer);
        clearTimeout(contentTimer);
      };
    }
  }, [isOpen]);

  if (!activeCard) return null;

  const { card, cardType } = activeCard;
  const isFate = cardType === 'FATE';
  
  // 根据卡片类型和好坏选择颜色
  const getCardColors = () => {
    if (card.isGood) {
      return {
        bg: isFate ? 'from-purple-600 via-purple-500 to-indigo-600' : 'from-amber-500 via-orange-500 to-yellow-500',
        border: isFate ? 'border-purple-300' : 'border-yellow-300',
        glow: isFate ? 'shadow-purple-500/50' : 'shadow-amber-500/50',
        text: 'text-white',
        accent: isFate ? 'text-purple-200' : 'text-yellow-200'
      };
    } else {
      return {
        bg: isFate ? 'from-violet-800 via-purple-900 to-slate-900' : 'from-red-600 via-rose-700 to-slate-900',
        border: isFate ? 'border-violet-400' : 'border-red-400',
        glow: isFate ? 'shadow-violet-500/50' : 'shadow-red-500/50',
        text: 'text-white',
        accent: isFate ? 'text-violet-300' : 'text-red-200'
      };
    }
  };

  const colors = getCardColors();

  // 卡背设计
  const cardBack = (
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${isFate ? 'from-purple-900 via-indigo-900 to-purple-800' : 'from-orange-800 via-amber-900 to-orange-800'} border-4 ${isFate ? 'border-purple-500' : 'border-amber-500'} flex items-center justify-center overflow-hidden`}>
      {/* 装饰图案 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-4 border-2 border-white/30 rounded-2xl"></div>
        <div className="absolute inset-8 border border-white/20 rounded-xl"></div>
        {/* 角落装饰 */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-white/40 rounded-tl-lg"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/40 rounded-tr-lg"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-white/40 rounded-bl-lg"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-white/40 rounded-br-lg"></div>
      </div>
      {/* 中心图标 */}
      <div className="text-6xl opacity-80 z-10">
        {isFate ? '🌟' : '❓'}
      </div>
      {/* 标题 */}
      <div className="absolute bottom-6 text-white/60 text-lg font-bold tracking-widest uppercase">
        {isFate ? '命运' : '机会'}
      </div>
      {/* 闪烁粒子 */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${isFate ? 'bg-purple-300' : 'bg-amber-300'}`}
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  // 卡正面设计
  const cardFront = (
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.bg} border-4 ${colors.border} overflow-hidden`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
      {/* 顶部装饰条 */}
      <div className="absolute top-0 inset-x-0 h-16 bg-black/20 flex items-center justify-center">
        <span className="text-white/80 text-sm font-bold tracking-[0.3em] uppercase">
          {isFate ? '⭐ 命运 ⭐' : '🎯 机会 🎯'}
        </span>
      </div>
      
      {/* 主要内容 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pt-20">
        {/* 大表情 */}
        <motion.div 
          className="text-7xl mb-4"
          animate={showContent ? { 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {card.emoji}
        </motion.div>
        
        {/* 标题 */}
        <motion.h3 
          className={`text-2xl font-black ${colors.text} mb-3 text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          {card.title}
        </motion.h3>
        
        {/* 描述 */}
        <motion.p 
          className={`${colors.accent} text-center text-base font-medium leading-relaxed px-4`}
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {card.description}
        </motion.p>
        
        {/* 效果指示 */}
        <motion.div
          className="mt-6 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showContent ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <span className="text-white/90 text-sm font-bold">
            {card.isGood ? '✨ 好运来袭!' : '💥 糟糕!'}
          </span>
        </motion.div>
      </div>
      
      {/* 底部玩家信息 */}
      <div className="absolute bottom-0 inset-x-0 h-12 bg-black/30 flex items-center justify-center">
        <span className="text-white/70 text-sm">
          🎲 {playerName} 抽到此卡
        </span>
      </div>
      
      {/* 光效 */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{
          opacity: [0, 0.5, 0],
          x: [-100, 200],
        }}
        transition={{
          duration: 1.5,
          delay: 1,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          {/* 背景粒子效果 */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${card.isGood ? 'bg-yellow-400' : 'bg-red-500'}`}
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
          ))}

          {/* 卡片容器 */}
          <motion.div
            className="relative w-72 h-[420px] cursor-pointer"
            style={{ perspective: '1000px' }}
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 内部翻转容器 */}
            <motion.div
              className={`relative w-full h-full shadow-2xl ${colors.glow}`}
              style={{ 
                transformStyle: 'preserve-3d',
              }}
              animate={{ 
                rotateY: isFlipped ? 180 : 0 
              }}
              transition={{
                duration: 0.8,
                type: 'spring',
                stiffness: 150,
                damping: 20
              }}
            >
              {/* 卡背 */}
              {cardBack}
              
              {/* 卡正面 */}
              {cardFront}
            </motion.div>
          </motion.div>

          {/* 点击继续提示 */}
          <motion.div 
            className="absolute bottom-8 text-white/60 text-sm font-medium"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            点击任意位置继续
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardRevealModal;


