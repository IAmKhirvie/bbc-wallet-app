"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/store";
import { Download, Copy, Check, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export default function ReceivePage() {
  const { address, isConnected } = useWalletStore();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <Download className="h-8 w-8 text-amber-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
        <p className="text-muted-foreground">Please connect your wallet to receive tokens.</p>
      </div>
    );
  }

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/wallet">
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Receive BBC</h1>
          <p className="text-muted-foreground text-sm">Your wallet address</p>
        </div>
      </div>

      {/* QR Code Card */}
      <Card className="text-center border-amber-500/20">
        <CardContent className="p-8">
          <div className="bg-white rounded-xl p-6 inline-block shadow-lg">
            <QRCodeSVG
              value={address}
              size={200}
              level="M"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#FFFFFF"
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Scan this QR code to receive BBC tokens
          </p>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Wallet Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Address */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/[0.06]">
            <p className="font-mono text-sm break-all text-foreground/90">{address}</p>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyAddress}
            className={cn(
              "w-full",
              copied
                ? "bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30"
                : "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20"
            )}
            variant={copied ? "outline" : "default"}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Only send BBC tokens to this address.</p>
            <p>Sending other tokens may result in permanent loss.</p>
            <p>This address works on the Hardhat Local network.</p>
          </div>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <p className="text-sm text-amber-400/90">
          <strong>Important:</strong> This is a local test network. Any tokens sent here will only exist on your local Hardhat node and cannot be transferred to mainnet.
        </p>
      </div>
    </div>
  );
}
