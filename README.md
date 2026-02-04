# 二手交易平台 Demo

一个简约风格的二手交易平台网站。

## 项目结构

```
DemoPage/
├── index.html              # 主页
├── detail.html             # 商品详情页
├── css/
│   └── styles.css          # 全站样式
├── js/
│   ├── app.js              # 主页逻辑（搜索、排序、渲染）
│   ├── detail.js           # 详情页逻辑
│   └── i18n.js             # 国际化管理（多语言支持）
├── data/
│   ├── products.json       # 商品数据
│   └── i18n.json           # 翻译文本（中英文）
└── README.md               # 项目说明
```

## 功能

- **主页**: 浏览商品列表，按名称搜索商品
- **多语言支持**: 支持中文和英文切换，UI 文本自动翻译
- **语言感知排序**: 当切换语言时，优先显示对应语言的商品
- **详情页**: 查看商品完整信息（图片、价格、位置、卖家信息等）
- **联系卖家**: 弹出对话窗口，填写个人信息和留言后发送
- **现代设计**: 受 Notion 启发的简约设计，采用青色配色方案

## 运行

请使用本地服务器打开（避免 file:// 限制）：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js http-server
npx http-server

# 或在 VS Code 中使用 Live Server 扩展
```

然后在浏览器打开 `http://localhost:8000`

## 数据格式

商品数据存储在 `data/products.json`，每个商品包含以下字段：

```json
{
  "id": "p-1001",
  "name": "商品名称",
  "price": 159,
  "location": "所在城市",
  "condition": "新旧程度",
  "language": "zh",
  "image": "图片 URL",
  "description": "商品描述",
  "postedAt": "发布日期",
  "seller": {
    "name": "卖家名字",
    "phone": "卖家电话",
    "avatar": "头像 URL"
  }
}
```

### 字段说明

- `language`: 商品的语言标识（"zh" 中文，"en" 英文）- 用于语言感知排序

## 多语言系统

项目支持中文和英文，翻译文本存储在 `data/i18n.json`：

```json
{
  "zh": {
    "brand": "二手市集",
    "search": "搜索商品...",
    "empty": "没有找到相关商品",
    ...
  },
  "en": {
    "brand": "Second-hand Market",
    "search": "Search products...",
    "empty": "No products found",
    ...
  }
}
```

点击页面右上角的语言按钮可切换语言，用户的语言偏好会自动保存。
