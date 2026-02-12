"use client";

import { useWalletStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NetworkStatusProps {
  className?: string;
}

export function NetworkStatus({ className }: NetworkStatusProps) {
  const { isConnected } = useWalletStore();

  if (!isConnected) {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        <span>Disconnected</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      <span className="text-green-400 font-medium">Hardhat</span>
    </div>
  );
}
