"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context" // Cắm ống hút dữ liệu từ Bộ não
import { 
  LayoutDashboard, 
  Database, 
  BarChart3, 
  Table2,
  LineChart, 
  Cpu,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

// Interface bây giờ chỉ cần 2 thứ để điều khiển đóng/mở
interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ 
  collapsed, 
  setCollapsed
}: SidebarProps) {
  
  // Móc toàn bộ trạng thái logic từ DataContext ra
  const { 
    activeTab, 
    setActiveTab, 
    stepDataChecked, 
    stepProcessed, 
    fullData 
  } = useData();

  // Kiểm tra xem đã có điểm HUB chưa (để bật/tắt Tab 2)
  const hasHUBScore = fullData.length > 0 && 'TBM_He10' in fullData[0];

  const navItems = [
    { id: 1, label: "Data Sources & Audit", icon: Database, disabled: false },
    { id: 2, label: "Statistical Overview", icon: BarChart3, disabled: !stepDataChecked || !hasHUBScore },
    { id: 3, label: "AI Insights & Analytics", icon: Cpu, disabled: !stepDataChecked },
    { id: 4, label: "Multivariate Analysis", icon: Table2, disabled: !stepProcessed },
    { id: 5, label: "Custom BI Dashboard", icon: LineChart, disabled: !stepProcessed },
    { id: 6, label: "Predictive Analytics", icon: LayoutDashboard, disabled: !stepProcessed },
  ]

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0 h-screen z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* --- CỤM HEADER SIDEBAR: LOGO KHOA + DATA SCIENCE HUB PORTAL --- */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-muted/30">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Logo Khoa */}
            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/logokhoa.png" 
                alt="Logo Khoa" 
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            {/* Tên Portal */}
            <h1 className="text-base font-bold tracking-tight text-primary whitespace-nowrap truncate">
              Data Science HUB Portal
            </h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* --- MENU ĐIỀU HƯỚNG --- */}
      <nav className="mt-4 flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            disabled={item.disabled}
            onClick={() => !item.disabled && setActiveTab(item.id)}
            className={cn(
              "w-full justify-start gap-3 h-10",
              collapsed && "justify-center px-0",
              activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/15",
              item.disabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="truncate text-sm">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* --- CỤM FOOTER SIDEBAR: LOGO TRƯỜNG + DATA SCIENCE FACULTY --- */}
      <div className="border-t border-border p-4 flex items-center justify-center bg-muted/30 h-16 transition-all duration-300">
        {collapsed ? (
          /* KHI THU NHỎ SIDEBAR: Chỉ hiện cái logo HUB */
          <div className="w-8 h-8 flex-shrink-0">
            <img 
              src="/logo-hub.jpg" 
              alt="HUB Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          /* KHI MỞ RỘNG SIDEBAR: Hiện Logo HUB + Chữ */
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex-shrink-0">
              <img 
                src="/logo-hub.jpg" 
                alt="HUB Logo" 
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
              Data Science Faculty
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}