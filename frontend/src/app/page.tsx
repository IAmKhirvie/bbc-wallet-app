"use client";

import { WalletCard } from "@/components/WalletCard";
import { QuickActions } from "@/components/QuickActions";
import { TransactionList } from "@/components/TransactionList";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore } from "@/lib/store";
import { Activity, Wallet, ArrowRight, Coins, Shield, Zap } from "lucide-react";
import { fromWei } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { isConnected, bbcBalance, ethBalance, transactions } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="animate-fade-in">
        {/* Hero section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-500/5 to-transparent border border-amber-500/10 p-8 md:p-12 mb-8">
          {/* Decorative orbs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            {/* BBC coin icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
              <span className="text-3xl font-bold text-black">B</span>
            </div>

            <h1 className="text-4xl font-bold mb-3">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                BBC Wallet
              </span>
            </h1>
            <p className="text-muted-foreground max-w-md mb-8">
              Connect your wallet to start managing your BigBlackCoin (BBC) tokens
              on the local Hardhat network.
            </p>

            <ConnectWalletButton className="h-12 px-8 text-base" />
          </div>
        </div>

        {/* Getting started steps */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group hover:border-amber-500/20 transition-colors">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Zap className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">1. Start Hardhat</h3>
              <p className="text-sm text-muted-foreground">
                Run <code className="bg-white/5 px-1.5 py-0.5 rounded text-amber-400/80 text-xs">npx hardhat node</code> to start
                your local blockchain.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:border-amber-500/20 transition-colors">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Shield className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">2. Deploy Contracts</h3>
              <p className="text-sm text-muted-foreground">
                Run the deploy script to set up BBC token on your local network.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:border-amber-500/20 transition-colors">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Coins className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="font-semibold mb-2">3. Connect & Trade</h3>
              <p className="text-sm text-muted-foreground">
                Add Hardhat network to MetaMask (Chain ID: 31337) and connect.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio</p>
      </div>

      {/* Wallet Card - full width */}
      <WalletCard />

      {/* Quick Actions */}
      <QuickActions />

      {/* Content grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Transactions - spans 2 cols */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Link
              href="/transactions"
              className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <TransactionList limit={5} />
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-400" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">BBC Balance</span>
              <span className="font-medium font-mono text-amber-400">{fromWei(bbcBalance).toFixed(4)} BBC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ETH Balance</span>
              <span className="font-medium font-mono text-blue-400">{fromWei(ethBalance).toFixed(4)} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Transactions</span>
              <span className="font-medium font-mono">{transactions.length}</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06]">
              <Link
                href="/transactions"
                className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors"
              >
                View all activity <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
