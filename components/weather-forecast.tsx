"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, CloudRain, CloudSnow, Zap, Eye, Wind, Droplets } from "lucide-react"

interface WeatherDay {
  date: string
  temperature: {
    max: number
    min: number
    day: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }
  humidity: number
  windSpeed: number
  precipitation: number
}

interface WeatherData {
  city: string
  country: string
  timezone: string
  forecast: WeatherDay[]
}

interface WeatherForecastProps {
  city: string
}

const getWeatherIcon = (iconCode: string, main: string): React.ReactElement => {
  const iconMap: { [key: string]: React.ReactElement } = {
    '01d': <Sun className="h-6 w-6 text-yellow-500" />,
    '01n': <Sun className="h-6 w-6 text-yellow-400" />,
    '02d': <Cloud className="h-6 w-6 text-gray-400" />,
    '02n': <Cloud className="h-6 w-6 text-gray-500" />,
    '03d': <Cloud className="h-6 w-6 text-gray-500" />,
    '03n': <Cloud className="h-6 w-6 text-gray-600" />,
    '04d': <Cloud className="h-6 w-6 text-gray-600" />,
    '04n': <Cloud className="h-6 w-6 text-gray-700" />,
    '09d': <CloudRain className="h-6 w-6 text-blue-500" />,
    '09n': <CloudRain className="h-6 w-6 text-blue-600" />,
    '10d': <CloudRain className="h-6 w-6 text-blue-500" />,
    '10n': <CloudRain className="h-6 w-6 text-blue-600" />,
    '11d': <Zap className="h-6 w-6 text-purple-500" />,
    '11n': <Zap className="h-6 w-6 text-purple-600" />,
    '13d': <CloudSnow className="h-6 w-6 text-blue-200" />,
    '13n': <CloudSnow className="h-6 w-6 text-blue-300" />,
    '50d': <Eye className="h-6 w-6 text-gray-400" />,
    '50n': <Eye className="h-6 w-6 text-gray-500" />,
  }
  
  return iconMap[iconCode] || <Cloud className="h-6 w-6 text-gray-400" />
}

const getTemperatureColor = (temp: number) => {
  if (temp >= 30) return 'text-red-600'
  if (temp >= 25) return 'text-orange-500'
  if (temp >= 20) return 'text-yellow-600'
  if (temp >= 15) return 'text-green-600'
  if (temp >= 10) return 'text-blue-500'
  if (temp >= 0) return 'text-blue-600'
  return 'text-blue-800'
}

const getClothingAdvice = (forecast: WeatherDay[]) => {
  const avgTemp = forecast.reduce((sum, day) => sum + day.temperature.day, 0) / forecast.length
  const hasRain = forecast.some(day => day.precipitation > 30)
  const tempRange = Math.max(...forecast.map(d => d.temperature.max)) - Math.min(...forecast.map(d => d.temperature.min))
  
  const advice = []
  
  if (avgTemp >= 25) {
    advice.push('👕 轻薄透气的夏装')
    advice.push('🧴 防晒霜和太阳镜')
  } else if (avgTemp >= 15) {
    advice.push('👔 长袖衬衫或薄外套')
    advice.push('👖 长裤或休闲裤')
  } else if (avgTemp >= 5) {
    advice.push('🧥 保暖外套或毛衣')
    advice.push('🧣 围巾和手套')
  } else {
    advice.push('🧥 厚重的冬装')
    advice.push('🧤 保暖配件必备')
  }
  
  if (hasRain) {
    advice.push('☂️ 雨伞或雨衣')
    advice.push('👟 防水鞋')
  }
  
  if (tempRange > 15) {
    advice.push('👕 多层次穿搭，方便增减')
  }
  
  return advice
}

