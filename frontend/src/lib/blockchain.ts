import { ethers, BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";

// Network configuration
export const NETWORK_CONFIG = {
  chainId: "0x7a69", // 31337 in hex
  chainName: "Hardhat Local",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["http://127.0.0.1:8545"],
  blockExplorerUrls: null,
};

// BBC Token ABI (only the functions we need)
export const BBC_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function getTokenInfo() view returns (string name, string symbol, uint8 decimals_, uint256 totalSupply_, uint256 maxSupply_, uint256 ownerBalance)",
  "function circulatingSupply() view returns (uint256)",
  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function airdrop(address[] calldata recipients, uint256[] calldata amounts)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event TokensMinted(address indexed to, uint256 amount)",
  "event TokensBurned(address indexed from, uint256 amount)",
];

// MockOracle ABI
export const ORACLE_ABI = [
  "function getPrice(string currency) view returns (uint256)",
  "function getPriceWithTimestamp(string currency) view returns (uint256 price, uint256 timestamp)",
  "function convert(uint256 amount, string fromCurrency, string toCurrency) view returns (uint256)",
  "function getBBCPrice() view returns (uint256)",
  "function getSupportedCurrencies() view returns (string[])",
  "function getBatchPrices(string[] calldata currencies) view returns (uint256[])",
  "function updatePrice(string currency, uint256 newPrice)",
  "function batchUpdatePrices(string[] calldata currencies, uint256[] calldata newPrices)",
  "function addCurrency(string currency, uint256 initialPrice)",
  "event PriceUpdated(string currency, uint256 newPrice)",
];

// Load deployment info
let deploymentInfo: any = null;

export function getDeploymentInfo() {
  if (deploymentInfo) return deploymentInfo;

  try {
    // Try to load from generated file (created by deploy.js)
    deploymentInfo = require("../deployment.json");
  } catch {
    // Fallback to template
    deploymentInfo = require("../deployment.template.json");
  }
  return deploymentInfo;
}

// Get BBC contract instance
export function getBBCContract(address: string, signer: ethers.Signer): Contract {
  return new Contract(address, BBC_ABI, signer);
}

// Get Oracle contract instance
export function getOracleContract(address: string, signer: ethers.Signer): Contract {
  return new Contract(address, ORACLE_ABI, signer);
}

