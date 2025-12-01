import type { FateChanceCard } from './types';

// 命运卡片 - 更多命运相关、人生大事
export const FATE_CARDS: FateChanceCard[] = [
  // 好的命运
  {
    id: 'fate_01',
    title: '彩票头奖',
    description: '买彩票中了头奖！获得 $3000',
    emoji: '🎰',
    effect: { type: 'MONEY', value: 3000 },
    isGood: true
  },
  {
    id: 'fate_02',
    title: '神秘遗产',
    description: '远方亲戚留下遗产，获得 $2500',
    emoji: '📜',
    effect: { type: 'MONEY', value: 2500 },
    isGood: true
  },
  {
    id: 'fate_03',
    title: '生日快乐',
    description: '今天是你的生日！每位玩家送你 $500',
    emoji: '🎂',
    effect: { type: 'BIRTHDAY' },
    isGood: true
  },
  {
    id: 'fate_04',
    title: '股票分红',
    description: '持有股票的公司大涨，每股获得 $50 分红',
    emoji: '📈',
    effect: { type: 'STOCK_BONUS', value: 50 },
    isGood: true
  },
  {
    id: 'fate_05',
    title: '穿越时空',
    description: '神秘力量将你传送到起点，并领取工资！',
    emoji: '⚡',
    effect: { type: 'MOVE_TO', targetPosition: 0 },
    isGood: true
  },
  {
    id: 'fate_06',
    title: '免费度假',
    description: '获得免费度假券，传送到免费停车处休息',
    emoji: '🏖️',
    effect: { type: 'MOVE_TO', targetPosition: 14 },
    isGood: true
  },
  {
    id: 'fate_07',
    title: '政府退税',
    description: '收到退税通知，获得 $1500',
    emoji: '🏛️',
    effect: { type: 'TAX_REFUND', value: 1500 },
    isGood: true
  },
  {
    id: 'fate_08',
    title: '出狱自由卡',
    description: '获得一张出狱自由卡，可在入狱时免费使用',
    emoji: '🗝️',
    effect: { type: 'GET_OUT_OF_JAIL' },
    isGood: true
  },
  {
    id: 'fate_09',
    title: '房产升值',
    description: '政府改造项目让你的一处房产免费升级！',
    emoji: '🏗️',
    effect: { type: 'FREE_UPGRADE' },
    isGood: true
  },
  {
    id: 'fate_10',
    title: '慈善晚宴',
    description: '富豪的慈善晚宴，每位玩家向你捐赠 $300',
    emoji: '🥂',
    effect: { type: 'COLLECT_FROM_EACH', value: 300 },
    isGood: true
  },
  
  // 坏的命运
  {
    id: 'fate_11',
    title: '医疗费用',
    description: '突发疾病住院，支付医疗费 $1500',
    emoji: '🏥',
    effect: { type: 'MONEY', value: -1500 },
    isGood: false
  },
  {
    id: 'fate_12',
    title: '绑架入狱',
    description: '被神秘人绑架扔进监狱！',
    emoji: '👮',
    effect: { type: 'GO_TO_JAIL' },
    isGood: false
  },
  {
    id: 'fate_13',
    title: '股市崩盘',
    description: '股市暴跌，每股损失 $30',
    emoji: '📉',
    effect: { type: 'STOCK_BONUS', value: -30 },
    isGood: false
  },
  {
    id: 'fate_14',
    title: '车祸事故',
    description: '遭遇车祸，支付修车费 $800',
    emoji: '🚗',
    effect: { type: 'MONEY', value: -800 },
    isGood: false
  },
  {
    id: 'fate_15',
    title: '房产维修',
    description: '台风过境，每处房产支付 $200 维修费',
    emoji: '🌀',
    effect: { type: 'REPAIR_PROPERTIES', value: 200 },
    isGood: false
  },
  {
    id: 'fate_16',
    title: '诈骗陷阱',
    description: '被电话诈骗，损失 $1200',
    emoji: '☎️',
    effect: { type: 'MONEY', value: -1200 },
    isGood: false
  },
  {
    id: 'fate_17',
    title: '败家一日',
    description: '冲动消费，每位玩家获得你的 $400',
    emoji: '🛍️',
    effect: { type: 'PAY_EACH_PLAYER', value: 400 },
    isGood: false
  },
  {
    id: 'fate_18',
    title: '倒霉透顶',
    description: '后退 3 步，希望那不是监狱...',
    emoji: '🦶',
    effect: { type: 'MOVE_STEPS', value: -3 },
    isGood: false
  }
];

