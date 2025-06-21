"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Wallet, Clock, Star, Utensils, Bed, Lightbulb, Camera, Navigation, Heart, Crown } from "lucide-react"
import WeatherForecast from "./weather-forecast"

interface TravelGuideData {
  cityOverview?: {
    title: string
    description: string
    highlights: string[]
  }
  budgetBreakdown?: {
    title: string
    total: number
    items: Array<{
      category: string
      amount: number
      percentage: number
      description: string
    }>
  }
  itinerary?: {
    title: string
    days: Array<{
      day: number
      theme: string
      activities: Array<{
        time: string
        activity: string
        cost: string
        tips: string
      }>
    }>
  }
  attractions?: {
    title: string
    items: Array<{
      name: string
      cost: string
      rating: string
      description: string
      tips: string
    }>
  }
  food?: {
    title: string
    items: Array<{
      name: string
      price: string
      location: string
      description: string
    }>
  }
  accommodation?: {
    title: string
    items: Array<{
      type: string
      priceRange: string
      location: string
      features: string[]
    }>
  }
  tips?: {
    title: string
    items: string[]
  }
  rawContent?: string
}

interface TravelGuideProps {
  city: string
  budget: string
  days: string
  style: string
  data: TravelGuideData
}

const styleLabels = {
  cultural: { label: "文艺青年", icon: "🎨" },
  foodie: { label: "美食探索", icon: "🍜" },
  historical: { label: "历史文化", icon: "🏛️" },
  nature: { label: "自然风光", icon: "🌿" },
  nightlife: { label: "夜生活", icon: "🌃" },
  shopping: { label: "购物血拼", icon: "🛍️" },
  relaxed: { label: "极简休闲", icon: "☕" },
}

const categoryIcons = {
  transportation: Navigation,
  food: Utensils,
  accommodation: Bed,
  activities: Heart,
}

const categoryColors = {
  transportation: "bg-orange-100 text-orange-800",
  food: "bg-amber-100 text-amber-800",
  accommodation: "bg-yellow-100 text-yellow-800",
  activities: "bg-red-100 text-red-800",
}

// 货币格式化函数
const formatCurrency = (text: string): string => {
  // 移除"元"字，只保留¥符号
  return text.replace(/¥(\d+)元/g, '¥$1').replace(/(\d+)元/g, '¥$1')
}

// 星级评分组件
const StarRating = ({ rating }: { rating: string }) => {
  // 解析评分，支持多种格式
  let numericRating = 0
  
  if (rating.includes('★')) {
    // 计算★的数量
    numericRating = (rating.match(/★/g) || []).length
  } else if (rating.includes('/')) {
    // 处理 "4.5/5" 格式
    const match = rating.match(/(\d+\.?\d*)\s*\/\s*(\d+)/)
    if (match) {
      numericRating = (parseFloat(match[1]) / parseFloat(match[2])) * 5
    }
  } else if (rating.includes('分')) {
    // 处理 "4.5分" 格式
    const match = rating.match(/(\d+\.?\d*)分/)
    if (match) {
      numericRating = parseFloat(match[1])
    }
  } else {
    // 尝试直接解析数字
    const parsed = parseFloat(rating)
    if (!isNaN(parsed)) {
      numericRating = parsed > 5 ? parsed / 2 : parsed // 如果大于5，假设是10分制
    }
  }
  
  // 确保评分在0-5之间
  numericRating = Math.max(0, Math.min(5, numericRating))
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= numericRating
              ? 'text-yellow-500 fill-current'
              : star - 0.5 <= numericRating
              ? 'text-yellow-500 fill-current opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">
        {numericRating.toFixed(1)}
      </span>
    </div>
  )
}

