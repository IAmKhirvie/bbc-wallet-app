"use client";

import { useWalletStore } from "@/lib/store";
import { formatAddress, timeAgo, shortenHash } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, ExternalLink, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FilterType = "all" | "sent" | "received" | "pending";

export default function TransactionsPage() {
  const { transactions, address, isConnected } = useWalletStore();
  const [filter, setFilter] = useState<FilterType>("all");

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
        <p className="text-muted-foreground">Please connect your wallet to view transactions.</p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    if (filter === "pending") return tx.status === "pending";
    if (filter === "sent") return tx.type === "send";
    if (filter === "received") return tx.type === "receive";
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: "bg-green-500/10 text-green-400 border-green-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
          styles[status] || ""
        )}
      >
        {status === "success" && <CheckCircle2 className="h-3 w-3" />}
        {status === "failed" && <XCircle className="h-3 w-3" />}
        {status === "pending" && <Clock className="h-3 w-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Your transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
          <CardContent className="relative p-4">
            <p className="text-2xl font-bold font-mono">{transactions.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-green-500/5 rounded-full blur-xl" />
          <CardContent className="relative p-4">
            <p className="text-2xl font-bold font-mono text-green-400">
              {transactions.filter((t) => t.type === "receive").length}
            </p>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
          <CardContent className="relative p-4">
            <p className="text-2xl font-bold font-mono text-red-400">
              {transactions.filter((t) => t.type === "send").length}
            </p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-yellow-500/5 rounded-full blur-xl" />
          <CardContent className="relative p-4">
            <p className="text-2xl font-bold font-mono text-yellow-400">
              {transactions.filter((t) => t.status === "pending").length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters - segmented control */}
      <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-1">
        {(["all", "sent", "received", "pending"] as FilterType[]).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap",
              filter === filterType
                ? "bg-amber-500/10 text-amber-400 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-amber-400/50" />
            </div>
            <p className="font-medium mb-1">
              {filter === "all"
                ? "No transactions yet"
                : `No ${filter} transactions found`}
            </p>
            <p className="text-sm text-muted-foreground">
              Transactions will appear here once you start using your wallet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {filter === "all"
                ? "All Transactions"
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Transactions`}{" "}
              <span className="text-muted-foreground font-normal text-sm">({filteredTransactions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div>
              {filteredTransactions.map((tx) => {
                const isSent =
                  tx.type === "send" ||
                  tx.from.toLowerCase() === address?.toLowerCase();
                const Icon = isSent ? ArrowUpRight : ArrowDownLeft;

                return (
                  <div
                    key={tx.hash}
                    className="p-4 hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                            isSent ? "bg-red-500/10" : "bg-green-500/10"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              isSent ? "text-red-400" : "text-green-400"
                            )}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {isSent ? "Sent " : "Received "}
                            {tx.tokenSymbol}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {isSent ? "To: " : "From: "}
                            {formatAddress(isSent ? tx.to : tx.from)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-medium font-mono text-sm",
                            isSent ? "text-red-400" : "text-green-400"
                          )}
                        >
                          {isSent ? "-" : "+"}
                          {parseFloat(tx.amount).toFixed(4)} {tx.tokenSymbol}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-1">
                          {timeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(tx.status)}
                        {tx.gasUsed && (
                          <span className="text-muted-foreground font-mono">
                            Gas: {parseFloat(tx.gasUsed).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <a
                        href="#"
                        className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-mono"
                      >
                        <span>{shortenHash(tx.hash)}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
