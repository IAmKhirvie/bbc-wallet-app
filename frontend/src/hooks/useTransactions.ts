import { useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useWalletStore, type Transaction } from "@/lib/store";
import { timeAgo } from "@/lib/utils";

/**
 * Hook for getting user's transactions
 */
export function useTransactions() {
  const {
    transactions,
    addTransaction,
    updateTransactionStatus,
    pendingTransactions,
    address,
  } = useWalletStore();

  // Poll pending transactions against the actual blockchain
  useEffect(() => {
    if (pendingTransactions.size === 0 || !window.ethereum) return;

    const checkPending = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      for (const hash of pendingTransactions) {
        try {
          const receipt = await provider.getTransactionReceipt(hash);
          if (receipt) {
            updateTransactionStatus(
              hash,
              receipt.status === 1 ? "success" : "failed"
            );
          }
        } catch (error) {
          console.error("Failed to check transaction:", hash, error);
        }
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);
    return () => clearInterval(interval);
  }, [pendingTransactions, updateTransactionStatus]);

  /**
   * Add a new transaction to the history
   */
  const addNewTransaction = useCallback(
    (tx: Omit<Transaction, "hash">) => {
      const newTx: Transaction = {
        ...tx,
        hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      };
      addTransaction(newTx);
    },
    [addTransaction]
  );

  /**
   * Get transactions sorted by timestamp
   */
  const sortedTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.timestamp - a.timestamp),
    [transactions]
  );

  /**
   * Get transactions by type
   */
  const getTransactionsByType = useCallback(
    (type: "send" | "receive" | "approval") => {
      return sortedTransactions.filter((tx) => tx.type === type);
    },
    [sortedTransactions]
  );

  /**
   * Get recent transactions (last 5)
   */
  const recentTransactions = useMemo(
    () => sortedTransactions.slice(0, 5),
    [sortedTransactions]
  );

  return {
    transactions: sortedTransactions,
    recentTransactions,
    pendingTransactions,
    addTransaction: addNewTransaction,
    updateTransactionStatus,
    getTransactionsByType,
  };
}

/**
 * Hook for formatted transaction display
 */
export function useTransactionDisplay() {
  const { transactions } = useWalletStore();

  return useMemo(
    () =>
      transactions.map((tx) => ({
        ...tx,
        timeAgo: timeAgo(tx.timestamp),
        amountFormatted: parseFloat(tx.amount).toFixed(4),
      })),
    [transactions]
  );
}

/**
 * Hook for transaction statistics
 */
export function useTransactionStats() {
  const { transactions } = useWalletStore();

  return useMemo(
    () => ({
      total: transactions.length,
      sent: transactions.filter((tx) => tx.type === "send").length,
      received: transactions.filter((tx) => tx.type === "receive").length,
      pending: transactions.filter((tx) => tx.status === "pending").length,
      successful: transactions.filter((tx) => tx.status === "success").length,
      failed: transactions.filter((tx) => tx.status === "failed").length,
    }),
    [transactions]
  );
}
