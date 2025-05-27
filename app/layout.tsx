import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '穷游去哪玩儿 - 用最低预算，看最美世界',
  description: '让AI为你定制专属的穷游攻略，用最少的钱体验最丰富的旅程',
  generator: '穷游去哪玩儿',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
