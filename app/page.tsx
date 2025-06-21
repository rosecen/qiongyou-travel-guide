"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Wallet, Sparkles, Loader2, Calendar, Palette, DollarSign, Clock, Heart, Star, Crown, Zap } from "lucide-react"
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
    <div className="min-h-screen relative overflow-hidden">
      {/* 世界级奢华背景 */}
      <div className="absolute inset-0">
        {/* 主背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* 动态光效层 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-amber-500/25 to-orange-500/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        {/* 星空效果 */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* 网格纹理 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* 世界级Hero Section */}
          <div className="text-center mb-24 animate-in fade-in duration-1000">
            <div className="mb-12">
              {/* 皇冠图标 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Crown className="h-16 w-16 text-yellow-400 animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-8xl font-black tracking-tight mb-6 leading-none">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  穷游去哪玩
                </span>
              </h1>
              
              {/* 世界第一标识 */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-lg animate-bounce">
                  🏆 WORLD'S #1 TRAVEL PLANNER 🏆
                </div>
              </div>
              
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mx-auto mb-8 animate-pulse"></div>
              
              <p className="text-3xl font-light text-white/90 tracking-wide mb-4">
                用最低预算，看最美世界
              </p>
              
              <p className="text-xl text-purple-200 font-light">
                ✨ 世界级AI驱动 · 奢华体验设计 · 无与伦比的智能推荐 ✨
              </p>
            </div>
          </div>

          {/* 世界级Planning Form */}
          <div className="space-y-16">
            {/* 进度条 */}
            {isGenerating && (
              <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-purple-500/30 animate-in slide-in-from-top duration-500">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-2xl font-medium text-white flex items-center">
                    <Zap className="mr-3 h-8 w-8 text-yellow-400 animate-pulse" />
                    正在生成您的专属奢华攻略
                  </span>
                  <span className="text-2xl text-yellow-400 font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-8 text-white/80">
                  <Loader2 className="mr-4 h-8 w-8 animate-spin text-yellow-400" />
                  <span className="font-light text-xl">世界级AI正在为您量身定制奢华旅行方案</span>
                </div>
              </div>
            )}

            {/* 想去的城市 */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 delay-200">
              <h2 className="text-5xl font-bold text-center tracking-wide">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  想去的城市
                </span>
              </h2>
              <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-cyan-500/20">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-full h-20 text-2xl border-0 bg-slate-800/50 focus:bg-slate-700/50 rounded-2xl transition-all duration-300 hover:bg-slate-700/50 text-white">
                    <SelectValue placeholder="🌍 选择您的梦想目的地" className="text-white/80 font-light" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl bg-slate-800/95 backdrop-blur-xl">
                    {popularCities.map((city) => (
                      <SelectItem key={city} value={city} className="text-xl py-4 font-light hover:bg-slate-700/50 rounded-xl text-white">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 旅游天数 */}
            <div className="space-y-8 animate-in slide-in-from-right duration-700 delay-300">
              <h2 className="text-5xl font-bold text-center tracking-wide">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  旅游天数
                </span>
              </h2>
              <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-emerald-500/30">
                <div className="grid grid-cols-3 gap-6">
                  {dayOptions.map((day) => (
                    <button
                      key={day}
                      onClick={() => setDays(day.toString())}
                      className={`h-20 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-110 ${
                        days === day.toString()
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/50"
                          : "bg-slate-800/50 text-white/80 hover:bg-slate-700/50 hover:shadow-xl border border-emerald-500/20"
                      }`}
                    >
                      {day} 天
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 旅行风格 */}
            <div className="space-y-8 animate-in slide-in-from-left duration-700 delay-400">
              <h2 className="text-5xl font-bold text-center tracking-wide">
                <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                  旅行风格
                </span>
              </h2>
              <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-pink-500/30">
                <div className="grid grid-cols-2 gap-8">
                  {travelStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setTravelStyle(style.value)}
                      className={`p-8 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                        travelStyle === style.value
                          ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-2xl shadow-pink-500/50"
                          : "bg-slate-800/50 text-white/80 hover:bg-slate-700/50 hover:shadow-xl border border-pink-500/20"
                      }`}
                    >
                      <div className="text-4xl mb-4">{style.icon}</div>
                      <h3 className="font-bold text-2xl mb-3">{style.label}</h3>
                      <p className={`text-lg font-light ${
                        travelStyle === style.value ? "text-white/90" : "text-white/60"
                      }`}>
                        {style.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 预算设置 */}
            <div className="space-y-8 animate-in slide-in-from-right duration-700 delay-500">
              <h2 className="text-5xl font-bold text-center tracking-wide">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  预算设置
                </span>
              </h2>
              <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-amber-500/30">
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="text-6xl font-black text-white mb-4">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        ¥{budget.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-white/60 font-light text-xl">预计总预算</p>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full appearance-none cursor-pointer luxury-slider"
                      style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #ea580c ${((budget - 100) / (10000 - 100)) * 100}%, #374151 ${((budget - 100) / (10000 - 100)) * 100}%, #374151 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="text-center pt-12 animate-in slide-in-from-bottom duration-700 delay-600">
              <button
                onClick={handleGenerateGuide}
                disabled={isGenerating || !selectedCity || !budget || !days || !travelStyle}
                className="group relative px-16 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center">
                  <Crown className="mr-4 h-8 w-8" />
                  {isGenerating ? "生成中..." : "🚀 生成世界级穷游攻略 🚀"}
                  <Sparkles className="ml-4 h-8 w-8 animate-spin" />
                </div>
              </button>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-900/40 backdrop-blur-xl border border-red-500/50 text-red-200 px-8 py-6 rounded-2xl text-center font-light text-xl animate-in slide-in-from-top duration-300">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 生成结果 */}
      {guide && (
        <div className="py-8 animate-in slide-in-from-bottom duration-1000">
          <TravelGuideComponent 
            city={guide.city}
            budget={guide.budget}
            days={guide.days}
            style={guide.style}
            data={guide.data}
          />
        </div>
      )}

      {/* 世界级底部装饰 */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="luxury-wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#ec4899" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="75%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            fill="url(#luxury-wave-gradient)"
            d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,213.3C960,224,1056,192,1152,176L1200,160L1200,320L1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            className="animate-pulse"
          />
        </svg>
      </div>

      <style jsx>{`
        .luxury-slider::-webkit-slider-thumb {
          appearance: none;
          height: 32px;
          width: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.6);
          transition: all 0.3s ease;
          border: 3px solid #fff;
        }
        
        .luxury-slider::-webkit-slider-thumb:hover {
          transform: scale(1.3);
          box-shadow: 0 12px 32px rgba(245, 158, 11, 0.8);
        }
        
        .luxury-slider::-moz-range-thumb {
          height: 32px;
          width: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          cursor: pointer;
          border: 3px solid #fff;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.6);
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-from-left {
          from { opacity: 0; transform: translateX(-80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-from-right {
          from { opacity: 0; transform: translateX(80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-from-top {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-from-bottom {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
        
        .slide-in-from-left {
          animation-name: slide-in-from-left;
        }
        
        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }
        
        .slide-in-from-top {
          animation-name: slide-in-from-top;
        }
        
        .slide-in-from-bottom {
          animation-name: slide-in-from-bottom;
        }
      `}</style>
    </div>
  )
}
