import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { city, budget, days, style } = await request.json()

    if (!city || !budget || !days || !style) {
      return NextResponse.json({ error: "请填写完整的旅行信息" }, { status: 400 })
    }

    const styleDescriptions = {
      cultural: "文艺青年风格，重点推荐咖啡馆、书店、艺术馆、文创园区、独立书店、画廊等文艺场所",
      foodie: "美食探索风格，重点推荐当地小吃、特色餐厅、夜市美食、街头小食、传统菜系",
      historical: "历史文化风格，重点推荐博物馆、古迹、传统建筑、文化遗产、历史街区",
      nature: "自然风光风格，重点推荐公园、山水、户外活动、风景名胜、徒步路线",
      nightlife: "夜生活风格，重点推荐酒吧、夜市、娱乐场所、夜景观赏点、夜间活动",
      shopping: "购物血拼风格，重点推荐商场、市集、特产店、潮流店铺、购物街区",
      relaxed: "极简休闲风格，重点推荐放松场所、慢节奏活动、简单行程、度假式体验",
    }

    const styleDescription = styleDescriptions[style as keyof typeof styleDescriptions] || ""

    // 尝试使用OpenRouter API
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
    
    if (OPENROUTER_API_KEY) {
      try {
        const prompt = `请为我生成一份详细的${city}穷游攻略，具体要求如下：
- 目的地：${city}
- 预算：¥${budget}
- 旅游天数：${days}天
- 旅行风格：${styleDescription}

请严格按照以下JSON格式返回，不要使用markdown代码块，直接返回纯JSON：

{
  "cityOverview": {
    "title": "城市概况",
    "description": "结合旅行风格简要介绍${city}的特色和适合${styleDescription}的原因",
    "highlights": ["根据旅行风格的特色1", "特色2", "特色3"]
  },
  "budgetBreakdown": {
    "title": "预算分配",
    "total": ${budget},
    "items": [
      {"category": "交通", "amount": 具体金额, "percentage": 百分比, "description": "具体说明"},
      {"category": "住宿", "amount": 具体金额, "percentage": 百分比, "description": "具体说明"},
      {"category": "餐饮", "amount": 具体金额, "percentage": 百分比, "description": "具体说明"},
      {"category": "景点", "amount": 具体金额, "percentage": 百分比, "description": "具体说明"},
      {"category": "其他", "amount": 具体金额, "percentage": 百分比, "description": "具体说明"}
    ]
  },
  "itinerary": {
    "title": "推荐行程",
    "days": [
      ${Array.from(
        { length: Number.parseInt(days) },
        (_, i) => `{
        "day": ${i + 1},
        "theme": "第${i + 1}天主题（结合旅行风格）",
        "activities": [
          {"time": "具体时间", "activity": "符合旅行风格的活动", "cost": "¥XX或免费", "tips": "小贴士"}
        ]
      }`,
      ).join(",")}
    ]
  },
  "attractions": {
    "title": "必游景点",
    "items": [
      {"name": "符合旅行风格的景点名", "cost": "¥XX或免费", "rating": "推荐指数", "description": "简介", "tips": "游玩建议"}
    ]
  },
  "food": {
    "title": "美食攻略",
    "items": [
      {"name": "符合旅行风格的美食名", "price": "¥XX", "location": "地点", "description": "描述"}
    ]
  },
  "accommodation": {
    "title": "住宿建议",
    "items": [
      {"type": "适合旅行风格的住宿类型", "priceRange": "¥XX-XX/晚", "location": "位置", "features": ["特点1", "特点2"]}
    ]
  },
  "tips": {
    "title": "省钱小贴士",
    "items": ["结合旅行风格的省钱贴士1", "贴士2", "贴士3", "贴士4", "贴士5"]
  }
}

重要：
1. 只返回JSON对象，不要添加任何解释文字或markdown格式
2. 所有推荐内容必须符合选择的旅行风格
3. 行程安排要根据${days}天的时间合理分配
4. 预算分配要符合¥${budget}的总预算
5. 所有金额只使用"¥XX"格式，不要添加"元"字
6. 免费项目请标注为"免费"
7. 价格区间使用"¥XX-XX"格式，不要添加"元"字`

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://qiongyou-travel-guide.vercel.app",
            "X-Title": "Budget Travel Guide Generator",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          let guideText = data.choices[0]?.message?.content

          if (guideText) {
            // 清理可能的markdown代码块格式
            guideText = guideText.trim()
            if (guideText.startsWith("```json")) {
              guideText = guideText.replace(/^```json\s*/, "")
            }
            if (guideText.startsWith("```")) {
              guideText = guideText.replace(/^```\s*/, "")
            }
            if (guideText.endsWith("```")) {
              guideText = guideText.replace(/\s*```$/, "")
            }

            try {
              const guide = JSON.parse(guideText)
              return NextResponse.json({ guide })
            } catch (parseError) {
              console.error("JSON parse error:", parseError)
              // 继续到备选方案
            }
          }
        }
      } catch (error) {
        console.error("OpenRouter API error:", error)
        // 继续到备选方案
      }
    }

    // 备选方案：生成本地模板攻略
    console.log("Using fallback template for:", city, budget, days, style)
    
    const guide = generateFallbackGuide(city, budget, days, style, styleDescription)
    return NextResponse.json({ guide })

  } catch (error) {
    console.error("Error generating guide:", error)
    return NextResponse.json({ error: "生成攻略时出现错误，请稍后重试" }, { status: 500 })
  }
}

// 备选方案：生成本地模板攻略
function generateFallbackGuide(city: string, budget: number, days: number, style: string, styleDescription: string) {
  const budgetPerDay = Math.floor(budget / Number(days))
  
  return {
    cityOverview: {
      title: "城市概况",
      description: `${city}是一个充满魅力的旅游目的地，特别适合${styleDescription}。这里有丰富的文化底蕴、美味的当地美食和独特的风景，是预算旅行者的理想选择。`,
      highlights: [
        "经济实惠的旅行体验",
        "丰富的文化和历史景观", 
        "地道的当地美食",
        "便利的交通网络"
      ]
    },
    budgetBreakdown: {
      title: "预算分配",
      total: budget,
      items: [
        {
          category: "交通",
          amount: Math.floor(budget * 0.25),
          percentage: 25,
          description: "包括往返交通和市内交通费用"
        },
        {
          category: "住宿", 
          amount: Math.floor(budget * 0.35),
          percentage: 35,
          description: "经济型酒店或青年旅社"
        },
        {
          category: "餐饮",
          amount: Math.floor(budget * 0.25),
          percentage: 25,
          description: "当地特色美食和街头小吃"
        },
        {
          category: "景点",
          amount: Math.floor(budget * 0.10),
          percentage: 10,
          description: "门票和体验活动费用"
        },
        {
          category: "其他",
          amount: Math.floor(budget * 0.05),
          percentage: 5,
          description: "购物和应急费用"
        }
      ]
    },
    itinerary: {
      title: "推荐行程",
      days: Array.from({ length: Number(days) }, (_, i) => ({
        day: i + 1,
        theme: `第${i + 1}天：${i === 0 ? '初探' + city : i === Number(days) - 1 ? '深度体验' : '精彩游览'}`,
        activities: [
          {
            time: "09:00-12:00",
            activity: `游览${city}标志性景点`,
            cost: "¥30-50",
            tips: "建议早上前往，避开人流高峰"
          },
          {
            time: "12:00-14:00", 
            activity: "品尝当地特色美食",
            cost: "¥25-40",
            tips: "选择当地人推荐的小店"
          },
          {
            time: "14:00-17:00",
            activity: "探索文化街区",
            cost: "免费",
            tips: "可以拍照留念，体验当地文化"
          },
          {
            time: "17:00-19:00",
            activity: "休息或购物",
            cost: "¥20-50",
            tips: "可以买些当地特产"
          }
        ]
      }))
    },
    attractions: {
      title: "必游景点",
      items: [
        {
          name: `${city}标志性景点`,
          cost: "¥30-50",
          rating: "★★★★★",
          description: "城市最具代表性的景点，不容错过",
          tips: "建议预留2-3小时游览时间"
        },
        {
          name: "历史文化街区",
          cost: "免费",
          rating: "★★★★☆", 
          description: "感受当地历史文化氛围",
          tips: "适合漫步和拍照"
        },
        {
          name: "当地市场",
          cost: "免费",
          rating: "★★★★☆",
          description: "体验当地生活，品尝街头美食",
          tips: "注意食品卫生，适量品尝"
        }
      ]
    },
    food: {
      title: "美食攻略", 
      items: [
        {
          name: `${city}特色小吃`,
          price: "¥10-20",
          location: "各大街头小摊",
          description: "当地最具特色的街头美食"
        },
        {
          name: "传统菜系",
          price: "¥30-50",
          location: "当地餐厅",
          description: "正宗的地方菜，值得一试"
        },
        {
          name: "夜市美食",
          price: "¥15-25", 
          location: "夜市街区",
          description: "夜晚的美食天堂"
        }
      ]
    },
    accommodation: {
      title: "住宿建议",
      items: [
        {
          type: "青年旅社",
          priceRange: `¥${Math.floor(budgetPerDay * 0.3)}-${Math.floor(budgetPerDay * 0.4)}/晚`,
          location: "市中心或交通便利区域",
          features: ["经济实惠", "交通便利", "设施齐全"]
        },
        {
          type: "经济型酒店",
          priceRange: `¥${Math.floor(budgetPerDay * 0.4)}-${Math.floor(budgetPerDay * 0.6)}/晚`,
          location: "商业区或景点附近", 
          features: ["性价比高", "服务良好", "位置优越"]
        }
      ]
    },
    tips: {
      title: "省钱小贴士",
      items: [
        "选择公共交通出行，购买交通卡更优惠",
        "在当地市场和街头小摊用餐，价格实惠且地道",
        "关注景点的免费开放时间或优惠政策",
        "选择青年旅社或民宿，既省钱又能结交朋友",
        "提前规划行程，避免临时决定的高额费用",
        "携带水杯，减少购买饮料的开支",
        "关注当地的免费活动和节庆庆典"
      ]
    }
  }
}
