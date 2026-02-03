"use client";

import { useWalletStore } from "@/lib/store";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkStatusProps {
  className?: string;
}

export function NetworkStatus({ className }: NetworkStatusProps) {
  const { isConnected, address } = useWalletStore();

  if (!isConnected) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <WifiOff className="h-4 w-4" />
        <span>Not Connected</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <Wifi className="h-3.5 w-3.5 text-green-500" />
        <span className="text-green-500 font-medium">Hardhat Local</span>
      </div>
      {address && (
        <span className="text-muted-foreground">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
    </div>
  );
}
