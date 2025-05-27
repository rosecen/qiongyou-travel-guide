# 穷游去哪玩儿 - Vercel 部署指南

## 🚀 部署步骤

### 1. 准备工作
确保您已经有：
- GitHub 账号
- Vercel 账号（可以用GitHub登录）
- 项目代码已推送到GitHub

### 2. 环境变量配置
在Vercel部署时需要配置以下环境变量：

```
OPENWEATHERMAP_API_KEY=ab514604d5d47937a41a889ba75e2511
```

### 3. 部署流程

#### 方法一：通过Vercel网站部署
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择您的GitHub仓库
5. 配置项目：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
6. 添加环境变量：
   - Key: `OPENWEATHERMAP_API_KEY`
   - Value: `ab514604d5d47937a41a889ba75e2511`
7. 点击 "Deploy"

#### 方法二：通过Vercel CLI部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 设置环境变量
vercel env add OPENWEATHERMAP_API_KEY
# 输入值：ab514604d5d47937a41a889ba75e2511

# 重新部署
vercel --prod
```

### 4. 项目特性
- ✅ Next.js 15.2.4
- ✅ AI旅行攻略生成（OpenRouter + Google Gemini 2.0）
- ✅ 5天天气预报（OpenWeatherMap API）
- ✅ 20个热门城市支持
- ✅ 7种旅行风格
- ✅ 蓝色海洋主题设计
- ✅ 响应式设计

### 5. API配置
- **AI服务**: OpenRouter (Google Gemini 2.0) - 已配置
- **天气服务**: OpenWeatherMap - 需要配置环境变量

### 6. 域名配置
部署成功后，Vercel会自动分配一个域名，格式如：
`https://your-project-name.vercel.app`

您也可以绑定自定义域名。

### 7. 注意事项
- 确保所有依赖都在 package.json 中
- 环境变量必须在Vercel控制台中配置
- 首次部署可能需要几分钟时间
- 支持自动部署：推送到GitHub会自动触发重新部署

## 🔧 故障排除

### 构建失败
- 检查 package.json 依赖
- 确保 TypeScript 类型正确
- 查看Vercel构建日志

### API错误
- 检查环境变量配置
- 确认API密钥有效
- 查看Function日志

### 样式问题
- 确保 Tailwind CSS 配置正确
- 检查 CSS 文件导入

## 📞 支持
如有问题，请检查：
1. Vercel部署日志
2. 浏览器控制台错误
3. API响应状态 