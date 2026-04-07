"use client"

import { useDataContext, THEME, formatXAxis } from "@/lib/data-context";
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ComposedChart, Scatter
} from "recharts"

export function Tab2Statistics() {
  const {
    fullData, // <--- Tui lấy thêm biến này ra để rút cột
    kpiData,
    classCol,
    setClassCol,
    statsData,
    boxplotData
  } = useDataContext();

  // --- TUYỆT CHIÊU 4H SÁNG (Phiên bản Tab 2) ---
  const availableCols = (fullData || []).length > 0 ? Object.keys(fullData[0]) : [];
  const categoryCols = availableCols
    .filter(col => !['TBM_He10', 'TBM_He4', 'Diem_Chu', 'Xep_Loai'].includes(col))
    .map(col => ({ name: col })); // Bọc lại để component ở dưới hiểu được

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-slate-400">
          <CardContent className="pt-5">
            <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-1 tracking-wide">Survey Count</h4>
            <span className="text-2xl font-bold text-foreground">{kpiData.total} SV</span>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
          <CardContent className="pt-5">
            <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-1 tracking-wide">Average Score (Scale 10)</h4>
            <span className="text-2xl font-bold text-primary">{kpiData.mean10}</span>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
          <CardContent className="pt-5">
            <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-1 tracking-wide">GPA (Scale 4.0)</h4>
            <span className="text-2xl font-bold text-amber-600">{kpiData.mean4}</span>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
          <CardContent className="pt-5">
            <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-1 tracking-wide">Pass Rate (≥4.0)</h4>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold text-emerald-600">{kpiData.passRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel: Chọn cột lớp */}
      <Card className="bg-blue-50/30 border-blue-100">
        <CardContent className="py-4 flex items-center gap-4">
          <Label className="text-sm text-blue-900 font-bold">Classifying Students Using Columns:</Label>
          <Select value={classCol} onValueChange={setClassCol}>
            <SelectTrigger className="w-[250px] bg-white shadow-sm">
              <SelectValue placeholder="-- Select the Class/Group Column--" />
            </SelectTrigger>
            <SelectContent>
              {categoryCols.map((c: any) => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!classCol && <span className="text-xs text-amber-600 animate-pulse font-medium">← TX ơi, chọn cột ở đây để hiện biểu đồ bên phải nhé!</span>}
        </CardContent>
      </Card>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Histogram */}
        <Card className="shadow-sm">
          <CardContent className="pt-5 h-[400px]">
            <h3 className="text-sm font-bold text-foreground uppercase mb-4 text-center">Distribution of Academic Performance Across the Course</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statsData.hist} margin={{ top: 10, right: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.gridLine} />
                <XAxis dataKey="bin" stroke={THEME.textMuted} fontSize={11} />
                <YAxis stroke={THEME.textMuted} fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" name="Number of students" fill={THEME.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ChartGuide title="Histogram" content="The highest peak helps you identify the general performance level of the students." />
          </CardContent>
        </Card>

        {/* 2. Stacked Bar */}
        <Card className="shadow-sm">
          <CardContent className="pt-5 h-[400px] flex flex-col">
            <h3 className="text-sm font-bold text-foreground uppercase mb-4 text-center">Ranking Structure According to {classCol || "Class"}</h3>
            {classCol ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData.classif.slice(0, 10)} margin={{ top: 10, right: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.gridLine} />
                  <XAxis dataKey="name" stroke={THEME.textMuted} fontSize={11} tickFormatter={formatXAxis} angle={-45} tick={{ textAnchor: 'end', dy: 10 }} interval={0} />
                  <YAxis stroke={THEME.textMuted} fontSize={11} />
                  <Tooltip />
                  <Legend verticalAlign="top" wrapperStyle={{ fontSize: '10px', paddingBottom: '10px' }} />
                  <Bar dataKey="Excellent" stackId="a" fill="#059669" />
                  <Bar dataKey="Very Good" stackId="a" fill="#1d4ed8" />
                  <Bar dataKey="Good" stackId="a" fill="#7c3aed" />
                  <Bar dataKey="Average" stackId="a" fill="#d97706" />
                  <Bar dataKey="Weak" stackId="a" fill="#e11d48" />
                  <Bar dataKey="Fail" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl m-4">
                <p className="text-xs uppercase font-black tracking-widest">Empty data</p>
                <p className="text-[10px]">Please select the classification column above.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Boxplot */}
      {classCol && (
        <Card className="shadow-sm animate-in slide-in-from-bottom duration-500">
          <CardContent className="pt-5">
            <h3 className="text-sm font-bold text-foreground uppercase mb-4 text-center">Boxplot (System 4.0)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={boxplotData.slice(0, 15)} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME.gridLine} />
                <XAxis dataKey="name" stroke={THEME.textMuted} fontSize={11} tickFormatter={formatXAxis} angle={-30} tick={{ textAnchor: 'end', dy: 10 }} interval={0} />
                <YAxis stroke={THEME.textMuted} fontSize={11} domain={[0, 4]} />
                <Tooltip />
                <Bar dataKey="whiskerMin" name="Min-Q1" barSize={2} fill="#94a3b8" />
                <Bar dataKey="whiskerMax" name="Q3-Max" barSize={2} fill="#94a3b8" />
                <Bar dataKey="boxRange" name="Box 50% (Q1-Q3)" barSize={35} fill={THEME.primary} radius={2} />
                <Scatter dataKey="median" name="Median" fill="#d97706" />
              </ComposedChart>
            </ResponsiveContainer>
            <ChartGuide title="Boxplot" content="A shorter box indicates more consistent scores within the group, meaning less disparity." />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ChartGuide({ title, content }: { title: string; content: string }) {
  return (
    <details className="mt-4 bg-slate-50 border rounded-lg group cursor-pointer transition-all">
      <summary className="px-4 py-2 text-[11px] font-bold text-blue-700 flex items-center justify-between outline-none uppercase">
        <span>💡 How to read {title}</span>
        <span className="group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="px-4 pb-3 text-[11px] text-slate-600 border-t pt-2 italic">
        {content}
      </div>
    </details>
  )
}