// 机会卡片 - 更多机遇和投机相关
export const CHANCE_CARDS: FateChanceCard[] = [
  // 好的机会
  {
    id: 'chance_01',
    title: '投资回报',
    description: '早期投资获得回报，赚取 $2000',
    emoji: '💰',
    effect: { type: 'MONEY', value: 2000 },
    isGood: true
  },
  {
    id: 'chance_02',
    title: '彩票奖池膨胀',
    description: '政府补贴，彩票奖池增加 $3000！',
    emoji: '🎊',
    effect: { type: 'LOTTERY_BOOST', value: 3000 },
    isGood: true
  },
  {
    id: 'chance_03',
    title: '直达上海',
    description: '获得免费机票，直飞上海！',
    emoji: '✈️',
    effect: { type: 'MOVE_TO', targetPosition: 26 },
    isGood: true
  },
  {
    id: 'chance_04',
    title: '路边捡钱',
    description: '在路上捡到一个钱包，获得 $500',
    emoji: '👛',
    effect: { type: 'MONEY', value: 500 },
    isGood: true
  },
  {
    id: 'chance_05',
    title: '粉丝打赏',
    description: '你的直播火了！每位玩家打赏你 $250',
    emoji: '📱',
    effect: { type: 'COLLECT_FROM_EACH', value: 250 },
    isGood: true
  },
  {
    id: 'chance_06',
    title: '幸运前行',
    description: '幸运之神眷顾，前进 3 步！',
    emoji: '🍀',
    effect: { type: 'MOVE_STEPS', value: 3 },
    isGood: true
  },
  {
    id: 'chance_07',
    title: '基金赎回',
    description: '定投基金到期，获得收益 $1800',
    emoji: '📊',
    effect: { type: 'MONEY', value: 1800 },
    isGood: true
  },
  {
    id: 'chance_08',
    title: '出狱自由卡',
    description: '律师朋友送你一张出狱自由卡',
    emoji: '⚖️',
    effect: { type: 'GET_OUT_OF_JAIL' },
    isGood: true
  },
  {
    id: 'chance_09',
    title: '工程中标',
    description: '你的公司中标大项目，获利 $2200',
    emoji: '🏢',
    effect: { type: 'MONEY', value: 2200 },
    isGood: true
  },
  {
    id: 'chance_10',
    title: '地产翻新',
    description: '设计师免费帮你翻新一处房产！',
    emoji: '🎨',
    effect: { type: 'FREE_UPGRADE' },
    isGood: true
  },
  
  // 坏的机会
  {
    id: 'chance_11',
    title: '超速罚单',
    description: '开车超速被抓，罚款 $600',
    emoji: '🚔',
    effect: { type: 'MONEY', value: -600 },
    isGood: false
  },
  {
    id: 'chance_12',
    title: '酒驾入狱',
    description: '酒驾被查，直接进监狱！',
    emoji: '🍺',
    effect: { type: 'GO_TO_JAIL' },
    isGood: false
  },
  {
    id: 'chance_13',
    title: '学区房税',
    description: '新的学区房政策，每处房产交税 $150',
    emoji: '🏫',
    effect: { type: 'REPAIR_PROPERTIES', value: 150 },
    isGood: false
  },
  {
    id: 'chance_14',
    title: '投资失败',
    description: '听信小道消息炒股亏损 $1000',
    emoji: '💸',
    effect: { type: 'MONEY', value: -1000 },
    isGood: false
  },
  {
    id: 'chance_15',
    title: '请客吃饭',
    description: '朋友聚会你买单，每位玩家获得 $300',
    emoji: '🍽️',
    effect: { type: 'PAY_EACH_PLAYER', value: 300 },
    isGood: false
  },
  {
    id: 'chance_16',
    title: '保险理赔',
    description: '保险公司要求你补交保费 $700',
    emoji: '📋',
    effect: { type: 'MONEY', value: -700 },
    isGood: false
  },
  {
    id: 'chance_17',
    title: '迷路困扰',
    description: '导航出错，后退 2 步',
    emoji: '🗺️',
    effect: { type: 'MOVE_STEPS', value: -2 },
    isGood: false
  },
  {
    id: 'chance_18',
    title: '被遣返起点',
    description: '签证问题被遣返起点（不领工资）',
    emoji: '🛂',
    effect: { type: 'MOVE_TO', targetPosition: 0, value: 0 }, // value: 0 表示不领工资
    isGood: false
  }
];

// 随机抽取一张卡片
export const drawFateCard = (): FateChanceCard => {
  return FATE_CARDS[Math.floor(Math.random() * FATE_CARDS.length)];
};

export const drawChanceCard = (): FateChanceCard => {
  return CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
};



