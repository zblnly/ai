# AI学习资源站

一个汇集AI领域学习心得、工具推荐和经验总结的个人网站。

## 🌐 在线访问

**网站地址**: https://zblnly.github.io/ai/

**GitHub**: https://github.com/zblnly/ai

## 📚 内容导航

| 板块 | 说明 |
|------|------|
| 首页 | 网站概览和最新动态 |
| [AI工具](pages/tools.html) | 本地大模型、AI编程助手等工具推荐 |
| [教程](pages/tutorials.html) | 学习路径和实战指南 |
| [笔记](pages/notes.html) | 学习过程中的问题和解决方案 |
| [资源](pages/resources.html) | 工具下载、模型下载、学习平台 |
| [动态](pages/ai-news.html) | AI最新发展趋势 |

## 🚀 快速开始

### 本地运行Ollama

```bash
# 启动服务
ollama serve > ollama.log 2>&1 &

# 运行模型
ollama run qwen2.5-coder:7b

# 查看已安装模型
ollama list

# 停止服务
Stop-Process -Name ollama -Force  # Windows
```

### 推荐工具

- **Ollama**: 本地运行大语言模型
- **Continue.dev**: VSCode AI编程扩展
- **Cursor**: AI代码编辑器
- **OpenCode**: 开源AI编程助手

## 📖 学习路线

### 入门阶段 (1-2周)
- 了解AI基本概念
- 体验在线AI服务 (ChatGPT/Claude)
- 掌握基础Prompt技巧

### 进阶阶段 (3-4周)
- 本地部署Ollama
- 配置VSCode + Continue.dev
- 使用AI辅助编程

### 高级阶段 (持续)
- Prompt工程技巧
- AI Agent应用
- RAG知识库构建

## 🛠️ 技术栈

- 静态网站 (HTML/CSS/JS)
- 托管于 GitHub Pages
- Vercel 部署配置

## 📄 目录结构

```
ai/
├── index.html          # 首页
├── pages/            # 页面目录
│   ├── tools.html
│   ├── tutorials.html
│   ├── notes.html
│   ├── resources.html
│   ├── ai-news.html
│   ├── ai-coding-path.html
│   ├── prompt-engineering.html
│   └── continue-dev-guide.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── README.md
└── vercel.json
```

## 🤝 参与贡献

欢迎提交PR或issue！

1. Fork本仓库
2. 创建新分支
3. 提交更改
4. 发起Pull Request