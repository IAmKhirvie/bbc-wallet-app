"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/lib/store";
import { Receive, Copy, Check, QrCode } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export default function ReceivePage() {
  const { address, isConnected } = useWalletStore();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) {
    return (
      <div className="text-center py-12">
        <Receive className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
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

  const shortAddress = `${address.slice(0, 10)}...${address.slice(-8)}`;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/wallet">
          <Button variant="ghost" size="icon">
            ←
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Receive BBC</h1>
          <p className="text-muted-foreground">Your wallet address</p>
        </div>
      </div>

      {/* QR Code Card */}
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="bg-white rounded-lg p-6 inline-block">
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
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="font-mono text-sm break-all">{address}</p>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyAddress}
            className="w-full"
            variant={copied ? "default" : "outline"}
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

      {/* Info Card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <QrCode className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Only send BBC tokens to this address.</p>
              <p>Sending other tokens may result in permanent loss.</p>
              <p>This address works on the Hardhat Local network.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-sm text-yellow-600 dark:text-yellow-500">
          <strong>Important:</strong> This is a local test network. Any tokens sent here will only exist on your local Hardhat node and cannot be transferred to mainnet.
        </p>
      </div>
    </div>
  );
}
