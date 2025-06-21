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
      <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden hover:shadow-blue-500/20 transition-all duration-500 border border-blue-500/30">
        <CardHeader className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
          <CardTitle className="flex items-center space-x-4 text-white">
            <Cloud className="h-8 w-8 text-blue-400" />
            <span className="text-3xl font-bold tracking-wide">天气预报</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-400"></div>
            <span className="ml-4 text-white/80 font-light text-xl">正在获取天气信息...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden hover:shadow-red-500/20 transition-all duration-500 border border-red-500/30">
        <CardHeader className="bg-gradient-to-r from-red-900/50 to-pink-900/50">
          <CardTitle className="flex items-center space-x-4 text-white">
            <Cloud className="h-8 w-8 text-red-400" />
            <span className="text-3xl font-bold tracking-wide">天气预报</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <div className="text-center py-8">
            <p className="text-red-400 mb-4 font-light text-xl">⚠️ {error}</p>
            <p className="text-lg text-white/60 font-light">天气信息暂时无法获取，不影响您的旅行规划</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) return null

  const clothingAdvice = getClothingAdvice(weatherData.forecast)

  return (
    <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-2xl rounded-3xl overflow-hidden hover:shadow-blue-500/20 transition-all duration-500 border border-blue-500/30">
      <CardHeader className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
        <CardTitle className="flex items-center space-x-4 text-white">
          <Cloud className="h-8 w-8 text-blue-400" />
          <span className="text-3xl font-bold tracking-wide">{weatherData.city} 5天天气预报</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-10">
        {/* 5天天气预报网格 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          {weatherData.forecast.map((day, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-blue-800/30 to-indigo-800/30 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl border border-blue-500/20 ${
                index === 0 ? 'ring-2 ring-blue-400/50 bg-gradient-to-br from-blue-700/40 to-indigo-700/40' : ''
              }`}
            >
              <div className="text-lg font-bold text-blue-200 mb-3">
                {index === 0 ? '今天' : day.date}
              </div>
              <div className="flex justify-center mb-4">
                {getWeatherIcon(day.weather.icon, day.weather.main)}
              </div>
              <div className="space-y-2">
                <div className={`text-2xl font-bold ${getTemperatureColor(day.temperature.max)}`}>
                  {Math.round(day.temperature.max)}°
                </div>
                <div className="text-lg text-white/60">
                  {Math.round(day.temperature.min)}°
                </div>
                <div className="text-sm text-blue-200 font-light">
                  {day.weather.description}
                </div>
              </div>
              
              {/* 详细信息 */}
              <div className="mt-4 space-y-2 text-sm text-white/60">
                <div className="flex items-center justify-center space-x-2">
                  <Droplets className="h-4 w-4" />
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Wind className="h-4 w-4" />
                  <span>{day.windSpeed}m/s</span>
                </div>
                {day.precipitation > 0 && (
                  <div className="flex items-center justify-center space-x-2">
                    <CloudRain className="h-4 w-4" />
                    <span>{day.precipitation}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 穿衣建议 */}
        <div className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 rounded-2xl p-8 border border-indigo-500/20">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
            <span>👔</span>
            <span>穿衣建议</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clothingAdvice.map((advice, index) => (
              <div key={index} className="bg-black/30 rounded-xl p-4 border border-indigo-400/20">
                <span className="text-white/90 font-light text-lg">{advice}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 