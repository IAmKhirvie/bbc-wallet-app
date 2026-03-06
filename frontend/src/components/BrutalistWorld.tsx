"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { ArrowRight } from "lucide-react";

// ============================================================
// BBC WALLET — BRUTALIST 3D HYPERSCROLL
// Adapted from Aleksa Rakocevic's "Hyper Scroll // Brutal Mode"
// ============================================================

const CONFIG = {
  itemCount: 20,
  starCount: 150,
  zGap: 800,
  loopSize: 0,
  camSpeed: 2.5,
};
CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

const BBC_TEXTS = [
  "BBC",
  "WALLET",
  "BRUTAL",
  "CHAIN",
  "TOKEN",
  "BLOCK",
  "CRYPTO",
  "HYPER",
  "WEB3",
  "DEFI",
];

const CARD_DATA = [
  { id: "TOK", title: "ERC-20\nTOKEN", meta: "SUPPLY: 1,000,000", size: "0.8.20" },
  { id: "WAL", title: "MULTI\nWALLET", meta: "CURRENCIES: 6", size: "ETH+BBC" },
  { id: "MKT", title: "LIVE\nMARKET", meta: "SOURCE: COINGECKO", size: "REAL-TIME" },
  { id: "TXN", title: "SEND\nTOKENS", meta: "GAS: ESTIMATED", size: "INSTANT" },
  { id: "SEC", title: "LOCAL\nTESTNET", meta: "CHAIN: 31337", size: "HARDHAT" },
  { id: "QR", title: "QR\nSHARE", meta: "ADDR: RECEIVE", size: "SCAN" },
  { id: "ORC", title: "PRICE\nORACLE", meta: "MOCK: ORACLE", size: "CONVERT" },
  { id: "AIR", title: "AIR\nDROP", meta: "MAX: 200 RCPT", size: "BATCH" },
  { id: "BRN", title: "BURN\nMINT", meta: "OWNER: ONLY", size: "SUPPLY" },
  { id: "EDU", title: "LEARN\nBUILD", meta: "TYPE: EDUCATIONAL", size: "OPEN" },
  { id: "GAS", title: "GAS\nFEES", meta: "EST: PRE-TX", size: "WEI" },
  { id: "KEY", title: "SIGN\nVERIFY", meta: "METAMASK", size: "CRYPTO" },
  { id: "NET", title: "PEER\nNODES", meta: "LOCAL: RPC", size: "8545" },
  { id: "SOL", title: "SOLID\nITY", meta: "OPENZEPPELIN", size: "AUDIT" },
  { id: "ZUS", title: "STATE\nSTORE", meta: "ZUSTAND", size: "REACT" },
];

interface ItemData {
  type: "card" | "text" | "star";
  x: number;
  y: number;
  rot: number;
  baseZ: number;
  cardIndex?: number;
  textIndex?: number;
}

