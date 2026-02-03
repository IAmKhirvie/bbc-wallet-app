import { useEffect, useCallback } from "react";
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

  // Watch pending transactions
  useEffect(() => {
    if (pendingTransactions.size === 0) return;

    const checkPendingTransactions = async () => {
      for (const hash of pendingTransactions) {
        try {
          // In a real app, you'd check the transaction status here
          // For now, we'll just mark as success after a delay
          setTimeout(() => {
            updateTransactionStatus(hash, "success");
          }, 3000);
        } catch (error) {
          console.error("Failed to check transaction:", error);
        }
      }
    };

    checkPendingTransactions();
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
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.timestamp - a.timestamp
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
  const recentTransactions = sortedTransactions.slice(0, 5);

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

  return transactions.map((tx) => ({
    ...tx,
    timeAgo: timeAgo(tx.timestamp),
    amountFormatted: parseFloat(tx.amount).toFixed(4),
  }));
}

/**
 * Hook for transaction statistics
 */
export function useTransactionStats() {
  const { transactions, address } = useWalletStore();

  const stats = {
    total: transactions.length,
    sent: transactions.filter((tx) => tx.type === "send").length,
    received: transactions.filter((tx) => tx.type === "receive").length,
    pending: transactions.filter((tx) => tx.status === "pending").length,
    successful: transactions.filter((tx) => tx.status === "success").length,
    failed: transactions.filter((tx) => tx.status === "failed").length,
  };

  return stats;
}
