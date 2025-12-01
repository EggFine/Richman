import type { GameState, Player, Tile, VisualEffect, LotteryTicket, PropertyLevel } from './types';
import { BOARD_SIZE, INITIAL_MONEY, INITIAL_TILES, INITIAL_COMPANIES } from './config';
import { drawFateCard, drawChanceCard } from './cards';

const generateId = () => Math.random().toString(36).substr(2, 9);
const STORAGE_KEY = 'richman_save_v4';

export const getInitialState = (): GameState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const state = JSON.parse(saved);
      if (!state.visualEffects) state.visualEffects = [];
      if (!state.companies) return createNewGame(['玩家 1', '电脑 AI']);
      // 兼容旧存档
      if (!state.activeCard) state.activeCard = null;
      if (!state.jailFreeCards) state.jailFreeCards = {};
      if (Array.isArray(state.players)) {
        state.players = state.players.map((player: Player) => ({
            ...player,
            lotteryTickets: player.lotteryTickets || [],
            restTurns: player.restTurns ?? 0,
        }));
      }
      return state;
    } catch (e) {
      console.error("Failed to load save", e);
    }
  }
  return createNewGame(['玩家 1', '电脑 AI']);
};

export const createNewGame = (playerNames: string[]): GameState => {
  const players: Player[] = playerNames.map((name, index) => ({
    id: `p${index}`,
    name,
    color: index === 0 ? 'blue' : 'red',
    money: INITIAL_MONEY,
    position: 0,
    isAi: index > 0,
    isBankrupt: false,
    jailTurns: 0,
    restTurns: 0,
    portfolio: {},
    lotteryTickets: [],
  }));

  const tiles = JSON.parse(JSON.stringify(INITIAL_TILES));
  const companies = JSON.parse(JSON.stringify(INITIAL_COMPANIES));

  return {
    players,
    tiles,
    companies,
    currentPlayerIndex: 0,
    diceValue: null,
    gameLog: ['🎮 新游戏开始!'],
    winner: null,
    isGameOver: false,
    waitingForAction: false,
    day: 1,
    lotteryJackpot: 5000,
    daysUntilDraw: 7,
    modalMessage: null,
    activeModal: null,
    visualEffects: [],
    debtCrisis: null,
    activeCard: null,
    jailFreeCards: {},
  };
};

