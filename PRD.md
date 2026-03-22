# Image Background Remover — MVP 需求文档

## 1. 项目概述

- **项目名称**：Image Background Remover
- **核心功能**：用户上传图片，自动去除背景，支持下载透明背景 PNG
- **技术方案**：Next.js 前端 + Next.js API Route 中转（隐藏 API Key）
- **第三方 API**：remove.bg

---

## 2. 功能需求

### 2.1 用户端（前端）

| 功能 | 描述 |
|------|------|
| 图片上传 | 支持点击上传，限制 JPG/PNG/WebP，最大 10MB |
| 拖拽上传 | 支持拖拽文件到上传区域 |
| 预览对比 | 上传后显示原图和处理后对比 |
| 下载结果 | 一键下载透明背景 PNG |
| 进度指示 | 处理中显示加载动画 |
| 错误提示 | API 失败或文件不合规时友好提示 |

### 2.2 后端（API Route）

| 功能 | 描述 |
|------|------|
| 代理转发 | 接收图片流，转发至 remove.bg API |
| Key 隐藏 | API Key 不暴露在客户端 |
| 格式转换 | remove.bg 返回 PNG，转发至前端 |
| 错误透传 | API 错误信息回传给前端 |

---

## 3. 非功能需求

- **性能**：处理时间依赖 remove.bg 响应速度（通常 2-5s）
- **免费额度**：remove.bg 免费 tier 50 张/月，超出需付费
- **无需存储**：图片不落盘，纯内存流处理
- **跨域**：同源部署，无 CORS 问题

---

## 4. 技术栈

- **前端**：Next.js 16 (App Router) + Tailwind CSS v4
- **后端**：Next.js API Route (Route Handler)
- **第三方**：remove.bg API

---

## 5. 部署流程

1. 克隆仓库
2. 安装依赖：`npm install`
3. 配置环境变量：复制 `.env.example` 为 `.env.local`，填入 `REMOVE_BG_API_KEY`
4. 开发模式：`npm run dev`
5. 生产部署：Vercel / Cloudflare Pages / 任意 Node.js 托管

---

## 6. 后续扩展方向（v2）

- 批量处理
- 历史记录（需引入存储）
- 自建模型（rembg）降低成本
- Additional output formats (JPG with white bg)
- API key usage tracking
