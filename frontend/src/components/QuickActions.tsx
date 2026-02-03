"use client";

import { Button } from "@/components/ui/button";
import { Send, Download, ArrowRightLeft, History } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  className?: string;
}

const actions = [
  {
    label: "Send",
    href: "/wallet/send",
    icon: Send,
    description: "Transfer BBC to another address",
  },
  {
    label: "Receive",
    href: "/wallet/receive",
    icon: Download,
    description: "Get your wallet address",
  },
  {
    label: "Swap",
    href: "/wallet/swap",
    icon: ArrowRightLeft,
    description: "Swap currencies",
    disabled: true,
  },
  {
    label: "History",
    href: "/transactions",
    icon: History,
    description: "View transaction history",
  },
];

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <Icon className="h-6 w-6 mb-2 mx-auto" />
              <span className="font-medium">{action.label}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {action.description}
              </span>
            </>
          );

          return (
            <div key={action.label}>
              {action.disabled ? (
                <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-muted-foreground/25 text-muted-foreground cursor-not-allowed opacity-50">
                  {content}
                </div>
              ) : (
                <Link href={action.href}>
                  <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer h-full">
                    {content}
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