export const saveGame = (state: GameState) => {
  const toSave = { ...state, visualEffects: [] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
};

export const resetGame = (): GameState => {
  localStorage.removeItem(STORAGE_KEY);
  return createNewGame(['玩家 1', '电脑 AI']);
};

// --- Visual Effects Helper ---
const generateParticles = (count: number = 12) => {
    return Array.from({ length: count }, () => ({
        id: generateId(),
        x: (Math.random() - 0.5) * 120,  // 随机水平偏移
        y: Math.random() * -80 - 20,      // 随机向上飘
        rotation: Math.random() * 360,     // 随机旋转
        delay: Math.random() * 0.3,        // 随机延迟
        scale: 0.6 + Math.random() * 0.6,  // 随机大小
    }));
};

export const addMoneyEffect = (state: GameState, amount: number, position: number): GameState => {
    if (amount === 0) return state;
    
    // 飘字效果
    const floatEffect: VisualEffect = {
        id: generateId(),
        type: 'FLOAT_TEXT',
        text: amount > 0 ? `+$${amount}` : `-$${Math.abs(amount)}`,
        value: amount,
        position: position,
        timestamp: Date.now()
    };
    
    // 仙女散花美元图标效果
    const showerEffect: VisualEffect = {
        id: generateId(),
        type: 'MONEY_SHOWER',
        text: '',
        value: amount,
        position: position,
        timestamp: Date.now(),
        particles: generateParticles(Math.abs(amount) > 500 ? 16 : 10)
    };
    
    return { ...state, visualEffects: [...state.visualEffects, floatEffect, showerEffect] };
};

export const clearEffects = (state: GameState): GameState => {
    const now = Date.now();
    const active = state.visualEffects.filter(e => now - e.timestamp < 2000);
    if (active.length === state.visualEffects.length) return state;
    return { ...state, visualEffects: active };
};

// --- Mechanics ---
// 掷两个骰子，返回两个骰子的值数组
export const rollDice = (): number[] => [
  Math.floor(Math.random() * 6) + 1,
  Math.floor(Math.random() * 6) + 1
];

export const calculateRent = (tile: Tile): number => {
  if (!tile.baseRent || tile.isMortgaged) return 0; // Mortgaged property yields 0 rent
  const level = tile.level || 0;
  return tile.baseRent * Math.pow(3, level);
};

export const checkNextDay = (state: GameState): GameState => {
  let newState = { ...state };
  if (newState.currentPlayerIndex === 0) {
      newState = advanceDay(newState);
  }
  return newState;
};

const advanceDay = (state: GameState): GameState => {
    let newState = { ...state };
    newState.day += 1;
    newState.daysUntilDraw -= 1;
    
    newState.companies = newState.companies.map(comp => {
        const changePercent = (Math.random() * (comp.volatility * 2)) - comp.volatility; 
        let newPrice = Math.floor(comp.price * (1 + changePercent));
        newPrice = Math.max(10, newPrice);
        const history = [...comp.history.slice(-9), newPrice]; // Keep slightly longer history for sparklines
        return { ...comp, price: newPrice, history };
    });

    if (newState.daysUntilDraw <= 0) {
        newState = processLotteryDraw(newState);
        newState.daysUntilDraw = 7;
    }
    return newState;
};

// 生成不重复的中奖号码
const generateWinningNumbers = (): number[] => {
    const numbers: number[] = [];
    while (numbers.length < 3) {
        const num = Math.floor(Math.random() * 10) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers.sort((a, b) => a - b);
};

// 计算彩票匹配数
const countMatches = (ticket: number[], winning: number[]): number => {
    return ticket.filter(n => winning.includes(n)).length;
};

const processLotteryDraw = (state: GameState): GameState => {
    let newState = { ...state };
    const winningNumbers = generateWinningNumbers();
    newState.gameLog = [...newState.gameLog, `🎰 大乐透开奖! 中奖号码: [${winningNumbers.join(', ')}]`];
    
    let hasJackpotWinner = false;
    const effectsQueue: Array<{ amount: number; position: number }> = [];
    
    const updatedPlayers = newState.players.map(p => {
        const newPlayer = { ...p, lotteryTickets: [] as LotteryTicket[] };
        let playerPrize = 0;
        let bestMatch = 0;
        
        p.lotteryTickets.forEach(ticket => {
            const matches = countMatches(ticket.numbers, winningNumbers);
            if (matches > bestMatch) bestMatch = matches;
            
            if (matches === 1) {
                playerPrize += ticket.cost;
            } else if (matches === 2) {
                playerPrize += ticket.cost * 5;
            } else if (matches === 3) {
                hasJackpotWinner = true;
                playerPrize += newState.lotteryJackpot;
            }
        });
        
        if (playerPrize > 0) {
            newPlayer.money += playerPrize;
            effectsQueue.push({ amount: playerPrize, position: newPlayer.position });
            
            if (bestMatch === 3) {
                newState.gameLog = [...newState.gameLog, `🎊 ${newPlayer.name} 全中大奖! 赢得 $${playerPrize}!`];
                if (!newPlayer.isAi) {
                    newState.modalTitle = "🎊 头奖降临!";
                    newState.modalMessage = `恭喜! 号码 [${winningNumbers.join(', ')}] 全部命中! 获得奖池 $${playerPrize}!`;
                }
            } else if (bestMatch === 2) {
                newState.gameLog = [...newState.gameLog, `🎉 ${newPlayer.name} 中了二等奖! 赢得 $${playerPrize}`];
                if (!newPlayer.isAi) {
                    newState.modalTitle = "🎉 二等奖!";
                    newState.modalMessage = `恭喜! 匹配了 2 个号码! 获得 $${playerPrize}`;
                }
            } else if (bestMatch === 1) {
                newState.gameLog = [...newState.gameLog, `🎫 ${newPlayer.name} 中了三等奖, 获得 $${playerPrize}`];
            }
        }
        
        return newPlayer;
    });
    
    newState.players = updatedPlayers;
    
    // 奖金飘字效果在玩家列表更新后统一应用，避免覆盖变更
    effectsQueue.forEach(effect => {
        newState = addMoneyEffect(newState, effect.amount, effect.position);
    });
    
    if (hasJackpotWinner) {
        newState.lotteryJackpot = 5000;
    } else {
        newState.lotteryJackpot += 3000;
        newState.gameLog = [...newState.gameLog, `💰 奖池滚存至 $${newState.lotteryJackpot}`];
    }
    
    return newState;
};

// --- Asset Management ---

export const sellProperty = (state: GameState, tileId: number, playerId: string): GameState => {
    let newState = { ...state };
    const tileIndex = newState.tiles.findIndex(t => t.id === tileId);
    const tile = { ...newState.tiles[tileIndex] };
    const playerIndex = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIndex] };

    if (tile.ownerId === playerId) {
        // Sell Price: 80% of (Land Price + Upgrade Cost implicitly via logic or just simplified)
        // Simplified: 80% of land price + 50% of upgrade levels? 
        // Let's stick to simple: 80% of current face value (Price).
        // But Price is static base price.
        // Let's calculate Value = Price + (Level * Price)
        const value = (tile.price || 0) * (1 + (tile.level || 0));
        const sellPrice = Math.floor(value * 0.8);
        
        player.money += sellPrice;
        newState = addMoneyEffect(newState, sellPrice, player.position); // Float over player
        
        tile.ownerId = null;
        tile.level = 0;
        tile.isMortgaged = false;

        newState.players[playerIndex] = player;
        newState.tiles[tileIndex] = tile;
        newState.gameLog = [...newState.gameLog, `💰 ${player.name} 出售了 ${tile.name}, 获得 $${sellPrice}`];
    }
    return newState;
};

