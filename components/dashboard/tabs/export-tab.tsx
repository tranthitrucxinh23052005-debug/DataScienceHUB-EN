"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileDown,
  FileText,
  FileSpreadsheet,
  Image,
  File,
  CheckCircle2,
  Clock,
  Calendar,
  Download
} from "lucide-react"

const exportHistory = [
  { id: 1, name: "Báo cáo tổng hợp Q1-2026", type: "PDF", date: "05/04/2026", size: "2.4 MB", status: "completed" },
  { id: 2, name: "Dữ liệu dự đoán tháng 3", type: "Excel", date: "01/04/2026", size: "1.8 MB", status: "completed" },
  { id: 3, name: "Biểu đồ phân tích mô hình", type: "PNG", date: "28/03/2026", size: "456 KB", status: "completed" },
  { id: 4, name: "Báo cáo chi tiết hiệu suất", type: "PDF", date: "25/03/2026", size: "3.1 MB", status: "completed" },
]

export function ExportTab() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)

  const exportFormats = [
    { 
      id: "pdf", 
      name: "PDF Report", 
      description: "Báo cáo đầy đủ với biểu đồ và bảng dữ liệu",
      icon: FileText,
      color: "text-chart-4"
    },
    { 
      id: "excel", 
      name: "Excel Spreadsheet", 
      description: "Dữ liệu thô và kết quả phân tích",
      icon: FileSpreadsheet,
      color: "text-accent"
    },
    { 
      id: "csv", 
      name: "CSV Data", 
      description: "Chỉ dữ liệu, định dạng đơn giản",
      icon: File,
      color: "text-primary"
    },
    { 
      id: "png", 
      name: "Charts (PNG)", 
      description: "Xuất biểu đồ dạng hình ảnh",
      icon: Image,
      color: "text-chart-3"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Xuất báo cáo
          </CardTitle>
          <CardDescription>
            Chọn định dạng xuất file phù hợp với nhu cầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {exportFormats.map((format) => {
              const Icon = format.icon
              return (
                <div
                  key={format.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFormat === format.id 
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <Icon className={`h-8 w-8 ${format.color} mb-3`} />
                  <h3 className="font-semibold text-foreground mb-1">{format.name}</h3>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </div>
              )
            })}
          </div>

          {selectedFormat && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-foreground mb-3">Tùy chọn xuất file</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-border" defaultChecked />
                  <span className="text-sm text-foreground">Bao gồm trang tổng quan (Overview)</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-border" defaultChecked />
                  <span className="text-sm text-foreground">Bao gồm biểu đồ phân tích</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-border" defaultChecked />
                  <span className="text-sm text-foreground">Bao gồm bảng dữ liệu chi tiết</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-sm text-foreground">Bao gồm thông tin mô hình</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button disabled={!selectedFormat}>
              <Download className="h-4 w-4 mr-2" />
              Tải xuống
            </Button>
            <Button variant="outline" disabled={!selectedFormat}>
              Xem trước
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Export */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Báo cáo nhanh</h3>
                <p className="text-xs text-muted-foreground">PDF tóm tắt 1 trang</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Dữ liệu gốc</h3>
                <p className="text-xs text-muted-foreground">Excel đầy đủ dữ liệu</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Image className="h-6 w-6 text-chart-3" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Tất cả biểu đồ</h3>
                <p className="text-xs text-muted-foreground">ZIP chứa hình ảnh</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử xuất file
          </CardTitle>
          <CardDescription>
            Các file đã xuất gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.type === "PDF" && <FileText className="h-5 w-5 text-chart-4" />}
                  {item.type === "Excel" && <FileSpreadsheet className="h-5 w-5 text-accent" />}
                  {item.type === "PNG" && <Image className="h-5 w-5 text-chart-3" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                      <span>-</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-accent">
                    <CheckCircle2 className="h-3 w-3" />
                    Hoàn thành
                  </span>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
