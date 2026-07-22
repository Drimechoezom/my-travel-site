# 📖 项目架构 Wiki 与 Agent 协作手册 (Developer & AI Agent Handbook)

> **致接手项目的开发者与 AI Agent**：  
> 本 Wiki 详细记录了《吃米的旅行日记》的软件架构、设计范式、数据接口规范及核心实现细节。在对本项目进行扩展、修改或重构时，**必须严格遵守本文及 `DESIGN.md` 中定义的准则**。

---

## 目录
1. [系统架构与设计哲学](#1-系统架构与设计哲学)
2. [核心模块与目录树](#2-核心模块与目录树)
3. [设计范式 (Design System & Tokens)](#3-设计范式-design-system--tokens)
4. [核心功能实现机制](#4-核心功能实现机制)
5. [AI Agent 接手与维护规范](#5-ai-agent-接手与维护规范)

---

## 1. 系统架构与设计哲学

### 1.1 零后端纯静态架构 (Zero-Backend Architecture)
本项目专为 **GitHub Pages** 等静态托管平台设计，不依赖任何 Node.js 服务端、数据库或复杂的打包编译工具链（如 Webpack/Vite）。所有页面逻辑由原生 HTML5、CSS3 及 ES6+ JavaScript 直接驱动。

### 1.2 数据与展示分离 (Data-Driven Separation)
网站所有旅行篇章数据统一由根目录下的 `data/stories.json` 驱动。`index.html` 保持纯洁语义骨架，`app.js` 负责异步加载数据并完成 DOM 节点的构建与重绘。

### 1.3 优雅降级与本地离线兼容 (Graceful Degradation)
为了避免在未启动本地 HTTP 服务器、直接以 `file://` 协议打开 HTML 时因 CORS 导致页面空白，`app.js` 内置了完备的 Fallback 数据集。即使 `fetch()` 异常，页面也能无缝降级并完整展示。

---

## 2. 核心模块与目录树

```
my-travel-site/
├── README.md              # 面向使用者的安装、预览与添加内容说明
├── WIKI.md                # 面向 Agent 与维护者的架构与规范指南（本文）
├── DESIGN.md              # Claymation Design System 设计系统规范
├── index.html             # 单页应用 (SPA) 语义 HTML5 骨架
├── style.css              # 全局设计 Token、组件样式与响应式断点
├── app.js                 # 数据加载引擎、双语切换、瀑布流与弹窗交互逻辑
├── data/
│   └── stories.json       # 旅行故事结构化数据库
├── assets/
│   ├── hero.jpg           # Hero 影院级宽屏风光展示大图
│   ├── hero_clay.jpg      # 品牌 3D 泥塑视效备用图
│   └── ...                # 篇章摄影图片库
```

---

## 3. 设计范式 (Design System & Tokens)

项目的视觉风格遵循 **Claymation-meets-data Design System**。在编写或修改 CSS 时，**必须使用 `style.css` 中定义的 CSS Custom Properties**：

### 3.1 核心色彩 Token (Color Tokens)

```css
:root {
  /* 页面画布与背景 */
  --color-canvas: #fffaf0;            /* 暖奶油调画布底色 */
  --color-surface-soft: #f5f0e0;       /* 柔和表面卡片色 */
  --color-surface-card: #ebe6d6;       /* 高亮卡片/悬停色 */
  
  /* 墨黑文字与品牌色 */
  --color-ink: #0a0a0a;               /* 纯黑标题墨色 */
  --color-body-strong: #2c2c2c;       /* 正文文字色 */
  --color-muted: #666055;             /* 辅助说明文字色 */
  
  /* 品牌主色 */
  --color-primary: #0a0a0a;           /* 主按钮黑调 */
  --color-brand-pink: #e6557e;         /* 品牌徽标粉 */
  --color-hairline: rgba(10, 10, 10, 0.12); /* 超细分割线 */
}
```

### 3.2 字体与排版规范 (Typography)
- **展陈标题 (`--font-display`)**：优先使用 `Plain Black` 500 权重，备用字体链包含 `"Smiley Sans"`, `"STYuanti"`, `"PingFang SC"`, `sans-serif`。标题需设置紧凑字距 `letter-spacing: -1.5px`。
- **正文文字 (`--font-body`)**：使用 `"Inter"`, `sans-serif`。
- **圆角规范 (`--radius-xl`)**：大型卡片与图片统一采用 `24px` 柔和圆角（`var(--radius-xl)`）。

---

## 4. 核心功能实现机制

### 4.1 动态 JSON 渲染引擎
`app.js` 启动后自动触发 `loadStoriesData()`，获取 `data/stories.json` 后调用 `renderWaterfall()`。

```javascript
// 渲染逻辑示例
stories.forEach(story => {
  const isVisible = currentFilter === 'all' || story.category === currentFilter;
  const article = document.createElement('article');
  article.className = 'waterfall-item';
  article.style.display = isVisible ? 'block' : 'none';
  // 动态拼装卡片 HTML 并在点击时绑定 openModal(story)
});
```

### 4.2 双语 i18n 切换系统
- **静态文本**：HTML 元素通过 `data-zh` 和 `data-en` 属性绑定双语文本。点击语言切换按钮时，遍历 `querySelectorAll('[data-zh][data-en]')` 更新内容。
- **动态 JSON 文本**：`renderWaterfall()` 和 `openModal()` 直接根据全局状态 `currentLang` 提取 `story.title[currentLang]` 和 `story.desc[currentLang]`。

### 4.3 纯 CSS 瀑布流 (CSS Masonry)
瀑布流容器 `.travel-waterfall` 采用了标准的 CSS Multi-Column 布局，避免使用重型 JS 布局库：

```css
.travel-waterfall {
  column-count: 3;
  column-gap: var(--spacing-xl);
}

.waterfall-item {
  break-inside: avoid;
  display: block;
  margin-bottom: var(--spacing-xl);
}
```

### 4.4 照片沉浸放大弹窗 (Lightbox Modal)
点击任何瀑布流照片卡片均会触发模态框：
- 沉浸式高斯模糊背景：`background: rgba(10, 10, 10, 0.88)` + `backdrop-filter: blur(12px)`。
- **布局规范**：照片位于上方 (`.lightbox-media` max-height 58vh)，标题、日期、地点及详细文字描述位于照片正下方 (`.lightbox-body`)。

---

## 5. AI Agent 接手与维护规范

当未来的 AI Agent (如 Antigravity / Gemini / Claude) 接收到用户的修改指令时，**必须遵循以下标准工作流程**：

### ❌ 严禁行为 (Forbidden Actions)
1. **严禁硬编码**：切勿在 `index.html` 中直接硬编码新的旅行篇章卡片；所有篇章改动必须更新 `data/stories.json`。
2. **严禁破坏设计 Token**：切勿引入未经定义的原生颜色（如纯红 `#ff0000` 或浅蓝 `#0000ff`），所有颜色必须继承自 `style.css` 的变量。
3. **严禁破坏双语系统**：添加或修改静态 HTML 元素时，必须同时提供 `data-zh` 与 `data-en` 两个属性。

### ✅ 推荐规范 (Recommended Workflow)
1. **修改前校验**：先阅读 `DESIGN.md` 和 `WIKI.md` 了解现有 Token 与结构。
2. **新增分类**：若用户要求新增/修改分类，需同步更新：
   - `index.html` 中的 `.category-tab` 按钮及其 `data-filter` 值。
   - `data/stories.json` 中的 `category` 键值。
   - `app.js` 中的 `fallbackStories` 数组。
3. **端到端验证**：修改完成后，必须在终端启动 `python -m http.server`，使用 `browser_subagent` 验证页面呈现与点击交互正常无误。
