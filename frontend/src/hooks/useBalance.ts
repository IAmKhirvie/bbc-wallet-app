import { useEffect, useState } from "react";
import { useWalletStore, fromWei, type Currency } from "@/lib/store";

/**
 * Hook for getting BBC balance formatted
 */
export function useBBCBalance(): string {
  const { bbcBalance } = useWalletStore();
  return fromWei(bbcBalance);
}

/**
 * Hook for getting ETH balance formatted
 */
export function useETHBalance(): string {
  const { ethBalance } = useWalletStore();
  return fromWei(ethBalance);
}

/**
 * Hook for getting balance converted to selected currency
 */
export function useBalanceInCurrency(balance: bigint, symbol: string): {
  value: string;
  currency: Currency;
} {
  const { selectedCurrency, exchangeRates } = useWalletStore();

  const getConvertedValue = (): string => {
    const balanceInUnits = fromWei(balance);
    const rate = exchangeRates[symbol] || 1;

    if (selectedCurrency === symbol) {
      return balanceInUnits;
    }

    // Convert through USD as base
    const inUSD = balanceInUnits * rate;
    const targetRate = exchangeRates[selectedCurrency] || 1;
    return (inUSD / targetRate).toFixed(2);
  };

  return {
    value: getConvertedValue(),
    currency: selectedCurrency,
  };
}

/**
 * Hook for total portfolio value
 */
export function usePortfolioValue(): {
  value: string;
  currency: Currency;
  change24h: string;
  isLoading: boolean;
} {
  const { bbcBalance, ethBalance, selectedCurrency, exchangeRates } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);

  const getConvertedValue = (balance: bigint, symbol: string): number => {
    const balanceInUnits = fromWei(balance);
    const rate = exchangeRates[symbol] || 1;

    if (selectedCurrency === symbol) {
      return balanceInUnits;
    }

    const inUSD = balanceInUnits * rate;
    const targetRate = exchangeRates[selectedCurrency] || 1;
    return inUSD / targetRate;
  };

  const bbcValue = getConvertedValue(bbcBalance, "BBC");
  const ethValue = getConvertedValue(ethBalance, "ETH");
  const totalValue = bbcValue + ethValue;

  return {
    value: totalValue.toFixed(2),
    currency: selectedCurrency,
    change24h: "+2.34", // Mock change for demo
    isLoading,
  };
}

/**
 * Hook for getting all balances
 */
export function useBalances() {
  const { bbcBalance, ethBalance, exchangeRates, selectedCurrency } = useWalletStore();

  const convertToCurrency = (balance: bigint, fromSymbol: string): string => {
    const balanceInUnits = fromWei(balance);
    const rate = exchangeRates[fromSymbol] || 1;

    if (selectedCurrency === fromSymbol) {
      return balanceInUnits;
    }

    const inUSD = balanceInUnits * rate;
    const targetRate = exchangeRates[selectedCurrency] || 1;
    return (inUSD / targetRate).toFixed(2);
  };

  return {
    bbc: {
      raw: bbcBalance,
      formatted: fromWei(bbcBalance),
      converted: convertToCurrency(bbcBalance, "BBC"),
    },
    eth: {
      raw: ethBalance,
      formatted: fromWei(ethBalance),
      converted: convertToCurrency(ethBalance, "ETH"),
    },
    currency: selectedCurrency,
  };
}
