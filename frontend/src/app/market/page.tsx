"use client";

import React, { useEffect, useState, useRef } from "react";
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
  BarChart3,
  Coins,
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

const Sparkline = React.memo(function Sparkline({ data, color, isPositive }: SparklineProps) {
  const width = 140;
  const height = 48;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  const strokeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-fill-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#sparkline-fill-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="2.5"
        fill={strokeColor}
      />
    </svg>
  );
});

interface PriceChartProps {
  history: PriceHistory[];
  symbol: string;
  name: string;
  color: string;
}

const PriceChart = React.memo(function PriceChart({ history, symbol, name, color }: PriceChartProps) {
  const width = 500;
  const height = 280;
  const padding = 24;

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
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="50%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={width - padding}
        cy={height - padding - ((prices[prices.length - 1] - min) / range) * (height - padding * 2)}
        r="5"
        fill={color}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="2"
      />
    </svg>
  );
});

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
        sparkline_in_7d: coin.sparkline_in_7d?.price,
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
      const data = await fetchHistoricalPrice(coinId, 1);
      const formatted: PriceHistory[] = data.slice(-48).map((point) => ({
        time: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: point.price,
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

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market</h1>
          <p className="text-muted-foreground">Live cryptocurrency prices from CoinGecko</p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <div className="text-xs text-red-400 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {error}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={cn("w-1.5 h-1.5 rounded-full", isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
            {lastUpdate.toLocaleTimeString()}
          </div>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm" className="border-white/[0.08] hover:border-amber-500/30">
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Stats */}
      {globalData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-green-500/5 rounded-full blur-xl" />
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Market Cap</p>
                  <p className="font-semibold font-mono text-green-400">{formatMarketCap(globalData.total_market_cap?.usd ?? 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                  <p className="font-semibold font-mono text-blue-400">{formatMarketCap(globalData.total_volume?.usd ?? 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">BTC Dominance</p>
                  <p className="font-semibold font-mono text-amber-400">
                    {(globalData.market_cap_percentage?.btc ?? 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-purple-500/5 rounded-full blur-xl" />
            <CardContent className="relative p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Market Trend</p>
                  <p className={cn(
                    "font-semibold font-mono",
                    (globalData.market_cap_change_percentage_24h_usd ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                  )}>
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
        <Card className="relative overflow-hidden border-amber-500/10">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCoin.image}
                  alt={selectedCoin.name}
                  className="w-12 h-12 rounded-full ring-2 ring-white/10"
                />
                <div>
                  <CardTitle className="text-2xl">{selectedCoin.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Rank #{selectedCoin.market_cap_rank} <span className="font-mono">{selectedCoin.symbol}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold font-mono">{formatPrice(selectedCoin.current_price)}</p>
                <div
                  className={cn(
                    "flex items-center justify-end gap-1 text-sm font-medium",
                    selectedCoin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
                  )}
                >
                  {selectedCoin.price_change_percentage_24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {formatPercent(selectedCoin.price_change_percentage_24h)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  Vol: {formatMarketCap(selectedCoin.total_volume)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {priceHistory.length > 0 ? (
              <>
                <div className="h-[280px] -mx-6 -mt-4">
                  <PriceChart
                    history={priceHistory}
                    symbol={selectedCoin.id}
                    name={selectedCoin.name}
                    color={selectedCoin.color}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-4 px-2 font-mono">
                  <span>{priceHistory[0]?.time}</span>
                  <span>{priceHistory[Math.floor(priceHistory.length / 2)]?.time}</span>
                  <span>{priceHistory[priceHistory.length - 1]?.time}</span>
                </div>
              </>
            ) : (
              <div className="h-[280px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-amber-400/50 mr-2" />
                <span className="text-muted-foreground">Loading chart data...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Live Price Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live Crypto Prices</CardTitle>
          <p className="text-xs text-muted-foreground">
            Real-time data from CoinGecko - Auto-refreshes every 60 seconds
          </p>
        </CardHeader>
        <CardContent>
          {isLoading && cryptoData.length === 0 ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Loading market data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">#</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Coin</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Price</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">24h</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">7 Days</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Market Cap</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((coin) => {
                    const isSelected = selectedCoin?.id === coin.id;
                    const isPositive = coin.price_change_percentage_24h >= 0;
                    const sparklineData = coin.sparkline_in_7d || [];

                    return (
                      <tr
                        key={coin.id}
                        onClick={() => handleCoinSelect(coin)}
                        className={cn(
                          "border-b border-white/[0.04] hover:bg-white/5 cursor-pointer transition-colors",
                          isSelected && "bg-amber-500/5 border-amber-500/10"
                        )}
                      >
                        <td className="py-4 px-4 text-xs text-muted-foreground font-mono">{coin.market_cap_rank}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-sm">{coin.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{coin.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right font-medium font-mono text-sm">
                          {formatPrice(coin.current_price)}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className={cn(
                              "flex items-center justify-end gap-1 text-sm font-medium font-mono",
                              isPositive ? "text-green-400" : "text-red-400"
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
                        <td className="py-4 px-4 text-right text-xs text-muted-foreground font-mono">
                          {formatMarketCap(coin.market_cap)}
                        </td>
                        <td className="py-4 px-4 text-right text-xs text-muted-foreground font-mono">
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
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-lg font-bold text-black">B</span>
            </div>
            BBC Token (Local)
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-3 border border-white/[0.06]">
              <p className="text-xs text-muted-foreground">Your Balance</p>
              <p className="text-xl font-bold font-mono text-amber-400">
                {isConnected ? `${Number(bbcBalance) / 1e18} BBC` : "-- BBC"}
              </p>
              {isConnected && (
                <p className="text-xs text-muted-foreground">BBC (local only)</p>
              )}
              {!isConnected && (
                <p className="text-xs text-muted-foreground">Connect wallet</p>
              )}
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/[0.06]">
              <p className="text-xs text-muted-foreground">Token Type</p>
              <p className="font-medium">ERC-20</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/[0.06]">
              <p className="text-xs text-muted-foreground">Network</p>
              <p className="font-medium">Hardhat Local (Chain 31337)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
        <p className="text-xs text-muted-foreground">
          <strong className="text-amber-400">Live Data:</strong> All prices shown above are REAL cryptocurrency prices from CoinGecko API.
          Bitcoin, Ethereum, and other top coins show actual market movements including crashes and pumps.
          Auto-refreshes every 60 seconds (CoinGecko free tier limit).
        </p>
      </div>
    </div>
  );
}
