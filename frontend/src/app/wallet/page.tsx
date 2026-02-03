"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore, fromWei } from "@/lib/store";
import { Wallet, Coins, DollarSign, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const assets = [
  {
    symbol: "BBC",
    name: "BigBlackCoin",
    icon: Coins,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: DollarSign,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
];

export default function WalletPage() {
  const { bbcBalance, ethBalance, selectedCurrency, exchangeRates, refreshBalances, isConnected } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Wallet className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
        <p className="text-muted-foreground">Please connect your wallet to view your assets.</p>
      </div>
    );
  }

  const convertToCurrency = (balance: bigint, symbol: string): { amount: string; value: string } => {
    const balanceInUnits = Number(fromWei(balance));
    const rate = exchangeRates[symbol] || 1;

    if (selectedCurrency === symbol) {
      return {
        amount: balanceInUnits.toFixed(4),
        value: balanceInUnits.toFixed(2),
      };
    }

    const inUSD = balanceInUnits * rate;
    const targetRate = exchangeRates[selectedCurrency] || 1;
    const convertedValue = inUSD / targetRate;

    return {
      amount: balanceInUnits.toFixed(4),
      value: convertedValue.toFixed(2),
    };
  };

  const bbcData = convertToCurrency(bbcBalance, "BBC");
  const ethData = convertToCurrency(ethBalance, "ETH");
  const totalValue = Number(bbcData.value) + Number(ethData.value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">Manage your crypto assets</p>
        </div>
        <Button onClick={refreshBalances} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground/80">
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{totalValue.toFixed(2)}</span>
            <span className="text-xl text-muted-foreground">{selectedCurrency}</span>
          </div>
        </CardContent>
      </Card>

      {/* Assets */}
      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Your Assets</h2>

        {/* BBC Asset */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold">BigBlackCoin</h3>
                  <p className="text-sm text-muted-foreground">BBC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{bbcData.amount} BBC</p>
                <p className="text-sm text-muted-foreground">
                  ≈ {bbcData.value} {selectedCurrency}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/wallet/send" className="flex-1">
                <Button variant="outline" className="w-full">
                  Send
                </Button>
              </Link>
              <Link href="/wallet/receive" className="flex-1">
                <Button variant="outline" className="w-full">
                  Receive
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ETH Asset */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Ethereum</h3>
                  <p className="text-sm text-muted-foreground">ETH</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{ethData.amount} ETH</p>
                <p className="text-sm text-muted-foreground">
                  ≈ {ethData.value} {selectedCurrency}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="w-full" disabled>
                Send (Coming Soon)
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Receive (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Info */}
      <Card>
        <CardHeader>
          <CardTitle>About BigBlackCoin (BBC)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token Name</span>
            <span>BigBlackCoin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token Symbol</span>
            <span>BBC</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token Type</span>
            <span>ERC-20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Decimals</span>
            <span>18</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network</span>
            <span>Hardhat Local</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
