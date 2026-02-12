"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Home, Activity, Settings, TrendingUp } from "lucide-react";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { NetworkStatus } from "@/components/NetworkStatus";
import { CurrencySelector } from "@/components/CurrencySelector";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/market", label: "Market", icon: TrendingUp },
  { href: "/transactions", label: "Activity", icon: Activity },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className="hidden md:block sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-lg"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-sm font-black text-black">B</span>
              </div>
              <span className="text-foreground">BBC Wallet</span>
            </Link>

            {/* Center: Nav Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right: Status & Wallet */}
            <div className="flex items-center gap-3">
              <NetworkStatus />
              <CurrencySelector />
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Minimal Top Bar */}
      <nav className="md:hidden sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-xs font-black text-black">B</span>
            </div>
            <span className="text-foreground">BBC Wallet</span>
          </Link>

          {/* Connect Wallet Button */}
          <ConnectWalletButton />
        </div>
      </nav>

      {/* Mobile Navigation - Fixed Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-200",
                  isActive
                    ? "text-amber-400"
                    : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive && "drop-shadow-[0_0_6px_rgba(245,166,35,0.5)]"
                  )}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
