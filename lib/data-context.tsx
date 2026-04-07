"use client"

import React, { createContext, useContext, useState, useRef, useEffect, useMemo, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

const API_URL = "https://tieuthetunhacongdang-tx-data-analytics-api.hf.space";

// --- MÃ MÀU CHUYÊN NGHIỆP ---
export const THEME = {
  bgBase: '#ffffff',          
  bgGradient: 'none',
  cardBg: '#ffffff', 
  cardBorder: '#e2e8f0', 
  primary: '#1d4ed8',         
  primaryGlow: 'rgba(29, 78, 216, 0.2)',
  success: '#059669',         
  successGlow: 'rgba(5, 150, 105, 0.2)',
  warning: '#d97706',         
  danger: '#dc2626',          
  textMain: '#1e293b',        
  textMuted: '#64748b',       
  gridLine: '#e2e8f0'
};

export const COLORS = ['#1d4ed8', '#059669', '#d97706', '#7c3aed', '#db2777', '#0d9488', '#e11d48', '#ca8a04'];

// --- QUY CHẾ ĐÀO TẠO TÍN CHỈ HUB ---
export const convertToHUBScale = (score10: any) => {
  const s = parseFloat(score10);
  if (isNaN(s)) return { letter: 'N/A', grade4: 0.0, group: 'N/A' };
  if (s >= 9.5) return { letter: 'A+', grade4: 4.0, group: 'Excellent' };
  if (s >= 9.0) return { letter: 'A',  grade4: 3.7, group: 'Excellent' };
  if (s >= 8.5) return { letter: 'A-', grade4: 3.4, group: 'Very Good' };
  if (s >= 8.0) return { letter: 'B+', grade4: 3.2, group: 'Very Good' };
  if (s >= 7.5) return { letter: 'B',  grade4: 3.0, group: 'Good' };
  if (s >= 7.0) return { letter: 'B-', grade4: 2.8, group: 'Good' };
  if (s >= 6.5) return { letter: 'C+', grade4: 2.6, group: 'Good' };
  if (s >= 6.0) return { letter: 'C',  grade4: 2.4, group: 'Average' };
  if (s >= 5.5) return { letter: 'C-', grade4: 2.2, group: 'Average' };
  if (s >= 5.0) return { letter: 'D+', grade4: 2.0, group: 'Average' };
  if (s >= 4.5) return { letter: 'D',  grade4: 1.8, group: 'Weak' };
  if (s >= 4.0) return { letter: 'D-', grade4: 1.6, group: 'Weak' };
  return { letter: 'F', grade4: 0.0, group: 'Fail' }; 
};

export const formatXAxis = (tickItem: any) => {
  if (typeof tickItem === 'string' && tickItem.length > 12) return tickItem.substring(0, 10) + '...';
  return tickItem;
};

interface DataContextType {
  sidebarOpen: boolean; setSidebarOpen: any;
  activeTab: number; setActiveTab: any;
  isMusicPlaying: boolean; toggleMusic: any;
  selectedFile: any; previewData: any[]; fullData: any[]; 
  loadingStatus: string; isLoading: boolean; statusType: string;
  stepDataChecked: boolean; stepProcessed: boolean; stepClustered: boolean;
  columnsInfo: any[]; totalRows: number; missingData: any;
  useHUBFormula: boolean; setUseHUBFormula: any;
  hubCols: any; setHubCols: any; mainScoreCol: string; setMainScoreCol: any;
  classCol: string; setClassCol: any; filterGrade: string; setFilterGrade: any;
  selectedStudentIdx: number; setSelectedStudentIdx: any;
  processMode: string; setProcessMode: any; scaleType: string; setScaleType: any;
  selectedScaleCols: string[]; setSelectedScaleCols: any;
  biData: any; corrMatrix: any; chartType: string; setChartType: any;
  xAxis: string; setXAxis: any; yAxis: string; setYAxis: any; aggFunc: string; setAggFunc: any;
  aiReport: string; chartInsight: string; autoConfigs: any[];
  kClusters: number; setKClusters: any; kmeansData: any; kmeansCols: string[]; setKmeansCols: any;
  modelType: string; setModelType: any; targetCol: string; setTargetCol: any;
  featureCols: string[]; setFeatureCols: any; modelMetrics: any;
  arimaDateCol: string; setArimaDateCol: any; arimaTargetCol: string; setArimaTargetCol: any;
  arimaSteps: number; setArimaSteps: any; arimaData: any;
  reportRef: any; chartRef: any;
  applyHUBScore: any; handleFileUpload: any; runCheckData: any; runProcessData: any;
  handleCleanData: any; handleAISummary: any; handleAutoDashboard: any; handleExportExcel: any;
  handleChartInsight: any; runKMeans: any; runTrainModel: any; runARIMA: any;
  exportFilteredExcel: any; exportPDF: any; parseMarkdown: any;
  kpiData: any; filteredTableData: any[]; statsData: any; boxplotData: any[];
  personalRadar: any; scatterWithTrend: any; autoDashboardDatasets: any[];
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export function DataProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const chartRef = useRef<HTMLDivElement>(null); 

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fullData, setFullData] = useState<any[]>([]); 
  const [loadingStatus, setLoadingStatus] = useState('THE SYSTEM IS READY TO RECEIVE DATA.');
  const [isLoading, setIsLoading] = useState(false); 
  const [statusType, setStatusType] = useState('success'); 
  const [stepDataChecked, setStepDataChecked] = useState(false);
  const [stepProcessed, setStepProcessed] = useState(false);
  const [stepClustered, setStepClustered] = useState(false);
  const [columnsInfo, setColumnsInfo] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [missingData, setMissingData] = useState<any>(null);
  const [useHUBFormula, setUseHUBFormula] = useState(true); 
  const [hubCols, setHubCols] = useState({ cc: '', btn: '', btcn: '', thi: '' });
  const [mainScoreCol, setMainScoreCol] = useState('');
  const [classCol, setClassCol] = useState('');
  const [filterGrade, setFilterGrade] = useState('All');
  const [selectedStudentIdx, setSelectedStudentIdx] = useState(0);
  const [processMode, setProcessMode] = useState('none');
  const [scaleType, setScaleType] = useState('none');
  const [selectedScaleCols, setSelectedScaleCols] = useState<string[]>([]);
  const [biData, setBiData] = useState<any>(null);
  const [corrMatrix, setCorrMatrix] = useState<any>(null);
  const [chartType, setChartType] = useState('Bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [aggFunc, setAggFunc] = useState('none');
  const [aiReport, setAiReport] = useState("");
  const [chartInsight, setChartInsight] = useState("");
  const [autoConfigs, setAutoConfigs] = useState<any[]>([]); 
  const [kClusters, setKClusters] = useState(3);
  const [kmeansData, setKmeansData] = useState<any>(null);
  const [kmeansCols, setKmeansCols] = useState<string[]>([]);   
  const [modelType, setModelType] = useState('rf');
  const [targetCol, setTargetCol] = useState('');
  const [featureCols, setFeatureCols] = useState<string[]>([]); 
  const [modelMetrics, setModelMetrics] = useState<any>(null);
  const [arimaDateCol, setArimaDateCol] = useState('');
  const [arimaTargetCol, setArimaTargetCol] = useState('');
  const [arimaSteps, setArimaSteps] = useState(5);
  const [arimaData, setArimaData] = useState<any>(null);

  const updateStatus = (msg: string, type = 'success') => { setLoadingStatus(msg); setStatusType(type); };

  // --- LOGIC HUB ---
  const applyHUBScore = () => {
    let newData: any[] = [];
    if (useHUBFormula) {
      const { cc, btn, btcn, thi } = hubCols;
      if (!cc || !btn || !btcn || !thi) return toast({ title: "Lack of information", description: "Please select all 4 columns..", variant: "destructive" });
      newData = fullData.map(row => {
        const s_cc = parseFloat(row[cc]) || 0; const s_btn = parseFloat(row[btn]) || 0;
        const s_btcn = parseFloat(row[btcn]) || 0; const s_thi = parseFloat(row[thi]) || 0;
        const total10 = (s_cc * 0.1 + s_btn * 0.2 + s_btcn * 0.2 + s_thi * 0.5).toFixed(2);
        const hubConv = convertToHUBScale(total10);
        return { ...row, TBM_He10: parseFloat(total10), TBM_He4: hubConv.grade4, Diem_Chu: hubConv.letter, Xep_Loai: hubConv.group };
      });
      setMainScoreCol('TBM_He10'); 
    } else {
      if (!mainScoreCol) return toast({ title: "Lack of information", description: "Please select the column in base 10..", variant: "destructive" });
      newData = fullData.map(row => {
        const total10 = parseFloat(row[mainScoreCol]);
        const hubConv = !isNaN(total10) ? convertToHUBScale(total10) : { letter: 'N/A', grade4: 0, group: 'N/A' };
        return { ...row, TBM_He10: isNaN(total10) ? 0 : total10, TBM_He4: hubConv.grade4, Diem_Chu: hubConv.letter, Xep_Loai: hubConv.group };
      });
    }
    setFullData(newData);
    updateStatus('Hub calculation successful!!', 'success');
  };

  const kpiData = useMemo(() => {
    if (!fullData.length || !fullData[0].hasOwnProperty('TBM_He10')) return { total: 0, mean10: 0, mean4: 0, passRate: 0, mode: 'N/A' };
    const scores10 = fullData.map(r => parseFloat(r['TBM_He10'])).filter(v => !isNaN(v));
    const total = scores10.length || fullData.length;
    const mean10 = scores10.length ? (scores10.reduce((a, b) => a + b, 0) / total).toFixed(2) : 0;
    const hubScores = scores10.map(s => convertToHUBScale(s));
    const mean4 = scores10.length ? (hubScores.reduce((acc, val) => acc + val.grade4, 0) / total).toFixed(2) : 0;
    const passRate = scores10.length ? ((hubScores.filter(v => v.grade4 >= 1.6).length / total) * 100).toFixed(1) : 0;
    return { total, mean10, mean4, passRate, mode: 'N/A' };
  }, [fullData]);

  const filteredTableData = useMemo(() => {
    if (filterGrade === 'All' || !fullData.length || !fullData[0].hasOwnProperty('Xep_Loai')) return fullData;
    return fullData.filter(row => row['Xep_Loai'] === filterGrade);
  }, [fullData, filterGrade]);

  const statsData = useMemo(() => {
  // Kiểm tra nếu chưa có dữ liệu hoặc chưa chọn cột Lớp
  if (!fullData.length || !classCol) return { hist: [], classif: [] };

  const bins: any = { 'F': 0, 'D-': 0, 'D': 0, 'D+': 0, 'C-': 0, 'C': 0, 'C+': 0, 'B-': 0, 'B': 0, 'B+': 0, 'A-': 0, 'A': 0, 'A+': 0 };
  const classMap: any = {};

  fullData.forEach(row => {
    // 1. Tính Histogram (Phân phối chung)
    const letter = row['Diem_Chu'];
    if (letter && bins[letter] !== undefined) {
      bins[letter]++;
    }

    // 2. Tính Stacked Bar (Theo lớp)
    const cls = String(row[classCol] || 'Khác'); // Ép kiểu string để tránh lỗi số
    const group = row['Xep_Loai'];

    if (!classMap[cls]) {
      classMap[cls] = { name: cls, count: 0, 'Excellent': 0, 'Very Good': 0, 'Good': 0, 'Average': 0, 'Weak': 0, 'Fail': 0 };
    }

    classMap[cls].count++;
    // Quan trọng: Key ở đây phải khớp 100% với chữ ở thẻ <Bar dataKey="..." /> bên Tab2
    if (classMap[cls][group] !== undefined) {
      classMap[cls][group]++;
    }
  });

  return { 
    hist: Object.keys(bins).map(k => ({ bin: k, count: bins[k] })), 
    classif: Object.values(classMap) 
  };
}, [fullData, classCol]);

  const boxplotData = useMemo(() => {
    if (!fullData.length || !fullData[0].hasOwnProperty('TBM_He4') || !classCol) return [];
    const classMap: any = {};
    fullData.forEach(row => {
      const s = row['TBM_He4']; const cls = row[classCol] || 'Unknown';
      if (s !== undefined && !isNaN(s)) { if (!classMap[cls]) classMap[cls] = []; classMap[cls].push(s); }
    });
    return Object.keys(classMap).map(cls => {
      const s = classMap[cls].sort((a:any, b:any) => a - b);
      return { name: cls, min: s[0], max: s[s.length-1], q1: s[Math.floor(s.length*0.25)], median: s[Math.floor(s.length*0.5)], q3: s[Math.floor(s.length*0.75)], boxRange: [s[Math.floor(s.length*0.25)], s[Math.floor(s.length*0.75)]], whiskerMin: [s[0], s[Math.floor(s.length*0.25)]], whiskerMax: [s[Math.floor(s.length*0.75)], s[s.length-1]] };
    });
  }, [fullData, classCol]);

  const personalRadar = useMemo(() => {
    if (!fullData.length || selectedStudentIdx >= fullData.length) return { data: [], warning: "", info: null };
    const numCols = columnsInfo.filter(c => c.type === 'number' && !['TBM_He10','TBM_He4'].includes(c.name)).map(c => c.name).slice(0, 6);
    const student = fullData[selectedStudentIdx];
    const data = numCols.map(col => ({ subject: col, studentScore: convertToHUBScale(student[col]).grade4, classAvg: convertToHUBScale(fullData.reduce((a, b) => a + (parseFloat(b[col]) || 0), 0) / fullData.length).grade4 }));
    return { data, warning: "✅ DATA IS READY", info: student };
  }, [fullData, selectedStudentIdx, columnsInfo]);

  const scatterWithTrend = useMemo(() => {
  // Bỏ điều kiện chartType !== 'Scatter' để Tab 4 luôn có dữ liệu nếu đã Process Data
  if (!biData || !xAxis || !yAxis || biData.length < 2) return { data: biData, trend: [] };
  
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0; 
  const n = biData.length; 
  let minX = Infinity, maxX = -Infinity;
  
  biData.forEach((d: any) => {
    const x = parseFloat(d[xAxis]); 
    const y = parseFloat(d[yAxis]);
    if (!isNaN(x) && !isNaN(y)) { 
      sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x; 
      minX = Math.min(minX, x); 
      maxX = Math.max(maxX, x); 
    }
  });

  // Tránh chia cho 0 nếu tất cả X bằng nhau
  const denominator = (n * sumX2 - sumX * sumX);
  if (denominator === 0) return { data: biData, trend: [] };

  const m = (n * sumXY - sumX * sumY) / denominator; 
  const b = (sumY - m * sumX) / n;
  
  return { 
    data: biData, 
    trend: [ 
      { [xAxis]: minX, [yAxis]: m * minX + b }, 
      { [xAxis]: maxX, [yAxis]: m * maxX + b } 
    ] 
  };
}, [biData, xAxis, yAxis]); // Bỏ chartType khỏi dependency

  const autoDashboardDatasets = useMemo(() => {
  if (!fullData.length || autoConfigs.length === 0) return [];
  return autoConfigs.map(config => {
    const { x: xCol, y: yCol, agg: aggFunc } = config; 
    const grouped: any = {};

    fullData.forEach(row => {
      const xVal = row[xCol] || 'Unknown';
      // Nếu là hàm đếm (count), chúng ta không cần quan tâm yVal có phải là số hay không
      const yVal = aggFunc === 'count' ? 1 : parseFloat(row[yCol]);

      if (!grouped[xVal]) grouped[xVal] = { sum: 0, count: 0 };
      
      if (aggFunc === 'count') {
        grouped[xVal].count += 1;
      } else if (!isNaN(yVal)) {
        grouped[xVal].sum += yVal;
        grouped[xVal].count += 1;
      }
    });

    const processed = Object.keys(grouped).map(key => {
      let finalY = 0;
      if (aggFunc === 'count') finalY = grouped[key].count;
      else if (aggFunc === 'sum') finalY = grouped[key].sum;
      else finalY = grouped[key].sum / grouped[key].count; // mặc định là mean

      return { 
        [xCol]: key, 
        [yCol]: parseFloat(finalY.toFixed(2)) 
      } as Record<string, any>;
    });

    return processed.sort((a: any, b: any) => b[yCol] - a[yCol]);
  });
}, [fullData, autoConfigs]);

  // --- AUDIO & UTILS ---
  useEffect(() => { 
    bgMusicRef.current = new Audio('/backgound.mp3'); 
    if(bgMusicRef.current) { bgMusicRef.current.loop = true; bgMusicRef.current.volume = 0.25; }
  }, []);

  const toggleMusic = () => {
    if (isMusicPlaying) bgMusicRef.current?.pause(); else bgMusicRef.current?.play().catch(() => {});
    setIsMusicPlaying(!isMusicPlaying);
  };

const parseMarkdown = (text: string) => {
  if (!text) return null;

  // 1. Chuẩn hóa dữ liệu: Khử sạch dấu **** và các khoảng trắng thừa
  const cleanText = text.replace(/\*\*\*\*/g, '').replace(/^[ \t]*[\*\-][ \t]+/gm, '* ');
  const lines = cleanText.split('\n');
  const elements: React.ReactNode[] = [];
  let currentTable: string[][] = [];
  let isInsideTable = false;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // XỬ LÝ BẢNG (Dựa trên ký tự |)
    if (trimmedLine.startsWith('|')) {
      isInsideTable = true;
      if (!trimmedLine.includes('---')) {
        const cells = trimmedLine
          .split('|')
          .filter((_, i, arr) => i > 0 && i < arr.length - 1)
          .map(c => c.trim().replace(/\*\*/g, '')); // Khử ** trong ô bảng
        if (cells.length > 0) currentTable.push(cells);
      }
      return;
    } 

    // Nếu dòng hiện tại không phải bảng nhưng trước đó đang trong bảng -> Render bảng
    if (isInsideTable && !trimmedLine.startsWith('|')) {
      if (currentTable.length > 0) {
        elements.push(renderTable(currentTable, `table-${index}`));
      }
      currentTable = [];
      isInsideTable = false;
    }

    // XỬ LÝ CÁC ĐỊNH DẠNG KHÁC
    if (!isInsideTable && trimmedLine !== '') {
      // Tiêu đề (### hoặc số thứ tự bôi đậm)
      if (trimmedLine.startsWith('###') || /^\d+\./.test(trimmedLine)) {
        const titleText = trimmedLine.replace('###', '').replace(/\*\*/g, '').trim();
        elements.push(
          <h3 key={index} className="text-lg font-black text-blue-800 mt-8 mb-4 border-l-4 border-blue-600 pl-3 uppercase tracking-tight">
            {titleText}
          </h3>
        );
      } 
      // Danh sách (Bullet points)
      else if (trimmedLine.startsWith('*')) {
        elements.push(
          <li key={index} className="ml-6 list-disc mb-2 text-slate-700 leading-relaxed marker:text-blue-500">
            {renderFormattedText(trimmedLine.substring(1).trim())}
          </li>
        );
      }
      // Đường phân cách
      else if (trimmedLine === '---') {
        elements.push(<hr key={index} className="my-6 border-slate-200" />);
      }
      // Văn bản thường
      else {
        elements.push(
          <p key={index} className="mb-4 text-slate-700 leading-relaxed text-justify">
            {renderFormattedText(trimmedLine)}
          </p>
        );
      }
    }
  });

  if (currentTable.length > 0) elements.push(renderTable(currentTable, 'table-final'));
  return elements;
};

