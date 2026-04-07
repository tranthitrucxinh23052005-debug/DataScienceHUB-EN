"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react"

interface StatusIndicatorProps {
  status: "success" | "warning" | "error" | "processing" | "idle"
  message: string
}

const statusConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-accent/10",
    textColor: "text-accent",
    borderColor: "border-accent/30"
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-chart-3/10",
    textColor: "text-chart-3",
    borderColor: "border-chart-3/30"
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    borderColor: "border-destructive/30"
  },
  processing: {
    icon: Loader2,
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    borderColor: "border-primary/30"
  },
  idle: {
    icon: Clock,
    bgColor: "bg-muted",
    textColor: "text-muted-foreground",
    borderColor: "border-border"
  }
}

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium",
        config.bgColor,
        config.textColor,
        config.borderColor
      )}
    >
      <Icon 
        className={cn(
          "h-4 w-4",
          status === "processing" && "animate-spin"
        )} 
      />
      <span>{message}</span>
    </div>
  )
}
