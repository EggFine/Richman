import type { Tile, Company } from './types';

export const BOARD_SIZE = 28;
export const INITIAL_MONEY = 15000;

// Companies for the Stock Market
export const INITIAL_COMPANIES: Company[] = [
  { id: 'c1', name: '企鹅科技', price: 300, volatility: 0.15, history: [300, 300, 300, 300, 300], industry: '科技', color: 'text-blue-400' },
  { id: 'c2', name: '福报电商', price: 200, volatility: 0.12, history: [200, 200, 200, 200, 200], industry: '互联网', color: 'text-orange-400' },
  { id: 'c3', name: '酱香白酒', price: 1800, volatility: 0.05, history: [1800, 1800, 1800, 1800, 1800], industry: '消费', color: 'text-red-500' },
  { id: 'c4', name: '新能源车', price: 150, volatility: 0.25, history: [150, 150, 150, 150, 150], industry: '制造', color: 'text-green-400' },
  { id: 'c5', name: '宇宙银行', price: 50, volatility: 0.03, history: [50, 50, 50, 50, 50], industry: '金融', color: 'text-yellow-400' },
  { id: 'c6', name: '神奇制药', price: 400, volatility: 0.18, history: [400, 400, 400, 400, 400], industry: '医疗', color: 'text-pink-400' },
];

// Map Layout: Clockwise from Bottom-Right
// 0: BR, 7: BL, 14: TL, 21: TR
export const INITIAL_TILES: Tile[] = [
  // --- Bottom Row (Right to Left) ---
  { id: 0, name: "起点", type: 'START', color: 'gray', description: "领工资" }, // Bottom-Right
  { id: 1, name: "台北", type: 'PROPERTY', price: 800, baseRent: 60, level: 0, color: 'indigo' },
  { id: 2, name: "大乐透", type: 'LOTTERY', color: 'pink', description: "搏一搏" },
  { id: 3, name: "高雄", type: 'PROPERTY', price: 900, baseRent: 70, level: 0, color: 'indigo' },
  { id: 4, name: "命运", type: 'FATE', color: 'purple' },
  { id: 5, name: "香港", type: 'PROPERTY', price: 1500, baseRent: 120, level: 0, color: 'indigo' },
  { id: 6, name: "澳门", type: 'PROPERTY', price: 1400, baseRent: 110, level: 0, color: 'indigo' },
  
  // --- Corner Bottom-Left ---
  { id: 7, name: "监狱", type: 'JAIL', color: 'gray', description: "探监/坐牢" },

  // --- Left Column (Bottom to Top) ---
  { id: 8, name: "深圳", type: 'PROPERTY', price: 2000, baseRent: 160, level: 0, color: 'blue' },
  { id: 9, name: "广州", type: 'PROPERTY', price: 1800, baseRent: 150, level: 0, color: 'blue' },
  { id: 10, name: "机会", type: 'CHANCE', color: 'orange' },
  { id: 11, name: "长沙", type: 'PROPERTY', price: 1600, baseRent: 130, level: 0, color: 'blue' },
  { id: 12, name: "武汉", type: 'PROPERTY', price: 1700, baseRent: 140, level: 0, color: 'blue' },
  { id: 13, name: "大乐透", type: 'LOTTERY', color: 'pink' },

  // --- Corner Top-Left ---
  { id: 14, name: "免费停车", type: 'CORNER', color: 'gray', description: "休息一回" },

  // --- Top Row (Left to Right) ---
  { id: 15, name: "成都", type: 'PROPERTY', price: 2200, baseRent: 180, level: 0, color: 'green' },
  { id: 16, name: "重庆", type: 'PROPERTY', price: 2300, baseRent: 190, level: 0, color: 'green' },
  { id: 17, name: "命运", type: 'FATE', color: 'purple' },
  { id: 18, name: "西安", type: 'PROPERTY', price: 2400, baseRent: 200, level: 0, color: 'green' },
  { id: 19, name: "南京", type: 'PROPERTY', price: 2600, baseRent: 220, level: 0, color: 'green' },
  { id: 20, name: "杭州", type: 'PROPERTY', price: 2800, baseRent: 240, level: 0, color: 'green' },

  // --- Corner Top-Right ---
  { id: 21, name: "被捕入狱", type: 'TO_JAIL', color: 'gray', description: "直接坐牢" },

  // --- Right Column (Top to Bottom) ---
  { id: 22, name: "青岛", type: 'PROPERTY', price: 3000, baseRent: 260, level: 0, color: 'rose' },
  { id: 23, name: "大连", type: 'PROPERTY', price: 3200, baseRent: 280, level: 0, color: 'rose' },
  { id: 24, name: "机会", type: 'CHANCE', color: 'orange' },
  { id: 25, name: "天津", type: 'PROPERTY', price: 3500, baseRent: 300, level: 0, color: 'rose' },
  { id: 26, name: "上海", type: 'PROPERTY', price: 4500, baseRent: 400, level: 0, color: 'rose' },
  { id: 27, name: "北京", type: 'PROPERTY', price: 5000, baseRent: 500, level: 0, color: 'rose' },
];