export const mortgageProperty = (state: GameState, tileId: number, playerId: string): GameState => {
    let newState = { ...state };
    const tileIndex = newState.tiles.findIndex(t => t.id === tileId);
    const tile = { ...newState.tiles[tileIndex] };
    const playerIndex = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIndex] };

    if (tile.ownerId === playerId && !tile.isMortgaged) {
        // Mortgage: 50% of base price
        const mortgageValue = Math.floor((tile.price || 0) * 0.5);
        
        player.money += mortgageValue;
        newState = addMoneyEffect(newState, mortgageValue, player.position);
        tile.isMortgaged = true;

        newState.players[playerIndex] = player;
        newState.tiles[tileIndex] = tile;
        newState.gameLog = [...newState.gameLog, `📝 ${player.name} 抵押了 ${tile.name}, 获得 $${mortgageValue}`];
    }
    return newState;
};

export const redeemProperty = (state: GameState, tileId: number, playerId: string): GameState => {
    let newState = { ...state };
    const tileIndex = newState.tiles.findIndex(t => t.id === tileId);
    const tile = { ...newState.tiles[tileIndex] };
    const playerIndex = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIndex] };

    if (tile.ownerId === playerId && tile.isMortgaged) {
        // Redeem: 60% of base price (10% interest)
        const cost = Math.floor((tile.price || 0) * 0.6);
        
        if (player.money >= cost) {
            player.money -= cost;
            newState = addMoneyEffect(newState, -cost, player.position);
            tile.isMortgaged = false;

            newState.players[playerIndex] = player;
            newState.tiles[tileIndex] = tile;
            newState.gameLog = [...newState.gameLog, `🔓 ${player.name} 赎回了 ${tile.name}, 花费 $${cost}`];
        }
    }
    return newState;
};

// --- Stock & Move ---

export const buyStock = (state: GameState, playerId: string, companyId: string, shares: number): GameState => {
    let newState = { ...state };
    const playerIndex = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIndex] };
    const company = newState.companies.find(c => c.id === companyId);
    
    if (company && player.money >= shares * company.price) {
        const cost = shares * company.price;
        player.money -= cost;
        newState = addMoneyEffect(newState, -cost, player.position);
        player.portfolio = { ...player.portfolio, [companyId]: (player.portfolio[companyId] || 0) + shares };
        newState.players[playerIndex] = player;
        newState.gameLog = [...newState.gameLog, `📉 ${player.name} 买入 ${shares} 股 ${company.name}.`];
    }
    return newState;
};

export const sellStock = (state: GameState, playerId: string, companyId: string, shares: number): GameState => {
    let newState = { ...state };
    const playerIndex = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIndex] };
    const company = newState.companies.find(c => c.id === companyId);
    const currentShares = player.portfolio[companyId] || 0;

    if (company && currentShares >= shares) {
        const profit = shares * company.price;
        player.money += profit;
        newState = addMoneyEffect(newState, profit, player.position);
        player.portfolio = { ...player.portfolio, [companyId]: currentShares - shares };
        newState.players[playerIndex] = player;
        newState.gameLog = [...newState.gameLog, `📈 ${player.name} 卖出 ${shares} 股 ${company.name}.`];
    }
    return newState;
};

const LOTTERY_PRICE = 300; // 彩票价格

export const buyLottery = (state: GameState, playerId: string, numbers: number[]): GameState => {
    let newState = { ...state };
    const playerIndex = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIndex] };
    
    // 验证号码：必须是3个不同的1-10的数字
    if (numbers.length !== 3 || new Set(numbers).size !== 3 || 
        numbers.some(n => n < 1 || n > 10)) {
        return newState;
    }
    
    if (player.money >= LOTTERY_PRICE) {
        player.money -= LOTTERY_PRICE;
        newState = addMoneyEffect(newState, -LOTTERY_PRICE, player.position);
        
        const ticket = {
            numbers: [...numbers].sort((a, b) => a - b),
            cost: LOTTERY_PRICE
        };
        player.lotteryTickets = [...player.lotteryTickets, ticket];
        newState.players[playerIndex] = player;
        newState.gameLog = [...newState.gameLog, `🎟️ ${player.name} 购买彩票 [${ticket.numbers.join(', ')}]`];
        newState.lotteryJackpot += 150; // 一半进入奖池
    }
    return newState;
};

