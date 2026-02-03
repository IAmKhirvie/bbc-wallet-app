"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/store";
import { Wallet, LogOut } from "lucide-react";
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
      className={className}
      variant={isConnected ? "outline" : "default"}
    >
      {isConnecting ? (
        "Connecting..."
      ) : isConnected ? (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          {address?.slice(0, 6)}...{address?.slice(-4)}
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
