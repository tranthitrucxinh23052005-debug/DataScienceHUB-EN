import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { DataProvider } from '@/lib/data-context' // Đảm bảo đúng đường dẫn tới bộ não
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'DS Portal - Faculty of Data Science HUB',
  description: 'Hệ thống phân tích dữ liệu khảo thí - Dự án nghiên cứu khoa học HUB',
  generator: 'v0.app',
  icons: {
    // TX chỉ cần trỏ thẳng vào file ảnh đã bỏ trong thư mục public
    icon: '/logo.png', 
    shortcut: '/logo.png',
    apple: '/logo.png', // Hoặc file apple-icon.png nếu có
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning giúp bỏ qua lỗi do Extension trình duyệt chèn code lạ
    <html lang="en" suppressHydrationWarning> 
      <body className={`${inter.variable} ${inter.className} font-sans antialiased`}>
        {/* Bọc DataProvider ở đây để toàn bộ các trang và Tab đều dùng chung được bộ não */}
        <DataProvider>
          {children}
        </DataProvider>
        
        {/* Chỉ bật Analytics khi chạy trên môi trường thật */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}