// AI 购买彩票的辅助函数
export const buyLotteryAI = (state: GameState, playerId: string): GameState => {
    // AI 随机选择 3 个号码
    const numbers: number[] = [];
    while (numbers.length < 3) {
        const num = Math.floor(Math.random() * 10) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return buyLottery(state, playerId, numbers);
};

export const moveOneStep = (state: GameState): GameState => {
    let newState = { ...state };
    const player = { ...newState.players[newState.currentPlayerIndex] };
    const newPos = (player.position + 1) % BOARD_SIZE;
    if (newPos === 0) {
        player.money += 2000;
        newState = addMoneyEffect(newState, 2000, 0);
        newState.gameLog = [...newState.gameLog, `💰 ${player.name} 经过起点! 获得 $2000 工资`];
    }
    player.position = newPos;
    newState.players = [...newState.players];
    newState.players[newState.currentPlayerIndex] = player;
    return newState;
}

export const handleLanding = (state: GameState): { newState: GameState, turnEnded: boolean } => {
  let newState = { ...state };
  const playerIdx = newState.currentPlayerIndex;
  const player = { ...newState.players[playerIdx] };
  const tile = { ...newState.tiles[player.position] };

  if (player.jailTurns > 0) {
      player.jailTurns--;
      newState.gameLog = [...newState.gameLog, `🔒 ${player.name} 正在坐牢, 剩余 ${player.jailTurns} 回合.`];
      newState.players[playerIdx] = player;
      return { newState, turnEnded: true };
  }

  if (tile.type === 'PROPERTY') {
      if (!tile.ownerId) {
          if (player.isAi && player.money >= (tile.price || 0)) {
              return buyProperty(newState, playerIdx);
          } else if (!player.isAi) {
              newState.waitingForAction = true;
              return { newState, turnEnded: false };
          }
      } else if (tile.ownerId !== player.id) {
          const rent = calculateRent(tile);
          if (rent > 0) {
            const ownerIdx = newState.players.findIndex(p => p.id === tile.ownerId);
            if (ownerIdx !== -1) {
                player.money -= rent;
                const owner = { ...newState.players[ownerIdx] };
                owner.money += rent;
                
                // 正确更新 players 数组
                newState.players = [...newState.players];
                newState.players[playerIdx] = player;
                newState.players[ownerIdx] = owner;
                
                newState = addMoneyEffect(newState, -rent, player.position); 
                newState = addMoneyEffect(newState, rent, owner.position); 
                
                newState.gameLog = [...newState.gameLog, `💸 ${player.name} 支付租金 $${rent} (${tile.name})`];
                
                if (player.money < 0) {
                    newState = handleBankruptcy(newState, playerIdx, ownerIdx);
                }
            }
          } else if (tile.isMortgaged) {
              newState.gameLog = [...newState.gameLog, `📝 ${tile.name} 处于抵押状态, 免租金.`];
          }
          return { newState, turnEnded: true };
      } else {
           if (tile.level !== undefined && tile.level < 5 && !tile.isMortgaged) {
               if (player.isAi && player.money >= (tile.price || 0)) {
                   return upgradeProperty(newState, playerIdx);
               } else if (!player.isAi) {
                   newState.waitingForAction = true;
                   return { newState, turnEnded: false };
               }
           }
      }
  }
  
  if (tile.type === 'JAIL') {
      newState.gameLog = [...newState.gameLog, `👮 ${player.name} 去监狱探视.`];
      return { newState, turnEnded: true };
  }
  if (tile.type === 'TO_JAIL') {
      player.position = 7; 
      player.jailTurns = 2;
      newState.gameLog = [...newState.gameLog, `🚔 ${player.name} 被捕入狱! 暂停 2 回合.`];
      newState.players[playerIdx] = player;
      return { newState, turnEnded: true };
  }
  if (tile.type === 'LOTTERY') {
      newState.gameLog = [...newState.gameLog, `🎰 ${player.name} 来到了彩票站.`];
      if (player.isAi && player.money > 500) {
          newState = buyLotteryAI(newState, player.id);
          return { newState, turnEnded: true };
      } else if (!player.isAi) {
          newState.activeModal = 'LOTTERY';
          return { newState, turnEnded: true };
      }
      return { newState, turnEnded: true };
  }
  if (tile.type === 'FATE' || tile.type === 'CHANCE') {
      // 抽取卡片
      const card = tile.type === 'FATE' ? drawFateCard() : drawChanceCard();
      const cardType = tile.type as 'FATE' | 'CHANCE';
      
      // 设置当前卡片状态，显示卡片模态框
      newState.activeCard = {
          card,
          cardType,
          playerId: player.id
      };
      newState.activeModal = 'CARD_REVEAL';
      newState.players[playerIdx] = player;
      
      // 卡片效果将在关闭模态框时应用
      newState.gameLog = [...newState.gameLog, `${cardType === 'FATE' ? '🌟' : '❓'} ${player.name} 抽到了${cardType === 'FATE' ? '命运' : '机会'}卡: ${card.title}`];
      
      return { newState, turnEnded: false }; // 不结束回合，等待卡片效果
  }
  if (tile.type === 'START') {
      newState.gameLog = [...newState.gameLog, `🏁 ${player.name} 正好停在起点.`];
  }
  if (tile.type === 'CORNER') {
      player.restTurns = 1;
      newState.players[playerIdx] = player;
      newState.gameLog = [...newState.gameLog, `☕ ${player.name} 在免费停车处休息，下一回合暂停行动.`];
      return { newState, turnEnded: true };
  }
  return { newState, turnEnded: true };
};

// 计算玩家可变现的总资产价值
export const calculatePotentialAssets = (state: GameState, playerId: string): number => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return 0;
    
    // 1. 计算可出售的房产价值（80%）
    const propertyValue = state.tiles
        .filter(t => t.ownerId === playerId)
        .reduce((sum, tile) => {
            if (tile.isMortgaged) {
                // 已抵押的房产不能再变现，跳过
                return sum;
            }
            const value = (tile.price || 0) * (1 + (tile.level || 0));
            return sum + Math.floor(value * 0.8); // 出售价 80%
        }, 0);
    
    // 2. 计算可抵押的房产价值（50%，仅未抵押的）
    const mortgageValue = state.tiles
        .filter(t => t.ownerId === playerId && !t.isMortgaged)
        .reduce((sum, tile) => {
            return sum + Math.floor((tile.price || 0) * 0.5);
        }, 0);
    
    // 3. 计算股票市值
    const stockValue = state.companies.reduce((sum, company) => {
        const shares = player.portfolio[company.id] || 0;
        return sum + shares * company.price;
    }, 0);
    
    // 返回房产出售价值 + 股票市值（取较高的变现方式）
    return Math.max(propertyValue, mortgageValue) + stockValue;
};

