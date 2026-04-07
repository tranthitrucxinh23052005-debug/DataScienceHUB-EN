"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DistributionChart } from "@/components/dashboard/distribution-chart"
import { DoughnutChart } from "@/components/dashboard/doughnut-chart"
import { 
  Brain,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  LineChart
} from "lucide-react"

const modelComparisonData = [
  { name: "Random Forest", value: 94.7 },
  { name: "XGBoost", value: 92.3 },
  { name: "Neural Network", value: 91.8 },
  { name: "SVM", value: 89.5 },
  { name: "Linear Reg.", value: 85.2 },
]

const featureImportance = [
  { name: "study_hours", value: 0.28 },
  { name: "attendance_rate", value: 0.24 },
  { name: "previous_grade", value: 0.21 },
  { name: "extra_activities", value: 0.15 },
  { name: "parent_education", value: 0.12 },
]

const confusionMatrix = [
  { name: "True Positive", value: 2845 },
  { name: "True Negative", value: 2712 },
  { name: "False Positive", value: 156 },
  { name: "False Negative", value: 134 },
]

const models = [
  {
    name: "Random Forest",
    accuracy: 94.7,
    precision: 93.8,
    recall: 95.2,
    f1: 94.5,
    status: "active",
    description: "Mô hình chính - Hiệu suất tốt nhất"
  },
  {
    name: "XGBoost",
    accuracy: 92.3,
    precision: 91.5,
    recall: 93.1,
    f1: 92.3,
    status: "active",
    description: "Mô hình phụ - Gradient Boosting"
  },
  {
    name: "Neural Network",
    accuracy: 91.8,
    precision: 90.2,
    recall: 93.4,
    f1: 91.8,
    status: "training",
    description: "Đang huấn luyện thêm"
  },
  {
    name: "SVM",
    accuracy: 89.5,
    precision: 88.7,
    recall: 90.3,
    f1: 89.5,
    status: "inactive",
    description: "Không sử dụng"
  },
]

export function AnalyticsTab() {
  const [selectedModel, setSelectedModel] = useState("Random Forest")

  return (
    <div className="space-y-6">
      {/* Model Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <Card 
            key={model.name}
            className={`cursor-pointer transition-all ${
              selectedModel === model.name 
                ? "border-primary ring-2 ring-primary/20" 
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedModel(model.name)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <Brain className="h-5 w-5 text-primary" />
                {model.status === "active" && (
                  <span className="flex items-center gap-1 text-xs text-accent">
                    <CheckCircle2 className="h-3 w-3" />
                    Hoạt động
                  </span>
                )}
                {model.status === "training" && (
                  <span className="flex items-center gap-1 text-xs text-chart-3">
                    <AlertCircle className="h-3 w-3" />
                    Đang huấn luyện
                  </span>
                )}
                {model.status === "inactive" && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <XCircle className="h-3 w-3" />
                    Không hoạt động
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-foreground">{model.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{model.description}</p>
              <div className="text-2xl font-bold text-primary">{model.accuracy}%</div>
              <p className="text-xs text-muted-foreground">Độ chính xác</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Model Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Chi tiết mô hình: {selectedModel}
          </CardTitle>
          <CardDescription>
            Các chỉ số đánh giá hiệu suất chi tiết
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(() => {
            const model = models.find(m => m.name === selectedModel)
            if (!model) return null
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{model.accuracy}%</div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{model.precision}%</div>
                  <p className="text-sm text-muted-foreground">Precision</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-chart-3">{model.recall}%</div>
                  <p className="text-sm text-muted-foreground">Recall</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-chart-4">{model.f1}%</div>
                  <p className="text-sm text-muted-foreground">F1-Score</p>
                </div>
              </div>
            )
          })()}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DistributionChart
          title="So sánh độ chính xác các mô hình"
          subtitle="Accuracy (%) của từng thuật toán"
          data={modelComparisonData}
        />
        <DoughnutChart
          title="Ma trận nhầm lẫn"
          subtitle="Confusion Matrix - Phân loại kết quả"
          data={confusionMatrix}
        />
      </div>

      {/* Feature Importance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Độ quan trọng của đặc trưng
          </CardTitle>
          <CardDescription>
            Feature Importance - Mức độ ảnh hưởng của từng biến đến kết quả dự đoán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureImportance.map((feature, index) => (
              <div key={feature.name} className="flex items-center gap-4">
                <span className="w-8 text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="w-40 text-sm font-medium text-foreground">
                  {feature.name}
                </span>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${feature.value * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-sm font-semibold text-foreground text-right">
                  {(feature.value * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Hành động huấn luyện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button>
              <Brain className="h-4 w-4 mr-2" />
              Huấn luyện lại mô hình
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Cross-Validation
            </Button>
            <Button variant="outline">
              <LineChart className="h-4 w-4 mr-2" />
              Hyperparameter Tuning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
