"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface TopNavProps {
  loadingStatus: string
  isLoading: boolean
  statusType: 'success' | 'warning' | 'error'
}

export function TopNav({ loadingStatus, isLoading, statusType }: TopNavProps) {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Data Science Faculty Portal
          </h2>
          <p className="text-xs text-muted-foreground">
            Test Analysis & Decision Support System
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className={cn(
          "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border",
          statusType === 'success' && "bg-emerald-50 border-emerald-200",
          statusType === 'warning' && "bg-amber-50 border-amber-200",
          statusType === 'error' && "bg-rose-50 border-rose-200"
        )}>
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
          ) : (
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              statusType === 'success' && "bg-emerald-500",
              statusType === 'warning' && "bg-amber-500",
              statusType === 'error' && "bg-rose-500"
            )} />
          )}
          <span className={cn(
            "text-[10px] font-mono font-bold",
            statusType === 'success' && "text-emerald-700",
            statusType === 'warning' && "text-amber-700",
            statusType === 'error' && "text-rose-700"
          )}>
            {loadingStatus}
          </span>
        </div>
      </div>
    </header>
  )
}
