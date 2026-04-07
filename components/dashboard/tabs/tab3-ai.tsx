"use client"

import { useDataContext, COLORS, formatXAxis } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Bot, Zap, Download, Sparkles, FileText } from "lucide-react"
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"

export function Tab3AI() {
  const {
    aiReport,
    autoConfigs,
    autoDashboardDatasets,
    isLoading,
    handleCleanData,
    handleAISummary,
    handleAutoDashboard,
    handleExportExcel,
    parseMarkdown 
  } = useDataContext();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Control Center - Bảng điều khiển trung tâm */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-white to-slate-50/50">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Analytics Hub
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            {/* Mascot AI trang trí */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
               <div className="relative w-44 h-44 rounded-full border-4 border-white shadow-2xl overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center">
                 <Bot className="w-20 h-20 text-blue-600/80 animate-pulse" />
               </div>
            </div>

            {/* Hệ thống nút bấm chức năng */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              <Button 
                onClick={handleCleanData} 
                disabled={isLoading}
                className="h-16 bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-50 shadow-sm transition-all active:scale-95 font-bold"
              >
                <Trash2 className="h-5 w-5 mr-3" />
                AUTOMATIC DATA CLEANING
              </Button>
              <Button 
                onClick={handleAISummary} 
                disabled={isLoading}
                className="h-16 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 font-bold transition-all active:scale-95"
              >
                <Bot className="h-5 w-5 mr-3" />
                AI DATASET EVALUATION
              </Button>
              <Button 
                onClick={handleAutoDashboard} 
                disabled={isLoading}
                className="h-16 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 font-bold transition-all active:scale-95"
              >
                <Zap className="h-5 w-5 mr-3" />
                AUTOMATIC DASHBOARD CREATION
              </Button>
              <Button 
                onClick={handleExportExcel} 
                disabled={isLoading}
                className="h-16 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 shadow-sm font-bold transition-all active:scale-95"
              >
                <Download className="h-5 w-5 mr-3" />
                EXPORT REPORT IN EXCEL
              </Button>
            </div>
          </div>

          {/* AI Report Display - Phần hiển thị báo cáo AI */}
          {aiReport && (
            <div className="mt-12 p-8 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] relative overflow-hidden shadow-inner animate-in zoom-in-95 duration-500">
              {/* Badge trang trí Header Báo cáo */}
              <div className="absolute top-0 left-12 transform -translate-y-1/2 flex gap-2">
                <div className="bg-blue-600 text-white px-6 py-2 text-[10px] font-black uppercase rounded-full shadow-lg tracking-widest flex items-center gap-2">
                   <FileText className="h-3 w-3" />
                   AI Generated Report
                </div>
              </div>
              
              <div className="pt-6 prose prose-blue max-w-none prose-sm lg:prose-base">
                <div className="text-slate-800 leading-relaxed">
                  {/* Sử dụng hàm parseMarkdown đã được TX nâng cấp ở context */}
                  {parseMarkdown(aiReport)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Dashboard - Khu vực biểu đồ AI đề xuất */}
      {(autoConfigs || []).length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
             <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">AI Suggested Dashboard</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(autoConfigs || []).map((config, idx) => (
              <Card key={idx} className="border-none shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-slate-800 font-bold text-sm leading-tight border-l-4 border-blue-500 pl-3 uppercase">
                      {config.title || `Insight Chart ${idx + 1}`}
                    </h3>
                  </div>
                  
                  <div className="h-64 bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
                    {(!autoDashboardDatasets[idx] || !config.x || !config.y) ? ( 
                      <div className="w-full h-full flex items-center justify-center text-red-400 text-[10px] font-bold uppercase italic">
                        Incompatible data
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        {config.type === 'Bar' ? ( 
                          <BarChart data={autoDashboardDatasets[idx]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey={config.x} stroke="#94a3b8" fontSize={9} fontWeight={600} tickFormatter={formatXAxis} />
                            <YAxis stroke="#94a3b8" fontSize={9} fontWeight={600} />
                            <Tooltip contentStyle={{background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Bar dataKey={config.y} fill={COLORS[idx % COLORS.length]} radius={[6, 6, 0, 0]} barSize={30} />
                          </BarChart>
                        ) : config.type === 'Pie' ? ( 
                          <PieChart>
                            <Pie 
                              data={autoDashboardDatasets[idx]?.slice(0, 8)} 
                              dataKey={config.y} 
                              nameKey={config.x} 
                              cx="50%" 
                              cy="50%" 
                              innerRadius={50} 
                              outerRadius={80} 
                              paddingAngle={4}
                            >
                              {autoDashboardDatasets[idx]?.slice(0, 8).map((_:any, i: number) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                          </PieChart>
                        ) : ( 
                          <LineChart data={autoDashboardDatasets[idx]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey={config.x} stroke="#94a3b8" fontSize={9} fontWeight={600} tickFormatter={formatXAxis} />
                            <YAxis stroke="#94a3b8" fontSize={9} fontWeight={600} />
                            <Tooltip contentStyle={{background: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Line type="monotone" dataKey={config.y} stroke={COLORS[idx % COLORS.length]} strokeWidth={3} dot={{ r: 4, fill: COLORS[idx % COLORS.length], strokeWidth: 2, stroke: '#fff' }} />
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    )}
                  </div>
                  
                  {/* Thông tin Meta dữ liệu của biểu đồ */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                       <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-tighter">X: {config.x}</span>
                       <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-tighter">Y: {config.y}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase italic">Agg: {config.agg || 'RAW'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}