"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useWalletStore, fromWei } from "@/lib/store";
import { Wallet, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  className?: string;
}

export function WalletCard({ className }: WalletCardProps) {
  const { bbcBalance, ethBalance, selectedCurrency, exchangeRates, address } = useWalletStore();

  const convertToCurrency = (balance: bigint, symbol: string): string => {
    const balanceInUnits = Number(fromWei(balance));
    const rate = exchangeRates[symbol] || 1;

    if (selectedCurrency === symbol) {
      return balanceInUnits.toFixed(4);
    }

    const inUSD = balanceInUnits * rate;
    const targetRate = exchangeRates[selectedCurrency] || 1;
    return (inUSD / targetRate).toFixed(2);
  };

  const bbcValue = convertToCurrency(bbcBalance, "BBC");
  const ethValue = convertToCurrency(ethBalance, "ETH");

  const totalValue = Number(bbcValue) + Number(ethValue);

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20",
        className
      )}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />

      <CardContent className="relative p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-sm font-medium text-amber-400/80">Total Portfolio</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full border border-white/[0.08]">
            Local Testnet
          </span>
        </div>

        {/* Balance display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold font-mono tracking-tight">
              {totalValue.toFixed(2)}
            </span>
            <span className="text-xl text-muted-foreground">{selectedCurrency}</span>
          </div>
        </div>

        {/* Asset breakdown pills */}
        {address && (
          <div className="flex gap-3">
            {/* BBC pill */}
            <div className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-2 flex-1">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Coins className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">BBC</p>
                <p className="text-sm font-medium font-mono text-amber-400 truncate">
                  {fromWei(bbcBalance)}
                </p>
              </div>
            </div>

            {/* ETH pill */}
            <div className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-2 flex-1">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="h-3.5 w-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM12 22.25l-6.25-8.5L12 17.5l6.25-3.75L12 22.25z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">ETH</p>
                <p className="text-sm font-medium font-mono text-blue-400 truncate">
                  {fromWei(ethBalance)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
