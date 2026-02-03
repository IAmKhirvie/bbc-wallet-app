"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore } from "@/lib/store";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  fetchPrices,
  fetchHistoricalPrice,
  fetchGlobalData,
  formatMarketCap,
  formatPercent,
  type CryptoData,
} from "@/lib/coingecko";

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
  image: string;
  sparkline_in_7d?: number[];
  color: string;
}

interface PriceHistory {
  time: string;
  price: number;
}

interface SparklineProps {
  data: number[];
  color: string;
  isPositive: boolean;
}

function Sparkline({ data, color, isPositive }: SparklineProps) {
  const width = 120;
  const height = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="3"
        fill={isPositive ? "#22c55e" : "#ef4444"}
      />
    </svg>
  );
}

interface PriceChartProps {
  history: PriceHistory[];
  symbol: string;
  name: string;
  color: string;
}

function PriceChart({ history, symbol, name, color }: PriceChartProps) {
  const width = 400;
  const height = 150;
  const padding = 20;

  const prices = history.map((h) => h.price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;

  const gradientId = `gradient-${symbol}`;

  const points = prices.map((value, index) => {
    const x = padding + (index / (prices.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = [
    `${padding},${height - padding}`,
    ...prices.map((value, index) => {
      const x = padding + (index / (prices.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }),
    `${width - padding},${height - padding}`,
  ].join(" ");

  return (
    <svg width={width} height={height} className="w-full h-auto">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={width - padding}
        cy={height - padding - ((prices[prices.length - 1] - min) / range) * (height - padding * 2)}
        r="4"
        fill={color}
      />
    </svg>
  );
}

// Coin colors for chart themes
const COIN_COLORS: Record<string, string> = {
  bitcoin: "#F7931A",
  ethereum: "#627EEA",
  binancecoin: "#F3BA2F",
  solana: "#14F195",
  cardano: "#0033AD",
  ripple: "#23292F",
  polkadot: "#E6007A",
  dogecoin: "#C2A633",
  tron: "#FF0013",
  "avalanche-2": "#E84142",
};

export default function MarketPage() {
  const { isConnected, bbcBalance } = useWalletStore();
  const [cryptoData, setCryptoData] = useState<CoinPrice[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinPrice | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [globalData, setGlobalData] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timeout>();
  const refreshIntervalRef = useRef<NodeJS.Timeout>();

  // Fetch real crypto data
  const fetchCryptoData = async () => {
    try {
      const data = await fetchPrices();

      const processed: CoinPrice[] = data.map((coin: CryptoData) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
        market_cap_rank: coin.market_cap_rank,
        image: coin.image,
        sparkline_in_7d: coin.sparkline_in_7d,
        color: COIN_COLORS[coin.id] || "#6B7280",
      }));

      setCryptoData(processed);

      if (processed.length > 0 && !selectedCoin) {
        setSelectedCoin(processed[0]);
      }
    } catch (err) {
      setError("Failed to fetch market data. Using cached data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch global market data
  const fetchGlobal = async () => {
    try {
      const data = await fetchGlobalData();
      setGlobalData(data);
    } catch (err) {
      console.error("Failed to fetch global data:", err);
    }
  };

  // Fetch historical data for selected coin
  const fetchSelectedCoinHistory = async (coinId: string) => {
    try {
      const data = await fetchHistoricalPrice(coinId, 1); // 24 hour chart
      const formatted: PriceHistory[] = data.slice(-48).map(([time, price]) => ({
        time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price,
      }));
      setPriceHistory(formatted);
    } catch (err) {
      console.error("Failed to fetch historical data:", err);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([fetchCryptoData(), fetchGlobal()]);
      setIsLoading(false);
      setLastUpdate(new Date());
    };

    loadData();

    // Auto-refresh every 60 seconds (CoinGecko free tier limit)
    intervalRef.current = setInterval(loadData, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update selected coin when data changes
  useEffect(() => {
    if (selectedCoin && cryptoData.length > 0) {
      const updated = cryptoData.find((c) => c.id === selectedCoin.id);
      if (updated && updated.current_price !== selectedCoin.current_price) {
        setSelectedCoin(updated);
      }
    }
  }, [cryptoData]);

  // Fetch historical data when selected coin changes
  useEffect(() => {
    if (selectedCoin) {
      fetchSelectedCoinHistory(selectedCoin.id);
    }
  }, [selectedCoin?.id]);

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    await Promise.all([fetchCryptoData(), fetchGlobal()]);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const handleCoinSelect = (coin: CoinPrice) => {
    setSelectedCoin(coin);
    fetchSelectedCoinHistory(coin.id);
  };

  // Get coin price formatted
  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market</h1>
          <p className="text-muted-foreground">Live cryptocurrency prices from CoinGecko</p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <div className="text-sm text-red-500 flex items-center gap-1">
              <Activity className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={cn("w-2 h-2 rounded-full", isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Stats - Real Data */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Market Cap</p>
                  <p className="font-semibold">{formatMarketCap(globalData.total_market_cap_usd)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="font-semibold">{formatMarketCap(globalData.total_volume_usd)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BTC Dominance</p>
                  <p className="font-semibold">
                    {globalData.bitcoin_dominance_percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Trend</p>
                  <p className="font-semibold text-green-500">
                    {globalData.market_cap_change_percentage_24h_usd?.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Chart for Selected Coin */}
      {selectedCoin && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCoin.image}
                  alt={selectedCoin.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <CardTitle className="text-2xl">{selectedCoin.name}</CardTitle>
                  <p className="text-muted-foreground">
                    Rank #{selectedCoin.market_cap_rank} • {selectedCoin.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{formatPrice(selectedCoin.current_price)}</p>
                <div
                  className={cn(
                    "flex items-center justify-end gap-1 text-sm font-medium",
                    selectedCoin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {selectedCoin.price_change_percentage_24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {formatPercent(selectedCoin.price_change_percentage_24h)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  24h Volume: {formatMarketCap(selectedCoin.total_volume)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {priceHistory.length > 0 ? (
              <>
                <div className="h-[180px] -mx-6 -mt-4">
                  <PriceChart
                    history={priceHistory}
                    symbol={selectedCoin.id}
                    name={selectedCoin.name}
                    color={selectedCoin.color}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-4 px-2">
                  <span>{priceHistory[0]?.time}</span>
                  <span>{priceHistory[Math.floor(priceHistory.length / 2)]?.time}</span>
                  <span>{priceHistory[priceHistory.length - 1]?.time}</span>
                </div>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Loading chart data...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Live Price Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Crypto Prices</CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time data from CoinGecko • Auto-refreshes every 60 seconds
          </p>
        </CardHeader>
        <CardContent>
          {isLoading && cryptoData.length === 0 ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Loading market data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Coin</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">24h Change</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">7 Days</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Market Cap</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Volume (24h)</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((coin, index) => {
                    const isSelected = selectedCoin?.id === coin.id;
                    const isPositive = coin.price_change_percentage_24h >= 0;
                    const sparklineData = coin.sparkline_in_7d || [];

                    return (
                      <tr
                        key={coin.id}
                        onClick={() => handleCoinSelect(coin)}
                        className={cn(
                          "border-b border-border hover:bg-muted/50 cursor-pointer transition-colors",
                          isSelected && "bg-muted"
                        )}
                      >
                        <td className="py-4 px-4 text-muted-foreground">{coin.market_cap_rank}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{coin.name}</p>
                              <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">
                          {formatPrice(coin.current_price)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 font-medium",
                              isPositive ? "text-green-500" : "text-red-500"
                            )}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {formatPercent(coin.price_change_percentage_24h)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {sparklineData.length > 0 ? (
                            <Sparkline
                              data={sparklineData}
                              color={coin.color}
                              isPositive={sparklineData[sparklineData.length - 1] >= sparklineData[0]}
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right text-muted-foreground">
                          {formatMarketCap(coin.market_cap)}
                        </td>
                        <td className="py-4 px-4 text-right text-muted-foreground">
                          {formatMarketCap(coin.total_volume)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* BBC Token Info - Local */}
      <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            BBC Token (Local)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-2xl font-bold">{isConnected ? "" : "Connect wallet to see balance"}</p>
              {isConnected && (
                <p className="text-sm text-muted-foreground">BBC (local only)</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Token Type</p>
              <p className="font-medium">ERC-20</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Network</p>
              <p className="font-medium">Hardhat Local (Chain 31337)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Live Data:</strong> All prices shown above are REAL cryptocurrency prices from CoinGecko API.
            Bitcoin, Ethereum, and other top coins show actual market movements including crashes and pumps.
            Auto-refreshes every 60 seconds (CoinGecko free tier limit).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
