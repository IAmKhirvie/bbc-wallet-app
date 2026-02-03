"use client";

import { useWalletStore } from "@/lib/store";
import { formatAddress, timeAgo, shortenHash } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FilterType = "all" | "sent" | "received" | "pending";

export default function TransactionsPage() {
  const { transactions, address, isConnected } = useWalletStore();
  const [filter, setFilter] = useState<FilterType>("all");

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      success: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    };

    return (
      <span
        className={cn(
          "px-2 py-1 rounded-full text-xs font-medium border",
          styles[status as keyof typeof styles]
        )}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Your transaction history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{transactions.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">
              {transactions.filter((t) => t.type === "receive").length}
            </p>
            <p className="text-xs text-muted-foreground">Received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-500">
              {transactions.filter((t) => t.type === "send").length}
            </p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-500">
              {transactions.filter((t) => t.status === "pending").length}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(["all", "sent", "received", "pending"] as FilterType[]).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
              filter === filterType
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filter === "all"
                ? "No transactions yet"
                : `No ${filter} transactions found`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {filter === "all"
                ? "All Transactions"
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Transactions`}{" "}
              ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredTransactions.map((tx) => {
                const isSent =
                  tx.type === "send" ||
                  tx.from.toLowerCase() === address?.toLowerCase();
                const Icon = isSent ? ArrowUpRight : ArrowDownLeft;

                return (
                  <div
                    key={tx.hash}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-full",
                            isSent ? "bg-red-500/10" : "bg-green-500/10"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-5 w-5",
                              isSent ? "text-red-500" : "text-green-500"
                            )}
                          />
                        </div>
                        <div>
                          <div className="font-medium">
                            {isSent ? "Sent " : "Received "}
                            {tx.tokenSymbol}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isSent ? "To: " : "From: "}
                            {formatAddress(isSent ? tx.to : tx.from)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "font-medium",
                            isSent ? "text-red-500" : "text-green-500"
                          )}
                        >
                          {isSent ? "-" : "+"}
                          {parseFloat(tx.amount).toFixed(4)} {tx.tokenSymbol}
                        </div>
                        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                          {getStatusIcon(tx.status)}
                          {timeAgo(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(tx.status)}
                        {tx.gasUsed && (
                          <span className="text-muted-foreground">
                            Gas: {parseFloat(tx.gasUsed).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <a
                        href="#"
                        className="flex items-center gap-1 text-primary hover:underline"
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
