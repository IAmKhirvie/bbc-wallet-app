"use client";

import { themes, type ThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Paintbrush, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ThemeSwitcherProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentIndex = themes.findIndex((t) => t.id === currentTheme);

  const prev = () => {
    const i = (currentIndex - 1 + themes.length) % themes.length;
    onThemeChange(themes[i].id);
  };

  const next = () => {
    const i = (currentIndex + 1) % themes.length;
    onThemeChange(themes[i].id);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-24 md:bottom-6 right-4 z-[100] w-12 h-12 rounded-full",
          "bg-gradient-to-br from-amber-500 to-yellow-500 text-black",
          "flex items-center justify-center shadow-xl shadow-amber-500/30",
          "hover:scale-110 transition-transform duration-200",
          isOpen && "rotate-90"
        )}
        title="Switch design theme"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Paintbrush className="h-5 w-5" />}
      </button>

      {/* Quick prev/next arrows */}
      {!isOpen && (
        <div className="fixed bottom-24 md:bottom-6 right-[4.5rem] z-[100] flex items-center gap-1">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full bg-card/90 backdrop-blur border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-amber-500/30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur border border-white/10 text-xs font-medium text-amber-400 min-w-[100px] text-center">
            {themes[currentIndex].name}
          </div>
          <button
            onClick={next}
            className="w-8 h-8 rounded-full bg-card/90 backdrop-blur border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-amber-500/30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Full panel */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 md:bottom-20 md:right-4 md:left-auto md:w-80 z-[99] bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="font-bold text-sm">Design Themes</h3>
            <p className="text-xs text-muted-foreground">Tap to preview each style</p>
          </div>
          <div className="p-2 max-h-[60vh] overflow-y-auto space-y-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                }}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-3",
                  currentTheme === theme.id
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "hover:bg-white/5 border border-transparent"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                    currentTheme === theme.id
                      ? "bg-amber-500 text-black"
                      : "bg-white/10 text-muted-foreground"
                  )}
                >
                  {theme.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{theme.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground">
                      {theme.preview}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{theme.description}</span>
                </div>
                {currentTheme === theme.id && (
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
