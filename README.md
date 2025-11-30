<p align="center">
  <img src="https://img.icons8.com/color/96/rich.png" alt="Richman Logo" width="96" height="96"/>
</p>

<h1 align="center">🎲 RICHMAN v4</h1>

<p align="center">
  <strong>A Modern Web-Based Monopoly-Style Board Game</strong>
</p>

<p align="center">
  <a href="./README_CHS.md">🇨🇳 简体中文</a>
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

## ✨ Overview

**RICHMAN v4** is a beautifully crafted, feature-rich Monopoly-style board game built with modern web technologies. Experience the classic real estate trading gameplay with Chinese cities, complete with a dynamic stock market, lottery system, fate & chance cards, and stunning visual effects.

<p align="center">
  <em>Roll the dice, buy properties, bankrupt your opponents, and become the ultimate tycoon!</em>
</p>

---

## 🎮 Features

### 🗺️ Game Board
- **28-tile board** featuring iconic Chinese cities (Beijing, Shanghai, Hong Kong, etc.)
- **Property tiers** organized by color groups with escalating values
- **Special tiles**: Start, Jail, Free Parking, Go to Jail, Fate, Chance, and Lottery stations

### 🏠 Property System
| Feature | Description |
|---------|-------------|
| **Purchase** | Buy unowned properties when you land on them |
| **Upgrade** | Build up to **5 levels** on your properties |
| **Rent** | Collect rent from opponents (exponential scaling: `baseRent × 3^level`) |
| **Mortgage** | Mortgage properties for 50% of base price in emergencies |
| **Redeem** | Buy back mortgaged properties for 60% of base price |
| **Sell** | Sell properties at 80% of total value |

### 📈 Stock Market
Trade shares in 6 simulated Chinese companies with realistic price volatility:

| Company | Industry | Volatility |
|---------|----------|------------|
| 🐧 Penguin Tech | Technology | High (15%) |
| 🛒 Fubo E-commerce | Internet | Medium (12%) |
| 🍶 Moutai Liquor | Consumer | Low (5%) |
| 🚗 New Energy Auto | Manufacturing | Very High (25%) |
| 🏦 Universe Bank | Finance | Very Low (3%) |
| 💊 Wonder Pharma | Healthcare | High (18%) |

- Daily price fluctuations based on volatility
- Historical price charts with sparklines
- Buy low, sell high strategy

### 🎰 Lottery System
- **Pick 3 numbers** (1-10) for each ticket ($300 per ticket)
- **Weekly draws** every 7 game days
- **Prize tiers**:
  - 🥉 1 match: Ticket refund
  - 🥈 2 matches: 5× payout
  - 🥇 3 matches: **JACKPOT!** (starts at $5,000, rolls over)

### 🃏 Fate & Chance Cards
36 unique cards with diverse effects:

| Effect Type | Examples |
|------------|----------|
| 💰 Money | Win/lose cash, tax refunds, medical bills |
| 🚀 Movement | Teleport to locations, move forward/backward |
| 🔒 Jail | Go directly to jail, get out of jail free cards |
| 🎁 Interactions | Collect/pay other players, birthday gifts |
| 🏗️ Property | Free upgrades, repair costs |
| 📊 Stock | Dividends, market crashes |
| 🎊 Lottery | Jackpot boosts |

### 🤖 AI Opponent
- Smart AI that makes strategic decisions
- Automatic property purchases and upgrades
- Intelligent asset liquidation during debt crises

### 💫 Visual Effects
- **Floating text** for money transactions
- **Particle effects** for major events (money showers!)
- **Smooth animations** powered by Framer Motion
- **Responsive design** for various screen sizes

### 💾 Game Persistence
- Automatic save to localStorage
- Resume your game anytime
- Reset option available

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI Framework |
| [TypeScript 5.9](https://www.typescriptlang.org/) | Type Safety |
| [Vite](https://vite.dev/) (Rolldown) | Build Tool |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Recharts](https://recharts.org/) | Stock Charts |
| [Lucide React](https://lucide.dev/) | Icons |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/richman.git
cd richman

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production

```bash
# Create production build
pnpm build

# Preview production build
pnpm preview
```

---

## 📁 Project Structure

```
richman/
├── src/
│   ├── components/          # React components
│   │   ├── GameBoard.tsx    # Main game board
│   │   ├── Tile.tsx         # Board tile component
│   │   ├── PlayerInfo.tsx   # Player status display
│   │   ├── Controls.tsx     # Game controls
│   │   ├── StockModal.tsx   # Stock trading interface
│   │   ├── LotteryModal.tsx # Lottery purchase interface
│   │   ├── AssetsModal.tsx  # Asset management
│   │   ├── DebtCrisisModal.tsx # Debt resolution
│   │   ├── CardRevealModal.tsx # Fate/Chance card reveal
│   │   └── ...
│   ├── game/
│   │   ├── types.ts         # TypeScript types
│   │   ├── config.ts        # Game configuration
│   │   ├── cards.ts         # Fate & Chance cards
│   │   └── logic.ts         # Game logic & state
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── dist/                    # Production build
```

---

## 🎯 Game Rules

### Objective
Be the last player standing by bankrupting your opponent through strategic property management, stock trading, and a bit of luck!

### Turn Flow
1. **Roll Dice** - Roll two dice and move clockwise
2. **Land Action** - Perform action based on tile type
3. **Optional Actions** - Trade stocks, buy lottery tickets
4. **End Turn** - Pass to next player

### Property Mechanics
- Landing on unowned property: Option to buy
- Landing on owned property (yours): Option to upgrade
- Landing on opponent's property: Pay rent
- Mortgaged properties generate no rent

### Special Tiles
| Tile | Effect |
|------|--------|
| 🏁 Start | Collect $2,000 salary when passing |
| 🔒 Jail | Visit only (no penalty) |
| 🚔 Go to Jail | Sent to jail for 2 turns |
| ☕ Free Parking | Rest (no effect) |
| 🟣 Fate | Draw a Fate card |
| 🟠 Chance | Draw a Chance card |
| 🎰 Lottery | Purchase lottery tickets |

### Bankruptcy
When money goes negative:
1. If you have assets, enter **Debt Crisis** mode
2. Sell properties, stocks, or mortgage to raise funds
3. If unable to pay, you're **bankrupt** - game over!

---

## 🎨 Screenshots

> *The game features a sleek dark theme with vibrant accent colors, responsive layout, and polished UI components.*

---

## 🗺️ Roadmap

- [ ] Multiplayer support (online)
- [ ] More cities and board variations
- [ ] Achievement system
- [ ] Sound effects and music
- [ ] Mobile app version
- [ ] Custom game rules

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Inspired by the classic Monopoly board game
- Chinese city names and companies are fictional/satirical
- Built with ❤️ using modern web technologies

---

<p align="center">
  <strong>⭐ Star this repo if you enjoy the game! ⭐</strong>
</p>

<p align="center">
  Made with 🎲 and ☕
</p>
