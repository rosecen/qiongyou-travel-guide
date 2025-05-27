"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Wallet, Clock, Star, Utensils, Bed, Lightbulb, Camera, Navigation, Heart } from "lucide-react"
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
      <Card className="shadow-lg border-0 bg-white rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
          <CardTitle className="text-orange-800">
            {city} 穷游攻略 (预算: ¥{budget})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {formatCurrency(data.rawContent)}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 城市概况卡片 */}
      {data.cityOverview && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-white overflow-hidden rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <MapPin className="h-6 w-6" />
              <span>
                {city} · {data.cityOverview.title}
              </span>
              <div className="flex items-center space-x-1 ml-auto">
                <span className="text-lg">{styleLabels[style as keyof typeof styleLabels]?.icon}</span>
                <span className="text-sm font-normal">{styleLabels[style as keyof typeof styleLabels]?.label}</span>
                <span className="text-sm font-normal">· {days}天</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4 leading-relaxed">{data.cityOverview.description}</p>
            <div className="flex flex-wrap gap-2">
              {data.cityOverview.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-xl">
                  {highlight}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 天气预报卡片 */}
      <WeatherForecast city={city} />

      {/* 预算分配卡片 */}
      {data.budgetBreakdown && (
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <Wallet className="h-6 w-6" />
              <span>
                {data.budgetBreakdown.title} (总计: ¥{data.budgetBreakdown.total})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.budgetBreakdown.items.map((item, index) => {
                const IconComponent = categoryIcons[item.category as keyof typeof categoryIcons] || Heart
                const colorClass =
                  categoryColors[item.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"

                return (
                  <div key={index} className="bg-orange-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-800">{item.category}</span>
                        <Badge className={colorClass}>{item.percentage}%</Badge>
                      </div>
                      <span className="font-bold text-orange-700">¥{item.amount}</span>
                    </div>
                    <Progress value={item.percentage} className="mb-2 h-2" />
                    <p className="text-sm text-gray-600">{formatCurrency(item.description)}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 行程安排卡片 */}
      {data.itinerary && (
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Clock className="h-6 w-6" />
              <span>{data.itinerary.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {data.itinerary.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-l-4 border-orange-300 pl-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-orange-600 text-white rounded-xl">第{day.day}天</Badge>
                    <span className="font-medium text-gray-800">{day.theme}</span>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="bg-orange-50 rounded-2xl p-3">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-orange-700">{activity.time}</span>
                          <span className="text-sm text-amber-600 font-medium">{formatCurrency(activity.cost)}</span>
                        </div>
                        <p className="text-gray-800 mb-1">{activity.activity}</p>
                        <p className="text-xs text-gray-600 italic">{activity.tips}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 景点推荐卡片 */}
      {data.attractions && (
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <Camera className="h-6 w-6" />
              <span>{data.attractions.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.attractions.items.map((attraction, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-4 border border-red-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{attraction.name}</h4>
                    <StarRating rating={attraction.rating} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{attraction.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">{formatCurrency(attraction.cost)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">{attraction.tips}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 美食攻略卡片 */}
      {data.food && (
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-amber-800">
              <Utensils className="h-6 w-6" />
              <span>{data.food.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.food.items.map((food, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-4 border border-amber-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{food.name}</h4>
                    <span className="text-sm font-medium text-amber-600">{formatCurrency(food.price)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{food.description}</p>
                  <p className="text-xs text-gray-500">📍 {food.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 住宿建议卡片 */}
      {data.accommodation && (
        <Card className="shadow-lg border-0 bg-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Bed className="h-6 w-6" />
              <span>{data.accommodation.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.accommodation.items.map((acc, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-4 border border-yellow-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{acc.type}</h4>
                    <span className="text-sm font-medium text-yellow-600">{formatCurrency(acc.priceRange)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">📍 {acc.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {acc.features.map((feature, fIndex) => (
                      <Badge key={fIndex} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Lightbulb className="h-6 w-6" />
              <span>{data.tips.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.tips.items.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2 bg-orange-50 rounded-2xl p-3">
                  <span className="text-orange-600 font-bold text-sm">💡</span>
                  <p className="text-sm text-gray-700">{formatCurrency(tip)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
