"use client";

import { useWalletStore, type Currency } from "@/lib/store";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  className?: string;
  label?: string;
}

const currencies: { value: Currency; label: string }[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "BBC", label: "BBC" },
  { value: "ETH", label: "ETH" },
  { value: "BTC", label: "BTC" },
];

export function CurrencySelector({ className, label = "Display Currency" }: CurrencySelectorProps) {
  const { selectedCurrency, setSelectedCurrency } = useWalletStore();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <label className="text-xs font-medium text-muted-foreground">{label}:</label>}
      <select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value as Currency)}
        className={cn(
          "h-8 rounded-md px-2.5 text-xs font-medium",
          "bg-white/5 border border-white/[0.08]",
          "text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/30",
          "transition-colors cursor-pointer"
        )}
      >
        {currencies.map((currency) => (
          <option key={currency.value} value={currency.value} className="bg-card text-foreground">
            {currency.label}
          </option>
        ))}
      </select>
    </div>
  );
}
