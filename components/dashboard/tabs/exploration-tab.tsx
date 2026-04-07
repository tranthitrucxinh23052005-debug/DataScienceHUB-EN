"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/dashboard/data-table"
import { 
  Upload,
  FileSpreadsheet,
  Filter,
  Search,
  BarChart2,
  PieChart,
  Table2,
  Eye
} from "lucide-react"

const sampleDataColumns = [
  { key: "stt", label: "STT", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type of Data", sortable: true },
  { key: "count", label: "Count", sortable: true },
  { key: "missing", label: "Missing Value", sortable: true },
  { key: "unique", label: "Unique", sortable: true },
]

const sampleDataInfo = [
  { stt: 1, name: "student_id", type: "int64", count: 12847, missing: 0, unique: 12847 },
  { stt: 2, name: "gpa_score", type: "float64", count: 12847, missing: 23, unique: 892 },
  { stt: 3, name: "study_hours", type: "float64", count: 12847, missing: 15, unique: 156 },
  { stt: 4, name: "attendance_rate", type: "float64", count: 12847, missing: 8, unique: 98 },
  { stt: 5, name: "previous_grade", type: "float64", count: 12847, missing: 45, unique: 234 },
  { stt: 6, name: "extra_activities", type: "int64", count: 12847, missing: 0, unique: 15 },
  { stt: 7, name: "family_income", type: "category", count: 12847, missing: 156, unique: 5 },
  { stt: 8, name: "parent_education", type: "category", count: 12847, missing: 89, unique: 6 },
  { stt: 9, name: "internet_access", type: "bool", count: 12847, missing: 0, unique: 2 },
  { stt: 10, name: "prediction_score", type: "float64", count: 12847, missing: 0, unique: 1245 },
]

const rawDataColumns = [
  { key: "student_id", label: "ID", sortable: true },
  { key: "gpa_score", label: "GPA Score", sortable: true },
  { key: "study_hours", label: "Study Hours", sortable: true },
  { key: "attendance_rate", label: "Attendance Rate", sortable: true },
  { key: "extra_activities", label: "Extra Activities", sortable: true },
]

const rawData = [
  { student_id: "SV001", gpa_score: 3.45, study_hours: 28, attendance_rate: "92%", extra_activities: 3 },
  { student_id: "SV002", gpa_score: 3.78, study_hours: 35, attendance_rate: "98%", extra_activities: 5 },
  { student_id: "SV003", gpa_score: 2.89, study_hours: 18, attendance_rate: "75%", extra_activities: 1 },
  { student_id: "SV004", gpa_score: 3.92, study_hours: 40, attendance_rate: "100%", extra_activities: 4 },
  { student_id: "SV005", gpa_score: 3.15, study_hours: 25, attendance_rate: "88%", extra_activities: 2 },
  { student_id: "SV006", gpa_score: 2.67, study_hours: 15, attendance_rate: "70%", extra_activities: 0 },
  { student_id: "SV007", gpa_score: 3.56, study_hours: 32, attendance_rate: "95%", extra_activities: 3 },
  { student_id: "SV008", gpa_score: 3.82, study_hours: 38, attendance_rate: "97%", extra_activities: 6 },
]

export function ExplorationTab() {
  const [viewMode, setViewMode] = useState<"info" | "data">("info")

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload data
          </CardTitle>
          <CardDescription>
            Upload new dataset for analysis (CSV, Excel, JSON)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
             Drag and drop file here or click to select file
            </p>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Select file
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">12,847</div>
            <p className="text-xs text-muted-foreground">Total number of records</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">10</div>
            <p className="text-xs text-muted-foreground">Number of columns/variables</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">336</div>
            <p className="text-xs text-muted-foreground">Missing value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground">2.6%</div>
            <p className="text-xs text-muted-foreground">Missing rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Data View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="h-5 w-5" />
                Explore data
              </CardTitle>
              <CardDescription>
                See overview information and detailed data
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === "info" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("info")}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Information
              </Button>
              <Button 
                variant={viewMode === "data" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("data")}
              >
                <Eye className="h-4 w-4 mr-2" />
                Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "info" ? (
            <DataTable
              title=""
              subtitle=""
              columns={sampleDataColumns}
              data={sampleDataInfo}
              pageSize={10}
            />
          ) : (
            <DataTable
              title=""
              subtitle=""
              columns={rawDataColumns}
              data={rawData}
              pageSize={8}
            />
          )}
        </CardContent>
      </Card>

      {/* Filter & Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced filtering and searching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search by student ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter student code..." className="pl-10" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                GPA from
              </label>
              <Input type="number" placeholder="0.0" step="0.1" min="0" max="4" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                GPA to
              </label>
              <Input type="number" placeholder="4.0" step="0.1" min="0" max="4" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
