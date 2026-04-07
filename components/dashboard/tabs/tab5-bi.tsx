"use client"

import { useDataContext, THEME, COLORS, formatXAxis } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileDown, Bot, Sparkles } from "lucide-react"
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from "recharts"

export function Tab5BI() {
  // Móc toàn bộ tài nguyên từ "Bộ não" DataContext
  const {
    biData,
    chartType,
    setChartType,
    xAxis,
    setXAxis,
    yAxis,
    setYAxis,
    aggFunc,
    setAggFunc,
    columnsInfo,
    chartInsight,
    isLoading,
    runProcessData,
    chartRef,
    reportRef,
    parseMarkdown,
    exportPDF,
    handleChartInsight
  } = useDataContext();

  return (
    <div className="space-y-6 animate-in fade-in duration-500" ref={reportRef}>
      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-tighter flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Custom BI Dashboard
              </CardTitle>
              <p className="text-xs text-muted-foreground font-medium">Tùy chỉnh trục tọa độ và phép tính toán học</p>
            </div>
            <Button 
              onClick={exportPDF} 
              variant="outline" 
              size="sm" 
              disabled={isLoading}
              className="border-red-200 text-red-600 hover:bg-red-50 font-bold"
            >
              <FileDown className="h-4 w-4 mr-2" />
              XUẤT BÁO CÁO PDF
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Chart Controls - Bảng điều khiển */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100 items-end shadow-inner">
            <div className="space-y-2">
              <Label className="text-[10px] font-black text-blue-700 uppercase ml-1">Dạng Biểu Đồ</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="bg-white border-slate-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bar">Cột (Bar Chart)</SelectItem>
                  <SelectItem value="Line">Đường (Line Chart)</SelectItem>
                  <SelectItem value="Pie">Tròn (Pie Chart)</SelectItem>
                  <SelectItem value="Scatter">Phân tán (Scatter)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-blue-700 uppercase ml-1">Trục Hoành (X)</Label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger className="bg-white border-slate-200"><SelectValue placeholder="Chọn cột dữ liệu" /></SelectTrigger>
                <SelectContent>
                  {columnsInfo.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-blue-700 uppercase ml-1">Trục Tung (Y)</Label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger className="bg-white border-slate-200"><SelectValue placeholder="Chọn cột dữ liệu" /></SelectTrigger>
                <SelectContent>
                  {columnsInfo.map(c => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black text-blue-700 uppercase ml-1">Phương Thức Tính</Label>
              <div className="flex gap-2">
                <Select value={aggFunc} onValueChange={setAggFunc}>
                  <SelectTrigger className="bg-white border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Giá trị gốc</SelectItem>
                    <SelectItem value="mean">Trung bình</SelectItem>
                    <SelectItem value="sum">Tổng cộng</SelectItem>
                    <SelectItem value="count">Đếm số lượng</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={runProcessData} 
                  disabled={isLoading} 
                  className="bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 font-bold px-4 transition-all active:scale-95"
                >
                  VẼ MỚI
                </Button>
              </div>
            </div>
          </div>

         {/* Chart Display - Khu vực hiển thị biểu đồ */}
<div 
  ref={chartRef} 
  className="bg-white p-6 rounded-2xl border border-slate-100 h-[500px] shadow-sm relative group"
  // Thêm style inline để đảm bảo html2canvas luôn thấy màu chuẩn
  style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
>
  {(!biData || biData.length === 0 || !xAxis || !yAxis) ? (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
      <div className="p-4 bg-white rounded-full shadow-sm">
        <BarChart className="h-8 w-8 text-slate-300" />
      </div>
      <p className="font-bold text-sm">Cấu hình trục tọa độ và nhấn VẼ MỚI để bắt đầu</p>
    </div>
  ) : (
    <ResponsiveContainer width="100%" height="100%">
      {chartType === 'Bar' ? ( 
        <BarChart data={biData} margin={{bottom: 30, top: 20}}>
          {/* Ép màu stroke lưới về mã HEX */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey={xAxis} stroke="#64748b" fontSize={10} fontWeight={600} tickFormatter={formatXAxis} />
          <YAxis stroke="#64748b" fontSize={10} fontWeight={600} />
          <Tooltip 
            cursor={{fill: '#f8fafc'}}
            contentStyle={{backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px'}} 
          />
          {/* Sử dụng mã HEX trực tiếp thay vì biến CSS --primary để tránh lỗi render ảnh */}
          <Bar dataKey={yAxis} fill="#1d4ed8" radius={[6, 6, 0, 0]} barSize={40} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold'}} />
        </BarChart>
      ) : chartType === 'Line' ? ( 
        <LineChart data={biData} margin={{bottom: 30, top: 20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xAxis} stroke="#64748b" fontSize={10} fontWeight={600} tickFormatter={formatXAxis} />
          <YAxis stroke="#64748b" fontSize={10} fontWeight={600} />
          <Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px'}} />
          <Line type="monotone" dataKey={yAxis} stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: "#dc2626" }} activeDot={{ r: 6 }} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold'}} />
        </LineChart>
      ) : chartType === 'Pie' ? ( 
        <PieChart>
          <Pie 
            data={biData?.slice(0, 10)} 
            dataKey={yAxis} 
            nameKey={xAxis} 
            cx="50%" 
            cy="50%" 
            innerRadius={80} 
            outerRadius={140} 
            paddingAngle={5}
            // Label cũng nên dùng mã màu HEX
            label={{fontSize: 10, fill: '#1e293b'}}
            labelLine={{ stroke: '#64748b' }}
          >
            {/* Sử dụng mảng màu COLORS từ hub-utils (đảm bảo là mã HEX) */}
            {biData?.slice(0, 10).map((_:any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 'bold'}} />
        </PieChart>
      ) : ( 
        <ScatterChart margin={{bottom: 30, top: 20}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey={xAxis} type="number" name={xAxis} stroke="#64748b" fontSize={10} tickFormatter={formatXAxis} />
          <YAxis dataKey={yAxis} type="number" name={yAxis} stroke="#64748b" fontSize={10} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{borderRadius: '12px', border: 'none'}} />
          <Scatter name="Sinh viên" data={biData} fill="#059669" fillOpacity={0.6} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
        </ScatterChart>
      )}
    </ResponsiveContainer>
  )}
</div>

          {/* AI Insight Button - Nút kích hoạt AI */}
          <div className="flex flex-col items-center space-y-4">
            <Button 
              onClick={handleChartInsight} 
              disabled={isLoading || !biData || biData.length === 0} 
              className="bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl shadow-xl hover:shadow-slate-200 transition-all active:scale-95 group"
            >
              <Bot className={`h-5 w-5 mr-3 ${isLoading ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
              <span className="font-black tracking-tight uppercase">Tạo Insight Bằng AI Gemini</span>
            </Button>
            {isLoading && <p className="text-[10px] font-bold text-blue-600 animate-pulse uppercase tracking-widest">Hệ thống đang truy vấn thị giác máy tính...</p>}
          </div>

         {/* Vùng hiển thị kết quả AI - Hãy chắc chắn đoạn này tồn tại */}
{chartInsight && (
  <div className="mt-8 p-8 bg-blue-50/50 border border-blue-200 rounded-3xl relative animate-in fade-in slide-in-from-bottom duration-700">
    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
    <div className="flex items-center gap-3 mb-4">
       <Bot className="text-blue-600 h-6 w-6" />
       <h4 className="text-lg font-black text-blue-900 uppercase">Kết quả phân tích từ AI Gemini</h4>
    </div>
    <div className="text-slate-700 leading-relaxed text-justify prose prose-blue prose-slate min-w-full">
  {parseMarkdown(chartInsight)}
</div>
  </div>
)}
        </CardContent>
      </Card>
    </div>
  )
}