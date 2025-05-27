"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Wallet, Sparkles, Loader2, Calendar, Palette, DollarSign, Clock, Heart } from "lucide-react"
import TravelGuideComponent from "@/components/travel-guide"

const popularCities = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "南京",
  "苏州",
  "成都",
  "重庆",
  "西安",
  "厦门",
  "青岛",
  "大连",
  "天津",
  "武汉",
  "长沙",
  "昆明",
  "丽江",
  "桂林",
  "三亚",
]

const travelStyles = [
  { value: "cultural", label: "文化历史", description: "探索古迹，体验传统文化", icon: "🏛️" },
  { value: "nature", label: "自然风光", description: "亲近自然，享受户外时光", icon: "🏔️" },
  { value: "foodie", label: "美食探索", description: "品尝地道美食，寻找小众餐厅", icon: "🍜" },
  { value: "photography", label: "摄影打卡", description: "寻找美景，记录旅行回忆", icon: "📸" },
  { value: "adventure", label: "冒险体验", description: "挑战自我，体验刺激活动", icon: "🎒" },
  { value: "relaxed", label: "休闲度假", description: "放松身心，慢节奏旅行", icon: "🌴" },
]

const dayOptions = [1, 2, 3, 4, 5, 6, 7, 10, 14]

interface TravelGuide {
  city: string
  budget: string
  days: string
  style: string
  data: any
  timestamp: number
}

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("")
  const [budget, setBudget] = useState(1000)
  const [days, setDays] = useState("")
  const [travelStyle, setTravelStyle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [guide, setGuide] = useState<TravelGuide | null>(null)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const handleGenerateGuide = async () => {
    if (!selectedCity || !budget || !days || !travelStyle) {
      setError("请填写完整的旅行信息")
      return
    }

    if (Number.parseInt(days) < 1 || Number.parseInt(days) > 30) {
      setError("旅游天数请设置在1-30天之间")
      return
    }

    if (budget < 100) {
      setError("预算至少需要100元")
      return
    }

    setIsGenerating(true)
    setError("")
    setProgress(0)

    // 模拟进度条动画
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      const response = await fetch("/api/generate-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: selectedCity,
          budget: budget.toString(),
          days: days,
          style: travelStyle,
        }),
      })

      const data = await response.json()

      // 检查新的响应格式
      if (!response.ok || !data.success) {
        throw new Error(data.error || "生成攻略失败")
      }

      setProgress(100)
      
      setTimeout(() => {
        const newGuide: TravelGuide = {
          city: selectedCity,
          budget: budget.toString(),
          days: days,
          style: travelStyle,
          data: data.guide,
          timestamp: Date.now(),
        }

        setGuide(newGuide)

        // 保存到 localStorage
        const savedGuides = JSON.parse(localStorage.getItem("travelGuides") || "[]")
        savedGuides.unshift(newGuide)
        localStorage.setItem("travelGuides", JSON.stringify(savedGuides.slice(0, 10))) // 只保存最近10条
        
        clearInterval(progressInterval)
        setProgress(0)
      }, 500)
    } catch (err: any) {
      setError(err.message || "生成攻略时出现错误，请重试")
      console.error("Guide generation error:", err)
      clearInterval(progressInterval)
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedStyleInfo = travelStyles.find((style) => style.value === travelStyle)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">穷游去哪玩</h1>
              <div className="text-3xl">✈️</div>
            </div>
            <p className="text-lg text-gray-600 font-light">
              用最低预算，看最美世界
            </p>
          </div>

          {/* Planning Form */}
          <div className="space-y-6">
            {/* 进度条 */}
            {isGenerating && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-medium text-gray-700">正在生成您的专属攻略...</span>
                  <span className="text-base text-orange-600 font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-3 text-gray-600">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-orange-500" />
                  <span className="text-sm">AI正在为您量身定制旅行方案...</span>
                </div>
              </div>
            )}

            {/* 想去的城市 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 text-center">想去的城市</h2>
              <div className="bg-white rounded-2xl p-5 shadow-lg">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full h-12 text-base border-2 border-orange-200 focus:border-orange-400 rounded-xl bg-orange-50">
                    <SelectValue placeholder="上海" className="text-gray-600" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {popularCities.map((city) => (
                      <SelectItem key={city} value={city} className="text-base py-2">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 旅游天数 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 text-center">旅游天数</h2>
              <div className="grid grid-cols-3 gap-3">
                {dayOptions.map((day) => (
                  <button
                    key={day}
                    onClick={() => setDays(day.toString())}
                    className={`h-16 rounded-xl border-2 transition-all duration-200 ${
                      days === day.toString()
                        ? 'bg-red-500 border-red-500 text-white shadow-lg'
                        : 'bg-white border-orange-200 text-gray-600 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-xl font-bold">{day}</div>
                    <div className="text-xs opacity-80">天</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 旅行风格 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 text-center">旅行风格</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {travelStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setTravelStyle(style.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      travelStyle === style.value
                        ? 'bg-red-50 border-red-500 shadow-lg'
                        : 'bg-white border-orange-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{style.icon}</div>
                      <div className="text-lg font-semibold text-gray-800">{style.label}</div>
                    </div>
                    <div className="text-sm text-gray-600">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 旅行预算 */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 text-center">旅行预算</h2>
              <div className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-red-500">¥{budget}</div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">舒适型</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="200"
                    max="3000"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-red-400 to-cyan-400 rounded-full appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>¥200</span>
                    <span>¥3000</span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-gray-700 font-medium">精确预算：</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-24 px-3 py-1 text-sm border-2 border-orange-200 rounded-lg focus:border-orange-400 outline-none"
                    />
                    <span className="text-sm text-gray-600">元</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm">
                {error}
              </div>
            )}

            {/* 生成按钮 */}
            <div className="text-center pt-2">
              <button
                onClick={handleGenerateGuide}
                disabled={isGenerating || !selectedCity || !budget || !days || !travelStyle}
                className="w-full max-w-md px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                    正在生成个性化攻略...
                  </>
                ) : (
                  <>
                    生成专属穷游攻略
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Generated Guide */}
      {guide && (
        <section className="container mx-auto px-6 py-3 relative z-10">
          <div className="max-w-4xl mx-auto">
            <TravelGuideComponent
              city={guide.city}
              budget={guide.budget}
              days={guide.days}
              style={guide.style}
              data={guide.data}
            />
          </div>
        </section>
      )}

      {/* 海浪动态背景 - 底部 */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 opacity-30 pointer-events-none z-0">
        <div className="wave-container">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="m-160,44c30,0 58,-18 88,-18s 58,18 88,18 58,-18 88,-18 58,18 88,18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(251, 146, 60, 0.7)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(252, 176, 64, 0.5)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(253, 186, 116, 0.3)" />
              <use href="#gentle-wave" x="48" y="7" fill="rgba(254, 215, 170, 0.1)" />
            </g>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .waves {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          min-height: 200px;
        }

        .parallax > use {
          animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
        }

        .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
        }

        .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
        }

        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }

        .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
        }

        @keyframes move-forever {
          0% {
            transform: translate3d(-90px,0,0);
          }
          100% { 
            transform: translate3d(85px,0,0);
          }
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #ef4444;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: white;
          border: 3px solid #ef4444;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
          .waves {
            min-height: 150px;
          }
        }
      `}</style>
    </div>
  )
}
