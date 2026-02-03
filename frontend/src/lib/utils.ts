import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format balance with decimals
export function formatBalance(balance: bigint, decimals = 18): string {
  if (balance === 0n) return "0";
  const str = balance.toString();
  if (str.length <= decimals) {
    return "0." + str.padStart(decimals, "0").replace(/0+$/, "");
  }
  const whole = str.slice(0, -decimals);
  let fraction = str.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

// Format currency
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === "BBC" || currency === "ETH" || currency === "BTC" ? "USD" : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

// Convert from wei/smallest unit to decimal
export function fromWei(amount: bigint, decimals = 18): number {
  return Number(amount) / Math.pow(10, decimals);
}

// Convert to wei/smallest unit
export function toWei(amount: number, decimals = 18): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

// Shorten hash
export function shortenHash(hash: string, chars = 6): string {
  if (!hash) return "";
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

// Check if valid address
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Calculate time ago
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}
