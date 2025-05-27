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
  { value: "cultural", label: "文艺青年", description: "咖啡馆、书店、艺术馆、文创园区", icon: "🎨" },
  { value: "foodie", label: "美食探索", description: "当地小吃、特色餐厅、夜市美食", icon: "🍜" },
  { value: "historical", label: "历史文化", description: "博物馆、古迹、传统建筑、文化遗产", icon: "🏛️" },
  { value: "nature", label: "自然风光", description: "公园、山水、户外活动、风景名胜", icon: "🌿" },
  { value: "nightlife", label: "夜生活", description: "酒吧、夜市、娱乐场所、夜景", icon: "🌃" },
  { value: "shopping", label: "购物血拼", description: "商场、市集、特产、潮流店铺", icon: "🛍️" },
  { value: "relaxed", label: "极简休闲", description: "放松、慢节奏、简单行程、度假风", icon: "☕" },
]

const featuredDestinations = [
  {
    name: "古都京城",
    image: "🏛️",
    description: "探索千年历史文化，体验传统与现代的完美融合",
    avgBudget: "¥800/天"
  },
  {
    name: "魔都上海",
    image: "🌃",
    description: "感受国际大都市的繁华，享受多元文化碰撞",
    avgBudget: "¥600/天"
  },
  {
    name: "天府成都",
    image: "🌶️",
    description: "品味地道川菜文化，体验悠闲慢生活节奏",
    avgBudget: "¥400/天"
  }
]

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
  const [budget, setBudget] = useState("")
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

    if (Number.parseInt(budget) < 100) {
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
          budget: budget,
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
          budget: budget,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 relative overflow-hidden">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif tracking-wide">
              穷游去哪玩儿
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light italic tracking-wider">
              用最低预算，看最美世界
            </p>
          </div>

          {/* Planning Form */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-2xl">
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6" />
                <span>开始规划你的穷游之旅</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* 进度条 */}
              {isGenerating && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">正在生成您的专属攻略...</span>
                    <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-3 text-blue-600">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span className="text-sm">AI正在为您量身定制旅行方案...</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 城市选择 */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    目的地城市
                  </Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                      <SelectValue placeholder="选择你想去的城市" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {popularCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 预算输入 */}
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-gray-700 font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                    预算
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="1000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-8 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* 旅游天数 */}
                <div className="space-y-2">
                  <Label htmlFor="days" className="text-gray-700 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    旅游天数
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="3"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                  />
                </div>

                {/* 旅行风格 */}
                <div className="space-y-2">
                  <Label htmlFor="style" className="text-gray-700 font-medium flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-blue-500" />
                    旅行风格
                  </Label>
                  <Select value={travelStyle} onValueChange={setTravelStyle}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                      <SelectValue placeholder="选择你的旅行风格" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {travelStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.icon} {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 选中风格的描述 */}
              {selectedStyleInfo && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <span className="mr-2">{selectedStyleInfo.icon}</span>
                    {selectedStyleInfo.label}
                  </h4>
                  <p className="text-blue-700 text-sm">{selectedStyleInfo.description}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerateGuide}
                disabled={isGenerating || !selectedCity || !budget || !days || !travelStyle}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    正在生成个性化攻略...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    生成专属穷游攻略
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Generated Guide */}
      {guide && (
        <section className="container mx-auto px-6 py-6 relative z-10">
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
      <div className="fixed bottom-0 left-0 w-full h-1/3 opacity-40 pointer-events-none z-0">
        <div className="wave-container">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="m-160,44c30,0 58,-18 88,-18s 58,18 88,18 58,-18 88,-18 58,18 88,18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(59, 130, 246, 0.7)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(96, 165, 250, 0.5)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(147, 197, 253, 0.3)" />
              <use href="#gentle-wave" x="48" y="7" fill="rgba(186, 230, 253, 0.1)" />
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

        @media (max-width: 768px) {
          .waves {
            min-height: 150px;
          }
        }
      `}</style>
    </div>
  )
}
