"use client";

import { WalletCard } from "@/components/WalletCard";
import { QuickActions } from "@/components/QuickActions";
import { TransactionList } from "@/components/TransactionList";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletStore, fromWei } from "@/lib/store";
import { type ThemeId } from "@/lib/themes";
import {
  Activity,
  ArrowRight,
  Coins,
  Shield,
  Zap,
  Send,
  TrendingUp,
  Lock,
  Sparkles,
  ChevronDown,
  Terminal,
  Star,
  Diamond,
  Gamepad2,
  Eye,
  Box,
  Layers,
  Crown,
  Cpu,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BrutalistWorld } from "@/components/BrutalistWorld";

// ========================================
// SHARED UTILITIES
// ========================================

function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function StatNum({ value, label, suffix = "", delay = 0, className = "" }: {
  value: number; label: string; suffix?: string; delay?: number; className?: string;
}) {
  const [vis, setVis] = useState(false);
  const count = useCounter(value, 2000, vis);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={cn("text-center", className)}>
      <div className="text-3xl md:text-4xl font-bold font-mono">{vis ? count.toLocaleString() : "0"}{suffix}</div>
      <div className="text-sm opacity-60 mt-1">{label}</div>
    </div>
  );
}

// ========================================
// 1. GLASSMORPHISM (default)
// ========================================
function GlassLanding() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    <div className="-mx-4 -mt-6">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,166,35,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(245,166,35,0.06) 0%, transparent 50%)" }}>
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] animate-float-delayed" />
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-amber-400/30"
              style={{ left: `${Math.random() * 100}%`, top: `${60 + Math.random() * 40}%`, animation: `particle-rise ${3 + Math.random() * 4}s ease-out infinite`, animationDelay: `${Math.random() * 5}s` }} />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Coin */}
          <div className={cn("mb-8 opacity-0 transition-all duration-1000", loaded && "opacity-100")}>
            <div className="relative w-40 h-40 animate-float">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-2xl animate-pulse-glow" />
              <div className="absolute inset-0 animate-orbit"><div className="w-3 h-3 rounded-full bg-amber-400/60 blur-sm" /></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-2xl shadow-amber-500/30 flex items-center justify-center">
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-500 flex items-center justify-center">
                  <span className="text-4xl font-black text-amber-900/80 select-none">B</span>
                </div>
              </div>
              <div className="absolute inset-4 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
            </div>
          </div>

          <h1 className={cn("text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6 opacity-0", loaded && "animate-text-reveal")}>
            <span className="text-foreground">The Future of</span><br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Digital Currency</span>
          </h1>
          <p className={cn("text-lg md:text-xl text-muted-foreground max-w-xl mb-10 opacity-0", loaded && "animate-fade-in-up delay-300")}>
            Experience blockchain technology hands-on with BigBlackCoin — your educational gateway to Web3.
          </p>
          <div className={cn("flex flex-col sm:flex-row gap-4 mb-16 opacity-0", loaded && "animate-fade-in-up delay-500")}>
            <ConnectWalletButton className="h-14 px-10 text-base rounded-xl" />
            <Link href="/about" className="h-14 px-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-semibold flex items-center justify-center gap-2 transition-all duration-300">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className={cn("grid grid-cols-3 gap-8 md:gap-16 opacity-0", loaded && "animate-fade-in-up delay-700")}>
            <StatNum value={1000000} label="Total Supply" delay={800} className="text-amber-400" />
            <StatNum value={6} label="Currencies" delay={1000} className="text-blue-400" />
            <StatNum value={3} label="Team Members" delay={1200} className="text-green-400" />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float opacity-40"><ChevronDown className="h-6 w-6 text-amber-400" /></div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-amber-400 text-sm font-medium bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4"><Sparkles className="h-3.5 w-3.5" />Features</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">A complete blockchain learning experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Coins, title: "ERC-20 Token", desc: "Mintable, burnable BBC token with supply cap.", color: "amber", span: "md:col-span-2 lg:col-span-2" },
            { icon: Shield, title: "Secure Wallet", desc: "MetaMask integration with auto network detection.", color: "blue" },
            { icon: Send, title: "Instant Transfers", desc: "Send BBC with gas estimation and QR sharing.", color: "green" },
            { icon: TrendingUp, title: "Live Market", desc: "Real-time crypto prices from CoinGecko.", color: "purple" },
            { icon: Lock, title: "Local Testnet", desc: "Safe sandbox on Hardhat. No real funds.", color: "red" },
          ].map((f, i) => (
            <div key={i} className={cn("backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group transition-all duration-500 hover:bg-white/[0.08] hover:border-amber-500/20 hover:-translate-y-1", f.span)}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border", `bg-${f.color}-500/10 border-${f.color}-500/20`)}>
                <f.icon className={cn("h-6 w-6", `text-${f.color}-400`)} />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ========================================
// 2. BRUTALIST
// ========================================
function BrutalistLanding() {
  return <BrutalistWorld />;
}

// ========================================
// 3. MINIMALIST
// ========================================
function MinimalistLanding() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  return (
    <div className="-mx-4 -mt-6">
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4">
        <div className={cn("text-center max-w-2xl opacity-0", loaded && "animate-fade-in-up")}>
          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-12">
            <span className="text-2xl font-bold text-black">B</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6 leading-tight">
            Simple. Secure.<br />
            <span className="font-semibold">BigBlackCoin.</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto leading-relaxed">
            An educational wallet for learning blockchain development.
          </p>
          <ConnectWalletButton className="h-12 px-8 text-sm rounded-full" />
        </div>
      </section>

      <section className="py-24 px-4 max-w-3xl mx-auto">
        <div className="space-y-0 border-t border-white/10">
          {[
            { title: "Custom Token", desc: "ERC-20 standard with minting and burning" },
            { title: "MetaMask", desc: "Seamless wallet connection" },
            { title: "Live Market", desc: "Real-time cryptocurrency data" },
            { title: "Transaction History", desc: "Full activity tracking" },
            { title: "Multi-Currency", desc: "USD, EUR, GBP, BTC, ETH, BBC" },
          ].map((f, i) => (
            <div key={i} className="flex items-center justify-between py-6 border-b border-white/10 group hover:px-4 transition-all duration-300">
              <div>
                <h3 className="font-medium mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ========================================
// 4. MAXIMALIST
// ========================================
function MaximalistLanding() {
  return (
    <div className="-mx-4 -mt-6 overflow-hidden">
      <section className="min-h-[92vh] relative flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
        {/* Decorative shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-pink-500/30 animate-spin-slow" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-4 border-cyan-400/20 animate-spin-slow" style={{ animationDirection: "reverse" }} />
        <div className="absolute top-1/2 left-20 w-20 h-20 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl rotate-45 opacity-20 animate-float" />
        <div className="absolute top-20 right-1/3 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 animate-float-delayed" />

        <div className="relative z-10 text-center max-w-5xl">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {["WEB3", "DEFI", "ERC-20", "BLOCKCHAIN", "CRYPTO"].map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white uppercase tracking-wider">{tag}</span>
            ))}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-6 leading-[0.9]">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent">BIG BLACK</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent">COIN</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-xl mx-auto">
            The <span className="text-yellow-400 font-bold">LOUDEST</span> educational wallet in the blockchain space
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConnectWalletButton className="h-16 px-12 text-lg rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 border-0 text-white font-black hover:scale-105 transition-transform" />
            <Link href="/about" className="h-16 px-12 rounded-2xl border-2 border-white/20 text-white font-bold flex items-center justify-center gap-2 hover:border-white/40 transition-all text-lg">
              EXPLORE <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
            <StatNum value={1000000} label="SUPPLY" delay={200} className="text-yellow-400" />
            <StatNum value={6} label="TOKENS" delay={400} className="text-pink-400" />
            <StatNum value={3} label="DEVS" delay={600} className="text-cyan-400" />
          </div>
        </div>
      </section>
    </div>
  );
}

// ========================================
// 5. NEUBRUTALISM
// ========================================
function NeubrutalLanding() {
  return (
    <div className="-mx-4 -mt-6" style={{ background: "#FFFBEB" }}>
      <section className="min-h-[92vh] flex items-center px-4 md:px-12">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-amber-400 text-black font-black text-sm px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 rounded-lg" style={{ borderWidth: "3px" }}>
                EDUCATIONAL PROJECT
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-black leading-[0.9] mb-6">
                BBC<br />Wallet<span className="text-amber-500">.</span>
              </h1>
              <p className="text-lg text-black/60 mb-8 max-w-md leading-relaxed">
                Learn blockchain by doing. Custom ERC-20 token, multi-currency wallet, and live market data.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConnectWalletButton className="h-14 px-8 text-base rounded-xl !bg-black !text-white font-black shadow-[4px_4px_0px_0px_rgba(245,166,35,1)] hover:shadow-[2px_2px_0px_0px_rgba(245,166,35,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all" />
                <Link href="/about" className="h-14 px-8 rounded-xl bg-white text-black font-black flex items-center justify-center gap-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all" style={{ borderWidth: "3px" }}>
                  About Us <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-amber-400 rounded-3xl border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500" style={{ borderWidth: "3px" }}>
                <span className="text-8xl font-black text-black">B</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-16">
            {[
              { n: "1M", label: "Token Supply", bg: "bg-pink-300" },
              { n: "6", label: "Currencies", bg: "bg-cyan-300" },
              { n: "3", label: "Team Members", bg: "bg-lime-300" },
            ].map((s, i) => (
              <div key={i} className={cn("p-6 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center text-black", s.bg)} style={{ borderWidth: "3px" }}>
                <div className="text-3xl md:text-4xl font-black">{s.n}</div>
                <div className="text-sm font-bold opacity-70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ========================================
// 6. NEUMORPHISM
// ========================================
function NeumorphLanding() {
  return (
    <div className="-mx-4 -mt-6" style={{ background: "#1a1a2e" }}>
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <div className="w-32 h-32 rounded-full mx-auto mb-10 flex items-center justify-center"
            style={{ background: "#1a1a2e", boxShadow: "8px 8px 20px #0d0d1a, -8px -8px 20px #272742" }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-inner">
              <span className="text-4xl font-black text-amber-900/80">B</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white/90 leading-tight">
            BBC Wallet
          </h1>
          <p className="text-lg text-white/40 mb-10 max-w-md mx-auto">
            Soft, tactile, and beautiful. Your gateway to blockchain learning.
          </p>
          <div className="inline-flex gap-4">
            <ConnectWalletButton className="h-14 px-10 text-base rounded-2xl" />
          </div>

          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
            {[
              { n: "1M", label: "Supply" },
              { n: "6", label: "Currencies" },
              { n: "3", label: "Builders" },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl text-center"
                style={{ background: "#1a1a2e", boxShadow: "6px 6px 15px #0d0d1a, -6px -6px 15px #272742" }}>
                <div className="text-2xl font-bold text-amber-400">{s.n}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ========================================
// 7. CYBERPUNK
// ========================================
function CyberpunkLanding() {
  return (
    <div className="-mx-4 -mt-6" style={{ background: "#0a0a0a" }}>
      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)" }} />

      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Neon grid floor */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20"
          style={{ background: "linear-gradient(transparent 60%, rgba(0,255,165,0.1) 100%)", backgroundImage: "linear-gradient(rgba(0,255,165,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,165,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: "perspective(500px) rotateX(60deg)", transformOrigin: "bottom" }} />

        <div className="relative z-10 text-center max-w-4xl">
          <div className="text-sm font-mono tracking-[0.5em] uppercase mb-6" style={{ color: "#00ffa5" }}>
            {'>'} initializing wallet protocol...
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase leading-[0.85] mb-6">
            <span style={{ color: "#ff0055", textShadow: "0 0 20px rgba(255,0,85,0.5), 0 0 40px rgba(255,0,85,0.2)" }}>BBC</span>
            <br />
            <span style={{ color: "#00ffa5", textShadow: "0 0 20px rgba(0,255,165,0.5), 0 0 40px rgba(0,255,165,0.2)" }}>WALLET</span>
          </h1>
          <p className="text-white/50 text-lg mb-10 font-mono max-w-lg mx-auto">
            [DECENTRALIZED] [ERC-20] [EDUCATIONAL]
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConnectWalletButton className="h-14 px-10 text-base rounded-none border-2 font-mono uppercase tracking-wider border-[#00ffa5] text-[#00ffa5] bg-[#00ffa5]/10" />
            <Link href="/about" className="h-14 px-10 rounded-none border-2 font-mono uppercase tracking-wider flex items-center justify-center gap-2 border-[#ff0055] text-[#ff0055] bg-[#ff0055]/10">
              Intel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-16 font-mono max-w-lg mx-auto">
            {[
              { n: "1,000,000", label: "SUPPLY", color: "#00ffa5" },
              { n: "006", label: "TOKENS", color: "#ff0055" },
              { n: "003", label: "OPERATORS", color: "#00d4ff" },
            ].map((s, i) => (
              <div key={i} className="border p-4 text-center" style={{ borderColor: `${s.color}30`, background: `${s.color}08` }}>
                <div className="text-2xl font-bold" style={{ color: s.color, textShadow: `0 0 10px ${s.color}40` }}>{s.n}</div>
                <div className="text-xs opacity-40 mt-1 tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ========================================
// 8. BENTO GRID
// ========================================
function BentoLanding() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  return (
    <div className="-mx-4 -mt-6 px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[140px]">
        {/* Hero tile — large */}
        <div className="col-span-2 row-span-3 rounded-3xl bg-gradient-to-br from-amber-500/10 to-card border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-4"><span className="text-2xl font-black text-black">B</span></div>
            <h1 className="text-4xl md:text-5xl font-black leading-[0.9] mb-3">BBC<br />Wallet</h1>
            <p className="text-muted-foreground text-sm max-w-xs">Educational blockchain wallet with custom ERC-20 token.</p>
          </div>
          <ConnectWalletButton className="h-12 w-fit px-8 text-sm rounded-xl" />
        </div>

        {/* Supply */}
        <div className="rounded-3xl bg-card border border-white/10 p-6 flex flex-col justify-center items-center text-center">
          <div className="text-3xl font-bold font-mono text-amber-400">1M</div>
          <div className="text-xs text-muted-foreground mt-1">Total Supply</div>
        </div>
        {/* Currencies */}
        <div className="rounded-3xl bg-card border border-white/10 p-6 flex flex-col justify-center items-center text-center">
          <div className="text-3xl font-bold font-mono text-blue-400">6</div>
          <div className="text-xs text-muted-foreground mt-1">Currencies</div>
        </div>

        {/* Feature tiles */}
        <div className="col-span-2 rounded-3xl bg-gradient-to-r from-blue-500/10 to-card border border-white/10 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0"><Shield className="h-5 w-5 text-blue-400" /></div>
          <div><h3 className="font-bold text-sm">MetaMask Integration</h3><p className="text-xs text-muted-foreground">Auto network detection</p></div>
        </div>

        {/* Market */}
        <div className="rounded-3xl bg-gradient-to-br from-green-500/10 to-card border border-white/10 p-6 flex flex-col justify-center">
          <TrendingUp className="h-6 w-6 text-green-400 mb-2" />
          <h3 className="font-bold text-sm">Live Market</h3>
          <p className="text-xs text-muted-foreground">CoinGecko API</p>
        </div>
        {/* Send */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-500/10 to-card border border-white/10 p-6 flex flex-col justify-center">
          <Send className="h-6 w-6 text-purple-400 mb-2" />
          <h3 className="font-bold text-sm">Send BBC</h3>
          <p className="text-xs text-muted-foreground">Gas estimation</p>
        </div>

        {/* About link */}
        <div className="col-span-2 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 flex items-center justify-between group cursor-pointer hover:bg-amber-500/10 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center"><Star className="h-5 w-5 text-amber-400" /></div>
            <div><h3 className="font-bold text-sm">Meet the Team</h3><p className="text-xs text-muted-foreground">3 builders behind BBC</p></div>
          </div>
          <Link href="/about"><ArrowRight className="h-5 w-5 text-amber-400 group-hover:translate-x-1 transition-transform" /></Link>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 9. ART DECO
// ========================================
function ArtDecoLanding() {
  return (
    <div className="-mx-4 -mt-6" style={{ background: "#0c0c0c" }}>
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Geometric decorations */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <div className="w-[600px] h-[600px] border border-amber-500 rotate-45" />
          <div className="absolute w-[420px] h-[420px] border border-amber-500 rotate-45" />
          <div className="absolute w-[240px] h-[240px] border border-amber-500 rotate-45" />
        </div>

        {/* Top ornament line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

        <div className="relative z-10 text-center max-w-3xl">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-amber-500/50" />
            <Diamond className="h-4 w-4 text-amber-500" />
            <div className="h-px w-16 bg-amber-500/50" />
          </div>

          <div className="text-sm tracking-[0.5em] uppercase text-amber-500/60 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Established MMXXVI
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span className="font-light text-white/90">Big Black</span>
            <br />
            <span className="font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600 bg-clip-text text-transparent">Coin</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-24 bg-amber-500/30" />
            <Crown className="h-5 w-5 text-amber-500/60" />
            <div className="h-px w-24 bg-amber-500/30" />
          </div>

          <p className="text-white/40 text-lg mb-12 max-w-md mx-auto" style={{ fontFamily: "Georgia, serif" }}>
            An exquisite educational experience in decentralized finance and blockchain artistry.
          </p>

          <ConnectWalletButton className="h-14 px-12 text-base rounded-none border-2 border-amber-500 bg-transparent text-amber-500 hover:bg-amber-500 hover:text-black font-semibold tracking-widest uppercase transition-all duration-500" />

          <div className="grid grid-cols-3 gap-8 mt-20 max-w-md mx-auto">
            {[{ n: "1M", l: "Supply" }, { n: "6", l: "Currencies" }, { n: "3", l: "Artisans" }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-light text-amber-400" style={{ fontFamily: "Georgia, serif" }}>{s.n}</div>
                <div className="text-xs text-white/30 tracking-widest uppercase mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      </section>
    </div>
  );
}

// ========================================
// 10. RETRO Y2K
// ========================================
function RetroLanding() {
  return (
    <div className="-mx-4 -mt-6" style={{ background: "linear-gradient(180deg, #1a0533 0%, #0d001a 100%)" }}>
      <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Chrome starburst */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-px h-[600px] bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-3xl">
          <div className="text-sm font-mono mb-4" style={{ color: "#ff00ff", textShadow: "0 0 10px rgba(255,0,255,0.5)" }}>
            *** WELCOME TO THE FUTURE ***
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase mb-4">
            <span style={{
              background: "linear-gradient(180deg, #fff 0%, #c0c0c0 30%, #fff 50%, #808080 70%, #fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
            }}>
              BBC
            </span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-8" style={{
            background: "linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            WALLET
          </h2>

          <p className="text-white/50 mb-10 text-lg font-mono">
            {'{ '} blockchain {'*'} education {'*'} tokens {' }'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConnectWalletButton className="h-14 px-10 text-base rounded-full font-black uppercase tracking-wider bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-black border-0" />
            <Link href="/about" className="h-14 px-10 rounded-full border-2 border-fuchsia-500 text-fuchsia-400 font-bold flex items-center justify-center gap-2 hover:bg-fuchsia-500/10 transition-all uppercase tracking-wider">
              About <Gamepad2 className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex justify-center gap-8 mt-16">
            {[{ n: "1M", l: "SUPPLY", c: "#ff00ff" }, { n: "6", l: "COINS", c: "#00ffff" }, { n: "3", l: "CREW", c: "#ffff00" }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black font-mono" style={{ color: s.c, textShadow: `0 0 15px ${s.c}40` }}>{s.n}</div>
                <div className="text-xs text-white/30 font-mono mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ========================================
// THEME ROUTER
// ========================================
const themeComponents: Record<ThemeId, React.FC> = {
  glassmorphism: GlassLanding,
  brutalist: BrutalistLanding,
  minimalist: MinimalistLanding,
  maximalist: MaximalistLanding,
  neubrutalism: NeubrutalLanding,
  neumorphism: NeumorphLanding,
  cyberpunk: CyberpunkLanding,
  bento: BentoLanding,
  artdeco: ArtDecoLanding,
  retro: RetroLanding,
};

// ========================================
// DASHBOARD (connected wallet)
// ========================================
function Dashboard() {
  const { bbcBalance, ethBalance, transactions } = useWalletStore();
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio</p>
      </div>
      <WalletCard />
      <QuickActions />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Link href="/transactions" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">View all <ArrowRight className="h-3 w-3" /></Link>
          </CardHeader>
          <CardContent className="p-0"><TransactionList limit={5} /></CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-amber-400" />Statistics</CardTitle></CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">BBC Balance</span><span className="font-medium font-mono text-amber-400">{fromWei(bbcBalance).toFixed(4)} BBC</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">ETH Balance</span><span className="font-medium font-mono text-blue-400">{fromWei(ethBalance).toFixed(4)} ETH</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Transactions</span><span className="font-medium font-mono">{transactions.length}</span></div>
            <div className="pt-3 border-t border-white/[0.06]">
              <Link href="/transactions" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1 transition-colors">View all activity <ArrowRight className="h-3 w-3" /></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========================================
// MAIN PAGE EXPORT
// ========================================
export default function DashboardPage() {
  const { isConnected } = useWalletStore();
  const [theme, setTheme] = useState<ThemeId>("glassmorphism");

  // Persist theme choice
  useEffect(() => {
    const saved = localStorage.getItem("bbc-theme") as ThemeId | null;
    if (saved) setTheme(saved);
  }, []);

  const handleThemeChange = (t: ThemeId) => {
    setTheme(t);
    localStorage.setItem("bbc-theme", t);
  };

  if (isConnected) return <Dashboard />;

  const LandingComponent = themeComponents[theme];

  return (
    <>
      <LandingComponent />
      <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
    </>
  );
}