// Connect wallet (MetaMask or injected provider)
export async function connectWallet(): Promise<{
  address: string;
  provider: BrowserProvider;
  signer: ethers.Signer;
}> {
  if (!window.ethereum) {
    throw new Error("No wallet found. Please install MetaMask or use a Web3-enabled browser.");
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  // Check if connected to the correct network
  const network = await provider.getNetwork();
  if (Number(network.chainId) !== 31337) {
    // Request to switch to Hardhat local network
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [NETWORK_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  return {
    address: accounts[0],
    provider,
    signer,
  };
}

// Disconnect wallet (MetaMask doesn't have a native disconnect, we just clear state)
export function disconnectWallet(): void {
  // Just a placeholder - MetaMask doesn't have programmatic disconnect
  // The actual disconnection happens in the app state
}

// Get ETH balance
export async function getETHBalance(address: string, provider: BrowserProvider): Promise<bigint> {
  return await provider.getBalance(address);
}

// Get BBC balance
export async function getBBCBalance(
  address: string,
  contractAddress: string,
  provider: BrowserProvider
): Promise<bigint> {
  const contract = new Contract(contractAddress, BBC_ABI, provider);
  return await contract.balanceOf(address);
}

// Get BBC token info
export async function getBBCInfo(contractAddress: string, provider: BrowserProvider) {
  const contract = new Contract(contractAddress, BBC_ABI, provider);
  const info = await contract.getTokenInfo();
  return {
    name: info[0],
    symbol: info[1],
    decimals: info[2],
    totalSupply: info[3],
    maxSupply: info[4],
    ownerBalance: info[5],
  };
}

// Send BBC tokens
export async function sendBBC(
  to: string,
  amount: string,
  contractAddress: string,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionReceipt> {
  const contract = new Contract(contractAddress, BBC_ABI, signer);
  const decimals = await contract.decimals();
  const amountWei = parseUnits(amount, decimals);

  // Estimate gas
  const gasEstimate = await contract.transfer.estimateGas(to, amountWei);

  // Send transaction with 20% gas buffer
  const tx = await contract.transfer(to, amountWei, {
    gasLimit: (gasEstimate * 120n) / 100n,
  });

  return await tx.wait();
}

// Get price from oracle
export async function getPrice(
  currency: string,
  oracleAddress: string,
  provider: BrowserProvider
): Promise<number> {
  const contract = new Contract(oracleAddress, ORACLE_ABI, provider);
  const price = await contract.getPrice(currency);
  // Price is returned with 8 decimals
  return Number(price) / 1e8;
}

// Convert currency
export async function convertCurrency(
  amount: bigint,
  from: string,
  to: string,
  oracleAddress: string,
  provider: BrowserProvider
): Promise<bigint> {
  const contract = new Contract(oracleAddress, ORACLE_ABI, provider);
  return await contract.convert(amount, from, to);
}

// Get supported currencies
export async function getSupportedCurrencies(
  oracleAddress: string,
  provider: BrowserProvider
): Promise<string[]> {
  const contract = new Contract(oracleAddress, ORACLE_ABI, provider);
  return await contract.getSupportedCurrencies();
}

// Listen for account changes
export function onAccountChange(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", callback);
  }
}

// Listen for network changes
export function onNetworkChange(callback: (chainId: string) => void): void {
  if (window.ethereum) {
    window.ethereum.on("chainChanged", callback);
  }
}

// Remove listeners
export function removeListeners(): void {
  if (window.ethereum) {
    window.ethereum.removeAllListeners();
  }
}

// Get transaction receipt
export async function getTransactionReceipt(
  txHash: string,
  provider: BrowserProvider
): Promise<ethers.TransactionReceipt | null> {
  return await provider.getTransactionReceipt(txHash);
}

// Get transaction
export async function getTransaction(
  txHash: string,
  provider: BrowserProvider
): Promise<ethers.TransactionResponse | null> {
  return await provider.getTransaction(txHash);
}

// Estimate gas for BBC transfer
export async function estimateGasForTransfer(
  to: string,
  amount: string,
  contractAddress: string,
  signer: ethers.Signer
): Promise<bigint> {
  const contract = new Contract(contractAddress, BBC_ABI, signer);
  const decimals = await contract.decimals();
  const amountWei = parseUnits(amount, decimals);
  const gasEstimate = await contract.transfer.estimateGas(to, amountWei);
  return gasEstimate;
}

// Get gas price
export async function getGasPrice(provider: BrowserProvider): Promise<bigint> {
  const feeData = await provider.getFeeData();
  return feeData.gasPrice || 0n;
}

// Format transaction for display
export interface TransactionDisplay {
  hash: string;
  from: string;
  to?: string;
  value?: string;
  timestamp?: number;
  status: "pending" | "success" | "failed";
  type: "send" | "receive" | "contract";
  tokenSymbol?: string;
}

export async function formatTransaction(
  tx: ethers.TransactionResponse,
  receipt: ethers.TransactionReceipt | null,
  bbcAddress: string
): Promise<TransactionDisplay> {
  const isBBCTransfer = tx.to?.toLowerCase() === bbcAddress.toLowerCase();
  const status = receipt?.status === 1 ? "success" : receipt?.status === 0 ? "failed" : "pending";

  let type: TransactionDisplay["type"] = "send";
  let value = tx.value ? formatUnits(tx.value, 18) : "0";

  // If it's a contract call to BBC, try to decode the transfer
  if (isBBCTransfer && tx.data) {
    try {
      const contract = new Contract(bbcAddress, BBC_ABI);
      const decoded = contract.interface.parseTransaction({ data: tx.data, value: tx.value });
      if (decoded?.name === "transfer") {
        type = "send";
        // Get amount from decoded args
        value = formatUnits(decoded.args[1], 18);
      }
    } catch {
      // Couldn't decode, use defaults
    }
  }

  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to || undefined,
    value,
    status,
    type,
    tokenSymbol: isBBCTransfer ? "BBC" : "ETH",
  };
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
