import { create } from "zustand";
import { ethers } from "ethers";
import {
  connectWallet,
  disconnectWallet,
  getETHBalance,
  getBBCBalance,
  sendBBC,
  getPrice,
  getSupportedCurrencies,
  convertCurrency,
  getDeploymentInfo,
  onAccountChange,
  onNetworkChange,
  removeListeners,
  estimateGasForTransfer,
  getGasPrice,
  type TransactionDisplay,
  formatTransaction,
} from "./blockchain";
import { fromWei } from "./utils";
import { getErrorMessage } from "@/types";

// Currency types
export type Currency = "USD" | "EUR" | "GBP" | "BBC" | "ETH" | "BTC";

// Transaction type for our app
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: "pending" | "success" | "failed";
  type: "send" | "receive" | "approval";
  tokenSymbol: string;
  gasUsed?: string;
}

// Store interface
interface WalletStore {
  // Wallet state
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;

  // Balances
  ethBalance: bigint;
  bbcBalance: bigint;

  // Contracts
  bbcAddress: string;
  oracleAddress: string;

  // Currency state
  selectedCurrency: Currency;
  exchangeRates: Record<string, number>;
  supportedCurrencies: string[];

  // Transactions
  transactions: Transaction[];
  pendingTransactions: Set<string>;

  // Token info
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  totalSupply: bigint;

  // Gas estimation
  estimatedGas: bigint;
  gasPrice: bigint;

  // Error state
  error: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
  refreshExchangeRates: () => Promise<void>;
  sendBBC: (to: string, amount: string) => Promise<string>;
  setSelectedCurrency: (currency: Currency) => void;
  clearError: () => void;
  loadTokenInfo: () => Promise<void>;
  estimateGas: (to: string, amount: string) => Promise<void>;
  addTransaction: (tx: Transaction) => void;
  updateTransactionStatus: (hash: string, status: Transaction["status"]) => void;
  loadInitialData: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  address: null,
  isConnected: false,
  isConnecting: false,
  ethBalance: 0n,
  bbcBalance: 0n,
  selectedCurrency: "USD",
  exchangeRates: {
    BBC: 1.0,
    ETH: 3000,
    BTC: 50000,
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
  },
  supportedCurrencies: ["BBC", "ETH", "BTC", "USD", "EUR", "GBP"],
  transactions: [],
  pendingTransactions: new Set(),
  tokenName: "BigBlackCoin",
  tokenSymbol: "BBC",
  tokenDecimals: 18,
  totalSupply: 0n,
  estimatedGas: 0n,
  gasPrice: 0n,
  error: null,

  // These will be loaded from deployment info
  bbcAddress: "",
  oracleAddress: "",

