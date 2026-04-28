# AI学习资源站 - 项目规则

## 部署
- 单分支 `main`，push 即部署（GitHub Actions → GitHub Pages）
- 网站改完后直接 `git add` + `git commit` + `git push`，无需询问
- 旧的 Vercel 配置已清理，不要引入

## 内容验证
- 修改/新增网站内容后，确认 HTML 页面确实渲染了目标内容
- 不要只改源文件就报完成，要核对页面输出

## 环境约束
- 环境用 DeepSeek API 中转，`/config` 命令不可用
- 改模型/配置直接编辑 `~/.claude/settings.json`

## 技术栈
- 纯静态网站，不引入外部框架或依赖
- CSS 使用 `css/style.css` 中定义的 CSS 变量色板
- 所有页面中文编写，UTF-8 编码

## 规则更新
- 对话中提到的任何新偏好或规则，自动更新到此文件
