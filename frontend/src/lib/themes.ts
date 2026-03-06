// ============================================================
// THEME SYSTEM — All 10 design styles
// Toggle between them with the ThemeSwitcher component
// ============================================================

export type ThemeId =
  | "glassmorphism"
  | "brutalist"
  | "minimalist"
  | "maximalist"
  | "neubrutalism"
  | "neumorphism"
  | "cyberpunk"
  | "bento"
  | "artdeco"
  | "retro";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  preview: string; // Short preview tag
}

export const themes: Theme[] = [
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass, blur, soft gradients",
    preview: "Current",
  },
  {
    id: "neubrutalism",
    name: "Neubrutalism",
    description: "Thick borders, offset shadows, bold colors",
    preview: "Trending",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon glow, dark terminal, scan lines",
    preview: "Crypto Native",
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Raw, harsh, monospace, anti-design",
    preview: "Raw",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, spacious, restrained palette",
    preview: "Clean",
  },
  {
    id: "maximalist",
    name: "Maximalist",
    description: "Loud, layered, busy, colorful",
    preview: "Bold",
  },
  {
    id: "neumorphism",
    name: "Neumorphism",
    description: "Soft embossed shadows, tactile feel",
    preview: "Soft",
  },
  {
    id: "bento",
    name: "Bento Grid",
    description: "Modular cards, varying sizes, clean",
    preview: "Modern",
  },
  {
    id: "artdeco",
    name: "Art Deco",
    description: "Gold & black, geometric, luxury serif",
    preview: "Premium",
  },
  {
    id: "retro",
    name: "Retro Y2K",
    description: "Pixel vibes, chrome gradients, nostalgic",
    preview: "Nostalgic",
  },
];
