"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/lib/store";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const loadTokenInfo = useWalletStore((state) => state.loadTokenInfo);

  useEffect(() => {
    // Load token info on mount
    loadTokenInfo();
  }, [loadTokenInfo]);

  return <>{children}</>;
}
