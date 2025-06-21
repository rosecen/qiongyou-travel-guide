'use client'

import { useEffect, useState } from 'react'

const stagewiseConfig = {
  plugins: [
    {
      name: 'travel-guide-context',
      description: '为旅游攻略网站提供上下文信息',
      shortInfoForPrompt: () => {
        return "这是一个世界级的穷游旅行攻略生成网站，用户可以选择城市、预算、天数和旅行风格来生成个性化攻略"
      },
      mcp: null,
      actions: [
        {
          name: '生成攻略',
          description: '触发攻略生成功能',
          execute: () => {
            const button = document.querySelector('button[type="button"]') as HTMLButtonElement
            if (button && button.textContent?.includes('生成')) {
              button.click()
            }
          },
        },
      ],
    },
  ],
}

export function StagewiseDevToolbar() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // 只在开发模式初始化
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      if (!window.__stagewise_initialized) {
        // 模拟stagewise初始化
        console.log('Stagewise开发工具已初始化 - 世界级旅游网站')
        window.__stagewise_initialized = true
      }
    }
  }, [isClient])

  return null
}

// 扩展window类型
declare global {
  interface Window {
    __stagewise_initialized?: boolean
  }
} 