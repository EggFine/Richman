<p align="center">
  <img src="https://img.icons8.com/color/96/rich.png" alt="Richman Logo" width="96" height="96"/>
</p>

<h1 align="center">🎲 大富翁 RICHMAN v4</h1>

<p align="center">
  <strong>一款现代化的网页版大富翁桌游</strong>
</p>

<p align="center">
  <a href="./README.md">🇬🇧 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

## ✨ 项目简介

**RICHMAN v4** 是一款精心制作、功能丰富的大富翁风格桌游，使用现代 Web 技术构建。游戏以中国城市为背景，包含动态股票市场、彩票系统、命运与机会卡牌，以及令人惊艳的视觉效果。

<p align="center">
  <em>掷骰子、买地产、让对手破产，成为终极大亨！</em>
</p>

---

## 🎮 游戏特色

### 🗺️ 游戏棋盘
- **28 格棋盘**，包含中国标志性城市（北京、上海、香港等）
- **房产分组**，按颜色分类，价值依次递增
- **特殊格子**：起点、监狱、免费停车、去监狱、命运、机会、彩票站

### 🏠 房产系统

| 功能 | 说明 |
|------|------|
| **购买** | 踩到无主房产时可购买 |
| **升级** | 最多可升级至 **5 级** |
| **租金** | 向对手收取租金（指数增长：`基础租金 × 3^等级`）|
| **抵押** | 紧急情况下可抵押房产，获得 50% 基础价格 |
| **赎回** | 支付 60% 基础价格赎回已抵押房产 |
| **出售** | 以 80% 总价值出售房产 |

### 📈 股票市场

在 6 家模拟中国公司中进行股票交易，体验真实的价格波动：

| 公司 | 行业 | 波动性 |
|------|------|--------|
| 🐧 企鹅科技 | 科技 | 高 (15%) |
| 🛒 福报电商 | 互联网 | 中 (12%) |
| 🍶 酱香白酒 | 消费 | 低 (5%) |
| 🚗 新能源车 | 制造 | 极高 (25%) |
| 🏦 宇宙银行 | 金融 | 极低 (3%) |
| 💊 神奇制药 | 医疗 | 高 (18%) |

- 每日股价根据波动性变化
- 历史价格走势图
- 低买高卖策略

### 🎰 彩票系统

- **选择 3 个号码**（1-10）购买彩票（每张 $300）
- **每 7 天开奖**一次
- **奖金等级**：
  - 🥉 中 1 个：返还票价
  - 🥈 中 2 个：5 倍奖金
  - 🥇 中 3 个：**头奖！**（起始 $5,000，滚存累积）

### 🃏 命运与机会卡牌

36 张独特卡牌，效果多样：

| 效果类型 | 示例 |
|----------|------|
| 💰 金钱 | 获得/失去现金、退税、医疗费 |
| 🚀 移动 | 传送到指定位置、前进/后退 |
| 🔒 监狱 | 直接入狱、获得出狱自由卡 |
| 🎁 互动 | 向其他玩家收取/支付、生日礼金 |
| 🏗️ 房产 | 免费升级、维修费用 |
| 📊 股票 | 股票分红、股市崩盘 |
| 🎊 彩票 | 奖池增加 |

### 🤖 AI 对手

- 智能 AI，做出策略性决策
- 自动购买和升级房产
- 债务危机时智能变卖资产

### 💫 视觉效果

- **金额飘字**：交易时的浮动文字
- **粒子效果**：重大事件时的金钱散落动画
- **流畅动画**：由 Framer Motion 驱动
- **响应式设计**：适配各种屏幕尺寸

### 💾 游戏存档

- 自动保存至 localStorage
- 随时继续游戏
- 可选重置选项

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| [React 19](https://react.dev/) | UI 框架 |
| [TypeScript 5.9](https://www.typescriptlang.org/) | 类型安全 |
| [Vite](https://vite.dev/) (Rolldown) | 构建工具 |
| [Tailwind CSS 4](https://tailwindcss.com/) | 样式 |
| [Framer Motion](https://www.framer.com/motion/) | 动画 |
| [Recharts](https://recharts.org/) | 股票图表 |
| [Lucide React](https://lucide.dev/) | 图标 |

---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm（推荐）

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/richman.git
cd richman

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 生产构建

```bash
# 创建生产构建
pnpm build

# 预览生产构建
pnpm preview
```

---

## 📁 项目结构

```
richman/
├── src/
│   ├── components/          # React 组件
│   │   ├── GameBoard.tsx    # 主游戏棋盘
│   │   ├── Tile.tsx         # 棋盘格子组件
│   │   ├── PlayerInfo.tsx   # 玩家状态显示
│   │   ├── Controls.tsx     # 游戏控制
│   │   ├── StockModal.tsx   # 股票交易界面
│   │   ├── LotteryModal.tsx # 彩票购买界面
│   │   ├── AssetsModal.tsx  # 资产管理
│   │   ├── DebtCrisisModal.tsx # 债务处理
│   │   ├── CardRevealModal.tsx # 命运/机会卡展示
│   │   └── ...
│   ├── game/
│   │   ├── types.ts         # TypeScript 类型定义
│   │   ├── config.ts        # 游戏配置
│   │   ├── cards.ts         # 命运与机会卡牌
│   │   └── logic.ts         # 游戏逻辑与状态
│   ├── App.tsx              # 主应用
│   └── main.tsx             # 入口文件
├── public/                  # 静态资源
└── dist/                    # 生产构建
```

---

## 🎯 游戏规则

### 目标
通过策略性的房产管理、股票交易和一点运气，让对手破产，成为最后的赢家！

### 回合流程
1. **掷骰子** - 掷两个骰子，顺时针移动
2. **落地行动** - 根据格子类型执行操作
3. **可选行动** - 交易股票、购买彩票
4. **结束回合** - 轮到下一位玩家

### 房产机制
- 踩到无主房产：可选择购买
- 踩到自己的房产：可选择升级
- 踩到对手的房产：支付租金
- 已抵押房产不产生租金

### 特殊格子

| 格子 | 效果 |
|------|------|
| 🏁 起点 | 经过时领取 $2,000 工资 |
| 🔒 监狱 | 仅探视（无惩罚）|
| 🚔 去监狱 | 被关押 2 回合 |
| ☕ 免费停车 | 休息（无效果）|
| 🟣 命运 | 抽取命运卡 |
| 🟠 机会 | 抽取机会卡 |
| 🎰 彩票 | 购买彩票 |

### 破产机制

当资金变为负数时：
1. 如果有资产，进入**债务危机**模式
2. 出售房产、股票或抵押以筹集资金
3. 如果无法偿还，你将**破产** - 游戏结束！

---

## 🎨 界面预览

> *游戏采用深色主题设计，配以鲜明的强调色，响应式布局，精致的 UI 组件。*

---

## 🗺️ 开发路线

- [ ] 多人联机支持
- [ ] 更多城市和棋盘变体
- [ ] 成就系统
- [ ] 音效和音乐
- [ ] 移动端 App
- [ ] 自定义游戏规则

---

## 🤝 参与贡献

欢迎贡献代码！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 开源协议

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- 灵感来源于经典大富翁桌游
- 中国城市名称和公司均为虚构/戏谑
- 使用现代 Web 技术用 ❤️ 构建

---

<p align="center">
  <strong>⭐ 如果你喜欢这个游戏，请给个 Star！⭐</strong>
</p>

<p align="center">
  用 🎲 和 ☕ 制作
</p>

