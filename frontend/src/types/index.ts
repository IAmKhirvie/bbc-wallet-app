// Shared TypeScript interfaces

export interface DeploymentInfo {
  network: string;
  chainId: string;
  deployedAt?: string;
  contracts: {
    MockOracle: string;
    BigBlackCoin: string;
  };
  deployer?: string;
}

export interface GlobalMarketData {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd?: number;
}

export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeAllListeners: () => void;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}
