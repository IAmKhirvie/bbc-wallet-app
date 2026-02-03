"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletStore, fromWei } from "@/lib/store";
import { Send, AlertCircle, CheckCircle2, GasPump } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export default function SendPage() {
  const router = useRouter();
  const { bbcBalance, sendBBC, address, isConnected, estimateGas, gasPrice, estimatedGas } = useWalletStore();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<string>("0");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    if (bbcBalance > 0n) {
      setMaxAmount(fromWei(bbcBalance));
    }
  }, [bbcBalance]);

  useEffect(() => {
    // Update gas estimate when it changes in store
    if (estimatedGas > 0n && gasPrice > 0n) {
      const gasCost = fromWei(estimatedGas * gasPrice, 18);
      setGasEstimate(gasCost);
    }
  }, [estimatedGas, gasPrice]);

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Send className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
        <p className="text-muted-foreground">Please connect your wallet to send tokens.</p>
      </div>
    );
  }

  const handleMaxClick = () => {
    setAmount(maxAmount);
  };

  const handleEstimateGas = async () => {
    if (!recipient || !amount) return;

    try {
      await estimateGas(recipient, amount);
      toast.success("Gas estimated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to estimate gas");
    }
  };

  const handleSend = async () => {
    if (!recipient || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate address
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (amountNum <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    if (amountNum > parseFloat(maxAmount)) {
      toast.error("Insufficient BBC balance");
      return;
    }

    setIsSending(true);
    try {
      const txHash = await sendBBC(recipient, amount);
      toast.success(
        <div>
          <p>Transaction sent successfully!</p>
          <p className="text-xs mt-1">Hash: {txHash.slice(0, 10)}...</p>
        </div>
      );
      router.push("/transactions");
    } catch (error: any) {
      toast.error(error.message || "Failed to send transaction");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/wallet">
          <Button variant="ghost" size="icon">
            ←
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Send BBC</h1>
          <p className="text-muted-foreground">Transfer BBC to another address</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Available Balance:</span>
            <span className="font-semibold">{maxAmount} BBC</span>
          </div>
        </CardContent>
      </Card>

      {/* Send Form */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter the Ethereum address you want to send BBC to
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount">Amount</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="text-xs"
              >
                Max
              </Button>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0001"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                BBC
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Available: {maxAmount} BBC
            </p>
          </div>

          {/* Gas Estimate */}
          {gasEstimate !== "0" && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <GasPump className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Estimated Gas Fee</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gas Cost:</span>
                <span>{gasEstimate} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time:</span>
                <span>~30 seconds</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleEstimateGas}
              disabled={!recipient || !amount || isSending}
              className="flex-1"
            >
              <GasPump className="h-4 w-4 mr-2" />
              Estimate Gas
            </Button>
            <Button
              onClick={handleSend}
              disabled={!recipient || !amount || isSending}
              className="flex-1"
            >
              {isSending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send BBC
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Make sure you have enough ETH to pay for gas fees.</p>
              <p>Transactions on the blockchain are irreversible once confirmed.</p>
              <p>Always verify the recipient address before sending.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
