// i18n 类型定义

export type Language = 'zh' | 'en';

export interface Translations {
  // === 通用 ===
  common: {
    confirm: string;
    cancel: string;
    close: string;
    back: string;
    day: string;
    days: string;
    turn: string;
    player: string;
    ai: string;
    me: string;
    waiting: string;
    shares: string;
    step: string;
  };

  // === 主界面 ===
  app: {
    title: string;
    version: string;
    dayLabel: string;
    drawIn: string;
    centralPark: string;
    myAssets: string;
    gameLog: string;
    wins: string;
    playAgain: string;
    confirmReset: string;
    eventTitle: string;
  };

  // === 控制面板 ===
  controls: {
    stock: string;
    lottery: string;
    restart: string;
    rollDice: string;
    waiting: string;
    buyProperty: string;
    upgradeBuilding: string;
    skip: string;
  };

  // === 玩家信息 ===
  playerInfo: {
    yourTurn: string;
    bankrupt: string;
    jail: string;
    rest: string;
    jailFreeCards: string;
    useJailCard: string;
  };

  // === 股票市场 ===
  stock: {
    title: string;
    subtitle: string;
    holding: string;
    cash: string;
    stepSize: string;
    buy: string;
    sell: string;
    volatility: string;
    code: string;
    price: string;
  };

  // === 彩票 ===
  lottery: {
    title: string;
    currentJackpot: string;
    drawIn: string;
    pickNumbers: string;
    selected: string;
    myTickets: string;
    noTickets: string;
    buyTicket: string;
    pickMore: string;
    notEnoughCash: string;
    ticketNum: string;
    cost: string;
  };

  // === 资产管理 ===
  assets: {
    title: string;
    noProperties: string;
    propertyCount: string;
    totalValue: string;
    currentRent: string;
    level: string;
    valuation: string;
    mortgage: string;
    redeem: string;
    sell: string;
    mortgaged: string;
    noHouses: string;
    rent: string;
  };

  // === 债务危机 ===
  debtCrisis: {
    title: string;
    subtitle: string;
    debtAmount: string;
    currentBalance: string;
    needMore: string;
    status: string;
    resolved: string;
    myProperties: string;
    clickToMortgageOrSell: string;
    myStocks: string;
    clickToSellStocks: string;
    sellAll: string;
    noAssetsToSell: string;
    cannotRepay: string;
    declareBankruptcy: string;
    debtCleared: string;
    clickToContinue: string;
    tip: string;
  };

  // === 卡片展示 ===
  cardReveal: {
    fate: string;
    chance: string;
    fateTitle: string;
    chanceTitle: string;
    playerTurn: string;
    clickToContinue: string;
  };

  // === 地块类型 ===
  tileTypes: {
    start: string;
    jail: string;
    toJail: string;
    parking: string;
    fate: string;
    chance: string;
    lotteryDesc: string;
    startDesc: string;
    jailDesc: string;
    toJailDesc: string;
    parkingDesc: string;
  };

  // === 城市名称 ===
  cities: {
    taipei: string;
    kaohsiung: string;
    hongKong: string;
    macau: string;
    shenzhen: string;
    guangzhou: string;
    changsha: string;
    wuhan: string;
    chengdu: string;
    chongqing: string;
    xian: string;
    nanjing: string;
    hangzhou: string;
    qingdao: string;
    dalian: string;
    tianjin: string;
    shanghai: string;
    beijing: string;
  };

  // === 公司名称 ===
  companies: {
    penguin: string;
    huawei: string;
    bytedance: string;
    alibaba: string;
    jd: string;
    moutai: string;
    milkTea: string;
    ev: string;
    solar: string;
    bank: string;
    insurance: string;
    pharma: string;
  };

  // === 行业 ===
  industries: {
    tech: string;
    internet: string;
    consumer: string;
    manufacturing: string;
    finance: string;
    healthcare: string;
  };

  // === 命运卡 ===
  fateCards: {
    lottery_win_title: string;
    lottery_win_desc: string;
    inheritance_title: string;
    inheritance_desc: string;
    birthday_title: string;
    birthday_desc: string;
    stock_dividend_title: string;
    stock_dividend_desc: string;
    teleport_title: string;
    teleport_desc: string;
    free_vacation_title: string;
    free_vacation_desc: string;
    tax_refund_title: string;
    tax_refund_desc: string;
    jail_free_title: string;
    jail_free_desc: string;
    free_upgrade_title: string;
    free_upgrade_desc: string;
    charity_title: string;
    charity_desc: string;
    medical_title: string;
    medical_desc: string;
    kidnapped_title: string;
    kidnapped_desc: string;
    stock_crash_title: string;
    stock_crash_desc: string;
    car_accident_title: string;
    car_accident_desc: string;
    property_repair_title: string;
    property_repair_desc: string;
    scam_title: string;
    scam_desc: string;
    shopping_spree_title: string;
    shopping_spree_desc: string;
    bad_luck_title: string;
    bad_luck_desc: string;
  };

  // === 机会卡 ===
  chanceCards: {
    investment_return_title: string;
    investment_return_desc: string;
    lottery_boost_title: string;
    lottery_boost_desc: string;
    fly_shanghai_title: string;
    fly_shanghai_desc: string;
    found_wallet_title: string;
    found_wallet_desc: string;
    livestream_title: string;
    livestream_desc: string;
    lucky_advance_title: string;
    lucky_advance_desc: string;
    fund_redemption_title: string;
    fund_redemption_desc: string;
    lawyer_jail_free_title: string;
    lawyer_jail_free_desc: string;
    project_win_title: string;
    project_win_desc: string;
    renovation_title: string;
    renovation_desc: string;
    speeding_title: string;
    speeding_desc: string;
    dui_title: string;
    dui_desc: string;
    school_tax_title: string;
    school_tax_desc: string;
    bad_investment_title: string;
    bad_investment_desc: string;
    dinner_treat_title: string;
    dinner_treat_desc: string;
    insurance_title: string;
    insurance_desc: string;
    lost_title: string;
    lost_desc: string;
    deported_title: string;
    deported_desc: string;
  };

  // === 游戏日志消息 ===
  logs: {
    rollDice: (name: string, d1: number, d2: number, total: number) => string;
    inJail: (name: string, turns: number) => string;
    continueRest: (name: string, turns: number) => string;
    endRest: (name: string) => string;
    buyProperty: (name: string, tileName: string, price: number) => string;
    upgradeProperty: (name: string, tileName: string, level: number) => string;
    payRent: (name: string, ownerName: string, amount: number) => string;
    passStart: (name: string, salary: number) => string;
    goToJail: (name: string) => string;
    freeParking: (name: string) => string;
    lotteryWin: (name: string, matches: number, prize: number) => string;
    lotteryNoWin: (name: string) => string;
    bankrupt: (name: string) => string;
    wins: (name: string) => string;
    buyStock: (name: string, company: string, shares: number, cost: number) => string;
    sellStock: (name: string, company: string, shares: number, revenue: number) => string;
    buyLottery: (name: string, numbers: number[]) => string;
    stockChange: (company: string, oldPrice: number, newPrice: number, isUp: boolean) => string;
    sellProperty: (name: string, tileName: string, value: number) => string;
    mortgageProperty: (name: string, tileName: string, value: number) => string;
    redeemProperty: (name: string, tileName: string, cost: number) => string;
    cantAffordRent: (name: string, amount: number) => string;
  };
}

