# 📷 吃米的旅行日记 (Chimi's Travel Log)

> 记录路上的风景，也记录自己的成长。  
> 一个基于 **Clay Design Architecture** 打造的纯静态、双语交互式旅行日志与光影瀑布流图册。无需后端服务器，零构建部署于 GitHub Pages。

---

## 🌟 项目亮点

- **影院级宽屏 Banner**：高清 16:9 风光摄影展示，搭配 Plain Black 展陈体与柔和卡片视效。
- **纯图片主导瀑布流**：无子页面跳转烦恼，悬停即显标题信息，点击弹窗放大查看高斯模糊深色背景下的精美照片与图文故事。
- **动态 JSON 数据驱动**：无需修改 HTML，所有旅行日记统一由轻量级 JSON 管理。
- **原生双语支持 (ZH / EN)**：支持中英双语无缝切换，包括标题、描述、分类与模态框。
- **极简响应式设计**：完美适配桌面端、平板与手机视图。

---

## 🚀 本地开发与预览

由于项目采用 `fetch()` 异步加载 `data/stories.json` 数据，建议在本地使用简易 HTTP 服务器进行预览：

### 使用 Python（推荐）
在项目根目录下运行：
```bash
python -m http.server 8000
```
然后在浏览器中打开 [http://localhost:8000](http://localhost:8000)。

### 使用 Node.js / npx
```bash
npx serve .
```

---

## 📝 如何添加新的旅行日记篇章

所有旅行篇章数据均存放在项目根目录下的 [`data/stories.json`](data/stories.json) 中。**新增一篇旅行日记只需两步：**

### 第一步：准备图片资源
将新拍摄的旅行照片放入 `assets/` 文件夹中（例如 `assets/tibet_lake.jpg`），或者直接使用高清晰度 CDN/Unsplash 图片 URL。

### 第二步：编辑 `data/stories.json`
打开 `data/stories.json`，在 JSON 数组末尾添加一个新的日记对象：

```json
{
  "id": "tibet-linzhi-2026",
  "category": "tibet",
  "badge": "藏地 · Tibet",
  "date": "2026.04",
  "img": "assets/tibet_lake.jpg",
  "title": {
    "zh": "林芝 · 雪山下的桃花盛宴",
    "en": "Nyingchi · Peach Blossoms Under Snow Mountains"
  },
  "desc": {
    "zh": "四月的雪域江南，粉色桃花在绵延的雪山脚下盛开，尼洋河水静静淌过村庄。",
    "en": "Pink peach blossoms blooming beneath snow peaks as the Niyang River glides quietly past ancient Tibetan villages."
  },
  "location": {
    "zh": "📍 西藏 · 林芝嘎拉桃花村",
    "en": "📍 Nyingchi, Tibet"
  }
}
```

#### 📌 字段说明表

| 字段 key | 类型 | 示例 / 可选值 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | `string` | `"tibet-linzhi-2026"` | 篇章唯一标识符 |
| `category` | `string` | `"tibet"` \| `"mainland"` \| `"shanghai"` \| `"japan"` | 分类筛选标识，需与分类导航保持一致 |
| `badge` | `string` | `"藏地 · Tibet"` | 悬停卡片与弹窗中显示的分类标签 |
| `date` | `string` | `"2026.04"` | 出行年月 |
| `img` | `string` | `"assets/tibet.jpg"` 或 `URL` | 图片路径 |
| `title.zh` / `title.en` | `string` | 中/英文标题 | 篇章双语标题 |
| `desc.zh` / `desc.en` | `string` | 中/英文长文本 | 篇章放大弹窗中的详细故事描述 |
| `location.zh` / `location.en` | `string` | 中/英文地点 | 地点标签（例如 `📍 西藏 · 拉萨`） |

---

### 🤖 方式三：使用大模型一键生成篇章 (AI Prompt 提示词)

如果您希望使用大模型（如 ChatGPT / Claude / Gemini / DeepSeek）自动撰写并生成符合格式的旅行日记，只需复制以下提示词给大模型，并替换末尾的**【我的旅行素材信息】**即可：

> **📋 大模型专用提示词 (Prompt Template)**：
> 
> ```text
> 你是一个《吃米的旅行日记》网站的内容编辑助手。请根据我提供的旅行素材信息，生成符合项目规范的 JSON 数据条目，以便追加插入到项目的 `data/stories.json` 数组末尾。
>
> 必须严格遵守以下格式规范：
> 1. id: 使用小写英文与年月，如 "tibet-linzhi-2026"。
> 2. category: 必须且只能是以下四个合法分类之一：
>    - "tibet"    (藏地)
>    - "mainland" (内地)
>    - "shanghai" (上海)
>    - "japan"    (日本)
> 3. badge: 分类显示标签，对应为 "藏地 · Tibet" / "内地 · Mainland" / "上海 · Shanghai" / "日本 · Japan"。
> 4. date: 格式为 "YYYY.MM"（如 "2026.04"）。
> 5. img: 图片本地相对路径（如 "assets/nyingchi.jpg"）或高清晰度 CDN 图片 URL。
> 6. title: 包含 zh (中文标题) 和 en (英文标题)。标题风格精炼优雅、富有诗意与光影感。
> 7. desc: 包含 zh (中文详细故事描述，80-120字) 和 en (英文描述)。语言充满画面感与沉浸感。
> 8. location: 包含 zh (如 "📍 西藏 · 林芝嘎拉桃花村") 和 en (如 "📍 Nyingchi, Tibet")，带 Emoji 前缀。
>
> 【我的旅行素材信息】：
> - 目的地/地点：西藏林芝
> - 出行时间：2026年4月
> - 照片路径或链接：assets/nyingchi.jpg
> - 所见所感：在雪山脚下的嘎拉村，四月粉红色的野桃花盛开在尼洋河畔，风一吹吹落在青稞田里，景色非常震撼。
> 
> 请输出严格符合标准的 JSON 代码段，无需包含额外的说明文字。
> ```

---

## 🌐 部署说明 (GitHub Pages)

由于项目完全由静态文件构成：
1. 将本地修改 Commit 并 Push 到 GitHub 的 `main` 分支。
2. 在 GitHub 仓库设置中开启 **Pages**（Source 选择 `main` 分支根目录 `/`）。
3. 部署完成后即可通过 `https://<your-username>.github.io/<repo-name>/` 访问网站。

---

## 📂 项目结构指南

有关项目的深度架构设计、样式规范及 AI Agent 接手开发指南，请参阅 [`WIKI.md`](WIKI.md) 与 [`DESIGN.md`](DESIGN.md)。
