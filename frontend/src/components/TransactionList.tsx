"use client";

import { useWalletStore } from "@/lib/store";
import { formatAddress, timeAgo, shortenHash } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TransactionListProps {
  limit?: number;
  className?: string;
}

export function TransactionList({ limit = 5, className }: TransactionListProps) {
  const { transactions, address } = useWalletStore();

  const displayTransactions = transactions.slice(0, limit);

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

  if (displayTransactions.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <p>No transactions yet</p>
        <p className="text-sm mt-1">Your transactions will appear here</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {displayTransactions.map((tx) => {
        const isSent = tx.type === "send" || tx.from.toLowerCase() === address?.toLowerCase();
        const Icon = isSent ? ArrowUpRight : ArrowDownLeft;

        return (
          <Link
            key={tx.hash}
            href={`/transactions`}
            className="block hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between p-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    isSent ? "bg-red-500/10" : "bg-green-500/10"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
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
                <div className={cn("font-medium", isSent ? "text-red-500" : "text-green-500")}>
                  {isSent ? "-" : "+"}
                  {parseFloat(tx.amount).toFixed(4)} {tx.tokenSymbol}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                  {getStatusIcon(tx.status)}
                  {timeAgo(tx.timestamp)}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
