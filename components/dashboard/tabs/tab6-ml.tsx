"use client"

import { useDataContext, COLORS, THEME, formatXAxis } from "@/lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ScatterChart, Scatter, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

export function Tab6ML() {
  // Móc toàn bộ dữ liệu và hàm từ "Bộ não" ra (Không dùng Props nữa)
  const {
    kClusters,
    setKClusters,
    kmeansCols,
    setKmeansCols,
    kmeansData,
    modelType,
    setModelType,
    targetCol,
    setTargetCol,
    featureCols,
    setFeatureCols,
    modelMetrics,
    arimaDateCol,
    setArimaDateCol,
    arimaTargetCol,
    setArimaTargetCol,
    arimaSteps,
    setArimaSteps,
    arimaData,
    columnsInfo,
    isLoading,
    runKMeans,
    runTrainModel,
    runARIMA
  } = useDataContext();

  const numericCols = columnsInfo.filter((c: any) => c.type === 'SỐ');

  const handleKMeansColToggle = (colName: string) => {
    if (kmeansCols.includes(colName)) {
      setKmeansCols(kmeansCols.filter((c: string) => c !== colName));
    } else {
      setKmeansCols([...kmeansCols, colName]);
    }
  };

  const handleFeatureColToggle = (colName: string) => {
    if (featureCols.includes(colName)) {
      setFeatureCols(featureCols.filter((c: string) => c !== colName));
    } else {
      setFeatureCols([...featureCols, colName]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* K-Means Clustering */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-purple-700 uppercase tracking-wide">
            Phân Cụm Tự Động (K-Means)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 bg-muted/50 p-4 rounded-lg border items-end">
            <div className="flex-1">
              <Label className="text-xs font-bold text-foreground mb-2 block uppercase">Biến Không Gian (X)</Label>
              <div className="flex flex-wrap gap-2 max-h-[80px] overflow-y-auto">
                {numericCols.map((c: any) => (
                  <label 
                    key={c.name} 
                    className={`px-2 py-1 text-xs rounded border cursor-pointer transition-colors ${
                      kmeansCols.includes(c.name) 
                        ? 'bg-purple-100 border-purple-300 text-purple-700 font-semibold' 
                        : 'bg-card border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Checkbox 
                      className="hidden"
                      checked={kmeansCols.includes(c.name)} 
                      onCheckedChange={() => handleKMeansColToggle(c.name)} 
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <Label className="text-xs font-bold text-foreground mb-1 block uppercase">Số Cụm (K)</Label>
                <Input 
                  type="number" 
                  min={2} 
                  max={10} 
                  value={kClusters} 
                  onChange={e => setKClusters(parseInt(e.target.value) || 3)} 
                  className="w-16 text-center"
                />
              </div>
              <Button 
                onClick={runKMeans} 
                disabled={isLoading}
                className="h-10 mt-5 bg-purple-600 hover:bg-purple-700"
              >
                CHẠY
              </Button>
            </div>
          </div>

          {kmeansData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-sm h-[350px]">
                <CardContent className="pt-5 h-full flex flex-col">
                  <h4 className="text-center text-sm font-bold text-foreground mb-2">Biểu Đồ Phân Cụm (PCA 2D)</h4>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={280}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="x" type="number" stroke="#64748b" fontSize={11} />
                        <YAxis dataKey="y" type="number" stroke="#64748b" fontSize={11} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }} />
                        <Legend verticalAlign="bottom" wrapperStyle={{fontSize: '11px'}}/>
                        {Array.from({ length: kClusters }).map((_, i) => (
                          <Scatter 
                            key={i} 
                            name={`Cụm ${i + 1}`} 
                            data={kmeansData.scatter?.filter((d: any) => d.cluster === `Cụm ${i + 1}`)} 
                            fill={COLORS[i % COLORS.length]} 
                          />
                        ))}
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm h-[350px] flex flex-col">
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <h4 className="text-center text-sm font-bold text-foreground py-3 bg-muted/50 -mx-6 px-6 border-b">Tọa Độ Trọng Tâm</h4>
                  <div className="overflow-auto flex-1 p-2 custom-scrollbar">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Cụm</TableHead>
                          {kmeansData.features.map((f: string) => (
                            <TableHead key={f} className="text-xs truncate max-w-[60px]">{f}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {kmeansData.centers.map((c: any[], i: number) => (
                          <TableRow key={i}>
                            <TableCell className="font-bold text-purple-700">Cụm {i+1}</TableCell>
                            {c.map((v, j) => (
                              <TableCell key={j}>{isFinite(v) ? v.toFixed(2) : '0'}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ML Training & ARIMA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Training */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-emerald-600 uppercase tracking-wide">
              Huấn Luyện AI (ML)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-bold text-foreground mb-1 block">Thuật Toán</Label>
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rf">Random Forest</SelectItem>
                  <SelectItem value="linear">Hồi Quy Tuyến Tính (OLS)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold text-foreground mb-1 block">Mục Tiêu (Y)</Label>
              <Select value={targetCol} onValueChange={setTargetCol}>
                <SelectTrigger><SelectValue placeholder="-- Chọn --" /></SelectTrigger>
                <SelectContent>
                  {numericCols.map((c: any) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-bold text-foreground mb-1 block">Biến Độc Lập (X)</Label>
              <div className="bg-muted/50 p-2 border rounded max-h-24 overflow-auto flex flex-wrap gap-1 custom-scrollbar">
                {numericCols.filter((c: any) => c.name !== targetCol).map((c: any) => (
                  <label 
                    key={c.name} 
                    className={`px-2 py-0.5 text-[10px] rounded cursor-pointer transition-colors ${
                      featureCols.includes(c.name) 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-card border border-border text-muted-foreground'
                    }`}
                  >
                    <Checkbox 
                      className="hidden"
                      checked={featureCols.includes(c.name)} 
                      onCheckedChange={() => handleFeatureColToggle(c.name)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <Button 
              onClick={runTrainModel} 
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              HUẤN LUYỆN
            </Button>
            
            {modelMetrics && (
              <div className="mt-4 p-4 bg-emerald-50 rounded border border-emerald-100 text-center">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Độ Tin Cậy (R-Squared)</div>
                <div className="text-4xl font-bold text-emerald-600">{(modelMetrics.r2 * 100).toFixed(1)}%</div>
                <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground font-mono">
                  <span>MAE: {modelMetrics.mae}</span>
                  <span>MSE: {modelMetrics.mse}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ARIMA Forecasting */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-primary uppercase tracking-wide">
              Dự Báo (ARIMA)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-foreground mb-1 block">Cột Thời Gian</Label>
                <Select value={arimaDateCol} onValueChange={setArimaDateCol}>
                  <SelectTrigger><SelectValue placeholder="-- Chọn --" /></SelectTrigger>
                  <SelectContent>
                    {columnsInfo.map((c: any) => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-bold text-foreground mb-1 block">Biến Quan Sát</Label>
                <Select value={arimaTargetCol} onValueChange={setArimaTargetCol}>
                  <SelectTrigger><SelectValue placeholder="-- Chọn --" /></SelectTrigger>
                  <SelectContent>
                    {numericCols.map((c: any) => (
                      <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold text-foreground mb-1 block">Số Bước Dự Báo</Label>
              <Input 
                type="number" 
                min={1} 
                max={30} 
                value={arimaSteps} 
                onChange={e => setArimaSteps(parseInt(e.target.value) || 5)} 
                className="w-24"
              />
            </div>
            <Button 
              onClick={runARIMA} 
              disabled={isLoading}
              className="w-full"
            >
              DỰ BÁO TƯƠNG LAI
            </Button>
            
            <div className="flex-1 bg-muted/50 rounded border flex flex-col justify-center min-h-[250px] p-2">
              {arimaData ? (
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={arimaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={formatXAxis} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                    <Line type="monotone" dataKey="actual" name="Lịch Sử" stroke={THEME.primary} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="forecast" name="Dự Phóng" stroke={THEME.warning} strokeWidth={2} strokeDasharray="4 4" dot={{r: 2}} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-xs text-muted-foreground">Kết quả vẽ biểu đồ sẽ hiển thị tại đây</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}