// 检查玩家是否有资产可以变现
export const hasAssetsToLiquidate = (state: GameState, playerId: string): boolean => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return false;
    
    // 检查是否有房产
    const hasProperties = state.tiles.some(t => t.ownerId === playerId && !t.isMortgaged);
    
    // 检查是否有股票
    const hasStocks = Object.values(player.portfolio).some(shares => shares > 0);
    
    return hasProperties || hasStocks;
};

const handleBankruptcy = (state: GameState, debtorIdx: number, creditorIdx: number): GameState => {
    let newState = { ...state };
    const debtor = newState.players[debtorIdx];
    const creditor = newState.players[creditorIdx];
    
    if (debtor.money < 0) {
        const debtAmount = Math.abs(debtor.money); // 欠债金额
        
        // 如果有资产可以变现
        if (hasAssetsToLiquidate(newState, debtor.id)) {
            // 进入资金危机状态，让玩家处理资产
            newState.debtCrisis = {
                debtorId: debtor.id,
                creditorId: creditor.id,
                amount: debtAmount
            };
            newState.activeModal = 'DEBT_CRISIS';
            newState.gameLog = [...newState.gameLog, `⚠️ ${debtor.name} 资金不足! 需要变卖资产偿还 $${debtAmount}`];
            
            // 如果是 AI，自动处理资产
            if (debtor.isAi) {
                newState = autoLiquidateAssets(newState, debtorIdx, creditorIdx);
            }
        } else {
            // 没有资产可以变现，直接破产
            const newDebtor = { ...debtor, isBankrupt: true };
            newState.players = [...newState.players];
            newState.players[debtorIdx] = newDebtor;
            newState.gameLog = [...newState.gameLog, `💀 ${debtor.name} 破产了!`];
            newState.isGameOver = true;
            newState.winner = creditor.name;
        }
    }
    return newState;
};

// AI 自动变卖资产
const autoLiquidateAssets = (state: GameState, debtorIdx: number, creditorIdx: number): GameState => {
    let newState = { ...state };
    const debtorId = newState.players[debtorIdx].id;
    
    // 防止无限循环的安全计数器
    let iterations = 0;
    const maxIterations = 100;
    
    // 循环直到资金为正或无资产可卖
    // 注意：每次循环都重新获取最新的 debtor 状态
    while (iterations < maxIterations) {
        iterations++;
        
        // 每次循环都获取最新的玩家状态
        const currentDebtor = newState.players[debtorIdx];
        
        // 检查是否已经脱离危机
        if (currentDebtor.money >= 0) {
            break;
        }
        
        // 检查是否还有资产可以变现
        const hasLiquidAssets = hasAssetsToLiquidate(newState, debtorId);
        const ownsAnyProperty = newState.tiles.some(t => t.ownerId === debtorId);
        if (!hasLiquidAssets && !ownsAnyProperty) {
            break;
        }
        
        let actionTaken = false;
        
        // 优先卖股票
        for (const company of newState.companies) {
            const shares = currentDebtor.portfolio[company.id] || 0;
            if (shares > 0) {
                newState = sellStock(newState, debtorId, company.id, shares);
                actionTaken = true;
                break;
            }
        }
        
        // 如果卖了股票，继续下一轮循环检查
        if (actionTaken) continue;
        
        // 如果还是负数，抵押房产
        const propertyToMortgage = newState.tiles.find(t => t.ownerId === debtorId && !t.isMortgaged);
        if (propertyToMortgage) {
            newState = mortgageProperty(newState, propertyToMortgage.id, debtorId);
            continue;
        }
        
        // 如果没有可抵押的，卖房产（包括已抵押的）
        const propertyToSell = newState.tiles.find(t => t.ownerId === debtorId);
        if (propertyToSell) {
            newState = sellProperty(newState, propertyToSell.id, debtorId);
            continue;
        }
        
        // 如果没有任何操作可执行，跳出循环防止死循环
        break;
    }
    
    // 清除危机状态
    newState.debtCrisis = null;
    newState.activeModal = null;
    
    // 检查最终是否还是破产
    const finalDebtor = newState.players[debtorIdx];
    if (finalDebtor.money < 0) {
        const newDebtor = { ...finalDebtor, isBankrupt: true };
        newState.players = [...newState.players];
        newState.players[debtorIdx] = newDebtor;
        newState.gameLog = [...newState.gameLog, `💀 ${finalDebtor.name} 破产了!`];
        newState.isGameOver = true;
        newState.winner = newState.players[creditorIdx].name;
    } else {
        newState.gameLog = [...newState.gameLog, `✅ ${finalDebtor.name} 成功变卖资产偿还了债务!`];
    }
    
    return newState;
};

