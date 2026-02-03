# BigBlackCoin (BBC) Wallet Application

An educational blockchain web application featuring a custom ERC-20 token and multi-currency wallet.

## Project Overview

This is a learning project to understand:
- Smart contract development with Solidity
- Web3 integration with ethers.js
- Building wallet interfaces
- Blockchain fundamentals (transactions, gas, blocks)

## Tech Stack

### Backend/Blockchain
- **Hardhat** - Ethereum development environment
- **Solidity** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **ethers.js** - Web3 library

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management

## Project Structure

```
bbc-wallet-app/
├── contracts/           # Solidity smart contracts
│   ├── BBC.sol         # BigBlackCoin ERC-20 token
│   └── MockOracle.sol  # Mock price feed oracle
├── scripts/            # Deployment and utility scripts
├── test/              # Contract tests
├── frontend/          # Next.js web application
└── hardhat.config.js  # Hardhat configuration
```

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### Running the Application

You'll need 3 terminal windows:

**Terminal 1: Start the local blockchain**
```bash
npx hardhat node
```

This starts a local Ethereum network with prefunded test accounts.

**Terminal 2: Deploy contracts**
```bash
npx hardhat run scripts/deploy.js --network localhost
```

This deploys the BBC token and MockOracle to your local network.

**Terminal 3: Run the frontend**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`

## Smart Contracts

### BigBlackCoin (BBC.sol)
An ERC-20 token with:
- Initial supply: 1,000,000 BBC
- Mintable (by owner)
- Burnable
- Max supply cap: 10 billion BBC
- Airdrop functionality

### MockOracle (MockOracle.sol)
A mock price oracle for educational purposes:
- Returns mock prices in USD
- Supports currency conversion
- Updatable by owner

## Scripts

### Deploy
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Faucet - Fund an address with BBC and ETH
```bash
npx hardhat run scripts/faucet.js --network localhost <address>
```

### Test
```bash
npx hardhat test
```

## Test Accounts (Hardhat)

When you run `npx hardhat node`, you get 20 test accounts with 10,000 ETH each:

| Account # | Address |
|-----------|---------|
| 0 | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 |
| 1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 |
| 2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC |
| ... | ... |

The deploy script also funds these accounts with BBC.

## MetaMask Setup

To connect your wallet to the local network:

1. Open MetaMask
2. Add a new network
3. Use these settings:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

4. Import one of the test accounts using the private key from Hardhat output

## Features

- **Dashboard**: View portfolio value and recent activity
- **Wallet**: See BBC and ETH balances
- **Send**: Transfer BBC to other addresses
- **Receive**: Generate QR code for receiving BBC
- **Transactions**: View transaction history
- **Settings**: Change display currency (USD, EUR, GBP, BBC, ETH)

## Learning Resources

- [Solidity by Example](https://solidity-by-example.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ethers.js Documentation](https://docs.ethers.org/)
- [Hardhat Tutorial](https://hardhat.org/tutorial)

## License

MIT - This is an educational project.
