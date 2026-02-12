import { useEffect, useCallback, useRef } from "react";
import { useWalletStore } from "@/lib/store";
import { getDeploymentInfo } from "@/lib/blockchain";

/**
 * Hook for wallet connection and basic operations
 */
export function useWallet() {
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    refreshBalances,
    error,
    clearError,
  } = useWalletStore();

  // Use ref for refreshBalances to prevent interval recreation
  const refreshRef = useRef(refreshBalances);
  refreshRef.current = refreshBalances;

  // Auto-refresh balances every 10 seconds when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      refreshRef.current();
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    refreshBalances,
    error,
    clearError,
  };
}

/**
 * Hook for getting formatted address
 */
export function useFormattedAddress(): string {
  const { address } = useWalletStore();

  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Hook for checking if user is the contract owner/deployer
 */
export function useIsOwner(): boolean {
  const { address } = useWalletStore();

  const deployment = getDeploymentInfo();
  const ownerAddress = deployment.deployer || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  return address?.toLowerCase() === ownerAddress.toLowerCase();
}

/**
 * Hook for wallet actions
 */
export function useWalletActions() {
  const { sendBBC, estimateGas, setSelectedCurrency } = useWalletStore();

  const transferBBC = useCallback(
    async (to: string, amount: string): Promise<string> => {
      return await sendBBC(to, amount);
    },
    [sendBBC]
  );

  const estimateTransferGas = useCallback(
    async (to: string, amount: string): Promise<void> => {
      await estimateGas(to, amount);
    },
    [estimateGas]
  );

  return {
    transferBBC,
    estimateTransferGas,
    setSelectedCurrency,
  };
}
