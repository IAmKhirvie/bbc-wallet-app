import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syncopate } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { WalletProvider } from "@/components/WalletProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
});

export const metadata: Metadata = {
  title: "BBC Wallet | BigBlackCoin",
  description: "Educational blockchain wallet application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${syncopate.variable} ${inter.className}`}
      >
        <WalletProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-6 max-w-6xl pb-24 md:pb-6">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
          <Toaster />
        </WalletProvider>
      </body>
    </html>
  );
}
