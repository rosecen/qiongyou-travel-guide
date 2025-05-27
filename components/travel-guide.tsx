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
  transportation: "bg-blue-100 text-blue-800",
  food: "bg-cyan-100 text-cyan-800",
  accommodation: "bg-sky-100 text-sky-800",
  activities: "bg-indigo-100 text-indigo-800",
}

// 货币格式化函数
const formatCurrency = (text: string): string => {
  // 移除"元"字，只保留¥符号
  return text.replace(/¥(\d+)元/g, '¥$1').replace(/(\d+)元/g, '¥$1')
}

export default function TravelGuide({ city, budget, days, style, data }: TravelGuideProps) {
  // 如果是原始内容，显示简单格式
  if (data.rawContent) {
    return (
      <Card className="shadow-lg border-0 bg-white rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
          <CardTitle className="text-blue-800">
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white overflow-hidden rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
            <CardTitle className="flex items-center space-x-2 text-blue-800">
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
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-xl">
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
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-cyan-800">
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
                  <div key={index} className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-800">{item.category}</span>
                        <Badge className={colorClass}>{item.percentage}%</Badge>
                      </div>
                      <span className="font-bold text-blue-700">¥{item.amount}</span>
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
          <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-sky-800">
              <Clock className="h-6 w-6" />
              <span>{data.itinerary.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {data.itinerary.days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-l-4 border-blue-300 pl-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className="bg-blue-600 text-white rounded-xl">第{day.day}天</Badge>
                    <span className="font-medium text-gray-800">{day.theme}</span>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="bg-blue-50 rounded-2xl p-3">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-blue-700">{activity.time}</span>
                          <span className="text-sm text-cyan-600 font-medium">{formatCurrency(activity.cost)}</span>
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
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-indigo-800">
              <Camera className="h-6 w-6" />
              <span>{data.attractions.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.attractions.items.map((attraction, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 border border-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{attraction.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{attraction.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{attraction.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-cyan-600">{formatCurrency(attraction.cost)}</span>
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
          <CardHeader className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Utensils className="h-6 w-6" />
              <span>{data.food.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.food.items.map((food, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-4 border border-orange-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{food.name}</h4>
                    <span className="text-sm font-medium text-orange-600">{formatCurrency(food.price)}</span>
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
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Bed className="h-6 w-6" />
              <span>{data.accommodation.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.accommodation.items.map((acc, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-4 border border-purple-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{acc.type}</h4>
                    <span className="text-sm font-medium text-purple-600">{formatCurrency(acc.priceRange)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">📍 {acc.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {acc.features.map((feature, fIndex) => (
                      <Badge key={fIndex} variant="outline" className="text-xs border-purple-300 text-purple-700">
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
        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-white rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-100 to-blue-50 rounded-t-2xl">
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Lightbulb className="h-6 w-6" />
              <span>{data.tips.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.tips.items.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2 bg-yellow-50 rounded-2xl p-3">
                  <span className="text-yellow-600 font-bold text-sm">💡</span>
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