  // Connect wallet
  connect: async () => {
    set({ isConnecting: true, error: null });
    try {
      const { address, provider } = await connectWallet();
      const deployment = getDeploymentInfo();

      set({
        address,
        isConnected: true,
        isConnecting: false,
        bbcAddress: deployment.contracts.BigBlackCoin,
        oracleAddress: deployment.contracts.MockOracle,
      });

      // Load initial data
      await get().loadInitialData();

      // Setup listeners
      onAccountChange(async (accounts) => {
        if (accounts.length === 0) {
          get().disconnect();
        } else if (accounts[0] !== get().address) {
          set({ address: accounts[0] });
          await get().loadInitialData();
        }
      });

      onNetworkChange(() => {
        // Refresh data on network change
        get().loadInitialData();
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error),
        isConnecting: false,
      });
    }
  },

  // Disconnect wallet
  disconnect: () => {
    removeListeners();
    set({
      address: null,
      isConnected: false,
      ethBalance: 0n,
      bbcBalance: 0n,
      transactions: [],
    });
  },

  // Refresh balances
  refreshBalances: async () => {
    const { address, bbcAddress } = get();
    if (!address || !bbcAddress) return;

    try {
      const { provider } = await connectWallet();

      const [ethBal, bbcBal] = await Promise.all([
        getETHBalance(address, provider),
        getBBCBalance(address, bbcAddress, provider),
      ]);

      set({ ethBalance: ethBal, bbcBalance: bbcBal });
    } catch (error: unknown) {
      console.error("Failed to refresh balances:", getErrorMessage(error));
    }
  },

  // Refresh exchange rates
  refreshExchangeRates: async () => {
    const { oracleAddress, supportedCurrencies } = get();
    if (!oracleAddress) return;

    try {
      const { provider } = await connectWallet();
      const rates: Record<string, number> = {};

      const currentRates = get().exchangeRates;
      for (const currency of supportedCurrencies) {
        try {
          rates[currency] = await getPrice(currency, oracleAddress, provider);
        } catch {
          // Keep previous rate rather than misleading default
          rates[currency] = currentRates[currency] || 1.0;
        }
      }

      set({ exchangeRates: rates });
    } catch (error: unknown) {
      console.error("Failed to refresh rates:", getErrorMessage(error));
    }
  },

  // Send BBC
  sendBBC: async (to: string, amount: string) => {
    const { bbcAddress, addTransaction } = get();
    set({ error: null });

    try {
      const { signer } = await connectWallet();

      // Create pending transaction record
      const pendingTx: Transaction = {
        hash: "", // Will be updated
        from: get().address || "",
        to,
        amount,
        timestamp: Date.now(),
        status: "pending",
        type: "send",
        tokenSymbol: "BBC",
      };

      // Send transaction
      const receipt = await sendBBC(to, amount, bbcAddress, signer);

      // Update transaction record with confirmed status
      pendingTx.hash = receipt.hash;
      pendingTx.gasUsed = receipt.gasUsed?.toString();
      pendingTx.status = receipt.status === 1 ? "success" : "failed";
      addTransaction(pendingTx);

      // Refresh balances
      await get().refreshBalances();

      return receipt.hash;
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error);
      set({ error: errorMsg });
      throw error;
    }
  },

  // Set selected currency
  setSelectedCurrency: (currency: Currency) => {
    set({ selectedCurrency: currency });
    localStorage.setItem("bbc-selected-currency", currency);
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Load token info
  loadTokenInfo: async () => {
    const { bbcAddress } = get();
    if (!bbcAddress) return;

    try {
      const { provider } = await connectWallet();
      const deployment = getDeploymentInfo();

      // Get token info from contract
      const bbcContract = new ethers.Contract(
        bbcAddress,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function decimals() view returns (uint8)",
          "function totalSupply() view returns (uint256)",
        ],
        provider
      );

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        bbcContract.name(),
        bbcContract.symbol(),
        bbcContract.decimals(),
        bbcContract.totalSupply(),
      ]);

      set({
        tokenName: name,
        tokenSymbol: symbol,
        tokenDecimals: decimals,
        totalSupply,
        bbcAddress: deployment.contracts.BigBlackCoin,
        oracleAddress: deployment.contracts.MockOracle,
      });
    } catch (error: unknown) {
      console.error("Failed to load token info:", getErrorMessage(error));
    }
  },

  // Estimate gas for a transaction
  estimateGas: async (to: string, amount: string) => {
    const { bbcAddress } = get();
    if (!bbcAddress) return;

    try {
      const { signer } = await connectWallet();
      const [gasEstimate, gasPriceVal] = await Promise.all([
        estimateGasForTransfer(to, amount, bbcAddress, signer),
        getGasPrice(signer.provider as ethers.BrowserProvider),
      ]);

      set({ estimatedGas: gasEstimate, gasPrice: gasPriceVal });
    } catch (error: unknown) {
      console.error("Failed to estimate gas:", getErrorMessage(error));
    }
  },

  // Add transaction to history (persisted to localStorage)
  addTransaction: (tx: Transaction) => {
    set((state) => {
      const updated = [tx, ...state.transactions].slice(0, 50);
      try {
        localStorage.setItem("bbc-tx-history", JSON.stringify(updated));
      } catch {}
      return { transactions: updated };
    });
  },

  // Update transaction status (persisted to localStorage)
  updateTransactionStatus: (hash: string, status: Transaction["status"]) => {
    set((state) => {
      const updated = state.transactions.map((tx) =>
        tx.hash === hash ? { ...tx, status } : tx
      );
      try {
        localStorage.setItem("bbc-tx-history", JSON.stringify(updated));
      } catch {}
      return {
        transactions: updated,
        pendingTransactions: new Set(
          [...state.pendingTransactions].filter((h) => h !== hash)
        ),
      };
    });
  },

  // Load all initial data
  loadInitialData: async () => {
    // Restore persisted transactions
    try {
      const savedTxs = localStorage.getItem("bbc-tx-history");
      if (savedTxs) {
        set({ transactions: JSON.parse(savedTxs) });
      }
    } catch {}

    await Promise.all([
      get().refreshBalances(),
      get().refreshExchangeRates(),
      get().loadTokenInfo(),
    ]);

    // Load saved currency preference
    const savedCurrency = localStorage.getItem("bbc-selected-currency");
    if (savedCurrency && ["USD", "EUR", "GBP", "BBC", "ETH", "BTC"].includes(savedCurrency)) {
      set({ selectedCurrency: savedCurrency as Currency });
    }
  },
}));

// Re-export utility functions for convenience
export { fromWei } from "./utils";

// Helper hooks
export const useBalanceInCurrency = (): string => {
  const { bbcBalance, ethBalance, selectedCurrency, exchangeRates } = useWalletStore();

  const getConvertedValue = (balance: bigint, symbol: string): number => {
    const balanceInUnits = fromWei(balance);
    const rate = exchangeRates[symbol] || 1;

    if (selectedCurrency === symbol) {
      return balanceInUnits;
    }

    // Convert through USD as base
    const inUSD = balanceInUnits * rate;
    const targetRate = exchangeRates[selectedCurrency] || 1;
    return inUSD / targetRate;
  };

  const bbcValue = getConvertedValue(bbcBalance, "BBC");
  const ethValue = getConvertedValue(ethBalance, "ETH");
  const totalValue = bbcValue + ethValue;

  return totalValue.toFixed(2);
};

export const useBBCInCurrency = (): string => {
  const { bbcBalance, selectedCurrency, exchangeRates } = useWalletStore();
  const balanceInUnits = fromWei(bbcBalance);
  const rate = exchangeRates.BBC || 1;

  if (selectedCurrency === "BBC") {
    return balanceInUnits.toFixed(4);
  }

  const inUSD = balanceInUnits * rate;
  const targetRate = exchangeRates[selectedCurrency] || 1;
  return (inUSD / targetRate).toFixed(2);
};
