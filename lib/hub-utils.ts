// lib/hub-utils.ts

// --- CÁC ĐỊNH NGHĨA KIỂU DỮ LIỆU (INTERFACE) ---

export type ColumnInfo = {
  name: string;
  type: 'SỐ' | 'CHỮ';
  nan_count: number;
};

export type DataRow = Record<string, any>;

export type MissingData = {
  column: string;
  System_NaN: number;
  User_Miss: number;
};

export type KMeansData = {
  features: string[];
  centers: number[][];
  scatter: any[];
};

export type ModelMetrics = {
  r2: number;
  mae: number;
  mse: number;
};

export type AutoConfig = {
  title: string;
  type: 'Bar' | 'Line' | 'Pie';
  x: string;
  y: string;
  agg?: string;
};

// Thêm cái này cho Tab 2 (Statistics)
export type BoxPlotItem = {
  name: string;
  min: number;
  max: number;
  q1: number;
  median: number;
  q3: number;
  boxRange: number[];
  whiskerMin: number[];
  whiskerMax: number[];
};

// Thêm cái này cho Tab 4 (Radar)
export type RadarData = {
  subject: string;
  studentScore: number;
  classAvg: number;
};

// --- CÁC HẰNG SỐ & HÀM TIỆN ÍCH (HELPER) ---

export const API_URL = "https://tieuthetunhacongdang-tx-data-analytics-api.hf.space";

export const COLORS = ['#1d4ed8', '#059669', '#d97706', '#7c3aed', '#db2777', '#0d9488', '#e11d48', '#ca8a04'];

export const THEME = {
  bgBase: '#ffffff',          
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

// Quy chế đào tạo tín chỉ HUB
export const convertToHUBScale = (score10: number | string) => {
  const s = parseFloat(String(score10));
  if (isNaN(s)) return { letter: 'N/A', grade4: 0.0, group: 'N/A' };
  if (s >= 9.5) return { letter: 'A+', grade4: 4.0, group: 'Xuất sắc' };
  if (s >= 9.0) return { letter: 'A',  grade4: 3.7, group: 'Xuất sắc' };
  if (s >= 8.5) return { letter: 'A-', grade4: 3.4, group: 'Giỏi' };
  if (s >= 8.0) return { letter: 'B+', grade4: 3.2, group: 'Giỏi' };
  if (s >= 7.5) return { letter: 'B',  grade4: 3.0, group: 'Khá' };
  if (s >= 7.0) return { letter: 'B-', grade4: 2.8, group: 'Khá' };
  if (s >= 6.5) return { letter: 'C+', grade4: 2.6, group: 'Khá' };
  if (s >= 6.0) return { letter: 'C',  grade4: 2.4, group: 'Trung Bình' };
  if (s >= 5.5) return { letter: 'C-', grade4: 2.2, group: 'Trung Bình' };
  if (s >= 5.0) return { letter: 'D+', grade4: 2.0, group: 'Trung Bình' };
  if (s >= 4.5) return { letter: 'D',  grade4: 1.8, group: 'Yếu' };
  if (s >= 4.0) return { letter: 'D-', grade4: 1.6, group: 'Yếu' };
  return { letter: 'F', grade4: 0.0, group: 'Kém' }; 
};

export const formatXAxis = (tickItem: string | number) => {
  if (typeof tickItem === 'string' && tickItem.length > 12) return tickItem.substring(0, 10) + '...';
  return String(tickItem);
};