// 解决资金危机（玩家完成资产处理后调用）
export const resolveDebtCrisis = (state: GameState): GameState => {
    const newState = { ...state };
    
    if (!newState.debtCrisis) return newState;
    
    const { debtorId, creditorId } = newState.debtCrisis;
    const debtorIdx = newState.players.findIndex(p => p.id === debtorId);
    const creditorIdx = newState.players.findIndex(p => p.id === creditorId);
    const debtor = newState.players[debtorIdx];
    
    if (debtor.money >= 0) {
        // 成功偿还债务
        newState.gameLog = [...newState.gameLog, `✅ ${debtor.name} 成功偿还了债务!`];
        newState.debtCrisis = null;
        newState.activeModal = null;
    } else if (!hasAssetsToLiquidate(newState, debtorId)) {
        // 无法偿还，破产
        const newDebtor = { ...debtor, isBankrupt: true };
        newState.players = [...newState.players];
        newState.players[debtorIdx] = newDebtor;
        newState.gameLog = [...newState.gameLog, `💀 ${debtor.name} 无力偿还债务，破产了!`];
        newState.isGameOver = true;
        newState.winner = newState.players[creditorIdx].name;
        newState.debtCrisis = null;
        newState.activeModal = null;
    }
    
    return newState;
};

export const buyProperty = (state: GameState, playerIndex: number): { newState: GameState, turnEnded: boolean } => {
  let newState = { ...state };
  const player = { ...newState.players[playerIndex] };
  const tile = { ...newState.tiles[player.position] };

  if (tile.price && player.money >= tile.price) {
    player.money -= tile.price;
    newState = addMoneyEffect(newState, -tile.price, player.position);
    tile.ownerId = player.id;
    
    newState.players = [...newState.players];
    newState.players[playerIndex] = player;
    newState.tiles = [...newState.tiles];
    newState.tiles[player.position] = tile;
    
    newState.gameLog = [...newState.gameLog, `🏠 ${player.name} 购买了 ${tile.name}`];
  }
  newState.waitingForAction = false;
  return { newState, turnEnded: true };
};

export const upgradeProperty = (state: GameState, playerIndex: number): { newState: GameState, turnEnded: boolean } => {
  let newState = { ...state };
  const player = { ...newState.players[playerIndex] };
  const tile = { ...newState.tiles[player.position] };
  const cost = tile.price || 0;

  if (tile.level !== undefined && tile.level < 5 && player.money >= cost) {
    player.money -= cost;
    newState = addMoneyEffect(newState, -cost, player.position);
    tile.level = (tile.level + 1) as PropertyLevel;
    
    newState.players = [...newState.players];
    newState.players[playerIndex] = player;
    newState.tiles = [...newState.tiles];
    newState.tiles[player.position] = tile;
    
    newState.gameLog = [...newState.gameLog, `🔨 ${player.name} 升级了 ${tile.name}`];
  }
  newState.waitingForAction = false;
  return { newState, turnEnded: true };
};

export const skipAction = (state: GameState): GameState => {
    const newState = { ...state };
    newState.waitingForAction = false;
    newState.gameLog = [...newState.gameLog, `⏩ ${newState.players[newState.currentPlayerIndex].name} 跳过`];
    return newState;
}

