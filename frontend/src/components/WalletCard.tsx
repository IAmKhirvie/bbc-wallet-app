"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore, fromWei } from "@/lib/store";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
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
    <Card className={cn("bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-foreground/80">
            Total Portfolio Value
          </CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{totalValue.toFixed(2)}</span>
          <span className="text-xl text-muted-foreground">{selectedCurrency}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-green-500">+2.34%</span>
          <span>vs yesterday</span>
        </div>
        {address && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">BBC Balance:</span>
              <span className="font-medium">{fromWei(bbcBalance)} BBC</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">ETH Balance:</span>
              <span className="font-medium">{fromWei(ethBalance)} ETH</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