export default function WeatherForecast({ city }: WeatherForecastProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!city) return

    const fetchWeather = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '获取天气信息失败')
        }
        
        const data = await response.json()
        setWeatherData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取天气信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [city])

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Cloud className="h-6 w-6" />
            <span>天气预报</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-gray-600">正在获取天气信息...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-2xl">
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Cloud className="h-6 w-6" />
            <span>天气预报</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-4">
            <p className="text-orange-600 mb-2">⚠️ {error}</p>
            <p className="text-sm text-gray-500">天气信息暂时无法获取，不影响您的旅行规划</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) return null

  const clothingAdvice = getClothingAdvice(weatherData.forecast)

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-2xl">
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <Cloud className="h-6 w-6" />
          <span>{weatherData.city} 5天天气预报</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* 5天天气预报网格 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-3 text-center border ${
                index === 0 ? 'border-orange-300 bg-orange-100' : 'border-amber-200'
              }`}
            >
              <div className="text-xs font-medium text-stone-600 mb-1">
                {index === 0 ? '今天' : day.date}
              </div>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.weather.icon, day.weather.main)}
              </div>
              <div className="text-xs text-stone-600 mb-2 leading-tight">
                {day.weather.description}
              </div>
              <div className="space-y-1">
                <div className={`text-sm font-bold ${getTemperatureColor(day.temperature.max)}`}>
                  {day.temperature.max}°
                </div>
                <div className="text-xs text-stone-500">
                  {day.temperature.min}°
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-center text-xs text-stone-500">
                  <Droplets className="h-3 w-3 mr-1" />
                  {day.precipitation}%
                </div>
                <div className="flex items-center justify-center text-xs text-stone-500">
                  <Wind className="h-3 w-3 mr-1" />
                  {day.windSpeed}km/h
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 穿衣建议 */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
          <h4 className="font-medium text-orange-800 mb-3 flex items-center">
            <span className="mr-2">👔</span>
            穿衣建议
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {clothingAdvice.map((advice, index) => (
              <div key={index} className="flex items-center text-sm text-orange-700">
                <span className="mr-2">•</span>
                {advice}
              </div>
            ))}
          </div>
        </div>

        {/* 天气提醒 */}
        <div className="mt-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
            <span className="mr-2">💡</span>
            出行提醒
          </h4>
          <div className="text-sm text-yellow-700 space-y-1">
            {/* 降雨提醒 */}
            {weatherData.forecast.some(d => d.precipitation > 70) && (
              <p>• 🌧️ 未来几天有大雨，建议携带雨具，避免户外长时间活动</p>
            )}
            {weatherData.forecast.some(d => d.precipitation > 30 && d.precipitation <= 70) && (
              <p>• ☔ 可能有阵雨，建议随身携带雨伞</p>
            )}
            
            {/* 温度提醒 */}
            {weatherData.forecast.some(d => d.temperature.max > 35) && (
              <p>• 🌡️ 高温预警！注意防暑降温，多补充水分，避免中午时段户外活动</p>
            )}
            {weatherData.forecast.some(d => d.temperature.max > 30 && d.temperature.max <= 35) && (
              <p>• ☀️ 气温较高，注意防晒和补水，选择阴凉处休息</p>
            )}
            {weatherData.forecast.some(d => d.temperature.min < 0) && (
              <p>• 🧊 有冰冻天气，路面可能结冰，出行注意安全</p>
            )}
            {weatherData.forecast.some(d => d.temperature.min < 5 && d.temperature.min >= 0) && (
              <p>• 🥶 气温较低，注意保暖防寒，老人小孩尤其要注意</p>
            )}
            
            {/* 风力提醒 */}
            {weatherData.forecast.some(d => d.windSpeed > 30) && (
              <p>• 💨 大风天气，避免高空作业，注意高层建筑物品安全</p>
            )}
            {weatherData.forecast.some(d => d.windSpeed > 20 && d.windSpeed <= 30) && (
              <p>• 🌬️ 风力较大，户外活动请注意安全，固定好随身物品</p>
            )}
            
            {/* 湿度提醒 */}
            {weatherData.forecast.some(d => d.humidity > 80) && (
              <p>• 💧 湿度较高，体感闷热，注意通风和防潮</p>
            )}
            {weatherData.forecast.some(d => d.humidity < 30) && (
              <p>• 🏜️ 空气干燥，注意补水和皮肤保湿，预防静电</p>
            )}
            
            {/* 温差提醒 */}
            {weatherData.forecast.some(d => (d.temperature.max - d.temperature.min) > 15) && (
              <p>• 🌡️ 昼夜温差较大，建议穿着可调节的多层衣物</p>
            )}
            
            {/* 特殊天气提醒 */}
            {weatherData.forecast.some(d => d.weather.main === 'Thunderstorm') && (
              <p>• ⛈️ 有雷雨天气，避免在空旷地带活动，远离金属物体</p>
            )}
            {weatherData.forecast.some(d => d.weather.main === 'Snow') && (
              <p>• ❄️ 有降雪，路面湿滑，驾车出行请减速慢行</p>
            )}
            {weatherData.forecast.some(d => d.weather.main === 'Fog' || d.weather.main === 'Mist') && (
              <p>• 🌫️ 有雾霾天气，能见度较低，驾车请开启雾灯</p>
            )}
            
            {/* 默认提醒 */}
            {!weatherData.forecast.some(d => 
              d.precipitation > 30 || 
              d.temperature.max > 30 || 
              d.temperature.min < 5 || 
              d.windSpeed > 20 ||
              d.humidity > 80 ||
              d.humidity < 30 ||
              (d.temperature.max - d.temperature.min) > 15
            ) && (
              <p>• ✨ 天气状况良好，适合户外活动和旅行</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 