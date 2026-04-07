"use client"

import { useData } from "@/lib/data-context"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"
import { Tab1Source } from "./tabs/tab1-source"
import { Tab2Statistics } from "./tabs/tab2-statistics"
import { Tab3AI } from "./tabs/tab3-ai"
import { Tab4Correlation } from "./tabs/tab4-correlation"
import { Tab5BI } from "./tabs/tab5-bi"
import { Tab6ML } from "./tabs/tab6-ml"

export function DashboardContent() {
  // Móc toàn bộ trạng thái cần thiết từ "Bộ não" DataContext
  const { 
    activeTab, 
    sidebarOpen, 
    setSidebarOpen, 
    loadingStatus, 
    isLoading, 
    statusType 
  } = useData();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar bây giờ lấy trạng thái từ Context */}
      <Sidebar
        collapsed={!sidebarOpen}
        setCollapsed={() => setSidebarOpen(!sidebarOpen)} 
        />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Thanh điều hướng trên cùng */}
        <TopNav
          loadingStatus={loadingStatus}
          isLoading={isLoading}
          statusType={statusType as 'success' | 'warning' | 'error'}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Logic hiển thị Tab cực kỳ đơn giản. 
             Mọi dữ liệu (fullData, kpiData...) đã được các file Tab 
             tự động móc từ useData() bên trong chúng rồi.
          */}
          {activeTab === 1 && <Tab1Source />}
          {activeTab === 2 && <Tab2Statistics />}
          {activeTab === 3 && <Tab3AI />}
          {activeTab === 4 && <Tab4Correlation />}
          {activeTab === 5 && <Tab5BI />}
          {activeTab === 6 && <Tab6ML />}
          
          <footer className="mt-8 py-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Data Science Faculty &copy; 2026 — HUB Test Analysis System - Truc Xinh
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}