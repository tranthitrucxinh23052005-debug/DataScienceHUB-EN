"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    direction: "up" | "down" | "neutral"
  }
  icon: LucideIcon
  iconColor?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = "text-primary"
}: MetricCardProps) {
  return (
    <Card className="border border-border bg-card hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-card-foreground tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-md bg-muted", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center gap-1.5">
            {trend.direction === "up" && (
              <TrendingUp className="h-3.5 w-3.5 text-accent" />
            )}
            {trend.direction === "down" && (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            {trend.direction === "neutral" && (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend.direction === "up" && "text-accent",
                trend.direction === "down" && "text-destructive",
                trend.direction === "neutral" && "text-muted-foreground"
              )}
            >
              {trend.direction === "up" && "+"}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
