"use client";

import { Send, Download, History } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  className?: string;
}

const actions = [
  {
    label: "Send",
    href: "/wallet/send",
    icon: Send,
  },
  {
    label: "Receive",
    href: "/wallet/receive",
    icon: Download,
  },
  {
    label: "History",
    href: "/transactions",
    icon: History,
  },
];

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={cn("flex gap-6 justify-center py-4", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.label} href={action.href} className="group flex flex-col items-center gap-2">
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-amber-500/20 to-amber-500/5",
                "border border-amber-500/20",
                "transition-all duration-200",
                "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/20"
              )}
            >
              <Icon className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-amber-400 transition-colors">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