// HÀM PHỤ: Biến **text** thành <strong>text</strong> và khử sạch dấu sao
const renderFormattedText = (text: string) => {
  if (!text) return '';
  // Tách chuỗi theo cặp **
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => 
    i % 2 === 1 ? <strong key={i} className="text-blue-900 font-bold">{part}</strong> : part
  );
};

// HÀM PHỤ: Dựng bảng chuyên nghiệp cho Data Science
const renderTable = (rows: string[][], key: string) => (
  <div key={key} className="my-6 overflow-hidden border border-slate-200 rounded-xl shadow-md">
    <table className="w-full text-sm border-collapse bg-white">
      <thead>
        <tr className="bg-slate-900 text-white">
          {rows[0].map((cell, i) => (
            <th key={i} className="p-3 text-left font-bold uppercase border-r border-slate-700 last:border-0">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((row, i) => (
          <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-blue-50/50 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="p-3 text-slate-700 border-r border-slate-100 last:border-0">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
  // --- API HANDLERS ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); updateStatus('ANALYZING...', 'warning');
      const reader = new FileReader();
      reader.onload = (evt) => {
        const rows = (evt.target?.result as string).split('\n').filter(r => r.trim());
        const headers = rows[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const parsed = rows.slice(1).map(row => {
          let obj: any = {}, vals: string[] = [], inQ = false, cur = "";
          for (let char of row) { if (char === '"') inQ = !inQ; else if (char === ',' && !inQ) { vals.push(cur); cur = ""; } else cur += char; }
          vals.push(cur);
          headers.forEach((h, i) => { obj[h] = !isNaN(parseFloat(vals[i])) && vals[i] !== '' ? parseFloat(vals[i]) : vals[i]?.trim(); });
          return obj;
        });
        setFullData(parsed); setPreviewData(parsed.slice(0, 5)); updateStatus('Upload successful.', 'success');
      };
      reader.readAsText(file);
    }
  };

  const runCheckData = async () => {
    setIsLoading(true); updateStatus('SCAN DATA...', 'warning');
    const fd = new FormData(); fd.append('file', selectedFile as Blob);
    try {
      const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.status === 'success') {
        setColumnsInfo(result.columns_info); setMissingData(result.missing_stats); setTotalRows(result.total_rows);
        const cats = result.columns_info.filter((c: any) => c.type === 'CHAR').map((c: any) => c.name);
        if (cats.length) setClassCol(cats[0]);
        setStepDataChecked(true); updateStatus('SCAN FINISH.', 'success');
      } else toast({ title: "Error", description: result.message, variant: "destructive" });
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const runProcessData = async () => {
    setIsLoading(true); updateStatus('PROCESSING...', 'warning');
    const fd = new FormData(); fd.append('file', selectedFile as Blob);
    fd.append('mode', processMode); fd.append('scale_type', scaleType); fd.append('scale_cols', selectedScaleCols.join(','));
    fd.append('group_by', xAxis); fd.append('agg_col', yAxis); fd.append('agg_func', aggFunc);
    try {
      const res = await fetch(`${API_URL}/api/process-data`, { method: 'POST', body: fd });
      const r = await res.json();
      if (r.status === 'success') { setBiData(r.data); setCorrMatrix(r.correlation); setStepProcessed(true); if(activeTab === 1) setActiveTab(5); updateStatus('XỬ LÝ XONG.', 'success'); }
    } catch (e) { toast({ title: "Error", description: "Error connecting API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const handleCleanData = async () => {
    setIsLoading(true); try {
      const fd = new FormData(); fd.append("file", selectedFile as Blob);
      const res = await fetch(`${API_URL}/api/clean-data`, { method: "POST", body: fd });
      const blob = await res.blob(); const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "Data_Sach.csv"; a.click();
      updateStatus('CLEAN DATA HAS BEEN DOWNLOADED.', 'success');
    } catch (e) { toast({ title: "Error", description: "Cleaning error", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const handleAISummary = async () => {
    setIsLoading(true); try {
      const fd = new FormData(); fd.append("file", selectedFile as Blob);
      const res = await fetch(`${API_URL}/api/ai-summary`, { method: "POST", body: fd });
      const d = await res.json(); setAiReport(d.ai_report); updateStatus('AI UPDATED.', 'success');
    } catch (e) { toast({ title: "Error AI", description: "Error API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const handleAutoDashboard = async () => {
    setIsLoading(true); try {
      const fd = new FormData(); fd.append("file", selectedFile as Blob);
      const res = await fetch(`${API_URL}/api/suggest-dashboard`, { method: "POST", body: fd });
      const d = await res.json(); setAutoConfigs(d.suggestions); updateStatus('DASHBOARD CREATED.', 'success');
    } catch (e) { toast({ title: "Error", description: "Error API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const handleExportExcel = async () => {
    setIsLoading(true); try {
      const fd = new FormData(); fd.append("file", selectedFile as Blob);
      const res = await fetch(`${API_URL}/api/export-excel`, { method: "POST", body: fd });
      const blob = await res.blob(); const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "Bao_Cao.xlsx"; a.click();
      updateStatus('EXPORTED TO EXCEL.', 'success');
    } catch (e) { toast({ title: "Error", description: "Error API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

const handleChartInsight = async () => {
  if (!chartRef.current) {
    return toast({ 
      title: "Error", 
      description: "Biểu đồ trống, không thể phân tích.", 
      variant: "destructive" 
    });
  }

  setIsLoading(true);
  updateStatus('AI IS QUESTING VISUAL PERCEPTION...', 'warning');

  try {
    // 1. Import động thư viện
    const html2canvasLib = (await import('html2canvas')).default;
    const element = chartRef.current;

    // 2. Tiến hành chụp ảnh biểu đồ
    const canvas = await html2canvasLib(element, {
      scale: 2, // Tăng scale lên 2 để AI nhìn rõ số liệu hơn
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Quét toàn bộ phần tử trong bản sao để xử lý màu lỗi
        const allElements = clonedDoc.querySelectorAll('*');
        const unsupportedColors = ['oklab', 'oklch', 'lab', 'lch'];

        allElements.forEach((el) => {
          const node = el as HTMLElement;
          const style = window.getComputedStyle(node);

          // Kiểm tra và ép màu chữ về mã HEX an toàn
          if (unsupportedColors.some(type => style.color.includes(type))) {
            node.style.setProperty('color', '#1e293b', 'important');
          }

          // Kiểm tra và ép màu nền (thanh biểu đồ, card...)
          if (unsupportedColors.some(type => style.backgroundColor.includes(type))) {
            // Nếu là nền của biểu đồ/thanh bar, ép về màu xanh chuẩn HUB hoặc trắng
            const isBar = node.classList.contains('recharts-bar-rectangle');
            node.style.setProperty('background-color', isBar ? '#1d4ed8' : '#ffffff', 'important');
          }

          // Kiểm tra và ép màu viền
          if (unsupportedColors.some(type => style.borderColor.includes(type))) {
            node.style.setProperty('border-color', '#e2e8f0', 'important');
          }

          // Triệt tiêu các hiệu ứng filter/blur hiện đại thường đi kèm màu lab gây lỗi render
          if (style.filter !== 'none' || style.backdropFilter !== 'none') {
            node.style.setProperty('filter', 'none', 'important');
            node.style.setProperty('backdrop-filter', 'none', 'important');
          }
        });
      }
    });

    // 3. Chuyển canvas thành Blob để gửi lên API
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error("Unable to generate image data from the chart.");

    const fd = new FormData();
    fd.append("file", blob, "chart_analysis.png");

    // 4. Gọi API AI Insight
    const res = await fetch(`${API_URL}/api/chart-insight`, { 
      method: "POST", 
      body: fd 
    });

    const d = await res.json();

    if (d.status === "success" || d.insight) {
      setChartInsight(d.insight);
      updateStatus('AI has finished its analysis.', 'success');
    } else {
      updateStatus(d.message || 'AI REFUSES TO ANALYZE', 'error');
    }

  } catch (error) {
    console.error("Image Rendering Error for AI:", error);
    updateStatus('VISUAL QUERY ERROR', 'error');
    toast({
      title: "System Error",
      description: "Unable to send chart data to AI. Please check your connection!",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};

  const runKMeans = async () => {
    if (kmeansCols.length < 2) return toast({ title: "Error", description: "Two variables are needed..", variant: "destructive" });
    setIsLoading(true); const fd = new FormData(); fd.append('file', selectedFile as Blob); 
    fd.append('scale_type', scaleType); fd.append('scale_cols', selectedScaleCols.join(',')); fd.append('kmeans_cols', kmeansCols.join(','));
    try {
      const res = await fetch(`${API_URL}/api/kmeans-pipeline?k=${kClusters}`, { method: 'POST', body: fd });
      const r = await res.json(); setKmeansData({ features: r.features, centers: r.centers, scatter: r.scatter_data }); setStepClustered(true); updateStatus('PHÂN CỤM XONG.', 'success');
    } catch (e) { toast({ title: "Error", description: "Error API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const runTrainModel = async () => {
    if (!targetCol || !featureCols.length) return toast({ title: "Error", description: "Missing X/Y.", variant: "destructive" });
    setIsLoading(true); const fd = new FormData(); fd.append('file', selectedFile as Blob);
    fd.append('target_col', targetCol); fd.append('feature_cols', featureCols.join(',')); fd.append('model_type', modelType);
    try {
      const res = await fetch(`${API_URL}/api/predict`, { method: 'POST', body: fd });
      const r = await res.json(); setModelMetrics(r.metrics); updateStatus('TRAINING COMPLETED.', 'success');
    } catch (e) { toast({ title: "Error", description: "Error API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const runARIMA = async () => {
    if (!arimaDateCol || !arimaTargetCol) return toast({ title: "Error", description: "Missing parameters.", variant: "destructive" });
    setIsLoading(true); const fd = new FormData(); fd.append('file', selectedFile as Blob);
    fd.append('date_col', arimaDateCol); fd.append('target_col', arimaTargetCol); fd.append('steps', arimaSteps.toString());
    try {
      const res = await fetch(`${API_URL}/api/forecast-arima`, { method: 'POST', body: fd });
      const r = await res.json(); setArimaData([...r.historical, ...r.predictions]); updateStatus('FORECAST COMPLETED.', 'success');
    } catch (e) { toast({ title: "Error", description: "Error API", variant: "destructive" }); } finally { setIsLoading(false); }
  };

  const exportFilteredExcel = () => {
    let csv = "data:text/csv;charset=utf-8,"; const heads = Object.keys(filteredTableData[0]); csv += heads.join(",") + "\r\n";
    filteredTableData.forEach(r => csv += heads.map(h => r[h]).join(",") + "\r\n");
    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = "Loc_Data.csv"; link.click();
  };

  const exportPDF = async () => {
    if (typeof window === 'undefined') return;
    updateStatus('Creating a print copy...', 'warning');
    const element = reportRef.current;
    if (!element) return;

    try {
      // Import động thư viện mới và jsPDF
      const [htmlToImage, jspdfLib] = await Promise.all([
        import('html-to-image'),
        import('jspdf')
      ]);
      const jsPDF = jspdfLib.jsPDF;

      // html-to-image chụp ảnh trực tiếp bằng engine của trình duyệt (Dẹp tan mọi lỗi lab/oklab)
      const dataUrl = await htmlToImage.toJpeg(element, { 
        quality: 0.95, 
        backgroundColor: '#ffffff',
        // Bỏ qua các hình ảnh bị lỗi CORS nếu có
        skipFonts: false,
      });

      updateStatus('PACKAGING PDF...', 'warning');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); 
      
      // Tạo một đối tượng ảnh để lấy tỷ lệ thật
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight); 
      pdf.save('Bao_Cao_HUB_ThanhCong.pdf');
      
      updateStatus('ĐÃ XUẤT PDF THÀNH CÔNG 🎉', 'success');
    } catch (error) {
      console.error("Error export PDF:", error);
      updateStatus('Error RENDER', 'error');
      // Lỡ có lỗi thì vẫn phải dọn dẹp sạch sẽ
      const cleanup = document.querySelectorAll('[data-tx-id]');
      cleanup.forEach(el => el.removeAttribute('data-tx-id'));
    }
  };
  return (
    <DataContext.Provider value={{
      sidebarOpen, setSidebarOpen, activeTab, setActiveTab, isMusicPlaying, toggleMusic,
      selectedFile, previewData, fullData, loadingStatus, isLoading, statusType,
      stepDataChecked, stepProcessed, stepClustered, columnsInfo, totalRows, missingData,
      useHUBFormula, setUseHUBFormula, hubCols, setHubCols, mainScoreCol, setMainScoreCol,
      classCol, setClassCol, filterGrade, setFilterGrade, selectedStudentIdx, setSelectedStudentIdx,
      processMode, setProcessMode, scaleType, setScaleType, selectedScaleCols, setSelectedScaleCols,
      biData, corrMatrix, chartType, setChartType, xAxis, setXAxis, yAxis, setYAxis, aggFunc, setAggFunc,
      aiReport, chartInsight, autoConfigs,
      kClusters, setKClusters, kmeansData, kmeansCols, setKmeansCols,
      modelType, setModelType, targetCol, setTargetCol, featureCols, setFeatureCols, modelMetrics,
      arimaDateCol, setArimaDateCol, arimaTargetCol, setArimaTargetCol, arimaSteps, setArimaSteps, arimaData,
      reportRef, chartRef,
      applyHUBScore, handleFileUpload, runCheckData, runProcessData, handleCleanData,
      handleAISummary, handleAutoDashboard, handleExportExcel, handleChartInsight,
      runKMeans, runTrainModel, runARIMA, exportFilteredExcel, exportPDF, parseMarkdown,
      kpiData, filteredTableData, statsData, boxplotData, personalRadar, scatterWithTrend, autoDashboardDatasets
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useDataContext = () => useContext(DataContext);
export const useData = () => useDataContext();