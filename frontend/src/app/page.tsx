"use client";

import { WalletCard } from "@/components/WalletCard";
import { QuickActions } from "@/components/QuickActions";
import { TransactionList } from "@/components/TransactionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore } from "@/lib/store";
import { Activity, Wallet, TrendingUp } from "lucide-react";
import { fromWei } from "@/lib/store";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, bbcBalance, ethBalance, transactions } = useWalletStore();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Wallet className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Welcome to BBC Wallet</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Connect your wallet to start managing your BigBlackCoin (BBC) tokens.
          This is an educational blockchain wallet application.
        </p>
        <div className="bg-card border border-border rounded-lg p-6 max-w-lg text-left">
          <h3 className="font-semibold mb-3">Getting Started:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Make sure Hardhat node is running: <code className="bg-muted px-1.5 py-0.5 rounded">npx hardhat node</code></li>
            <li>Deploy contracts: <code className="bg-muted px-1.5 py-0.5 rounded">npx hardhat run scripts/deploy.js --network localhost</code></li>
            <li>Add Hardhat Local network to MetaMask (Chain ID: 31337)</li>
            <li>Click "Connect Wallet" above</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio</p>
      </div>

      {/* Main Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <WalletCard className="md:col-span-2" />

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">BBC Balance</span>
              <span className="font-medium">{fromWei(bbcBalance)} BBC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ETH Balance</span>
              <span className="font-medium">{fromWei(ethBalance)} ETH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Transactions</span>
              <span className="font-medium">{transactions.length}</span>
            </div>
            <div className="pt-3 border-t border-border">
              <Link
                href="/transactions"
                className="text-primary hover:underline text-sm flex items-center gap-1"
              >
                View all activity <TrendingUp className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link
            href="/transactions"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionList limit={5} />
        </CardContent>
      </Card>
    </div>
  );
}
