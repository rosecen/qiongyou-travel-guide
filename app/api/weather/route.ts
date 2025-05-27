import { NextRequest, NextResponse } from 'next/server'

interface WeatherData {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  pop?: number // 降水概率
}

interface ForecastResponse {
  list: WeatherData[]
  city: {
    name: string
    country: string
  }
}

// 中文城市名称映射 - 包含所有支持的城市
const cityNameMap: { [key: string]: string } = {
  '北京': 'Beijing',
  '上海': 'Shanghai',
  '广州': 'Guangzhou',
  '深圳': 'Shenzhen',
  '杭州': 'Hangzhou',
  '南京': 'Nanjing',
  '苏州': 'Suzhou',
  '成都': 'Chengdu',
  '重庆': 'Chongqing',
  '西安': 'Xian',
  '厦门': 'Xiamen',
  '青岛': 'Qingdao',
  '大连': 'Dalian',
  '天津': 'Tianjin',
  '武汉': 'Wuhan',
  '长沙': 'Changsha',
  '昆明': 'Kunming',
  '丽江': 'Lijiang',
  '桂林': 'Guilin',
  '三亚': 'Sanya',
  '郑州': 'Zhengzhou',
  '济南': 'Jinan',
  '哈尔滨': 'Harbin',
  '长春': 'Changchun',
  '沈阳': 'Shenyang',
  '石家庄': 'Shijiazhuang',
  '太原': 'Taiyuan',
  '呼和浩特': 'Hohhot',
  '兰州': 'Lanzhou',
  '银川': 'Yinchuan',
  '西宁': 'Xining',
  '乌鲁木齐': 'Urumqi',
  '拉萨': 'Lhasa',
  '贵阳': 'Guiyang',
  '南宁': 'Nanning',
  '海口': 'Haikou',
  '香港': 'Hong Kong',
  '澳门': 'Macau',
  '台北': 'Taipei',
  '宁波': 'Ningbo',
  '无锡': 'Wuxi'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    
    if (!city) {
      return NextResponse.json({ error: '城市名称不能为空' }, { status: 400 })
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: '天气服务配置错误' }, { status: 500 })
    }

    // 转换中文城市名称为英文
    const englishCityName = cityNameMap[city] || city
    
    console.log(`Requesting weather for: ${city} -> ${englishCityName}`)
    
    // 尝试多种城市名称格式
    const cityVariants = [
      englishCityName,
      city,
      `${englishCityName},CN`,
      `${city},CN`
    ]
    
    let forecastData: ForecastResponse | null = null
    let lastError: any = null
    
    // 依次尝试不同的城市名称格式
    for (const cityVariant of cityVariants) {
      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityVariant)}&appid=${apiKey}&units=metric&lang=zh_cn`
        console.log(`Trying: ${cityVariant}`)
        
        const forecastResponse = await fetch(forecastUrl)
        
        if (forecastResponse.ok) {
          forecastData = await forecastResponse.json()
          console.log(`Success with: ${cityVariant}`)
          break
        } else {
          const errorData = await forecastResponse.json()
          lastError = errorData
          console.log(`Failed with ${cityVariant}:`, errorData.message)
        }
      } catch (err) {
        lastError = err
        console.log(`Error with ${cityVariant}:`, err)
      }
    }
    
    if (!forecastData) {
      console.error('All city variants failed. Last error:', lastError)
      return NextResponse.json(
        { error: `无法获取 ${city} 的天气信息，请检查城市名称` },
        { status: 404 }
      )
    }
    
    return processWeatherData(forecastData, city)

  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json(
      { error: '获取天气信息失败，请稍后重试' },
      { status: 500 }
    )
  }
}

function processWeatherData(forecastData: ForecastResponse, originalCityName: string) {
  // 处理5天预报数据，每天取中午12点的数据
  const dailyForecasts = new Map()
  
  forecastData.list.forEach((item: WeatherData) => {
    const date = new Date(item.dt * 1000)
    const dateKey = date.toDateString()
    
    // 优先选择中午12点的数据，如果没有则选择当天第一个数据
    if (!dailyForecasts.has(dateKey) || date.getHours() === 12) {
      dailyForecasts.set(dateKey, item)
    }
  })

  // 转换为我们需要的格式，最多5天（免费API限制）
  const forecast = Array.from(dailyForecasts.values()).slice(0, 5).map((day: WeatherData, index: number) => ({
    date: new Date(day.dt * 1000).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    }),
    temperature: {
      max: Math.round(day.main.temp_max),
      min: Math.round(day.main.temp_min),
      day: Math.round(day.main.temp)
    },
    weather: {
      main: day.weather[0].main,
      description: day.weather[0].description,
      icon: day.weather[0].icon
    },
    humidity: day.main.humidity,
    windSpeed: Math.round(day.wind.speed * 3.6), // 转换为km/h
    precipitation: Math.round((day.pop || 0) * 100) // 转换为百分比
  }))

  return NextResponse.json({
    city: originalCityName, // 返回原始中文城市名称
    country: forecastData.city.country,
    timezone: 'Asia/Shanghai', // 默认时区
    forecast
  })
} 