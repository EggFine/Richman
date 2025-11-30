import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, Building2 } from 'lucide-react';

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
    clearEffects, resolveDebtCrisis, applyCardEffect
} from './game/logic';
import type { GameState } from './game/types';

// Helper to pause
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
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
        let nextState = checkNextDay(prev); 
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

  // AI Turn Logic
  useEffect(() => {
    if (isAiTurn && !gameState.isGameOver && !gameState.waitingForAction && gameState.diceValue === null && !gameState.modalMessage && !gameState.activeModal && !isMoving) {
      const timer = setTimeout(() => {
        handleRoll();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAiTurn, gameState.isGameOver, gameState.waitingForAction, gameState.diceValue, gameState.modalMessage, gameState.activeModal, isMoving]);

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

  const handleRoll = async () => {
    if (isMoving) return;
    setIsMoving(true);

    const dice = rollDice(); // 返回两个骰子的值 [dice1, dice2]
    const total = dice[0] + dice[1]; // 两个骰子的总和
    
    // 1. Set Dice Value
    setGameState(prev => ({
        ...prev,
        diceValue: dice,
        gameLog: [...prev.gameLog, `${prev.players[prev.currentPlayerIndex].name} 掷出了 ${dice[0]} + ${dice[1]} = ${total} 点.`]
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
  };

  // --- UI Actions ---

  const onBuy = () => setGameState(prev => buyProperty(prev, prev.currentPlayerIndex).newState);
  const onUpgrade = () => setGameState(prev => upgradeProperty(prev, prev.currentPlayerIndex).newState);
  const onPass = () => setGameState(prev => skipAction(prev));
  
  const onReset = () => {
      if (confirm("确定要重新开始游戏吗? 当前进度将丢失.")) {
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
        gameLog: [...prev.gameLog, `💀 ${debtor.name} 无力偿还债务，破产了!`],
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-200 select-none overflow-x-hidden">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-lg tracking-wider">
          RICHMAN <span className="text-2xl text-white/50 font-mono align-super">v4</span>
        </h1>
        <div className="bg-slate-800 px-3 py-1 rounded-full text-xs font-mono text-slate-400 border border-slate-700 flex items-center gap-2">
            <span>📅 第 {gameState.day} 天</span>
            <span className="w-px h-3 bg-slate-600"></span>
            <span className="flex items-center gap-1 text-pink-400"><Sparkles size={10}/> 下次开奖: {gameState.daysUntilDraw}天</span>
        </div>
      </motion.div>
      
      <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start w-full max-w-7xl justify-center">
        
        {/* Left Panel: Board */}
        <div className="flex-shrink-0 scale-90 sm:scale-100 origin-top xl:origin-top-right">
          <GameBoard gameState={gameState}>
            <div className="h-full w-full flex flex-col justify-center items-center relative p-4">
               <div className="absolute top-4 w-full text-center text-slate-400 font-bold text-xs uppercase tracking-[0.3em] opacity-50">Central Park</div>
               
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
                  className="mt-4 flex items-center gap-1 bg-slate-200 text-slate-800 px-4 py-2 rounded-full text-xs font-bold hover:bg-white hover:scale-105 transition-all shadow-lg"
               >
                   <Building2 size={14}/> 我的资产
               </button>

               <div className="mt-4 text-center text-slate-400 text-xs font-mono bg-slate-100/50 px-3 py-1 rounded-full">
                   当前回合: <span className="font-bold text-slate-800">{gameState.players[gameState.currentPlayerIndex].name}</span>
               </div>
            </div>
          </GameBoard>
        </div>

        {/* Right Panel: Info & Logs */}
        <div className="flex flex-col gap-4 w-full max-w-md h-[650px] bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-md">
           <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">玩家状态</div>
           
           {/* Player Stats */}
           <div className="flex flex-col gap-3">
             {gameState.players.map((p, i) => (
               <PlayerInfo key={p.id} player={p} isCurrent={i === gameState.currentPlayerIndex} />
             ))}
           </div>

           <div className="mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">游戏记录</div>
           {/* Game Log */}
           <GameLog logs={gameState.gameLog} />
           
           <AnimatePresence>
            {gameState.winner && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-3xl"
                >
                    <div className="bg-yellow-400 text-black font-black p-8 text-center text-3xl rounded-2xl shadow-2xl border-8 border-white animate-bounce">
                    🏆 {gameState.winner} 获胜! 🏆
                    <button onClick={onReset} className="mt-6 bg-black text-white text-sm px-4 py-2 rounded-lg font-bold hover:bg-gray-800 flex items-center gap-2 mx-auto">
                        <RotateCcw size={16}/> 重新开始
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
                    <h3 className="text-2xl font-black mb-2 text-purple-700">{gameState.modalTitle || '事件发生'}</h3>
                    <p className="text-lg font-medium text-slate-600 mb-6">{gameState.modalMessage}</p>
                    <button onClick={closeModal} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors w-full shadow-lg">
                        确定
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