export default function TravelGuide({ city, budget, days, style, data }: TravelGuideProps) {
  // 如果是原始内容，显示简单格式
  if (data.rawContent) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden border border-purple-500/30">
            <CardHeader className="bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <CardTitle className="text-3xl font-bold text-white tracking-wide flex items-center">
                <Crown className="mr-4 h-8 w-8 text-yellow-400" />
                {city} 世界级穷游攻略 (预算: ¥{budget})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-white/90 leading-relaxed font-light text-lg">
                  {formatCurrency(data.rawContent)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 城市概况卡片 */}
        {data.cityOverview && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-purple-500/20 transition-all duration-500 border border-purple-500/30">
            <CardHeader className="bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <MapPin className="h-8 w-8 text-cyan-400" />
                <span className="text-3xl font-bold tracking-wide">
                  {city} · {data.cityOverview.title}
                </span>
                <div className="flex items-center space-x-3 ml-auto">
                  <span className="text-2xl">{styleLabels[style as keyof typeof styleLabels]?.icon}</span>
                  <span className="text-lg font-light text-cyan-200">{styleLabels[style as keyof typeof styleLabels]?.label}</span>
                  <span className="text-lg font-light text-cyan-200">· {days}天</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <p className="text-white/90 mb-8 leading-relaxed font-light text-xl">
                {data.cityOverview.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.cityOverview.highlights.map((highlight, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 p-6 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                    <span className="text-white/90 font-light text-lg">{highlight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 预算分配卡片 */}
        {data.budgetBreakdown && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-emerald-500/20 transition-all duration-500 border border-emerald-500/30">
            <CardHeader className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <Wallet className="h-8 w-8 text-emerald-400" />
                <span className="text-3xl font-bold tracking-wide">{data.budgetBreakdown.title}</span>
                <span className="ml-auto text-3xl font-bold text-emerald-400">¥{data.budgetBreakdown.total}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-8">
                {data.budgetBreakdown.items.map((item, index) => {
                  const IconComponent = categoryIcons[item.category as keyof typeof categoryIcons] || Wallet
                  return (
                    <div key={index} className="bg-gradient-to-r from-slate-800/50 to-emerald-800/30 p-8 rounded-2xl border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <IconComponent className="h-6 w-6 text-emerald-400" />
                          <span className="font-bold text-white text-xl">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-400">¥{item.amount}</div>
                          <div className="text-lg text-emerald-300">{item.percentage}%</div>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="mb-4 h-3" />
                      <p className="text-lg text-white/80 font-light">{item.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 行程安排卡片 */}
        {data.itinerary && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-blue-500/20 transition-all duration-500 border border-blue-500/30">
            <CardHeader className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <Clock className="h-8 w-8 text-blue-400" />
                <span className="text-3xl font-bold tracking-wide">{data.itinerary.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-10">
                {data.itinerary.days.map((day, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-800/30 to-indigo-800/30 p-8 rounded-2xl border border-blue-500/20">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      第{day.day}天 - {day.theme}
                    </h3>
                    <div className="space-y-6">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="bg-black/30 p-6 rounded-xl border border-blue-400/20">
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-bold text-blue-400 text-lg">{activity.time}</span>
                            <span className="text-lg font-bold text-white">{formatCurrency(activity.cost)}</span>
                          </div>
                          <p className="text-white/90 mb-3 font-light text-lg">{activity.activity}</p>
                          <p className="text-lg text-blue-200 font-light">{activity.tips}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 必游景点卡片 */}
        {data.attractions && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-amber-500/20 transition-all duration-500 border border-amber-500/30">
            <CardHeader className="bg-gradient-to-r from-amber-900/50 to-orange-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <Camera className="h-8 w-8 text-amber-400" />
                <span className="text-3xl font-bold tracking-wide">{data.attractions.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.attractions.items.map((attraction, index) => (
                  <div key={index} className="bg-gradient-to-br from-amber-800/30 to-orange-800/30 p-8 rounded-2xl border border-amber-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{attraction.name}</h3>
                      <span className="text-lg font-bold text-amber-400">{formatCurrency(attraction.cost)}</span>
                    </div>
                    <div className="mb-4">
                      <StarRating rating={attraction.rating} />
                    </div>
                    <p className="text-white/90 mb-4 font-light text-lg">{attraction.description}</p>
                    <p className="text-lg text-amber-200 font-light">{attraction.tips}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 美食攻略卡片 */}
        {data.food && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-red-500/20 transition-all duration-500 border border-red-500/30">
            <CardHeader className="bg-gradient-to-r from-red-900/50 to-pink-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <Utensils className="h-8 w-8 text-red-400" />
                <span className="text-3xl font-bold tracking-wide">{data.food.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.food.items.map((food, index) => (
                  <div key={index} className="bg-gradient-to-br from-red-800/30 to-pink-800/30 p-8 rounded-2xl border border-red-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{food.name}</h3>
                      <span className="text-lg font-bold text-red-400">{formatCurrency(food.price)}</span>
                    </div>
                    <p className="text-lg text-red-200 mb-4 font-light">{food.location}</p>
                    <p className="text-white/90 font-light text-lg">{food.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 住宿建议卡片 */}
        {data.accommodation && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-cyan-500/20 transition-all duration-500 border border-cyan-500/30">
            <CardHeader className="bg-gradient-to-r from-cyan-900/50 to-teal-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <Bed className="h-8 w-8 text-cyan-400" />
                <span className="text-3xl font-bold tracking-wide">{data.accommodation.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-8">
                {data.accommodation.items.map((acc, index) => (
                  <div key={index} className="bg-gradient-to-br from-cyan-800/30 to-teal-800/30 p-8 rounded-2xl border border-cyan-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{acc.type}</h3>
                      <span className="text-lg font-bold text-cyan-400">{formatCurrency(acc.priceRange)}</span>
                    </div>
                    <p className="text-lg text-cyan-200 mb-4 font-light">{acc.location}</p>
                    <div className="flex flex-wrap gap-3">
                      {acc.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="bg-cyan-800/50 text-cyan-200 font-light text-lg px-4 py-2">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 省钱小贴士卡片 */}
        {data.tips && (
          <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl overflow-hidden rounded-3xl hover:shadow-yellow-500/20 transition-all duration-500 border border-yellow-500/30">
            <CardHeader className="bg-gradient-to-r from-yellow-900/50 to-amber-900/50">
              <CardTitle className="flex items-center space-x-4 text-white">
                <Lightbulb className="h-8 w-8 text-yellow-400" />
                <span className="text-3xl font-bold tracking-wide">{data.tips.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.tips.items.map((tip, index) => (
                  <div key={index} className="bg-gradient-to-br from-yellow-800/30 to-amber-800/30 p-6 rounded-2xl border border-yellow-500/20">
                    <p className="text-white/90 font-light text-lg">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 天气预报 */}
        <WeatherForecast city={city} />
      </div>
    </div>
  )
}
