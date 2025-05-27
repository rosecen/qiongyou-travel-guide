# 天气预报功能配置指南

## 功能概述
已为您的穷游网站添加了7天天气预报功能，包括：
- 📅 7天详细天气预报
- 🌡️ 温度、湿度、风速信息
- 🌧️ 降水概率预测
- 👔 智能穿衣建议
- 💡 出行提醒

## API Key 安全配置

### 1. 获取 OpenWeatherMap API Key
1. 访问 [OpenWeatherMap](https://openweathermap.org/api)
2. 注册免费账户
3. 获取 API Key（免费版本支持1000次/天调用）

### 2. 安全配置 API Key

**方法一：环境变量文件（推荐）**
```bash
# 在项目根目录创建 .env.local 文件
echo "OPENWEATHERMAP_API_KEY=ab514604d5d47937a41a889ba75e2511" > .env.local
```

**方法二：直接编辑**
创建 `.env.local` 文件，内容如下：
```
OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

### 3. 验证配置
重启开发服务器后，天气预报功能将自动生效：
```bash
npm run dev
```

## 功能特点

### 🎯 智能天气展示
- 今天天气突出显示
- 温度颜色编码（蓝色=寒冷，红色=炎热）
- 直观的天气图标

### 👔 智能穿衣建议
根据温度和天气条件自动推荐：
- 夏装/冬装建议
- 雨具提醒
- 多层次穿搭建议

### 💡 出行提醒
智能分析天气数据，提供：
- 降雨提醒
- 高温/低温警告
- 大风天气提醒

## 安全说明

✅ **安全做法：**
- API Key 存储在服务器端环境变量
- 通过 Next.js API 路由调用
- 客户端无法访问 API Key

❌ **避免做法：**
- 不要将 API Key 写在客户端代码中
- 不要提交 `.env.local` 到 git
- 不要在公开场所分享 API Key

## 故障排除

### 天气信息无法显示
1. 检查 `.env.local` 文件是否存在
2. 确认 API Key 是否正确
3. 重启开发服务器
4. 检查浏览器控制台错误信息

### API 调用限制
- 免费版本：1000次/天
- 超出限制会显示错误信息
- 可升级到付费版本获得更多调用次数

## 技术实现

### API 路由
- `app/api/weather/route.ts` - 服务器端天气API
- 支持中文城市名称
- 自动地理编码转换

### 组件结构
- `components/weather-forecast.tsx` - 天气预报组件
- 已集成到 `components/travel-guide.tsx` 中
- 响应式设计，支持移动端

## 下一步
配置完成后，天气预报将自动显示在每个旅行攻略的城市概况下方，为用户提供实用的出行参考信息。 