export type PropertyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type TileType = 
  | 'START' | 'PROPERTY' | 'CORNER' | 'FATE' | 'CHANCE' | 'JAIL' | 'TO_JAIL' | 'LOTTERY';

// 命运/机会卡片效果类型
export type CardEffectType = 
  | 'MONEY'           // 获得/失去金钱
  | 'MOVE_TO'         // 传送到指定位置
  | 'MOVE_STEPS'      // 前进/后退若干步
  | 'GO_TO_JAIL'      // 入狱
  | 'GET_OUT_OF_JAIL' // 出狱卡
  | 'PAY_EACH_PLAYER' // 向每位玩家支付
  | 'COLLECT_FROM_EACH' // 向每位玩家收取
  | 'REPAIR_PROPERTIES' // 房产维修费
  | 'FREE_UPGRADE'    // 免费升级一处房产
  | 'STOCK_BONUS'     // 股票分红/股灾
  | 'BIRTHDAY'        // 生日收礼
  | 'TAX_REFUND'      // 退税
  | 'LOTTERY_BOOST';  // 彩票奖池增加

export interface CardEffect {
  type: CardEffectType;
  value?: number;        // 金额或步数
  targetPosition?: number; // 目标位置（用于传送）
}

export interface FateChanceCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  effect: CardEffect;
  isGood: boolean; // 是好事还是坏事，影响卡片样式
}

// 当前展示的卡片信息
export interface ActiveCard {
  card: FateChanceCard;
  cardType: 'FATE' | 'CHANCE';
  playerId: string;
}

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  price?: number;
  baseRent?: number;
  ownerId?: string | null;
  level?: PropertyLevel;
  color?: string;
  description?: string;
  isMortgaged?: boolean; // New: Mortgage status
}

export interface Company {
  id: string;
  name: string;
  price: number;
  volatility: number;
  history: number[];
  industry: string;
  color: string;
}

export interface VisualEffect {
  id: string;
  type: 'FLOAT_TEXT' | 'MONEY_SHOWER';
  text: string;
  value: number;
  position: number;
  timestamp: number;
  // 仙女散花效果需要的额外数据
  particles?: Array<{
    id: string;
    x: number;
    y: number;
    rotation: number;
    delay: number;
    scale: number;
  }>;
}

export interface LotteryTicket {
  numbers: number[];  // 玩家选择的 3 个号码
  cost: number;       // 购买成本
}

export interface Player {
  id: string;
  name: string;
  color: string; 
  money: number;
  position: number;
  isAi: boolean;
  isBankrupt: boolean;
  jailTurns: number;
  portfolio: Record<string, number>;
  lotteryTickets: LotteryTicket[];  // 改为彩票数组
}

// 资金危机状态 - 当玩家资金不足但有资产时触发
export interface DebtCrisis {
  debtorId: string;      // 欠债玩家ID
  creditorId: string;    // 债权人玩家ID
  amount: number;        // 需要偿还的金额（正数）
}

export interface GameState {
  players: Player[];
  tiles: Tile[];
  companies: Company[];
  currentPlayerIndex: number;
  diceValue: number[] | null; // 两个骰子的值
  gameLog: string[];
  winner: string | null;
  isGameOver: boolean;
  waitingForAction: boolean;
  
  day: number;
  lotteryJackpot: number;
  daysUntilDraw: number;
  
  modalMessage: string | null;
  modalTitle?: string;
  activeModal: 'STOCK' | 'LOTTERY' | 'ASSETS' | 'DEBT_CRISIS' | 'CARD_REVEAL' | null;
  
  visualEffects: VisualEffect[];
  
  // 资金危机状态
  debtCrisis: DebtCrisis | null;
  
  // 当前展示的命运/机会卡片
  activeCard: ActiveCard | null;
  
  // 玩家持有的出狱卡数量
  jailFreeCards: Record<string, number>;
}