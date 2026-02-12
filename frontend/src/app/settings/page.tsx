"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useWalletStore, type Currency } from "@/lib/store";
import { DollarSign, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const currencies: { value: Currency; label: string; description: string }[] = [
  { value: "USD", label: "US Dollar", description: "United States Dollar ($)" },
  { value: "EUR", label: "Euro", description: "European Union Euro" },
  { value: "GBP", label: "British Pound", description: "United Kingdom Pound" },
  { value: "BBC", label: "BigBlackCoin", description: "Display values in BBC" },
  { value: "ETH", label: "Ethereum", description: "Display values in ETH" },
  { value: "BTC", label: "Bitcoin", description: "Display values in BTC" },
];

export default function SettingsPage() {
  const { selectedCurrency, setSelectedCurrency, exchangeRates, tokenSymbol } = useWalletStore();

  const currencyInfo = currencies.find((c) => c.value === selectedCurrency);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your wallet experience</p>
      </div>

      {/* Currency Settings */}
      <Card className="relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            Display Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm">Preferred Currency</Label>
            <Select
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
              className="w-full"
            >
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label} - {currency.description}
                </option>
              ))}
            </Select>
            {currencyInfo && (
              <p className="text-xs text-muted-foreground mt-2">
                {currencyInfo.description}
              </p>
            )}
          </div>

          {/* Exchange Rates Table */}
          <div className="border-t border-white/[0.06] pt-4">
            <Label className="text-sm font-medium mb-3 block">Current Exchange Rates</Label>
            <div className="rounded-lg border border-white/[0.06] overflow-hidden">
              {Object.entries(exchangeRates).map(([symbol, rate], index) => (
                <div
                  key={symbol}
                  className={cn(
                    "flex justify-between items-center px-4 py-2.5 text-sm",
                    index !== Object.entries(exchangeRates).length - 1 && "border-b border-white/[0.04]",
                    "hover:bg-white/5 transition-colors"
                  )}
                >
                  <span className="text-muted-foreground">1 {symbol}</span>
                  <span className="font-medium font-mono">${rate.toFixed(2)} USD</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="relative overflow-hidden">
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Info className="h-4 w-4 text-amber-400" />
            </div>
            About BBC Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-white/[0.04] hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">App Version</span>
              <span className="font-medium font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-white/[0.04] hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">Network</span>
              <span className="font-medium">Hardhat Local (Chain ID: 31337)</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-white/[0.04] hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">Token Standard</span>
              <span className="font-medium">ERC-20</span>
            </div>
            <div className="flex justify-between items-center px-4 py-2.5 text-sm hover:bg-white/5 transition-colors">
              <span className="text-muted-foreground">Purpose</span>
              <span className="font-medium">Educational / Learning</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This is an educational blockchain wallet application. It uses a local
            Hardhat network for testing and learning purposes. Do not use with
            real funds on mainnet.
          </p>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-amber-400">Learning Project:</strong> This wallet is designed to help you
            understand how blockchain wallets work. All transactions occur on your
            local Hardhat network.
          </p>
        </div>
      </div>
    </div>
  );
}
