require('dotenv').config();
const OpenAI = require('openai');
const RSSParser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const Turndown = require('turndown');
const fs = require('fs').promises;
const path = require('path');

class AIContentAgent {
    constructor(config = {}) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'ollama',
            baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1'
        });
        
        this.rssParser = new RSSParser();
        this.turndown = new Turndown();
        
        this.config = {
            websitePath: config.websitePath || '../ai',
            contentCategories: {
                'news': 'pages/ai-news.html',
                'tutorials': 'pages/tutorials.html',
                'tools': 'pages/tools.html',
                'resources': 'pages/resources.html',
                'guides': 'pages/guide.html'
            },
            rssFeeds: [
                { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: 'news' },
                { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: 'news' },
                { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: 'news' },
                { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml', category: 'news' },
                { name: 'AI Weekly', url: 'https://aiweekly.co/issues/rss', category: 'news' }
            ],
            searchKeywords: [
                'AI agent', 'LLM', '大模型', 'RAG', 'Prompt工程',
                'AI编程', 'Copilot', '开源AI', '本地部署'
            ],
            ...config
        };
        
        this.learningLog = [];
        this.contentHistory = [];
    }
    
    async initialize() {
        console.log('🚀 初始化AI内容Agent...');
        await this.ensureDirectoryStructure();
        await this.loadLearningLog();
        console.log('✅ Agent初始化完成');
    }
    
    async ensureDirectoryStructure() {
        const dirs = [
            'data',
            'data/knowledge',
            'data/logs',
            'data/cache',
            'generated'
        ];
        
        for (const dir of dirs) {
            try {
                await fs.mkdir(path.join(__dirname, dir), { recursive: true });
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }
        }
    }
    
    async loadLearningLog() {
        try {
            const logPath = path.join(__dirname, 'data/learning_log.json');
            const data = await fs.readFile(logPath, 'utf8');
            this.learningLog = JSON.parse(data);
        } catch {
            this.learningLog = [];
        }
    }
    
    async saveLearningLog() {
        const logPath = path.join(__dirname, 'data/learning_log.json');
        await fs.writeFile(logPath, JSON.stringify(this.learningLog, null, 2));
    }
    
    async run() {
        console.log('\n📚 ========== 开始运行AI内容Agent ==========\n');
        
        try {
            // 1. 获取最新AI知识
            console.log('📥 步骤1: 获取最新AI知识...');
            const knowledge = await this.gatherKnowledge();
            
            // 2. 分析和筛选内容
            console.log('🔍 步骤2: 分析和筛选内容...');
            const valuableContent = await this.analyzeContent(knowledge);
            
            // 3. 生成新内容
            console.log('✍️ 步骤3: 生成新内容...');
            const generatedContent = await this.generateContent(valuableContent);
            
            // 4. 整合到网站
            console.log('🌐 步骤4: 整合到网站...');
            await this.integrateContent(generatedContent);
            
            // 5. 自我演进学习
            console.log('🧠 步骤5: 自我演进学习...');
            await this.learnAndEvolve(knowledge, generatedContent);
            
            console.log('\n✅ ========== Agent运行完成 ==========\n');
            
        } catch (error) {
            console.error('❌ Agent运行错误:', error);
            await this.logError(error);
        }
    }
    
    async gatherKnowledge() {
        const knowledge = {
            rssArticles: [],
            searchResults: [],
            githubProjects: [],
            arxivPapers: [],
            timestamp: new Date().toISOString()
        };
        
        // 获取RSS feeds
        console.log('  📰 获取RSS订阅...');
        for (const feed of this.config.rssFeeds) {
            try {
                const articles = await this.fetchRSSFeed(feed);
                knowledge.rssArticles.push(...articles.map(a => ({ ...a, source: feed.name })));
                console.log(`    ✓ 从 ${feed.name} 获取 ${articles.length} 篇文章`);
            } catch (error) {
                console.error(`    ✗ 获取 ${feed.name} 失败:`, error.message);
            }
        }
        
        // 获取GitHub热门项目
        console.log('  🐙 获取GitHub热门项目...');
        try {
            knowledge.githubProjects = await this.fetchGitHubTrending();
            console.log(`    ✓ 获取 ${knowledge.githubProjects.length} 个热门项目`);
        } catch (error) {
            console.error('    ✗ 获取GitHub失败:', error.message);
        }
        
        // 获取ArXiv论文
        console.log('  📄 获取ArXiv最新论文...');
        try {
            knowledge.arxivPapers = await this.fetchArxivPapers();
            console.log(`    ✓ 获取 ${knowledge.arxivPapers.length} 篇论文`);
        } catch (error) {
            console.error('    ✗ 获取ArXiv失败:', error.message);
        }
        
        // 搜索关键词
        console.log('  🔍 搜索关键词...');
        try {
            knowledge.searchResults = await this.searchKeywords();
            console.log(`    ✓ 获取 ${knowledge.searchResults.length} 条搜索结果`);
        } catch (error) {
            console.error('    ✗ 搜索失败:', error.message);
        }
        
        return knowledge;
    }
    
    async fetchRSSFeed(feed) {
        const articles = [];
        try {
            const parsed = await this.rssParser.parseURL(feed.url);
            parsed.items.slice(0, 10).forEach(item => {
                articles.push({
                    title: item.title,
                    link: item.link,
                    description: item.contentSnippet || item.content || item.summary,
                    pubDate: item.pubDate,
                    category: feed.category
                });
            });
        } catch (error) {
            console.warn(`RSS feed error for ${feed.name}:`, error.message);
        }
        return articles;
    }
    
    async fetchGitHubTrending() {
        const projects = [];
        try {
            const response = await axios.get('https://api.github.com/search/repositories', {
                params: {
                    q: 'AI OR machine-learning OR LLM',
                    sort: 'stars',
                    order: 'desc',
                    per_page: 10
                },
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            response.data.items.forEach(repo => {
                projects.push({
                    name: repo.full_name,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    url: repo.html_url,
                    language: repo.language,
                    topics: repo.topics
                });
            });
        } catch (error) {
            console.warn('GitHub API error:', error.message);
        }
        return projects;
    }
    
    async fetchArxivPapers() {
        const papers = [];
        try {
            const keyword = this.config.searchKeywords[Math.floor(Math.random() * this.config.searchKeywords.length)];
            const response = await axios.get(`http://export.arxiv.org/api/query`, {
                params: {
                    search_query: `all:${keyword}`,
                    max_results: 10,
                    sortBy: 'submittedDate',
                    sortOrder: 'descending'
                }
            });
            
            const $ = cheerio.load(response.data, { xmlMode: true });
            $('entry').each((i, entry) => {
                papers.push({
                    title: $(entry).find('title').text().trim(),
                    summary: $(entry).find('summary').text().trim().substring(0, 300),
                    published: $(entry).find('published').text(),
                    url: $(entry).find('id').text()
                });
            });
        } catch (error) {
            console.warn('ArXiv API error:', error.message);
        }
        return papers;
    }
    
    async searchKeywords() {
        const results = [];
        const keywords = this.config.searchKeywords.slice(0, 3);
        
        for (const keyword of keywords) {
            try {
                // 使用OpenAI的浏览能力或搜索API
                const completion = await this.openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || "llama3",
                    messages: [{
                        role: "system",
                        content: "你是一个AI领域的信息收集助手。请用中文总结关于这个主题的最新动态，生成3个要点。"
                    }, {
                        role: "user", 
                        content: `搜索并总结关于"${keyword}"的最新进展和趋势，格式化为JSON数组：[{topic, summary, key_points}]`
                    }]
                });
                
                const response = completion.choices[0].message.content;
                try {
                    const parsed = JSON.parse(response);
                    results.push(...parsed.map(p => ({ ...p, keyword })));
                } catch {
                    results.push({ topic: keyword, summary: response, key_points: [] });
                }
            } catch (error) {
                console.warn(`Search error for ${keyword}:`, error.message);
            }
        }
        
        return results;
    }
    
    async analyzeContent(knowledge) {
        console.log('  使用AI分析内容价值...');
        
        const prompt = `你是一个AI内容编辑专家。请分析以下收集到的内容，筛选出最有价值的3-5条，用于更新AI学习资源网站。

请按以下格式输出JSON数组：
[{
  "title": "内容标题",
  "summary": "简要总结",
  "category": "分类(news/tutorials/tools/resources/guides)",
  "priority": 1-5,
  "source": "来源",
  "url": "链接(如果有)",
  "tags": ["标签1", "标签2"]
}]

内容来源：
${JSON.stringify(knowledge, null, 2)}

请只返回JSON数组，不要有其他内容。`;
        
        try {
            const completion = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "llama3",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            });
            
            const response = completion.choices[0].message.content;
            const valuableContent = JSON.parse(response.match(/\[[\s\S]*\]/)[0]);
            
            console.log(`  ✓ 筛选出 ${valuableContent.length} 条有价值内容`);
            return valuableContent;
            
        } catch (error) {
            console.error('  ✗ 内容分析失败:', error.message);
            return [];
        }
    }
    
    async generateContent(valuableContent) {
        const generated = [];
        
        for (const content of valuableContent) {
            try {
                console.log(`  ✍️ 生成内容: ${content.title}`);
                
                const prompt = `你是一个专业的AI技术博客作者。请为以下主题撰写一篇高质量的教程/新闻文章。

主题：${content.title}
分类：${content.category}
摘要：${content.summary}
来源：${content.source}
链接：${content.url || '无'}

要求：
1. 使用中文撰写
2. 适合AI学习者的水平
3. 包含实用的代码示例（如果适用）
4. 包含相关的资源链接
5. 格式为HTML，包含适当的标签
6. 长度适中（500-1000字）

请直接输出HTML内容，不需要包含<!DOCTYPE html>等标签。`;
                
                const completion = await this.openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || "llama3",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8
                });
                
                generated.push({
                    ...content,
                    htmlContent: completion.choices[0].message.content,
                    generatedAt: new Date().toISOString()
                });
                
            } catch (error) {
                console.error(`  ✗ 生成内容失败 ${content.title}:`, error.message);
            }
        }
        
        return generated;
    }
    
    async integrateContent(generatedContent) {
        console.log('  📝 更新网站内容...');
        
        for (const content of generatedContent) {
            try {
                const categoryFile = this.config.contentCategories[content.category];
                if (!categoryFile) continue;
                
                const filePath = path.join(this.config.websitePath, categoryFile);
                
                // 读取现有文件
                let fileContent;
                try {
                    fileContent = await fs.readFile(filePath, 'utf8');
                } catch {
                    console.warn(`  ⚠ 文件不存在: ${categoryFile}`);
                    continue;
                }
                
                // 生成新的内容块
                const newContentBlock = this.generateContentBlock(content);
                
                // 根据分类找到合适的插入位置
                const insertPoint = this.findInsertPoint(fileContent, content.category);
                
                if (insertPoint !== -1) {
                    fileContent = fileContent.slice(0, insertPoint) + 
                                  newContentBlock + 
                                  fileContent.slice(insertPoint);
                    
                    await fs.writeFile(filePath, fileContent);
                    console.log(`  ✓ 已更新: ${content.title}`);
                    
                    this.contentHistory.push({
                        title: content.title,
                        file: categoryFile,
                        integratedAt: new Date().toISOString()
                    });
                }
                
            } catch (error) {
                console.error(`  ✗ 整合内容失败:`, error.message);
            }
        }
        
        // 更新首页最新内容
        await this.updateIndexPage(generatedContent);
    }
    
    generateContentBlock(content) {
        const date = new Date(content.generatedAt).toLocaleDateString('zh-CN');
        
        return `
        <div class="content-item" data-priority="${content.priority}">
            <h4>${content.title}</h4>
            <p class="content-meta">来源: ${content.source} | 发布日期: ${date}</p>
            <p>${content.summary}</p>
            ${content.url ? `<a href="${content.url}" target="_blank" rel="noopener">阅读更多 →</a>` : ''}
            ${content.tags ? `<div class="tags">${content.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        </div>`;
    }
    
    findInsertPoint(content, category) {
        const patterns = {
            'news': /<div class="news-items">/,
            'tutorials': /<div class="tutorial-list">/,
            'tools': /<div class="tool-list">/,
            'resources': /<div class="resource-list">/,
            'guides': /<div class="guide-list">/
        };
        
        const pattern = patterns[category];
        if (!pattern) return -1;
        
        const match = content.match(pattern);
        if (match && match.index !== undefined) {
            return match.index + match[0].length;
        }
        
        return -1;
    }
    
    async updateIndexPage(generatedContent) {
        try {
            const indexPath = path.join(this.config.websitePath, 'index.html');
            let indexContent = await fs.readFile(indexPath, 'utf8');
            
            // 更新最近更新列表
            const recentUpdates = generatedContent.slice(0, 3).map(c => 
                `<li><a href="${this.config.contentCategories[c.category]}">${c.title}</a></li>`
            ).join('\n');
            
            const recentPattern = /<ul id="recent-list">[\s\S]*?<\/ul>/;
            const recentMatch = indexContent.match(recentPattern);
            
            if (recentMatch) {
                const newRecentList = `<ul id="recent-list">\n${recentUpdates}\n</ul>`;
                indexContent = indexContent.replace(recentPattern, newRecentList);
                await fs.writeFile(indexPath, indexContent);
                console.log('  ✓ 首页已更新');
            }
            
        } catch (error) {
            console.error('  ✗ 更新首页失败:', error.message);
        }
    }
    
    async learnAndEvolve(knowledge, generatedContent) {
        console.log('  🧠 记录学习成果...');
        
        const learning = {
            timestamp: new Date().toISOString(),
            knowledgeGathered: {
                rssArticles: knowledge.rssArticles.length,
                githubProjects: knowledge.githubProjects.length,
                arxivPapers: knowledge.arxivPapers.length,
                searchResults: knowledge.searchResults.length
            },
            contentGenerated: generatedContent.length,
            topicsCovered: generatedContent.map(c => c.title),
            successful: generatedContent.length > 0
        };
        
        this.learningLog.push(learning);
        
        // 只保留最近100条学习记录
        if (this.learningLog.length > 100) {
            this.learningLog = this.learningLog.slice(-100);
        }
        
        await this.saveLearningLog();
        
        // 根据学习成果调整策略
        await this.adjustStrategy();
        
        // 生成学习报告
        await this.generateLearningReport();
    }
    
    async adjustStrategy() {
        console.log('  📊 分析学习模式，优化策略...');
        
        try {
            const recentLogs = this.learningLog.slice(-10);
            const successRate = recentLogs.filter(l => l.successful).length / recentLogs.length;
            
            const prompt = `你是一个AI学习策略优化专家。请根据以下数据优化Agent的学习策略：

学习记录统计：
- 最近10次运行成功率: ${(successRate * 100).toFixed(1)}%
- 总共生成内容: ${this.learningLog.reduce((sum, l) => sum + l.contentGenerated, 0)}条
- 最近覆盖的主题: ${recentLogs.flatMap(l => l.topicsCovered).slice(-10).join(', ') || '无'}

请生成优化建议，包括：
1. 应该增加关注哪些主题
2. 哪些RSS源最有价值
3. 内容生成的最佳长度和风格
4. 更新频率建议

请用JSON格式输出：
{
  "suggested_keywords": ["关键词1", "关键词2"],
  "valuable_feeds": ["feed1", "feed2"],
  "content_style": "风格建议",
  "update_frequency": "建议频率"
}`;
            
            const completion = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "llama3",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            });
            
            const response = completion.choices[0].message.content;
            try {
                const optimizations = JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
                
                // 应用优化建议
                if (optimizations.suggested_keywords) {
                    this.config.searchKeywords = [...new Set([
                        ...this.config.searchKeywords,
                        ...optimizations.suggested_keywords
                    ])];
                }
                
                console.log('  ✓ 策略优化完成');
                console.log('    新关键词:', this.config.searchKeywords.slice(0, 5).join(', '));
                
            } catch {
                console.log('  ⚠ 策略优化解析失败');
            }
            
        } catch (error) {
            console.error('  ✗ 策略优化失败:', error.message);
        }
    }
    
    async generateLearningReport() {
        console.log('  📝 生成学习报告...');
        
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalRuns: this.learningLog.length,
                totalContentGenerated: this.learningLog.reduce((sum, l) => sum + l.contentGenerated, 0),
                averageSuccessRate: (this.learningLog.filter(l => l.successful).length / this.learningLog.length * 100).toFixed(1) + '%'
            },
            recentActivity: this.learningLog.slice(-5),
            topTopics: this.getTopTopics(),
            contentHistory: this.contentHistory.slice(-10)
        };
        
        const reportPath = path.join(__dirname, 'data/learning_report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log('  ✓ 学习报告已保存');
    }
    
    getTopTopics() {
        const topicCounts = {};
        this.contentHistory.forEach(h => {
            const words = h.title.split(/[^\u4e00-\u9fa5a-zA-Z0-9]/);
            words.forEach(word => {
                if (word.length > 2) {
                    topicCounts[word] = (topicCounts[word] || 0) + 1;
                }
            });
        });
        
        return Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count }));
    }
    
    async logError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            message: error.message,
            stack: error.stack
        };
        
        const logPath = path.join(__dirname, 'data/logs/error_log.json');
        
        try {
            let logs = [];
            try {
                const existing = await fs.readFile(logPath, 'utf8');
                logs = JSON.parse(existing);
            } catch {}
            
            logs.push(errorLog);
            if (logs.length > 50) logs = logs.slice(-50);
            
            await fs.writeFile(logPath, JSON.stringify(logs, null, 2));
        } catch (err) {
            console.error('Failed to log error:', err);
        }
    }
}

// 调度器
class AgentScheduler {
    constructor(agent) {
        this.agent = agent;
        this.schedule = require('node-schedule');
    }
    
    start() {
        console.log('⏰ 启动Agent调度器...\n');
        
        // 每6小时运行一次
        const rule = new this.schedule.RecurrenceRule();
        rule.hour = new this.schedule.Range(0, 23, 6);
        
        this.schedule.scheduleJob(rule, async () => {
            console.log('\n🕐 定时任务触发');
            await this.agent.run();
        });
        
        // 也支持手动运行
        console.log('📌 使用 npm start 或 npm run dev 手动运行Agent');
    }
}

// CLI入口
if (require.main === module) {
    const agent = new AIContentAgent({
        websitePath: path.join(__dirname, '../ai')
    });
    
    agent.initialize().then(() => {
        const scheduler = new AgentScheduler(agent);
        
        if (process.argv.includes('--once')) {
            // 只运行一次
            agent.run().then(() => process.exit(0));
        } else {
            // 启动调度器
            scheduler.start();
            agent.run(); // 立即运行一次
        }
    }).catch(err => {
        console.error('初始化失败:', err);
        process.exit(1);
    });
}

module.exports = { AIContentAgent, AgentScheduler };
