import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { city, budget, days, style } = await request.json()

    // 临时硬编码API密钥，确保部署正常工作
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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"
    
    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key not found')
      return NextResponse.json(
        { error: 'API配置错误' },
        { status: 500 }
      )
    }

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

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    let guideText = data.choices[0]?.message?.content

    if (!guideText) {
      throw new Error("未能生成攻略内容")
    }

    // 清理可能的markdown代码块格式
    guideText = guideText.trim()

    // 移除可能的markdown代码块标记
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
      // 尝试解析JSON
      const guide = JSON.parse(guideText)
      return NextResponse.json({ guide })
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.error("Raw response:", guideText)

      // 如果JSON解析失败，创建一个简单的结构化数据
      const fallbackGuide = {
        cityOverview: {
          title: "城市概况",
          description: `${city}${days}天穷游攻略（预算：¥${budget}元）`,
          highlights: ["经济实惠", "体验丰富", "适合年轻人"],
        },
        rawContent: guideText,
      }

      return NextResponse.json({ guide: fallbackGuide })
    }
  } catch (error) {
    console.error("Error generating guide:", error)
    return NextResponse.json({ error: "生成攻略时出现错误，请稍后重试" }, { status: 500 })
  }
}
