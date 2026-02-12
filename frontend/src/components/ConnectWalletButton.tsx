"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/store";
import { Wallet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const { isConnected, address, isConnecting, connect, disconnect } = useWalletStore();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isConnecting}
      className={cn(
        isConnected
          ? ""
          : "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20",
        className
      )}
      variant={isConnected ? "outline" : "default"}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          <span className="font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </>
      ) : (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}
