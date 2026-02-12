"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore, fromWei } from "@/lib/store";
import { Wallet, Coins, RefreshCw, Send, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const { bbcBalance, ethBalance, selectedCurrency, exchangeRates, refreshBalances, isConnected } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <Wallet className="h-8 w-8 text-amber-400" />
        </div>
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">Manage your crypto assets</p>
        </div>
        <Button
          onClick={refreshBalances}
          variant="outline"
          size="sm"
          className="border-white/[0.08] hover:border-amber-500/30"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <CardContent className="relative p-6">
          <p className="text-sm font-medium text-amber-400/80 mb-2">Total Balance</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold font-mono tracking-tight">{totalValue.toFixed(2)}</span>
            <span className="text-xl text-muted-foreground">{selectedCurrency}</span>
          </div>
        </CardContent>
      </Card>

      {/* Asset Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* BBC Asset Card */}
        <Card className="relative overflow-hidden group hover:border-amber-500/30 transition-all duration-200">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
          <CardContent className="relative p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">BigBlackCoin</h3>
                <p className="text-sm text-muted-foreground">BBC</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold font-mono text-amber-400">{bbcData.amount} <span className="text-base text-muted-foreground">BBC</span></p>
              <p className="text-sm text-muted-foreground mt-0.5">
                ≈ {bbcData.value} {selectedCurrency}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/wallet/send" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </Link>
              <Link href="/wallet/receive" className="flex-1">
                <Button variant="outline" className="w-full border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5">
                  <Download className="h-4 w-4 mr-2" />
                  Receive
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ETH Asset Card */}
        <Card className="relative overflow-hidden group hover:border-blue-500/30 transition-all duration-200">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
          <CardContent className="relative p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM12 22.25l-6.25-8.5L12 17.5l6.25-3.75L12 22.25z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Ethereum</h3>
                <p className="text-sm text-muted-foreground">ETH</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-2xl font-bold font-mono text-blue-400">{ethData.amount} <span className="text-base text-muted-foreground">ETH</span></p>
              <p className="text-sm text-muted-foreground mt-0.5">
                ≈ {ethData.value} {selectedCurrency}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-white/[0.08] opacity-60 cursor-default">
                <Send className="h-4 w-4 mr-2" />
                Send
                <span className="ml-1.5 text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20">Soon</span>
              </Button>
              <Button variant="outline" className="flex-1 border-white/[0.08] opacity-60 cursor-default">
                <Download className="h-4 w-4 mr-2" />
                Receive
                <span className="ml-1.5 text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20">Soon</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-400">B</span>
            </div>
            About BigBlackCoin (BBC)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Token Name</span>
            <span className="font-medium">BigBlackCoin</span>
          </div>
          <div className="flex justify-between py-1 border-t border-white/[0.04]">
            <span className="text-muted-foreground">Token Symbol</span>
            <span className="font-medium font-mono">BBC</span>
          </div>
          <div className="flex justify-between py-1 border-t border-white/[0.04]">
            <span className="text-muted-foreground">Token Type</span>
            <span className="font-medium">ERC-20</span>
          </div>
          <div className="flex justify-between py-1 border-t border-white/[0.04]">
            <span className="text-muted-foreground">Decimals</span>
            <span className="font-medium font-mono">18</span>
          </div>
          <div className="flex justify-between py-1 border-t border-white/[0.04]">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">Hardhat Local</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
