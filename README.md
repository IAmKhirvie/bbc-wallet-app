# BBC Wallet - BigBlackCoin Blockchain Application

An educational blockchain web application featuring a custom ERC-20 token (BBC), multi-currency wallet, and real-time market monitoring.

> **Note:** This is an educational project for learning blockchain development. The BBC token only exists on your local Hardhat network and is NOT connected to mainnet.

![Screenshot](https://img.shields.io/badge/version-1.0.0-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-black)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Features

- 🪙 **Custom ERC-20 Token** (BigBlackCoin - BBC)
- 💼 **Multi-Currency Wallet** with MetaMask integration
- 📊 **Real-Time Market Monitoring** with auto-refreshing charts
- 💸 **Send/Receive BBC** transactions
- 📈 **Transaction History** tracking
- 💱 **Multi-Currency Display** (USD, EUR, GBP, BBC, ETH, BTC)
- 🎨 **Modern Responsive UI** built with Next.js + Tailwind CSS

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Smart Contracts** | Solidity 0.8.20, OpenZeppelin |
| **Blockchain** | Hardhat (local development) |
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Web3 Library** | ethers.js v6 |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Testing** | Hardhat Test |

## Project Structure

```
bbc-wallet-app/
├── contracts/              # Solidity smart contracts
│   ├── BBC.sol             # BigBlackCoin ERC-20 token
│   └── MockOracle.sol      # Mock price feed oracle
├── scripts/                # Deployment & utility scripts
│   ├── deploy.js           # Deploy contracts to local network
│   └── faucet.js           # Fund addresses with BBC/ETH
├── test/                   # Smart contract tests
├── frontend/               # Next.js web application
│   ├── src/
│   │   ├── app/            # Pages (Dashboard, Wallet, Market, etc.)
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities & store
│   └── package.json
├── hardhat.config.js
└── README.md
```

## Quick Start

### Prerequisites

- Node.js v18+ installed
- Git installed
- MetaMask browser extension (for wallet connection)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bbc-wallet-app
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies (Hardhat, contracts)
   npm install

   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

3. **Run the application** (requires 3 terminal windows)

   **Terminal 1:** Start the local blockchain
   ```bash
   npx hardhat node
   ```

   **Terminal 2:** Deploy smart contracts
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

   **Terminal 3:** Run the frontend
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## Connecting Your Wallet (MetaMask)

1. Open MetaMask extension
2. Add a new network manually:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Import a test account (use one of the private keys below)
4. Click "Connect Wallet" in the app

## Test Accounts (from Hardhat)

| Account | Address | Private Key | Balance |
|---------|---------|-------------|---------|
| Owner | 0xf39F...2266 | 0xac09...ff80 | 1M BBC + 10,000 ETH |
| Account 1 | 0x7099...79C8 | 0x59c6...0b2c | 10,000 BBC + 10,000 ETH |
| Account 2 | 0x3C44...293BC | 0x5de4...365a | 10,000 BBC + 10,000 ETH |

> ⚠️ **Security Warning:** These private keys are for local testing only. Never use these on mainnet or any public network!

## Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Portfolio overview, quick actions, recent transactions |
| Wallet | `/wallet` | View BBC and ETH balances |
| Market | `/market` | Live price charts, auto-refreshing market data |
| Send | `/wallet/send` | Transfer BBC to another address |
| Receive | `/wallet/receive` | Get your wallet address with QR code |
| Transactions | `/transactions` | View transaction history |
| Settings | `/settings` | Change display currency preferences |

## Available Scripts

```bash
# Compile contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Start local blockchain
npx hardhat node

# Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Fund an address (faucet)
npx hardhat run scripts/faucet.js --network localhost <address>

# Run frontend
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## Smart Contracts

### BBC Token (ERC-20)

- **Name:** BigBlackCoin
- **Symbol:** BBC
- **Initial Supply:** 1,000,000 BBC
- **Decimals:** 18
- **Features:** Mintable, Burnable, Airdrop

### Mock Oracle

- Returns mock prices for BBC, ETH, BTC, USD, EUR, GBP
- Used for currency conversion in the app
- Prices can be updated by the contract owner

## Development

### Running Tests

```bash
npx hardhat test
```

### Contract Deployment to Public Testnet (Optional)

To deploy to Sepolia testnet:

1. Create `.env` file:
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_private_key_here
   ```

2. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## What You'll Learn

Building this project teaches:

1. **Smart Contract Development** - ERC-20 token standards in Solidity
2. **Web3 Integration** - Connecting frontend to blockchain using ethers.js
3. **Wallet Mechanics** - How transactions are signed and broadcast
4. **Gas Fees** - How Ethereum gas calculations work
5. **State Management** - Managing blockchain state in React applications
6. **DeFi Patterns** - Price oracles, token swapping concepts

## FAQ

**Q: Can I use real money with this?**
A: No! This is for educational purposes only. The BBC token only exists on your local Hardhat network.

**Q: How do I get BBC tokens?**
A: Run the deployment script - it automatically funds test accounts with BBC. Or use the faucet script to fund any address.

**Q: Why is the price changing automatically?**
A: The market page simulates real-time price updates every 3 seconds for demonstration purposes.

**Q: Can I connect multiple wallets?**
A: Yes, you can switch between MetaMask accounts or different wallets.

## License

MIT License - Feel free to use this project for learning and educational purposes.

## Credits

Built as an educational project to learn blockchain development.
