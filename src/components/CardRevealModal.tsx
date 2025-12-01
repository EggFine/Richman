import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ActiveCard } from '../game/types';
import { Coins, TrendingDown, Skull, PartyPopper } from 'lucide-react';
import { useTranslation } from '../i18n';

interface CardRevealModalProps {
  isOpen: boolean;
  activeCard: ActiveCard | null;
  playerName: string;
  onClose: () => void;
}

const CardRevealModal = ({ isOpen, activeCard, playerName, onClose }: CardRevealModalProps) => {
  const t = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset states
      setIsFlipped(false);
      setShowContent(false);
      setShake(false);

      // Sequence
      const flipTimer = setTimeout(() => setIsFlipped(true), 600);
      const contentTimer = setTimeout(() => {
        setShowContent(true);
        if (activeCard?.card?.isGood === false) {
          setShake(true);
        }
      }, 1200);
      
      return () => {
        clearTimeout(flipTimer);
        clearTimeout(contentTimer);
      };
    }
  }, [isOpen, activeCard]);

  // 粒子生成 hooks
  const particles = useMemo(() => {
    if (!activeCard) return [];
    const isGood = activeCard.card.isGood;
    const count = isGood ? 50 : 30;
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      scale: 0.5 + Math.random() * 1,
      rotate: Math.random() * 360
    }));
  }, [activeCard]);

  if (!activeCard) return null;

  const { card, cardType } = activeCard;
  const isFate = cardType === 'FATE';
  const isMoneyEffect = ['MONEY', 'STOCK_BONUS', 'LOTTERY_BOOST'].includes(card.effect.type);
  
  // 视觉风格配置
  const getTheme = () => {
    if (card.isGood) {
      if (isMoneyEffect) {
        return {
          bg: 'from-yellow-400 via-orange-500 to-yellow-600',
          border: 'border-yellow-200',
          glow: 'shadow-yellow-500/80',
          textTitle: 'text-yellow-100',
          icon: <Coins className="w-12 h-12 text-yellow-200" />,
          particle: '💰',
          sound: 'win'
        };
      }
      return {
        bg: 'from-pink-500 via-purple-500 to-indigo-500',
        border: 'border-pink-200',
        glow: 'shadow-pink-500/80',
        textTitle: 'text-white',
        icon: <PartyPopper className="w-12 h-12 text-white" />,
        particle: '✨',
        sound: 'good'
      };
    } else {
      if (isMoneyEffect) {
        return {
          bg: 'from-red-900 via-slate-900 to-black',
          border: 'border-red-500',
          glow: 'shadow-red-600/80',
          textTitle: 'text-red-500',
          icon: <TrendingDown className="w-12 h-12 text-red-500" />,
          particle: '💸',
          sound: 'loss'
        };
      }
      return {
        bg: 'from-slate-800 via-gray-900 to-black',
        border: 'border-gray-600',
        glow: 'shadow-gray-500/50',
        textTitle: 'text-gray-400',
        icon: <Skull className="w-12 h-12 text-gray-400" />,
        particle: '⛈️',
        sound: 'bad'
      };
    }
  };

  const theme = getTheme();

  // 卡背 (保持神秘感)
  const CardBack = () => (
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${isFate ? 'from-purple-900 to-indigo-900' : 'from-orange-700 to-red-900'} border-4 border-white/20 flex flex-col items-center justify-center overflow-hidden shadow-2xl`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg) translateZ(1px)' }}>
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-8xl z-10 filter drop-shadow-lg"
      >
        {isFate ? '🔮' : '❓'}
      </motion.div>
      <div className="mt-8 text-white/80 text-2xl font-bold tracking-[0.5em] uppercase border-t border-b border-white/30 py-2">
        {isFate ? t.cardReveal.fate : t.cardReveal.chance}
      </div>
    </div>
  );

  // 卡正面 (根据主题变化)
  const CardFront = () => (
    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${theme.bg} border-4 ${theme.border} overflow-hidden flex flex-col`} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}>
      
      {/* 旋转光效背景 (仅好运) */}
      {card.isGood && (
        <motion.div 
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,white_90deg,transparent_180deg)] opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* 顶部标签 */}
      <div className="relative z-10 flex justify-center pt-6 pb-2">
        <div className="bg-black/30 backdrop-blur-md px-6 py-1 rounded-full border border-white/10">
          <span className={`text-xs font-bold tracking-widest uppercase text-white/90`}>
            {isFate ? t.cardReveal.fateTitle : t.cardReveal.chanceTitle}
          </span>
        </div>
      </div>

      {/* 核心内容区 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
        {/* Emoji / 图标 */}
        <motion.div 
          className="text-8xl mb-6 filter drop-shadow-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={showContent ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", damping: 12 }}
        >
          {card.emoji}
        </motion.div>

        {/* 标题 */}
        <motion.h2 
          className={`text-3xl font-black mb-4 leading-tight ${theme.textTitle} drop-shadow-md`}
          initial={{ opacity: 0, y: 20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
        >
          {card.title}
        </motion.h2>

        {/* 描述 */}
        <motion.p 
          className="text-white/90 font-medium text-lg leading-relaxed px-2"
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {card.description}
        </motion.p>

        {/* 金额/效果特写 (如果有) */}
        {isMoneyEffect && card.effect.value && (
          <motion.div 
            className={`mt-6 text-4xl font-black ${card.isGood ? 'text-yellow-200' : 'text-red-300'}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={showContent ? { scale: 1.2, opacity: 1 } : {}}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {card.isGood ? '+' : '-'}${Math.abs(card.effect.value)}
          </motion.div>
        )}
      </div>

      {/* 底部玩家 */}
      <div className="relative z-10 bg-black/40 p-3 text-center">
        <span className="text-white/70 text-sm font-medium">
          {t.cardReveal.playerTurn.replace('{name}', playerName)}
        </span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* 全屏特效层 */}
          {showContent && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* 1. 赢钱/好运：漫天金币/星星 */}
              {card.isGood && particles.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute top-[-50px] text-4xl"
                  style={{ left: `${p.x}vw` }}
                  initial={{ y: -100, rotate: 0 }}
                  animate={{ y: '110vh', rotate: p.rotate * 2 }}
                  transition={{ 
                    duration: p.duration, 
                    ease: "linear", 
                    repeat: Infinity,
                    delay: p.delay 
                  }}
                >
                  {theme.particle}
                </motion.div>
              ))}

              {/* 2. 输钱/厄运：屏幕震动红光/雨 */}
              {!card.isGood && (
                <>
                   {/* 红色闪烁警报 */}
                  <motion.div 
                    className="absolute inset-0 bg-red-600 mixture-blend-overlay"
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 0.5, repeat: 4 }}
                  />
                  {/* 飘走的钱 / 阴雨 */}
                  {particles.map((p) => (
                    <motion.div
                      key={p.id}
                      className="absolute text-3xl opacity-60"
                      style={{ left: `${p.x}vw` }}
                      initial={{ y: isMoneyEffect ? '100vh' : -50, opacity: 0 }}
                      animate={{ 
                        y: isMoneyEffect ? -100 : '110vh', 
                        opacity: [0, 1, 0] 
                      }}
                      transition={{ 
                        duration: p.duration * 0.8, 
                        ease: "easeIn",
                        repeat: Infinity, 
                        delay: p.delay 
                      }}
                    >
                      {theme.particle}
                    </motion.div>
                  ))}
                </>
              )}
              
              {/* 3. God Rays for Jackpot */}
              {isMoneyEffect && card.isGood && (
                 <motion.div 
                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle,rgba(255,215,0,0.2)_0%,transparent_70%)]"
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity }}
                 />
              )}
            </div>
          )}

          {/* 卡片主体 */}
          <motion.div
            className="relative w-80 h-[480px] cursor-pointer z-20"
            style={{ perspective: '1200px' }}
            initial={{ scale: 0, y: 100 }}
            animate={{ 
              scale: 1, 
              y: 0,
              x: shake ? [-10, 10, -10, 10, 0] : 0
            }}
            transition={{ 
              default: { type: "spring", duration: 0.8, bounce: 0.5 },
              x: { type: "tween", duration: 0.4, ease: "easeInOut" }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className={`relative w-full h-full transition-all duration-500 ${showContent ? theme.glow : 'shadow-2xl'}`}
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <CardBack />
              <CardFront />
            </motion.div>
          </motion.div>

          {/* 继续提示 */}
          <motion.div 
            className="absolute bottom-12 text-white/50 text-sm tracking-widest animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            {t.cardReveal.clickToContinue}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardRevealModal;