export function BrutalistWorld() {
  const worldRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ scroll: 0, velocity: 0, targetSpeed: 0, mouseX: 0, mouseY: 0 });
  const itemsRef = useRef<{ el: HTMLDivElement; data: ItemData }[]>([]);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  const rafIdRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Build items data
  const buildItems = useCallback((): ItemData[] => {
    const result: ItemData[] = [];
    for (let i = 0; i < CONFIG.itemCount; i++) {
      const isHeading = i % 4 === 0;
      if (isHeading) {
        result.push({ type: "text", x: 0, y: 0, rot: 0, baseZ: -i * CONFIG.zGap, textIndex: i % BBC_TEXTS.length });
      } else {
        const angle = (i / CONFIG.itemCount) * Math.PI * 6;
        const x = Math.cos(angle) * (typeof window !== "undefined" ? window.innerWidth * 0.3 : 400);
        const y = Math.sin(angle) * (typeof window !== "undefined" ? window.innerHeight * 0.3 : 300);
        const rot = (Math.random() - 0.5) * 30;
        result.push({ type: "card", x, y, rot, baseZ: -i * CONFIG.zGap, cardIndex: i % CARD_DATA.length });
      }
    }
    // Stars
    for (let i = 0; i < CONFIG.starCount; i++) {
      result.push({
        type: "star",
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        rot: 0,
        baseZ: -Math.random() * CONFIG.loopSize,
      });
    }
    return result;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Main effect — Lenis + RAF
  useEffect(() => {
    if (!mounted || !worldRef.current || !viewportRef.current) return;

    let lenis: any;
    let cancelled = false;
    let onMouseMove: ((e: MouseEvent) => void) | null = null;

    (async () => {
      const mod = await import("@studio-freight/lenis");
      const Lenis = mod.default || mod;
      if (cancelled) return;

      const s = stateRef.current;

      lenis = new Lenis({
        lerp: 0.08,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        touchMultiplier: 2,
      });

      lenis.on("scroll", ({ scroll, velocity }: { scroll: number; velocity: number }) => {
        s.scroll = scroll;
        s.targetSpeed = velocity;
      });

      onMouseMove = (e: MouseEvent) => {
        s.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        s.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      let lastTime = 0;
      const allItems = itemsRef.current;
      const world = worldRef.current!;
      const viewport = viewportRef.current!;

      function raf(time: number) {
        if (cancelled) return;
        lenis.raf(time);

        const delta = time - lastTime;
        lastTime = time;
        if (fpsRef.current && time % 10 < 1) {
          fpsRef.current.innerText = String(Math.round(1000 / delta));
        }

        s.velocity += (s.targetSpeed - s.velocity) * 0.1;

        if (velRef.current) velRef.current.innerText = Math.abs(s.velocity).toFixed(2);
        if (coordRef.current) coordRef.current.innerText = s.scroll.toFixed(0);

        // Camera tilt
        const tiltX = s.mouseY * 5 - s.velocity * 0.5;
        const tiltY = s.mouseX * 5;
        world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Dynamic perspective (warp)
        const fov = 1000 - Math.min(Math.abs(s.velocity) * 10, 600);
        viewport.style.perspective = `${fov}px`;

        // Items loop
        const cameraZ = s.scroll * CONFIG.camSpeed;

        allItems.forEach(({ el, data }) => {
          let relZ = data.baseZ + cameraZ;
          const modC = CONFIG.loopSize;
          let vizZ = ((relZ % modC) + modC) % modC;
          if (vizZ > 500) vizZ -= modC;

          let alpha = 1;
          if (vizZ < -3000) alpha = 0;
          else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
          if (vizZ > 100 && data.type !== "star") alpha = 1 - (vizZ - 100) / 400;
          if (alpha < 0) alpha = 0;

          el.style.opacity = String(alpha);

          if (alpha > 0) {
            let trans = `translate3d(${data.x}px, ${data.y}px, ${vizZ}px)`;

            if (data.type === "star") {
              const stretch = Math.max(1, Math.min(1 + Math.abs(s.velocity) * 0.1, 10));
              trans += ` scale3d(1, 1, ${stretch})`;
            } else if (data.type === "text") {
              trans += ` rotateZ(${data.rot}deg)`;
              if (Math.abs(s.velocity) > 1) {
                const offset = s.velocity * 2;
                el.style.textShadow = `${offset}px 0 #ff003c, ${-offset}px 0 #00f3ff`;
              } else {
                el.style.textShadow = "none";
              }
            } else {
              const t = time * 0.001;
              const float = Math.sin(t + data.x) * 10;
              trans += ` rotateZ(${data.rot}deg) rotateY(${float}deg)`;
            }

            el.style.transform = trans;
          }
        });

        rafIdRef.current = requestAnimationFrame(raf);
      }

      rafIdRef.current = requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafIdRef.current);
      if (lenis) lenis.destroy();
      if (onMouseMove) window.removeEventListener("mousemove", onMouseMove);
    };
  }, [mounted]);

  // Build scene items
  const itemsData = useRef<ItemData[]>([]);
  if (itemsData.current.length === 0 && mounted) {
    itemsData.current = buildItems();
  }

  // Register DOM refs
  const setItemRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    if (el && itemsData.current[idx]) {
      itemsRef.current[idx] = { el, data: itemsData.current[idx] };
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[10]" style={{
        background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))",
        backgroundSize: "100% 4px",
      }} />
      <div className="fixed inset-0 pointer-events-none z-[11]" style={{
        background: "radial-gradient(circle, transparent 40%, #000 120%)",
      }} />
      <div className="fixed inset-0 pointer-events-none z-[12] opacity-[0.07]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />

      {/* HUD */}
      <div className="fixed inset-8 z-[20] pointer-events-none flex flex-col justify-between" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
        <div className="flex justify-between items-center">
          <span>SYS.READY</span>
          <div className="flex-1 h-px bg-white/20 mx-4 relative">
            <div className="absolute right-0 -top-[2px] w-[5px] h-[5px] bg-[#ff003c]" />
          </div>
          <span>FPS: <strong ref={fpsRef} className="text-[#00f3ff]">60</strong></span>
        </div>

        {/* Center nav — vertical text */}
        <div className="self-start my-auto" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          SCROLL VELOCITY // <strong ref={velRef} className="text-[#00f3ff]">0.00</strong>
        </div>

        <div className="flex justify-between items-center">
          <span>COORD: <strong ref={coordRef} className="text-[#00f3ff]">000</strong></span>
          <div className="flex-1 h-px bg-white/20 mx-4 relative">
            <div className="absolute right-0 -top-[2px] w-[5px] h-[5px] bg-[#ff003c]" />
          </div>
          <span>BBC WALLET V1.0 [BRUTAL]</span>
        </div>
      </div>

      {/* CTA overlay — always visible */}
      <div className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-[25] flex flex-col items-center gap-4 pointer-events-auto">
        <ConnectWalletButton className="h-14 px-10 text-base rounded-none border-2 border-[#ff003c] bg-[#ff003c]/10 text-[#ff003c] font-black uppercase tracking-[0.2em] hover:bg-[#ff003c] hover:text-black transition-all duration-300" />
        <div className="flex gap-3">
          <Link href="/about" className="px-6 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 text-white/50 hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all">
            About
          </Link>
          <Link href="/wallet" className="px-6 py-2 text-xs font-mono uppercase tracking-widest border border-white/20 text-white/50 hover:border-[#00f3ff] hover:text-[#00f3ff] transition-all">
            Wallet
          </Link>
        </div>
      </div>

      {/* 3D Viewport */}
      <div ref={viewportRef} className="fixed inset-0 overflow-hidden z-[1]" style={{ perspective: "1000px" }}>
        <div ref={worldRef} className="absolute top-1/2 left-1/2" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
          {itemsData.current.map((item, idx) => {
            if (item.type === "star") {
              return (
                <div
                  key={`star-${idx}`}
                  ref={(el) => setItemRef(el, idx)}
                  className="absolute w-[2px] h-[2px] bg-white"
                  style={{ left: 0, top: 0, backfaceVisibility: "hidden", transform: `translate3d(${item.x}px, ${item.y}px, ${item.baseZ}px)` }}
                />
              );
            }

            if (item.type === "text") {
              return (
                <div
                  key={`text-${idx}`}
                  ref={(el) => setItemRef(el, idx)}
                  className="absolute left-0 top-0"
                  style={{ backfaceVisibility: "hidden", transformOrigin: "center center" }}
                >
                  <div
                    className="whitespace-nowrap pointer-events-none select-none uppercase"
                    style={{
                      fontSize: "15vw",
                      fontWeight: 800,
                      fontFamily: "'Syncopate', 'JetBrains Mono', sans-serif",
                      color: "transparent",
                      WebkitTextStroke: "2px rgba(255,255,255,0.15)",
                      letterSpacing: "-0.5rem",
                      mixBlendMode: "overlay",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {BBC_TEXTS[item.textIndex ?? 0]}
                  </div>
                </div>
              );
            }

            // Card
            const cd = CARD_DATA[item.cardIndex ?? 0];
            const randId = Math.floor(Math.random() * 9999);

            return (
              <div
                key={`card-${idx}`}
                ref={(el) => setItemRef(el, idx)}
                className="absolute left-0 top-0"
                style={{ backfaceVisibility: "hidden", transformOrigin: "center center" }}
              >
                <div
                  className="relative flex flex-col justify-between p-8 backdrop-blur-lg transition-all duration-300 group"
                  style={{
                    width: "320px",
                    height: "460px",
                    background: "rgba(10,10,10,0.4)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.5)",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {/* Corner brackets */}
                  <div className="absolute -top-px -left-px w-[10px] h-[10px] border-t border-l border-white/80 group-hover:w-full group-hover:h-full group-hover:border-[#ff003c] transition-all duration-300" />
                  <div className="absolute -bottom-px -right-px w-[10px] h-[10px] border-b border-r border-white/80 group-hover:w-full group-hover:h-full group-hover:border-[#ff003c] transition-all duration-300" />

                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                    <span className="font-mono text-[#ff003c] text-xs">ID-{cd.id}-{randId}</span>
                    <div className="w-[10px] h-[10px] bg-[#ff003c]" />
                  </div>

                  {/* Title */}
                  <h2
                    className="text-[2.5rem] leading-[0.9] font-bold uppercase text-white m-0"
                    style={{ fontFamily: "'Syncopate', sans-serif", mixBlendMode: "hard-light" }}
                  >
                    {cd.title.split("\n").map((line, li) => (
                      <span key={li}>
                        {line}
                        {li === 0 && <br />}
                      </span>
                    ))}
                  </h2>

                  {/* Footer */}
                  <div className="mt-auto flex justify-between font-mono text-[0.7rem] text-white/40">
                    <span>{cd.meta}</span>
                    <span>DATA: {cd.size}</span>
                  </div>

                  {/* Big watermark number */}
                  <div className="absolute bottom-8 right-8 text-[4rem] font-black opacity-[0.06] select-none">
                    {String(item.cardIndex ?? 0).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll proxy — must be in-flow to create scroll height */}
      <div className="w-full z-[-1]" style={{ height: "10000vh" }} />
    </>
  );
}
