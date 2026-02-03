// CoinGecko API integration for real cryptocurrency prices
// Free API - no key required for basic usage

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export interface CoinGeckoPrice {
  usd: number;
  usd_24h_change: number;
  usd_market_cap: number;
  usd_24h_vol: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  sparkline_in_7d?: number[];
}

// Top cryptocurrencies to track
export const TRACKED_COINS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "solana",
  "cardano",
  "ripple",
  "polkadot",
  "dogecoin",
  "tron",
  "avalanche-2",
];

/**
 * Fetch real prices for multiple cryptocurrencies
 */
export async function fetchPrices(): Promise<CryptoData[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&price_change_percentage=24h&sparkline=true`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    throw error;
  }
}

/**
 * Fetch price for a single cryptocurrency
 */
export async function fetchSinglePrice(coinId: string): Promise<CryptoData | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${coinId}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch price for ${coinId}:`, error);
    return null;
  }
}

/**
 * Fetch historical price data (for charts)
 * Note: Free tier has limited historical data
 */
export async function fetchHistoricalPrice(
  coinId: string,
  days: number = 1
): Promise<{ time: number; price: number }[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data.prices || [];
  } catch (error) {
    console.error(`Failed to fetch historical data for ${coinId}:`, error);
    return [];
  }
}

/**
 * Get global market data
 */
export async function fetchGlobalData(): Promise<{
  total_market_cap_usd: number;
  total_volume_usd: number;
  bitcoin_dominance_percentage: number;
  market_cap_percentage: Record<string, number>;
} | null> {
  try {
    const response = await fetch(`${COINGECKO_API}/global`);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch global data:", error);
    return null;
  }
}

/**
 * Convert market cap to readable format
 */
export function formatMarketCap(cap: number): string {
  if (cap >= 1_000_000_000_000) return `$${(cap / 1_000_000_000_000).toFixed(1)}T`;
  if (cap >= 1_000_000_000) return `$${(cap / 1_000_000_000).toFixed(1)}B`;
  if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(1)}M`;
  if (cap >= 1_000) return `$${(cap / 1000).toFixed(1)}K`;
  return `$${cap.toFixed(2)}`;
}

/**
 * Format percentage with + sign for positive
 */
export function formatPercent(value: number, decimals = 2): string {
  const signed = value >= 0 ? "+" : "";
  return `${signed}${value.toFixed(decimals)}%`;
}
