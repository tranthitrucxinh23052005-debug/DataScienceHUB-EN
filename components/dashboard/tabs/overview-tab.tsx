"use client"

import { MetricCard } from "@/components/dashboard/metric-card"
import { TimeSeriesChart } from "@/components/dashboard/time-series-chart"
import { DistributionChart } from "@/components/dashboard/distribution-chart"
import { DoughnutChart } from "@/components/dashboard/doughnut-chart"
import { DataTable } from "@/components/dashboard/data-table"
import { 
  Database, 
  Target, 
  Activity, 
  Clock,
  TrendingUp,
  Cpu
} from "lucide-react"

const timeSeriesData = [
  { name: "T1", actual: 4000, predicted: 3800 },
  { name: "T2", actual: 3000, predicted: 3200 },
  { name: "T3", actual: 5000, predicted: 4800 },
  { name: "T4", actual: 4780, predicted: 4900 },
  { name: "T5", actual: 5890, predicted: 5700 },
  { name: "T6", actual: 4390, predicted: 4600 },
  { name: "T7", actual: 6490, predicted: 6200 },
  { name: "T8", actual: 7200, predicted: 7000 },
  { name: "T9", actual: 6800, predicted: 7100 },
  { name: "T10", actual: 7500, predicted: 7300 },
  { name: "T11", actual: 8100, predicted: 7900 },
  { name: "T12", actual: 8500, predicted: 8200 },
]

const modelDistribution = [
  { name: "Random Forest", value: 35 },
  { name: "XGBoost", value: 28 },
  { name: "Neural Network", value: 22 },
  { name: "Linear Regression", value: 15 },
]

const distributionData = [
  { name: "Excellent", value: 156 },
  { name: " Very Good", value: 234 },
  { name: "Average", value: 312 },
  { name: "Good", value: 189 },
  { name: "Weak", value: 87 },
]

const tableColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "timestamp", label: "Time", sortable: true },
  { key: "prediction", label: "Prediction", sortable: true },
  { key: "actual", label: "Actual", sortable: true },
  { key: "error", label: "Error(%)", sortable: true },
  { key: "status", label: "Status", sortable: false },
]

const tableData = [
  { id: "P-001", timestamp: "07/04/2026 09:15", prediction: 87.5, actual: 89.2, error: 1.9, status: "Verified" },
  { id: "P-002", timestamp: "07/04/2026 09:30", prediction: 92.1, actual: 91.8, error: 0.3, status: "Verified" },
  { id: "P-003", timestamp: "07/04/2026 09:45", prediction: 78.3, actual: 80.1, error: 2.2, status: "Verified" },
  { id: "P-004", timestamp: "07/04/2026 10:00", prediction: 95.6, actual: 94.2, error: 1.5, status: "Verified" },
  { id: "P-005", timestamp: "07/04/2026 10:15", prediction: 83.9, actual: 85.7, error: 2.1, status: "Verified" },
  { id: "P-006", timestamp: "07/04/2026 10:30", prediction: 88.2, actual: 87.5, error: 0.8, status: "Verified" },
  { id: "P-007", timestamp: "07/04/2026 10:45", prediction: 91.4, actual: 92.1, error: 0.8, status: "Verified" },
  { id: "P-008", timestamp: "07/04/2026 11:00", prediction: 76.8, actual: 78.3, error: 1.9, status: "Verified" },
]

export function OverviewTab() {
  return (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total data"
          value="12,847"
          subtitle="Processed record"
          icon={Database}
          iconColor="text-primary"
          trend={{ value: 12.5, direction: "up" }}
        />
        <MetricCard
          title="Accuracy"
          value="94.7%"
          subtitle=" R²: 0.947"
          icon={Target}
          iconColor="text-accent"
          trend={{ value: 2.3, direction: "up" }}
        />
        <MetricCard
          title="RMSE"
          value="0.0312"
          subtitle="Mean square error"
          icon={Activity}
          iconColor="text-chart-3"
          trend={{ value: 5.1, direction: "down" }}
        />
        <MetricCard
          title="Processing time"
          value="2.34s"
          subtitle="Average per lot"
          icon={Clock}
          iconColor="text-chart-4"
          trend={{ value: 0, direction: "neutral" }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <TimeSeriesChart
            title="Time series analysis"
            subtitle="Compare actual and predicted values"
            data={timeSeriesData}
          />
        </div>
        <div className="lg:col-span-1">
          <DoughnutChart
            title="Model allocation"
            subtitle="Algorithm usage rate"
            data={modelDistribution}
          />
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DistributionChart
          title="Score distribution"
          subtitle="Categorize performance by group"
          data={distributionData}
        />
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-base font-semibold text-card-foreground mb-4">
            Summary of model performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">Random Forest</p>
                  <p className="text-xs text-muted-foreground">Main model</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-card-foreground">94.7%</p>
                <p className="text-xs text-accent">The Best</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">XGBoost</p>
                  <p className="text-xs text-muted-foreground">Gradient boosting</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-card-foreground">92.3%</p>
                <p className="text-xs text-muted-foreground">Auxiliary</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-chart-3/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">Neural Network</p>
                  <p className="text-xs text-muted-foreground">Deep learning</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-card-foreground">91.8%</p>
                <p className="text-xs text-muted-foreground">Experiment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="Recent prediction results"
        subtitle="Model output and validation status"
        columns={tableColumns}
        data={tableData}
        pageSize={5}
      />
    </>
  )
}
