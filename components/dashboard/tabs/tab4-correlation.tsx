"use client"

import { useDataContext, formatXAxis } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ComposedChart, Line, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend
} from "recharts"

export function Tab4Correlation() {
  const {
    corrMatrix,
    xAxis,
    yAxis,
    scatterWithTrend,
    selectedStudentIdx,
    setSelectedStudentIdx,
    fullData,
    columnsInfo,
    personalRadar
  } = useDataContext();

  const idCol = columnsInfo.find((c: any) => c.type === 'CATEGORICAL' && !['Diem_Chu','Xep_Loai'].includes(c.name))?.name

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Correlation Heatmap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-primary uppercase tracking-wide">
            Multivariable Correlation (Heatmap)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm h-[400px] flex flex-col">
              <CardContent className="pt-5 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-foreground mb-4 text-center underline underline-offset-4 decoration-primary/30">Correlation Matrix (Pearson)</h3>
                <div className="flex-1 overflow-auto border rounded custom-scrollbar bg-muted/5">
                  {corrMatrix && Object.keys(corrMatrix).length > 0 ? (
                    <table className="w-full text-[10px] text-center border-collapse">
                      <thead className="sticky top-0 bg-white shadow-sm z-10">
                        <tr>
                          <th className="p-2 border bg-muted/20"></th>
                          {Object.keys(corrMatrix).map(k => (
                            <th key={k} className="p-2 border text-muted-foreground truncate max-w-[70px] uppercase font-black">{k.substring(0,8)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(corrMatrix).map(rowKey => (
                          <tr key={rowKey} className="hover:bg-muted/5 transition-colors">
                            <td className="p-2 border bg-muted/10 text-foreground font-bold truncate max-w-[70px] text-left">{rowKey}</td>
                            {Object.keys(corrMatrix[rowKey]).map(colKey => {
                              const val = corrMatrix[rowKey][colKey]
                              let bg = '#fff'; let color = '#1e293b'
                              if (val > 0.7) { bg = '#fee2e2'; color = '#991b1b' }
                              else if (val > 0.3) { bg = '#fef9c3'; color = '#854d0e' }
                              else if (val < -0.3) { bg = '#e0f2fe'; color = '#075985' }
                              else if (val < -0.7) { bg = '#dbeafe'; color = '#1e40af' }
                              return (
                                <td key={colKey} className="p-2 border font-mono font-bold" style={{backgroundColor: bg, color: color}}>
                                  {val.toFixed(2)}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground italic">The data is not ready yet...</div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Scatter with Trendline - PHẦN ĐÃ SỬA LỖI HIỂN THỊ */}
            <Card className="shadow-sm h-[400px] flex flex-col">
              <CardContent className="pt-5 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-foreground mb-4 text-center tracking-tight">
                  DISTRIBUTION & TRENDLINE
                </h3>
                <div className="flex-1">
                  {xAxis && yAxis && scatterWithTrend.data && scatterWithTrend.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
  
  {/* SỬA TRỤC X: Bỏ type="number" và domain, thêm allowDuplicatedCategory để hiện nhiều SV cùng 1 lớp */}
  <XAxis 
    dataKey={xAxis} 
    name={xAxis}
    stroke="#64748b" 
    fontSize={10} 
    allowDuplicatedCategory={true} 
    tickFormatter={formatXAxis} 
  />
  
  {/* SỬA TRỤC Y: Trả về auto để nó tự co giãn theo dữ liệu thực tế */}
  <YAxis 
    type="number" 
    dataKey={yAxis} 
    name={yAxis}
    stroke="#64748b" 
    fontSize={10} 
    domain={['auto', 'auto']} 
  />
  
  <Tooltip 
    cursor={{ strokeDasharray: '3 3' }} 
    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }} 
  />
  
  <Scatter 
    name="student" 
    data={scatterWithTrend.data}
    fill="#3b82f6" 
    opacity={0.6} 
  />

  {scatterWithTrend.trend && scatterWithTrend.trend.length > 0 && (
    <Line 
      name="Trendline"
      data={scatterWithTrend.trend} 
      type="monotone" 
      dataKey={yAxis} 
      stroke="#ef4444" 
      strokeWidth={3} 
      dot={false} 
      activeDot={false}
      strokeDasharray="5 5" 
    />
  )}
  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px' }}/>
</ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground text-[11px] text-center px-6 bg-muted/20 border border-dashed rounded-lg">
                      <p className="font-bold mb-2 italic text-primary">The system has not yet identified the pair of variables (X, Y).</p>
                      <p>Please pass <span className="font-black text-blue-600 underline">Tab 5</span>, select the X-axis and Y-axis, then press <span className="font-black text-emerald-600 underline">Execute Pipeline</span>.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Personal Radar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-primary uppercase tracking-wide">
            Personal Competency Assessment (Radar)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-muted/30 p-5 rounded-lg border">
              <Label className="text-xs font-bold text-foreground mb-2 block uppercase tracking-tighter">Query by Student / ID</Label>
              <Select value={String(selectedStudentIdx)} onValueChange={(v) => setSelectedStudentIdx(parseInt(v))}>
                <SelectTrigger className="mb-6 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fullData.map((row: any, idx: number) => {
                    const label = idCol ? `${row[idCol]}` : `Line number ${idx + 1}`
                    return <SelectItem key={idx} value={String(idx)}>{label}</SelectItem>
                  })}
                </SelectContent>
              </Select>
              
              <Card className="mb-4 border-primary/20 shadow-none bg-primary/[0.02]">
                <CardContent className="pt-4 text-center">
                  <div className="text-[10px] text-muted-foreground uppercase font-black mb-1">GPA Hệ 4.0</div>
                  <div className="text-4xl font-black text-primary">{fullData[selectedStudentIdx]?.TBM_He4 || '0.00'}</div>
                  <div className="mt-2 inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                    {fullData[selectedStudentIdx]?.Xep_Loai || 'Not yet rated'}
                  </div>
                </CardContent>
              </Card>
              
              {personalRadar.warning && (
                <div className={`p-4 rounded-lg text-xs font-bold border leading-tight shadow-sm ${
                  personalRadar.warning.includes('Warning') 
                    ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' 
                    : personalRadar.warning.includes('Pass') 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {personalRadar.warning}
                </div>
              )}
            </div>
            
            <Card className="lg:col-span-3 shadow-none border-none h-[400px]">
              <CardContent className="pt-5 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={personalRadar.data}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} tickFormatter={formatXAxis} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '11px' }} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}/>
                    <Radar name="Personal" dataKey="studentScore" stroke="#059669" strokeWidth={3} fill="#059669" fillOpacity={0.6} />
                    <Radar name="General Level of the Class" dataKey="classAvg" stroke="#d97706" strokeWidth={2} fill="#d97706" fillOpacity={0.2} strokeDasharray="4 4" />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}