"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useWalletStore, type Currency } from "@/lib/store";
import { Settings as SettingsIcon, DollarSign, Globe, Info } from "lucide-react";

const currencies: { value: Currency; label: string; description: string }[] = [
  { value: "USD", label: "US Dollar", description: "United States Dollar ($)" },
  { value: "EUR", label: "Euro", description: "European Union Euro (€)" },
  { value: "GBP", label: "British Pound", description: "United Kingdom Pound (£)" },
  { value: "BBC", label: "BigBlackCoin", description: "Display values in BBC" },
  { value: "ETH", label: "Ethereum", description: "Display values in ETH" },
  { value: "BTC", label: "Bitcoin", description: "Display values in BTC" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
];

export default function SettingsPage() {
  const { selectedCurrency, setSelectedCurrency, exchangeRates, tokenSymbol } = useWalletStore();

  const currencyInfo = currencies.find((c) => c.value === selectedCurrency);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your wallet experience</p>
      </div>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Display Currency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Preferred Currency</Label>
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
              <p className="text-sm text-muted-foreground mt-2">
                {currencyInfo.description}
              </p>
            )}
          </div>

          {/* Exchange Rates */}
          <div className="border-t border-border pt-4">
            <Label className="text-sm font-medium mb-3 block">Current Exchange Rates</Label>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(exchangeRates).map(([symbol, rate]) => (
                <div key={symbol} className="flex justify-between">
                  <span className="text-muted-foreground">1 {symbol}</span>
                  <span className="font-medium">
                    ${rate.toFixed(2)} USD
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">App Language</Label>
            <Select id="language" value="en" disabled className="w-full">
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </Select>
            <p className="text-sm text-muted-foreground">
              More languages coming soon!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About BBC Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">App Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network</span>
            <span>Hardhat Local (Chain ID: 31337)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token Standard</span>
            <span>ERC-20</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Purpose</span>
            <span>Educational / Learning</span>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-muted-foreground">
              This is an educational blockchain wallet application. It uses a local
              Hardhat network for testing and learning purposes. Do not use with
              real funds on mainnet.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-primary">
          <strong>Learning Project:</strong> This wallet is designed to help you
          understand how blockchain wallets work. All transactions occur on your
          local Hardhat network.
        </p>
      </div>
    </div>
  );
}
