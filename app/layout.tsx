import type { Metadata } from 'next'
import './globals.css'
import { StagewiseDevToolbar } from '@/components/stagewise-toolbar'

export const metadata: Metadata = {
  title: '穷游去哪玩儿 - 世界第一的旅游攻略生成器',
  description: '世界级AI为你定制专属的穷游攻略，用最少的钱体验最丰富的旅程',
  generator: '穷游去哪玩儿 - 世界第一',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
        <StagewiseDevToolbar />
      </body>
    </html>
  )
}
