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
  sparkline_in_7d?: { price: number[] };
}

// Simple request cache to avoid rate limiting
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 30_000; // 30 seconds
const MIN_REQUEST_INTERVAL = 2_000; // 2 seconds between requests
let lastRequestTime = 0;

async function cachedFetch<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

/**
 * Fetch real prices for multiple cryptocurrencies
 */
export async function fetchPrices(): Promise<CryptoData[]> {
  return cachedFetch<CryptoData[]>(
    `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&price_change_percentage=24h&sparkline=true`
  );
}

/**
 * Fetch price for a single cryptocurrency
 */
export async function fetchSinglePrice(coinId: string): Promise<CryptoData | null> {
  try {
    const data = await cachedFetch<CryptoData[]>(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${coinId}`
    );
    return data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch price for ${coinId}:`, error);
    return null;
  }
}

/**
 * Fetch historical price data (for charts)
 */
export async function fetchHistoricalPrice(
  coinId: string,
  days: number = 1
): Promise<{ time: number; price: number }[]> {
  try {
    const data = await cachedFetch<{ prices: number[][] }>(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    return (data.prices || []).map(([time, price]) => ({ time, price }));
  } catch (error) {
    console.error(`Failed to fetch historical data for ${coinId}:`, error);
    return [];
  }
}

/**
 * Get global market data
 */
export async function fetchGlobalData(): Promise<{
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd?: number;
} | null> {
  try {
    const data = await cachedFetch<{ data: ReturnType<typeof fetchGlobalData> extends Promise<infer T> ? T : never }>(
      `${COINGECKO_API}/global`
    );
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
