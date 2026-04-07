"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TimeSeriesChart } from "@/components/dashboard/time-series-chart"
import { DataTable } from "@/components/dashboard/data-table"
import { 
  LineChart,
  Calculator,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react"

const forecastData = [
  { name: "T1", actual: 4000, predicted: 4000 },
  { name: "T2", actual: 3500, predicted: 3500 },
  { name: "T3", actual: 4200, predicted: 4200 },
  { name: "T4", actual: 4800, predicted: 4800 },
  { name: "T5", actual: 5200, predicted: 5200 },
  { name: "T6", actual: 5600, predicted: 5600 },
  { name: "T7", actual: null, predicted: 6100 },
  { name: "T8", actual: null, predicted: 6500 },
  { name: "T9", actual: null, predicted: 6900 },
  { name: "T10", actual: null, predicted: 7200 },
  { name: "T11", actual: null, predicted: 7600 },
  { name: "T12", actual: null, predicted: 8000 },
]

const predictionColumns = [
  { key: "period", label: "Kỳ", sortable: true },
  { key: "prediction", label: "Giá trị dự đoán", sortable: true },
  { key: "lower", label: "Khoảng dưới (95%)", sortable: true },
  { key: "upper", label: "Khoảng trên (95%)", sortable: true },
  { key: "confidence", label: "Độ tin cậy", sortable: true },
]

const predictionData = [
  { period: "Tháng 7/2026", prediction: 6100, lower: 5800, upper: 6400, confidence: "92%" },
  { period: "Tháng 8/2026", prediction: 6500, lower: 6100, upper: 6900, confidence: "89%" },
  { period: "Tháng 9/2026", prediction: 6900, lower: 6400, upper: 7400, confidence: "86%" },
  { period: "Tháng 10/2026", prediction: 7200, lower: 6600, upper: 7800, confidence: "83%" },
  { period: "Tháng 11/2026", prediction: 7600, lower: 6900, upper: 8300, confidence: "80%" },
  { period: "Tháng 12/2026", prediction: 8000, lower: 7200, upper: 8800, confidence: "77%" },
]

export function ForecastingTab() {
  const [inputValues, setInputValues] = useState({
    studyHours: "",
    attendanceRate: "",
    previousGrade: "",
    extraActivities: ""
  })
  const [predictionResult, setPredictionResult] = useState<number | null>(null)

  const handlePredict = () => {
    // Simulate prediction
    const baseScore = 2.5
    const hours = parseFloat(inputValues.studyHours) || 0
    const attendance = parseFloat(inputValues.attendanceRate) || 0
    const prevGrade = parseFloat(inputValues.previousGrade) || 0
    const activities = parseFloat(inputValues.extraActivities) || 0
    
    const predicted = Math.min(4.0, Math.max(0, 
      baseScore + (hours * 0.02) + (attendance * 0.01) + (prevGrade * 0.3) + (activities * 0.05)
    ))
    setPredictionResult(Math.round(predicted * 100) / 100)
  }

  return (
    <div className="space-y-6">
      {/* Individual Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Dự đoán đơn lẻ
          </CardTitle>
          <CardDescription>
            Nhập thông tin sinh viên để dự đoán điểm GPA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Số giờ học/tuần
              </label>
              <Input 
                type="number" 
                placeholder="VD: 25" 
                value={inputValues.studyHours}
                onChange={(e) => setInputValues({...inputValues, studyHours: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tỷ lệ điểm danh (%)
              </label>
              <Input 
                type="number" 
                placeholder="VD: 90" 
                min="0" 
                max="100"
                value={inputValues.attendanceRate}
                onChange={(e) => setInputValues({...inputValues, attendanceRate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Điểm kỳ trước (GPA)
              </label>
              <Input 
                type="number" 
                placeholder="VD: 3.2" 
                step="0.1" 
                min="0" 
                max="4"
                value={inputValues.previousGrade}
                onChange={(e) => setInputValues({...inputValues, previousGrade: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Hoạt động ngoại khóa
              </label>
              <Input 
                type="number" 
                placeholder="VD: 3" 
                min="0" 
                max="10"
                value={inputValues.extraActivities}
                onChange={(e) => setInputValues({...inputValues, extraActivities: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handlePredict}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Chạy dự đoán
            </Button>
            {predictionResult !== null && (
              <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg">
                <ArrowRight className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">Kết quả dự đoán:</span>
                <span className="text-lg font-bold text-accent">{predictionResult.toFixed(2)} GPA</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Series Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TimeSeriesChart
            title="Dự báo chuỗi thời gian"
            subtitle="Dự báo 6 tháng tiếp theo (vùng xám = dự báo)"
            data={forecastData}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5" />
              Tóm tắt dự báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Kỳ dự báo</span>
              </div>
              <span className="text-sm font-semibold text-foreground">6 tháng</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Xu hướng</span>
              </div>
              <span className="text-sm font-semibold text-accent">Tăng +42.8%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Độ tin cậy TB</span>
              </div>
              <span className="text-sm font-semibold text-foreground">84.5%</span>
            </div>
            <Button className="w-full" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Điều chỉnh khoảng dự báo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Table */}
      <DataTable
        title="Chi tiết dự báo theo kỳ"
        subtitle="Giá trị dự báo với khoảng tin cậy 95%"
        columns={predictionColumns}
        data={predictionData}
        pageSize={6}
      />

      {/* Batch Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Dự đoán hàng loạt
          </CardTitle>
          <CardDescription>
            Tải lên file CSV chứa thông tin nhiều sinh viên để dự đoán đồng thời
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              Chọn file CSV
            </Button>
            <Button>
              <PlayCircle className="h-4 w-4 mr-2" />
              Chạy dự đoán hàng loạt
            </Button>
            <span className="text-sm text-muted-foreground">
              Chưa có file nào được chọn
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