// 应用卡片效果
export const applyCardEffect = (state: GameState): GameState => {
    if (!state.activeCard) return state;
    
    let newState = { ...state };
    const { card, playerId } = state.activeCard;
    const playerIdx = newState.players.findIndex(p => p.id === playerId);
    const player = { ...newState.players[playerIdx] };
    const effect = card.effect;
    
    switch (effect.type) {
        case 'MONEY': {
            const amount = effect.value || 0;
            player.money += amount;
            newState = addMoneyEffect(newState, amount, player.position);
            newState.gameLog = [...newState.gameLog, 
                amount > 0 
                    ? `💰 ${player.name} 获得 $${amount}`
                    : `💸 ${player.name} 损失 $${Math.abs(amount)}`
            ];
            break;
        }
        
        case 'MOVE_TO': {
            const targetPos = effect.targetPosition ?? 0;
            const shouldCollectSalary = effect.value !== 0; // value: 0 表示不领工资
            
            // 检查是否经过起点
            if (shouldCollectSalary && targetPos < player.position) {
                player.money += 2000;
                newState = addMoneyEffect(newState, 2000, 0);
                newState.gameLog = [...newState.gameLog, `💰 ${player.name} 经过起点! 获得 $2000 工资`];
            }
            
            player.position = targetPos;
            const targetTile = newState.tiles[targetPos];
            newState.gameLog = [...newState.gameLog, `🚀 ${player.name} 被传送到 ${targetTile.name}`];
            break;
        }
        
        case 'MOVE_STEPS': {
            const steps = effect.value || 0;
            const newPos = (player.position + steps + BOARD_SIZE) % BOARD_SIZE;
            
            // 前进时检查是否经过起点
            if (steps > 0 && newPos < player.position) {
                player.money += 2000;
                newState = addMoneyEffect(newState, 2000, 0);
                newState.gameLog = [...newState.gameLog, `💰 ${player.name} 经过起点! 获得 $2000 工资`];
            }
            
            player.position = newPos;
            const targetTile = newState.tiles[newPos];
            newState.gameLog = [...newState.gameLog, 
                steps > 0 
                    ? `🚶 ${player.name} 前进 ${steps} 步到 ${targetTile.name}`
                    : `🚶 ${player.name} 后退 ${Math.abs(steps)} 步到 ${targetTile.name}`
            ];
            break;
        }
        
        case 'GO_TO_JAIL': {
            player.position = 7; // 监狱位置
            player.jailTurns = 2;
            newState.gameLog = [...newState.gameLog, `🚔 ${player.name} 被送进监狱! 暂停 2 回合`];
            break;
        }
        
        case 'GET_OUT_OF_JAIL': {
            const currentCards = newState.jailFreeCards[playerId] || 0;
            newState.jailFreeCards = { ...newState.jailFreeCards, [playerId]: currentCards + 1 };
            newState.gameLog = [...newState.gameLog, `🗝️ ${player.name} 获得一张出狱自由卡!`];
            break;
        }
        
        case 'PAY_EACH_PLAYER': {
            const amount = effect.value || 0;
            const otherPlayers = newState.players.filter(p => p.id !== playerId && !p.isBankrupt);
            const totalPay = amount * otherPlayers.length;
            
            player.money -= totalPay;
            newState = addMoneyEffect(newState, -totalPay, player.position);
            
            newState.players = newState.players.map(p => {
                if (p.id !== playerId && !p.isBankrupt) {
                    const newP = { ...p, money: p.money + amount };
                    newState = addMoneyEffect(newState, amount, newP.position);
                    return newP;
                }
                return p;
            });
            
            newState.gameLog = [...newState.gameLog, `💸 ${player.name} 向每位玩家支付 $${amount}`];
            break;
        }
        
        case 'COLLECT_FROM_EACH': {
            const amount = effect.value || 0;
            const otherPlayers = newState.players.filter(p => p.id !== playerId && !p.isBankrupt);
            const totalCollect = amount * otherPlayers.length;
            
            newState.players = newState.players.map(p => {
                if (p.id !== playerId && !p.isBankrupt) {
                    const newP = { ...p, money: p.money - amount };
                    newState = addMoneyEffect(newState, -amount, newP.position);
                    return newP;
                }
                return p;
            });
            
            player.money += totalCollect;
            newState = addMoneyEffect(newState, totalCollect, player.position);
            
            newState.gameLog = [...newState.gameLog, `💰 ${player.name} 向每位玩家收取 $${amount}`];
            break;
        }
        
        case 'BIRTHDAY': {
            const amount = 500;
            const otherPlayers = newState.players.filter(p => p.id !== playerId && !p.isBankrupt);
            const totalGift = amount * otherPlayers.length;
            
            newState.players = newState.players.map(p => {
                if (p.id !== playerId && !p.isBankrupt) {
                    return { ...p, money: p.money - amount };
                }
                return p;
            });
            
            player.money += totalGift;
            newState = addMoneyEffect(newState, totalGift, player.position);
            
            newState.gameLog = [...newState.gameLog, `🎂 ${player.name} 生日快乐! 收到礼金 $${totalGift}`];
            break;
        }
        
        case 'REPAIR_PROPERTIES': {
            const costPerProperty = effect.value || 0;
            const ownedProperties = newState.tiles.filter(t => t.ownerId === playerId);
            const totalCost = costPerProperty * ownedProperties.length;
            
            if (totalCost > 0) {
                player.money -= totalCost;
                newState = addMoneyEffect(newState, -totalCost, player.position);
                newState.gameLog = [...newState.gameLog, `🔧 ${player.name} 支付 ${ownedProperties.length} 处房产的维修费 $${totalCost}`];
            } else {
                newState.gameLog = [...newState.gameLog, `😌 ${player.name} 没有房产，免于维修费`];
            }
            break;
        }
        
        case 'FREE_UPGRADE': {
            const ownedProperties = newState.tiles.filter(t => 
                t.ownerId === playerId && 
                t.type === 'PROPERTY' && 
                (t.level ?? 0) < 5 && 
                !t.isMortgaged
            );
            
            if (ownedProperties.length > 0) {
                // 随机选择一处房产升级
                const randomProperty = ownedProperties[Math.floor(Math.random() * ownedProperties.length)];
                const tileIdx = newState.tiles.findIndex(t => t.id === randomProperty.id);
                const tile = { ...newState.tiles[tileIdx] };
                tile.level = ((tile.level || 0) + 1) as PropertyLevel;
                
                newState.tiles = [...newState.tiles];
                newState.tiles[tileIdx] = tile;
                
                newState.gameLog = [...newState.gameLog, `🏗️ ${player.name} 的 ${tile.name} 免费升级!`];
            } else {
                // 没有可升级的房产，补偿金钱
                player.money += 1000;
                newState = addMoneyEffect(newState, 1000, player.position);
                newState.gameLog = [...newState.gameLog, `💵 ${player.name} 没有可升级房产，获得补偿金 $1000`];
            }
            break;
        }
        
        case 'STOCK_BONUS': {
            const bonusPerShare = effect.value || 0;
            let totalBonus = 0;
            
            for (const companyId in player.portfolio) {
                const shares = player.portfolio[companyId] || 0;
                totalBonus += shares * bonusPerShare;
            }
            
            if (totalBonus !== 0) {
                player.money += totalBonus;
                newState = addMoneyEffect(newState, totalBonus, player.position);
                newState.gameLog = [...newState.gameLog, 
                    totalBonus > 0 
                        ? `📈 ${player.name} 股票分红获得 $${totalBonus}`
                        : `📉 ${player.name} 股票损失 $${Math.abs(totalBonus)}`
                ];
            } else {
                newState.gameLog = [...newState.gameLog, `📊 ${player.name} 没有持有股票`];
            }
            break;
        }
        
        case 'TAX_REFUND': {
            const amount = effect.value || 0;
            player.money += amount;
            newState = addMoneyEffect(newState, amount, player.position);
            newState.gameLog = [...newState.gameLog, `🏛️ ${player.name} 收到退税 $${amount}`];
            break;
        }
        
        case 'LOTTERY_BOOST': {
            const boostAmount = effect.value || 0;
            newState.lotteryJackpot += boostAmount;
            newState.gameLog = [...newState.gameLog, `🎊 彩票奖池增加 $${boostAmount}! 当前奖池: $${newState.lotteryJackpot}`];
            break;
        }
    }
    
    // 更新玩家状态
    newState.players = [...newState.players];
    newState.players[playerIdx] = player;
    
    // 清除卡片状态
    newState.activeCard = null;
    newState.activeModal = null;
    
    // 检查是否破产
    if (player.money < 0) {
        // 简化处理：如果钱为负且没有特定债权人，算作对银行破产
        const hasAssets = newState.tiles.some(t => t.ownerId === playerId) || 
                         Object.values(player.portfolio).some(s => s > 0);
        
        if (!hasAssets) {
            const newPlayer = { ...player, isBankrupt: true };
            newState.players[playerIdx] = newPlayer;
            newState.gameLog = [...newState.gameLog, `💀 ${player.name} 破产了!`];
            newState.isGameOver = true;
            // 找到另一个玩家作为赢家
            const winner = newState.players.find(p => !p.isBankrupt && p.id !== playerId);
            newState.winner = winner?.name || null;
        }
    }
    
    return newState;
}

// 使用出狱卡
export const useJailFreeCard = (state: GameState, playerId: string): GameState => {
    const newState = { ...state };
    const currentCards = newState.jailFreeCards[playerId] || 0;
    
    if (currentCards > 0) {
        const playerIdx = newState.players.findIndex(p => p.id === playerId);
        const player = { ...newState.players[playerIdx] };
        
        if (player.jailTurns > 0) {
            player.jailTurns = 0;
            newState.jailFreeCards = { ...newState.jailFreeCards, [playerId]: currentCards - 1 };
            newState.players = [...newState.players];
            newState.players[playerIdx] = player;
            newState.gameLog = [...newState.gameLog, `🗝️ ${player.name} 使用出狱自由卡!`];
        }
    }
    
    return newState;
}