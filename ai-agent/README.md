# 🤖 AI内容Agent

一个能够自动获取AI知识、生成内容并更新网站的智能Agent。

## 功能特性

- 📥 自动获取AI知识（RSS、GitHub、ArXiv、搜索）
- 🔍 智能分析内容价值
- ✍️ 自动生成教程/新闻文章
- 🌐 自动整合到网站
- 🧠 自我演进学习
- ⏰ 定时自动运行

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/zblnly/ai.git
cd ai/ai-agent
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 添加你的 OpenAI API Key
```

### 3. 安装依赖

```bash
npm install
```

### 4. 运行Agent

```bash
# 单次运行
npm start

# 持续运行（每小时检查）
npm run dev

# 定时运行（每6小时）
npm run cron
```

## 配置说明

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| OPENAI_API_KEY | OpenAI API密钥 | (必需) |
| WEBSITE_PATH | 网站路径 | ../ai |
| OPENAI_MODEL | 使用的模型 | gpt-4 |
| UPDATE_INTERVAL | 更新间隔 | 6h |

## GitHub Actions

在 GitHub 仓库设置中添加 secrets:
- `OPENAI_API_KEY`: 你的 OpenAI API Key
- `GH_TOKEN`: GitHub Token (用于自动提交)

然后在 Actions 中手动触发或等待定时运行。

## 目录结构

```
ai-agent/
├── agent.js          # Agent核心代码
├── scheduler.js     # 调度器
├── package.json    # 依赖配置
├── .env.example   # 环境变量示例
├── .github/workflows/  # GitHub Actions
└── data/        # 学习数据
    ├── learning_log.json    # 学习记录
    ├── learning_report.json # 学习报告
    └── logs/             # 错误日志
```

## 使用方法

### 本地运行

```bash
# 单次运行
node agent.js --once

# 持续监控
node scheduler.js continuous
```

### 手动触发GitHub Actions

1. 打开 GitHub 仓库的 Actions
2. 选择 "AI Content Agent"
3. 点击 "Run workflow"

## 自定义配置

### 添加RSS源

编辑 `agent.js` 中的 `rssFeeds` 数组：

```javascript
rssFeeds: [
  { name: '你的RSS', url: 'https://...', category: 'news' }
]
```

### 添加关键词

编辑 `searchKeywords` 数组添加感兴趣的AI话题。

## 输出示例

运行后会在 `data/learning_report.json` 生成学习报告，包含：
- 生成的内容数量
- 成功率统计
- 热门主题分析
- 内容历史

## 注意事项

1. 需要 OpenAI API Key
2. 首次运行可能需要几分钟
3. 确保网站目录有写权限
4. GitHub Pages 需要正确的部署配置