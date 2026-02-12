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

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: "bg-green-500/10 text-green-400 border-green-500/20",
      failed: "bg-red-500/10 text-red-400 border-red-500/20",
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
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

  if (displayTransactions.length === 0) {
    return (
      <div className={cn("text-center py-12 text-muted-foreground", className)}>
        <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
        <p className="font-medium">No transactions yet</p>
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
            className="block"
          >
            <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
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
              <div className="text-right flex flex-col items-end gap-1">
                <div
                  className={cn(
                    "font-medium font-mono text-sm",
                    isSent ? "text-red-400" : "text-green-400"
                  )}
                >
                  {isSent ? "-" : "+"}
                  {parseFloat(tx.amount).toFixed(4)} {tx.tokenSymbol}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(tx.status)}
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(tx.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
