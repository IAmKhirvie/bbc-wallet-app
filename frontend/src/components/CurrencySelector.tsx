"use client";

import { Select } from "@/components/ui/select";
import { useWalletStore, type Currency } from "@/lib/store";
import { DollarSign, Coins, PoundSterling, Euro } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  className?: string;
  label?: string;
}

const currencies: { value: Currency; label: string; icon: React.ReactNode }[] = [
  { value: "USD", label: "USD", icon: <DollarSign className="h-4 w-4" /> },
  { value: "EUR", label: "EUR", icon: <Euro className="h-4 w-4" /> },
  { value: "GBP", label: "GBP", icon: <PoundSterling className="h-4 w-4" /> },
  { value: "BBC", label: "BBC", icon: <Coins className="h-4 w-4 text-yellow-500" /> },
  { value: "ETH", label: "ETH", icon: <Coins className="h-4 w-4 text-blue-500" /> },
  { value: "BTC", label: "BTC", icon: <Coins className="h-4 w-4 text-orange-500" /> },
];

export function CurrencySelector({ className, label = "Display Currency" }: CurrencySelectorProps) {
  const { selectedCurrency, setSelectedCurrency } = useWalletStore();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <label className="text-sm font-medium">{label}:</label>}
      <Select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
        className="w-32"
      >
        {currencies.map((currency) => (
          <option key={currency.value} value={currency.value}>
            {currency.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
