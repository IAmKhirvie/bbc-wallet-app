"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletStore, fromWei } from "@/lib/store";
import { Send, AlertCircle, CheckCircle2, XCircle, ArrowLeft, Fuel, Loader2 } from "lucide-react";
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

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(recipient);
  const showAddressValidation = recipient.length > 0;

  useEffect(() => {
    if (bbcBalance > 0n) {
      setMaxAmount(fromWei(bbcBalance).toString());
    }
  }, [bbcBalance]);

  useEffect(() => {
    if (estimatedGas > 0n && gasPrice > 0n) {
      const gasCost = fromWei(estimatedGas * gasPrice, 18);
      setGasEstimate(gasCost.toString());
    }
  }, [estimatedGas, gasPrice]);

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-amber-400" />
        </div>
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

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }

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
          <p className="text-xs mt-1 font-mono">Hash: {txHash.slice(0, 10)}...</p>
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
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/wallet">
          <Button variant="ghost" size="icon" className="hover:bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Send BBC</h1>
          <p className="text-muted-foreground text-sm">Transfer BBC to another address</p>
        </div>
      </div>

      {/* Available Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/20">
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
        <CardContent className="relative p-4 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Available Balance</span>
          <span className="font-semibold font-mono text-amber-400">{maxAmount} BBC</span>
        </CardContent>
      </Card>

      {/* Send Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipient Address */}
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm">Recipient Address</Label>
            <div className="relative">
              <Input
                id="recipient"
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono pr-10"
              />
              {showAddressValidation && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isValidAddress ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the Ethereum address you want to send BBC to
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-sm">Amount</Label>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
              >
                MAX
              </button>
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
                className="font-mono pr-14"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                BBC
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Available: <span className="font-mono">{maxAmount}</span> BBC
            </p>
          </div>

          {/* Gas Estimate */}
          {gasEstimate !== "0" && (
            <div className="bg-white/5 rounded-lg p-4 space-y-3 border border-white/[0.06]">
              <div className="flex items-center gap-2 text-sm">
                <Fuel className="h-4 w-4 text-amber-400" />
                <span className="font-medium">Estimated Gas Fee</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gas Cost</span>
                <span className="font-mono">{gasEstimate} ETH</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time</span>
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
              className="flex-1 border-white/[0.08] hover:border-amber-500/30"
            >
              <Fuel className="h-4 w-4 mr-2" />
              Estimate Gas
            </Button>
            <Button
              onClick={handleSend}
              disabled={!recipient || !amount || isSending}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/20"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
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

      {/* Info Banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Make sure you have enough ETH to pay for gas fees.</p>
            <p>Transactions on the blockchain are irreversible once confirmed.</p>
            <p>Always verify the recipient address before sending.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
