"use client"

import { DataProvider } from "@/lib/data-context"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function Home() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  )
}
