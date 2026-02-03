# BBC Wallet - Quick Start Guide

## Prerequisites

- Node.js v18+ installed
- MetaMask browser extension installed (optional, for wallet connection)

## Installation

1. **Install root dependencies:**
```bash
cd bbc-wallet-app
npm install
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

## Running the Application

You need 3 terminal windows open:

### Terminal 1: Start the local blockchain
```bash
npx hardhat node
```

Keep this running! You should see output like:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

### Terminal 2: Deploy contracts
```bash
npx hardhat run scripts/deploy.js --network localhost
```

You should see:
```
=== Deploying BBC Wallet Contracts ===

Deploying contracts with account: 0xf39F...
...
BBC Token deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
...
```

### Terminal 3: Run the frontend
```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3000**

## Connecting Your Wallet

1. Open MetaMask
2. Click the network dropdown (top left)
3. Click "Add Network" → "Add a network manually"
4. Enter these details:
   - Network Name: `Hardhat Local`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

5. To import a test account:
   - Click MetaMask account icon → "Import Account"
   - Paste a private key from Terminal 1 output
   - Click Import

6. Click "Connect Wallet" in the app

## Test Accounts (from Hardhat)

| Account | Address | Private Key |
|---------|---------|-------------|
| #0 (Owner) | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| #1 | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b7a0b2c |
| #2 | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a |

## Funding an Address (Faucet)

To fund an address with BBC and ETH:
```bash
npx hardhat run scripts/faucet.js --network localhost <address>
```

Example:
```bash
npx hardhat run scripts/faucet.js --network localhost 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## Running Tests

```bash
npx hardhat test
```

## What You Can Do

- ✅ View your BBC and ETH balances
- ✅ Send BBC to other addresses
- ✅ Receive BBC via QR code
- ✅ View transaction history
- ✅ Switch display currencies (USD, EUR, GBP, BBC, ETH)
- ✅ See gas estimates

## Troubleshooting

**"No wallet found" error:**
- Install MetaMask or use Brave browser's built-in wallet

**"Invalid Chain ID" error:**
- Make sure Hardhat node is running
- Add the Hardhat Local network to MetaMask (Chain ID: 31337)

**"Network error" or "RPC error":**
- Check that `npx hardhat node` is still running
- Restart Hardhat node and redeploy contracts

**Zero balance after deployment:**
- The deployer account (Account #0) has 1,000,000 BBC
- Import Account #0 into MetaMask
- Or use the faucet to fund another address

**Contracts not found:**
- Make sure you ran `npx hardhat run scripts/deploy.js --network localhost`
- Check `frontend/src/deployment.json` exists

## Learning Goals

This project teaches you:
1. **Solidity** - ERC-20 token contracts
2. **Hardhat** - Local blockchain development
3. **ethers.js** - Web3 library for blockchain interaction
4. **React/Next.js** - Frontend for dApps
5. **Wallet mechanics** - How transactions work
6. **Gas fees** - How Ethereum gas works

## Next Steps

1. Read the smart contracts in `contracts/`
2. Try sending BBC between accounts
3. Look at the transaction history
4. Experiment with currency conversion in Settings
5. Check out the test files to learn testing
