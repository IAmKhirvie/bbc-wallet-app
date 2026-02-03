"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore } from "@/lib/store";
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: string;
  volume?: string;
  icon: string;
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
  color: string;
}

function PriceChart({ history, symbol, color }: PriceChartProps) {
  const width = 400;
  const height = 150;
  const padding = 20;

  const prices = history.map((h) => h.price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const range = max - min || 1;

  // Create gradient
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
      {/* Area */}
      <polygon
        points={areaPoints}
        fill={`url(#${gradientId})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Current price dot */}
      <circle
        cx={width - padding}
        cy={height - padding - ((prices[prices.length - 1] - min) / range) * (height - padding * 2)}
        r="4"
        fill={color}
        className="shadow-lg"
      />
    </svg>
  );
}

export default function MarketPage() {
  const { exchangeRates, refreshExchangeRates, isConnected } = useWalletStore();
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinPrice | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

  // Define coins with their data
  const coinsData: Omit<CoinPrice, "price" | "change24h">[] = [
    {
      symbol: "BBC",
      name: "BigBlackCoin",
      icon: "B",
      marketCap: "1.0M",
      volume: "50K",
      color: "#EAB308",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "Ξ",
      marketCap: "274B",
      volume: "12B",
      color: "#3B82F6",
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      icon: "₿",
      marketCap: "842B",
      volume: "28B",
      color: "#F97316",
    },
    {
      symbol: "SOL",
      name: "Solana",
      icon: "◎",
      marketCap: "42B",
      volume: "2.1B",
      color: "#14F195",
    },
    {
      symbol: "USD",
      name: "US Dollar",
      icon: "$",
      color: "#6B7280",
    },
    {
      symbol: "EUR",
      name: "Euro",
      icon: "€",
      color: "#3B82F6",
    },
    {
      symbol: "GBP",
      name: "British Pound",
      icon: "£",
      color: "#8B5CF6",
    },
  ];

  // Generate mock price history
  const generatePriceHistory = (basePrice: number): PriceHistory[] => {
    const history: PriceHistory[] = [];
    let price = basePrice * 0.95; // Start 5% lower

    for (let i = 0; i < 24; i++) {
      history.push({
        time: `${i}h ago`,
        price: price,
      });
      // Random walk
      price = price * (1 + (Math.random() - 0.45) * 0.05);
    }

    return history;
  };

  // Generate prices with simulated real-time updates
  const generatePrices = () => {
    return coinsData.map((coin) => {
      const basePrice = exchangeRates[coin.symbol] || 1;
      // Add some randomness to simulate live price changes
      const variance = (Math.random() - 0.5) * 0.02; // ±1%
      const price = basePrice * (1 + variance);
      const change24h = (Math.random() - 0.4) * 8; // Random -4% to +4%

      return {
        ...coin,
        price,
        change24h,
      };
    });
  };

  // Initial load
  useEffect(() => {
    const initialPrices = generatePrices();
    setPrices(initialPrices);
    setSelectedCoin(initialPrices[0]);
    setPriceHistory(generatePriceHistory(initialPrices[0].price));
    setIsLoading(false);

    // Set up auto-refresh every 3 seconds
    intervalRef.current = setInterval(() => {
      const newPrices = generatePrices();
      setPrices(newPrices);
      setLastUpdate(new Date());

      // Update selected coin if it exists
      if (selectedCoin) {
        const updated = newPrices.find((p) => p.symbol === selectedCoin.symbol);
        if (updated) {
          setSelectedCoin(updated);

          // Update price history - add new point, remove oldest
          setPriceHistory((prev) => {
            const newHistory = [...prev.slice(1), {
              time: "now",
              price: updated.price,
            }];
            return newHistory;
          });
        }
      }
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshExchangeRates();
    const newPrices = generatePrices();
    setPrices(newPrices);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const handleCoinSelect = (coin: CoinPrice) => {
    setSelectedCoin(coin);
    setPriceHistory(generatePriceHistory(coin.price));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Market</h1>
          <p className="text-muted-foreground">Real-time cryptocurrency prices</p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Market Cap</p>
                <p className="font-semibold">$1.12T</p>
                <p className="text-xs text-green-500">+2.34%</p>
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
                <p className="font-semibold">$42.3B</p>
                <p className="text-xs text-green-500">+5.12%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BBC Dominance</p>
                <p className="font-semibold">0.089%</p>
                <p className="text-xs text-green-500">+0.002%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BTC Dominance</p>
                <p className="font-semibold">52.3%</p>
                <p className="text-xs text-red-500">-0.15%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      {selectedCoin && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                  style={{ backgroundColor: `${selectedCoin.color}20`, color: selectedCoin.color }}
                >
                  {selectedCoin.icon}
                </div>
                <div>
                  <CardTitle className="text-2xl">{selectedCoin.name}</CardTitle>
                  <p className="text-muted-foreground">{selectedCoin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${selectedCoin.price.toFixed(2)}</p>
                <div
                  className={cn(
                    "flex items-center justify-end gap-1 text-sm font-medium",
                    selectedCoin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {selectedCoin.change24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(selectedCoin.change24h).toFixed(2)}% (24h)
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] -mx-6 -mt-4">
              <PriceChart history={priceHistory} symbol={selectedCoin.symbol} color={selectedCoin.color} />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-4 px-2">
              <span>24h</span>
              <span>12h</span>
              <span>6h</span>
              <span>1h</span>
              <span>Now</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Table with Sparklines */}
      <Card>
        <CardHeader>
          <CardTitle>Live Prices</CardTitle>
          <p className="text-sm text-muted-foreground">Auto-updates every 3 seconds</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">#</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Coin</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price (USD)</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">24h Change</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Last 7 Days</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Market Cap</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((coin, index) => {
                  const isSelected = selectedCoin?.symbol === coin.symbol;
                  // Generate sparkline data
                  const sparklineData = Array.from({ length: 12 }, () =>
                    coin.price * (1 + (Math.random() - 0.5) * 0.1)
                  );

                  return (
                    <tr
                      key={coin.symbol}
                      onClick={() => handleCoinSelect(coin)}
                      className={cn(
                        "border-b border-border hover:bg-muted/50 cursor-pointer transition-colors",
                        isSelected && "bg-muted"
                      )}
                    >
                      <td className="py-4 px-4 text-muted-foreground">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                            style={{ backgroundColor: `${coin.color}20`, color: coin.color }}
                          >
                            {coin.icon}
                          </div>
                          <div>
                            <p className="font-medium">{coin.name}</p>
                            <p className="text-sm text-muted-foreground">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${coin.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div
                          className={cn(
                            "flex items-center justify-end gap-1",
                            coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {coin.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(coin.change24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Sparkline
                          data={sparklineData}
                          color={coin.color}
                          isPositive={coin.change24h >= 0}
                        />
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground">
                        {coin.marketCap ? `$${coin.marketCap}` : "-"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant={isSelected ? "default" : "ghost"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCoinSelect(coin);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prices.slice(0, 4).map((coin) => (
              <div key={coin.symbol} className="p-3 rounded-lg bg-background/50">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: `${coin.color}20`, color: coin.color }}
                  >
                    {coin.icon}
                  </div>
                  <span className="font-medium text-sm">{coin.symbol}</span>
                </div>
                <p className="text-lg font-bold">${coin.price.toFixed(2)}</p>
                <p
                  className={cn(
                    "text-xs",
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {coin.change24h >= 0 ? "+" : ""}
                  {coin.change24h.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Live Monitoring:</strong> Prices automatically refresh every 3 seconds.
            This is a demo with simulated price movements. For production, integrate with
            real price feeds like CoinGecko API, CoinMarketCap, or Chainlink Price Feeds.
            The BBC token only exists on your local Hardhat network.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
