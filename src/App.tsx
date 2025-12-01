import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Building2, Globe } from 'lucide-react';

import GameBoard from './components/GameBoard';
import PlayerInfo from './components/PlayerInfo';
import Controls from './components/Controls';
import GameLog from './components/GameLog';
import StockModal from './components/StockModal';
import LotteryModal from './components/LotteryModal';
import AssetsModal from './components/AssetsModal';
import DebtCrisisModal from './components/DebtCrisisModal';
import CardRevealModal from './components/CardRevealModal';

import { 
    getInitialState, saveGame, resetGame,
    rollDice, moveOneStep, handleLanding, 
    buyProperty, upgradeProperty, skipAction, 
    checkNextDay, buyStock, sellStock, buyLottery,
    sellProperty, mortgageProperty, redeemProperty,
    clearEffects, resolveDebtCrisis, applyCardEffect,
    aiAutoRedeemProperties
} from './game/logic';
import type { GameState } from './game/types';
import { useI18n, languageFlags, languageNames } from './i18n';

// Helper to pause
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const { t, language, toggleLanguage } = useI18n();
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [isMoving, setIsMoving] = useState(false); // Block inputs during move animation

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isAiTurn = currentPlayer.isAi;

  // Persistence & Effect Cleanup
  useEffect(() => {
      saveGame(gameState);
      
      // Cleanup visual effects periodically
      const timer = setInterval(() => {
          setGameState(prev => clearEffects(prev));
      }, 1000);
      return () => clearInterval(timer);
  }, [gameState]);

  // Helper to advance turn with delay
  const endTurn = useCallback(() => {
    if (gameState.isGameOver) return;
    
    setTimeout(() => {
      setGameState(prev => {
        const nextState = checkNextDay(prev); 
        const nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
        
        return {
          ...nextState,
          currentPlayerIndex: nextIndex,
          diceValue: null,
          waitingForAction: false,
          modalMessage: null,
          activeModal: null
        };
      });
    }, 1500);
  }, [gameState.isGameOver]);

  // Turn End Check
  useEffect(() => {
    const turnFinished = gameState.diceValue !== null && 
                         !gameState.waitingForAction && 
                         !gameState.isGameOver && 
                         !gameState.modalMessage && 
                         !gameState.activeModal &&
                         !isMoving; // Wait for movement to finish

    if (turnFinished) {
       endTurn();
    }
  }, [gameState.diceValue, gameState.waitingForAction, gameState.isGameOver, gameState.modalMessage, gameState.activeModal, isMoving, endTurn]);


  // --- Main Action Loop ---

  const handleRoll = useCallback(async () => {
    if (isMoving) return;

    const current = gameState.players[gameState.currentPlayerIndex];
    const needsJailSkip = current.jailTurns > 0;
    const needsRestSkip = (current.restTurns || 0) > 0;

    if (needsJailSkip || needsRestSkip) {
      setIsMoving(true);
      setGameState(prev => {
        const players = [...prev.players];
        const player = { ...players[prev.currentPlayerIndex] };
        
        if (needsJailSkip) {
          player.jailTurns = Math.max(0, player.jailTurns - 1);
        } else {
          player.restTurns = Math.max(0, (player.restTurns || 0) - 1);
        }
        
        players[prev.currentPlayerIndex] = player;
        const message = needsJailSkip
          ? t.logs.inJail(player.name, player.jailTurns)
          : player.restTurns > 0
              ? t.logs.continueRest(player.name, player.restTurns)
              : t.logs.endRest(player.name);
        
        return {
          ...prev,
          players,
          gameLog: [...prev.gameLog, message],
          waitingForAction: false,
          diceValue: null
        };
      });
      endTurn();
      setTimeout(() => setIsMoving(false), 1600);
      return;
    }

    setIsMoving(true);

    const dice = rollDice(); // 返回两个骰子的值 [dice1, dice2]
    const total = dice[0] + dice[1]; // 两个骰子的总和
    
    // 1. Set Dice Value
    setGameState(prev => ({
        ...prev,
        diceValue: dice,
        gameLog: [...prev.gameLog, t.logs.rollDice(prev.players[prev.currentPlayerIndex].name, dice[0], dice[1], total)]
    }));

    await wait(600); // Wait for dice animation

    // 2. Step-by-Step Move
    for (let i = 0; i < total; i++) {
        setGameState(prev => moveOneStep(prev));
        await wait(250); // Step delay for "sinking" animation
    }

    // 3. Land
    setGameState(prev => {
        const { newState } = handleLanding(prev);
        return newState;
    });

    setIsMoving(false);
  }, [endTurn, gameState, isMoving, t.logs]);

  // AI Turn Logic
  useEffect(() => {
    if (isAiTurn && !gameState.isGameOver && !gameState.waitingForAction && gameState.diceValue === null && !gameState.modalMessage && !gameState.activeModal && !isMoving) {
      const timer = setTimeout(() => {
        // AI 回合开始前，先检查是否要赎回抵押地产
        setGameState(prev => aiAutoRedeemProperties(prev, prev.players[prev.currentPlayerIndex].id));
        handleRoll();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAiTurn, gameState.isGameOver, gameState.waitingForAction, gameState.diceValue, gameState.modalMessage, gameState.activeModal, isMoving, handleRoll]);

  // --- UI Actions ---

  const onBuy = () => setGameState(prev => buyProperty(prev, prev.currentPlayerIndex).newState);
  const onUpgrade = () => setGameState(prev => upgradeProperty(prev, prev.currentPlayerIndex).newState);
  const onPass = () => setGameState(prev => skipAction(prev));
  
  const onReset = () => {
      if (confirm(t.app.confirmReset)) {
          setGameState(resetGame());
      }
  };

  const closeModal = () => {
      setGameState(prev => ({ ...prev, modalMessage: null, activeModal: null }));
  };

  const handleBuyStock = (companyId: string, amount: number) => setGameState(prev => buyStock(prev, currentPlayer.id, companyId, amount));
  const handleSellStock = (companyId: string, amount: number) => setGameState(prev => sellStock(prev, currentPlayer.id, companyId, amount));
  const handleBuyLottery = (numbers: number[]) => setGameState(prev => buyLottery(prev, currentPlayer.id, numbers));
  
  // 出售房产时，检查是否需要解决债务危机
  const onSellPropertyHandler = (id: number) => {
    setGameState(prev => {
      let newState = sellProperty(prev, id, currentPlayer.id);
      // 如果在债务危机中，检查是否已解决
      if (newState.debtCrisis) {
        newState = resolveDebtCrisis(newState);
      }
      return newState;
    });
  };
  
  // 抵押房产时，检查是否需要解决债务危机
  const handleMortgageProperty = (id: number) => {
    setGameState(prev => {
      let newState = mortgageProperty(prev, id, currentPlayer.id);
      // 如果在债务危机中，检查是否已解决
      if (newState.debtCrisis) {
        newState = resolveDebtCrisis(newState);
      }
      return newState;
    });
  };
  
  const handleRedeemProperty = (id: number) => setGameState(prev => redeemProperty(prev, id, currentPlayer.id));
  
  // 危机模式下卖出股票
  const handleCrisisSellStock = (companyId: string, shares: number) => {
    setGameState(prev => {
      let newState = sellStock(prev, currentPlayer.id, companyId, shares);
      // 检查是否已解决债务危机
      if (newState.debtCrisis) {
        newState = resolveDebtCrisis(newState);
      }
      return newState;
    });
  };
  
  // 宣告破产（无力偿还）
  const handleDeclareFailure = () => {
    setGameState(prev => {
      if (!prev.debtCrisis) return prev;
      
      const { debtorId, creditorId } = prev.debtCrisis;
      const debtorIdx = prev.players.findIndex(p => p.id === debtorId);
      const creditorIdx = prev.players.findIndex(p => p.id === creditorId);
      const debtor = prev.players[debtorIdx];
      const creditor = prev.players[creditorIdx];
      
      const newDebtor = { ...debtor, isBankrupt: true };
      const newPlayers = [...prev.players];
      newPlayers[debtorIdx] = newDebtor;
      
      return {
        ...prev,
        players: newPlayers,
        gameLog: [...prev.gameLog, t.logs.bankrupt(debtor.name)],
        isGameOver: true,
        winner: creditor.name,
        debtCrisis: null,
        activeModal: null
      };
    });
  };

  // Controls State
  const currentTile = gameState.tiles[currentPlayer.position];
  const tilePrice = currentTile.price || 0;
  const canAfford = currentPlayer.money >= tilePrice;
  const canBuy = gameState.waitingForAction && !currentPlayer.isAi && currentTile.type === 'PROPERTY' && !currentTile.ownerId && canAfford;
  const canUpgrade = gameState.waitingForAction && !currentPlayer.isAi && currentTile.type === 'PROPERTY' && currentTile.ownerId === currentPlayer.id && canAfford && (currentTile.level ?? 0) < 5 && !currentTile.isMortgaged;
  const canPass = gameState.waitingForAction && !currentPlayer.isAi;
  const canRoll = !isAiTurn && !gameState.waitingForAction && gameState.diceValue === null && !gameState.isGameOver && !gameState.activeModal && !isMoving;

  const showStock = gameState.activeModal === 'STOCK';
  const showLottery = gameState.activeModal === 'LOTTERY';
  const showAssets = gameState.activeModal === 'ASSETS';
  const showDebtCrisis = gameState.activeModal === 'DEBT_CRISIS';
  const showCardReveal = gameState.activeModal === 'CARD_REVEAL';
  
  // 关闭卡牌模态框并应用效果
  const closeCardModal = () => {
    setGameState(prev => applyCardEffect(prev));
  };
  
  // 获取抽卡玩家名称
  const getCardPlayerName = () => {
    if (!gameState.activeCard) return '';
    const player = gameState.players.find(p => p.id === gameState.activeCard?.playerId);
    return player?.name || '';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start xl:justify-center p-1 sm:p-4 font-sans text-slate-200 select-none overflow-x-hidden pb-8">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-6 mt-1 sm:mt-0 w-full justify-between max-w-7xl px-2"
      >
        <div className="flex items-baseline gap-2">
            <h1 className="text-xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-lg tracking-wider">
            {t.app.title}
            </h1>
            <span className="text-[10px] sm:text-2xl text-slate-500 font-mono">{t.app.version}</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all border border-slate-700 hover:border-slate-600 shadow-sm active:scale-95"
            title={languageNames[language === 'zh' ? 'en' : 'zh']}
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{languageFlags[language]}</span>
            <span className="hidden sm:inline">{languageNames[language]}</span>
          </button>

          <div className="bg-slate-900 px-3 py-1.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono text-slate-400 border border-slate-800 flex items-center gap-2 sm:gap-4 shadow-sm">
              <span className="flex items-center gap-1">📅 <span className="text-slate-200 font-bold">{language === 'zh' ? `第 ${gameState.day} 天` : `Day ${gameState.day}`}</span></span>
              <span className="w-px h-3 bg-slate-700"></span>
              <span className="flex items-center gap-1 text-pink-400 font-bold"><Sparkles size={10}/> {language === 'zh' ? `${gameState.daysUntilDraw}天后开奖` : `Draw in ${gameState.daysUntilDraw}d`}</span>
          </div>
        </div>
      </motion.div>
      
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-8 items-center xl:items-start w-full max-w-[95%] xl:max-w-[1800px] justify-center flex-1">
        
        {/* Left Panel: Board */}
        <div className="flex-shrink-0 w-full sm:w-auto flex justify-center origin-top xl:origin-top-right z-10">
          <GameBoard gameState={gameState}>
            <div className="h-full w-full flex flex-col justify-center items-center relative p-0.5 sm:p-4">
               <div className="absolute top-2 sm:top-4 w-full text-center text-slate-500/30 font-black text-[8px] sm:text-xs uppercase tracking-[0.2em]">{t.app.centralPark}</div>
               
               <Controls 
                  onRoll={handleRoll} 
                  onBuy={onBuy}
                  onPass={onPass}
                  onUpgrade={onUpgrade}
                  onOpenStock={() => setGameState(prev => ({...prev, activeModal: 'STOCK'}))}
                  onOpenLottery={() => setGameState(prev => ({...prev, activeModal: 'LOTTERY'}))}
                  onReset={onReset}
                  canRoll={canRoll}
                  canBuy={canBuy}
                  canUpgrade={canUpgrade}
                  canPass={canPass}
                  diceValue={gameState.diceValue}
               />

               <button 
                  onClick={() => setGameState(prev => ({...prev, activeModal: 'ASSETS'}))}
                  className="mt-2 sm:mt-4 flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-slate-700 hover:text-white transition-all shadow-lg active:scale-95"
               >
                   <Building2 className="w-3 h-3 sm:w-4 sm:h-4"/> {t.app.myAssets}
               </button>

               <div className="mt-auto mb-1 sm:mb-0 sm:mt-4 text-center text-slate-500 text-[9px] sm:text-xs font-mono bg-slate-900/50 px-2 py-1 rounded-lg border border-white/5">
                   {t.common.turn}: <span className="font-bold text-slate-300">{gameState.players[gameState.currentPlayerIndex].name}</span>
               </div>
            </div>
          </GameBoard>
        </div>

        {/* Right Panel: Info & Logs */}
        <div className="flex flex-col gap-2 sm:gap-4 w-full xl:flex-1 xl:max-w-[600px] xl:h-[650px] bg-slate-900/30 p-2 sm:p-4 rounded-xl sm:rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm">
           
           {/* Player Stats - Grid on Mobile, List on Desktop */}
           <div className="grid grid-cols-2 xl:flex xl:flex-col gap-2 sm:gap-3">
             {gameState.players.map((p, i) => (
               <PlayerInfo key={p.id} player={p} isCurrent={i === gameState.currentPlayerIndex} />
             ))}
           </div>

           <div className="flex items-center gap-2 mt-1 sm:mt-2">
             <div className="h-px bg-slate-800 flex-1"></div>
             <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest">{t.app.gameLog}</span>
             <div className="h-px bg-slate-800 flex-1"></div>
           </div>

           {/* Game Log - Adjustable height on mobile */}
           <div className="flex-1 min-h-[100px] xl:min-h-0 overflow-hidden flex flex-col">
              <GameLog logs={gameState.gameLog} />
           </div>
           
           <AnimatePresence>
            {gameState.winner && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-3xl backdrop-blur-sm"
                >
                    <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-black p-8 text-center text-3xl rounded-2xl shadow-2xl border-8 border-white/20 animate-bounce">
                    🏆 {t.app.wins.replace('{name}', gameState.winner)} 🏆
                    <button onClick={onReset} className="mt-6 bg-black text-white text-sm px-6 py-3 rounded-xl font-bold hover:bg-gray-800 flex items-center gap-2 mx-auto shadow-lg">
                        <RotateCcw size={16}/> {t.app.playAgain}
                    </button>
                    </div>
                </motion.div>
            )}
           </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {gameState.modalMessage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={closeModal}
            >
                <motion.div 
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 50 }}
                    className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border-4 border-purple-500"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-2xl font-black mb-2 text-purple-700">{gameState.modalTitle || t.app.eventTitle}</h3>
                    <p className="text-lg font-medium text-slate-600 mb-6">{gameState.modalMessage}</p>
                    <button onClick={closeModal} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors w-full shadow-lg">
                        {t.common.confirm}
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <StockModal 
        isOpen={showStock} 
        onClose={closeModal} 
        companies={gameState.companies}
        player={currentPlayer}
        onBuy={handleBuyStock}
        onSell={handleSellStock}
      />

      <LotteryModal 
        isOpen={showLottery}
        onClose={closeModal}
        jackpot={gameState.lotteryJackpot}
        daysUntilDraw={gameState.daysUntilDraw}
        player={currentPlayer}
        onBuy={handleBuyLottery}
      />

      <AssetsModal
        isOpen={showAssets}
        onClose={closeModal}
        player={currentPlayer}
        tiles={gameState.tiles}
        onSell={onSellPropertyHandler}
        onMortgage={handleMortgageProperty}
        onRedeem={handleRedeemProperty}
      />

      <DebtCrisisModal
        isOpen={showDebtCrisis}
        debtCrisis={gameState.debtCrisis}
        player={currentPlayer}
        tiles={gameState.tiles}
        companies={gameState.companies}
        onSell={onSellPropertyHandler}
        onMortgage={handleMortgageProperty}
        onSellStock={handleCrisisSellStock}
        onDeclareFailure={handleDeclareFailure}
      />

      <CardRevealModal
        isOpen={showCardReveal}
        activeCard={gameState.activeCard}
        playerName={getCardPlayerName()}
        onClose={closeCardModal}
      />
    </div>
  );
}

export default App;
