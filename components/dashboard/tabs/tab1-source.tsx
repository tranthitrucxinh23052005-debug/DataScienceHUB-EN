"use client"

import { useDataContext, THEME, formatXAxis } from "@/lib/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Upload, CheckCircle2 } from "lucide-react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts"
import { Checkbox } from "@/components/ui/checkbox"

export function Tab1Source() {
  // Móc toàn bộ dữ liệu và hàm từ "Bộ não" ra (Không dùng Props nữa)
  const {
    selectedFile,
    fullData,
    columnsInfo,
    missingData,
    stepDataChecked,
    useHUBFormula,
    setUseHUBFormula,
    hubCols,
    setHubCols,
    mainScoreCol,
    setMainScoreCol,
    filterGrade,
    setFilterGrade,
    filteredTableData,
    processMode,
    setProcessMode,
    scaleType,
    setScaleType,
    selectedScaleCols,
    setSelectedScaleCols,
    isLoading,
    handleFileUpload,
    runCheckData,
    applyHUBScore,
    runProcessData,
    exportFilteredExcel
  } = useDataContext();
  
  const hasHUBScore = fullData.length > 0 && 'TBM_He4' in fullData[0];
  const numericCols = columnsInfo.filter(c => c.type === 'number');

  const handleScaleColToggle = (colName: string) => {
    if (selectedScaleCols.includes(colName)) {
      setSelectedScaleCols(selectedScaleCols.filter(c => c !== colName));
    } else {
      setSelectedScaleCols([...selectedScaleCols, colName]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Section 1: File Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-primary uppercase tracking-wide">
            Data Sources & Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-muted/50 p-5 rounded-lg border">
            <Label 
              htmlFor="file-upload"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
              <Upload className="h-4 w-4" />
              SEND FILES (.CSV)
              <Input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Label>
            
            {selectedFile && (
              <span className="text-primary font-mono bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20 text-sm">
                {selectedFile.name}
              </span>
            )}
            
            {selectedFile && (
              <Button 
                onClick={runCheckData} 
                disabled={isLoading}
                className="ml-auto bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                1. START SCANNING DATA 
              </Button>
            )}
          </div>

          {/* HUB Score Configuration */}
          {stepDataChecked && (
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-200 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wide">
                  2. Setting the Score for HUB
                </h3>
                <div className="flex rounded-md shadow-sm">
                  <Button
                    variant={useHUBFormula ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseHUBFormula(true)}
                    className="rounded-r-none"
                  >
                    CALCULATE 4 COMPONENTS
                  </Button>
                  <Button
                    variant={!useHUBFormula ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseHUBFormula(false)}
                    className="rounded-l-none"
                  >
                    USE EXISTING SCORES
                  </Button>
                </div>
              </div>

              {useHUBFormula ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold mb-1">Diligence (10%)</Label>
                    <Select value={hubCols.cc} onValueChange={(v) => setHubCols({...hubCols, cc: v})}>
                      <SelectTrigger><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                      <SelectContent>
                        {columnsInfo.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold mb-1">Group Assignment (20%)</Label>
                    <Select value={hubCols.btn} onValueChange={(v) => setHubCols({...hubCols, btn: v})}>
                      <SelectTrigger><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                      <SelectContent>
                        {columnsInfo.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold mb-1">Individual Assignment (20%)</Label>
                    <Select value={hubCols.btcn} onValueChange={(v) => setHubCols({...hubCols, btcn: v})}>
                      <SelectTrigger><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                      <SelectContent>
                        {columnsInfo.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold mb-1">Final Exam (50%)</Label>
                    <Select value={hubCols.thi} onValueChange={(v) => setHubCols({...hubCols, thi: v})}>
                      <SelectTrigger><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                      <SelectContent>
                        {columnsInfo.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <Label className="text-xs text-muted-foreground font-semibold mb-1">Final Grade Column (10-point scale)</Label>
                  <Select value={mainScoreCol} onValueChange={setMainScoreCol}>
                    <SelectTrigger className="max-w-[300px]"><SelectValue placeholder="-- Choose --" /></SelectTrigger>
                    <SelectContent>
                      {columnsInfo.map(c => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button 
                onClick={applyHUBScore} 
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                3. HUB CALCULATION & CONVERSION
              </Button>
            </div>
          )}

          {/* Data Table */}
          {hasHUBScore && (
            <div className="border rounded-lg overflow-hidden animate-in fade-in duration-300">
              <div className="flex flex-wrap justify-between items-center p-4 bg-muted/50 border-b">
                <h3 className="text-sm font-semibold text-foreground uppercase">
                  Actual data table ({fullData.length} rows)
                </h3>
                <div className="flex gap-2">
                  <Select value={filterGrade} onValueChange={setFilterGrade}>
                    <SelectTrigger className="w-[150px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Filter: All</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Very good">Very good</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Weak">Weak</SelectItem>
                      <SelectItem value="Faile">Faile</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={exportFilteredExcel} className="bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">
                    DOWNLOAD (.CSV)
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto max-h-[350px]">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      {fullData.length > 0 && Object.keys(fullData[0])
                        .filter(h => !['TBM_He10','TBM_He4','Diem_Chu','Xep_Loai'].includes(h))
                        .map((h, i) => (
                          <TableHead key={i} className="text-xs font-semibold whitespace-nowrap">{h}</TableHead>
                        ))}
                      <TableHead className="text-xs font-bold text-primary bg-primary/10">Scale 10</TableHead>
                      <TableHead className="text-xs font-bold text-amber-700 bg-amber-50">Scale 4.0</TableHead>
                      <TableHead className="text-xs font-bold text-purple-700 bg-purple-50">Ranking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTableData.slice(0, 100).map((row, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/30">
                        {Object.keys(row)
                          .filter(h => !['TBM_He10','TBM_He4','Diem_Chu','Xep_Loai'].includes(h))
                          .map((h, j) => (
                            <TableCell key={j} className="text-sm truncate max-w-[150px]">
                              {row[h] !== '' && row[h] !== null && row[h] !== undefined 
                                ? String(row[h]) 
                                : <span className="text-destructive font-bold text-xs">NULL</span>}
                            </TableCell>
                          ))}
                        <TableCell className="text-center font-mono font-semibold text-primary bg-primary/5">
                          {row['TBM_He10']}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold text-amber-700 bg-amber-50/50">
                          {row['TBM_He4']}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-purple-700 bg-purple-50/50">
                          {row['Diem_Chu']}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Error Audit */}
      {stepDataChecked && (
        <Card className="animate-in fade-in duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-destructive uppercase tracking-wide">
              Error Auditing (Null & Formatting)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 overflow-y-auto max-h-[300px] rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      <TableHead className="font-semibold">Column</TableHead>
                      <TableHead className="text-center font-semibold">Type</TableHead>
                      <TableHead className="text-center font-semibold">Error (Null)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columnsInfo
                      .filter(c => !['TBM_He10','TBM_He4','Diem_Chu','Xep_Loai'].includes(c.name))
                      .map((info, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/30">
                          <TableCell className="truncate max-w-[120px]">{info.name}</TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              info.type === 'number' ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {info.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-bold text-destructive">{info.nan_count}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="lg:col-span-3 bg-card p-4 rounded-lg border h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={missingData || []} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={THEME.gridLine} />
                    <XAxis dataKey="column" stroke={THEME.textMuted} fontSize={11} tickFormatter={formatXAxis} angle={-45} tick={{ textAnchor: 'end', dy: 10 }} interval={0} />
                    <YAxis stroke={THEME.textMuted} fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: THEME.bgBase, border: `1px solid ${THEME.cardBorder}`, borderRadius: '6px' }} />
                    <Bar dataKey="System_NaN" name="Null" stackId="a" fill={THEME.danger} />
                    <Bar dataKey="User_Miss" name="Incorrect formatting" stackId="a" fill={THEME.warning} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 3: ETL Pipeline */}
      {stepDataChecked && (
        <Card className="animate-in fade-in duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-emerald-600 uppercase tracking-wide">
              Pipeline Normalization (ETL)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/50 p-4 rounded-lg border">
                <Label className="text-xs font-bold text-foreground mb-2 block uppercase">Addressing Deficiencies</Label>
                <Select value={processMode} onValueChange={setProcessMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Preserve the Original</SelectItem>
                    <SelectItem value="drop">Drop NA</SelectItem>
                    <SelectItem value="mean">Replace with Average</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border">
                <Label className="text-xs font-bold text-foreground mb-2 block uppercase">Number Normalization Algorithm</Label>
                <Select value={scaleType} onValueChange={setScaleType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Skip Normalization</SelectItem>
                    <SelectItem value="standard">Standard Scaler (Z-Score)</SelectItem>
                    <SelectItem value="minmax">MinMax Scaler (0-1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <Label className="text-xs font-bold text-foreground mb-3 block uppercase">Specify the column to be normalized:</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[120px] overflow-y-auto">
                {columnsInfo.map(c => (
                  <label 
                    key={c.name} 
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer border transition-colors ${
                      selectedScaleCols.includes(c.name) 
                        ? 'bg-primary/10 border-primary/30 text-primary' 
                        : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Checkbox
                      checked={selectedScaleCols.includes(c.name)}
                      onCheckedChange={() => handleScaleColToggle(c.name)}
                    />
                    <span className="truncate">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={runProcessData} 
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              CONFIRM CONFIGURATION & DATA TRANSFORMATION PROCESSING
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}