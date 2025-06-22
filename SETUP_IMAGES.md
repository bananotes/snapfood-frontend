# 图片功能设置指南

## 概述

SnapFood 应用现在支持自动获取菜品图片功能，包括缩略图和详情页图片轮播。

## 环境变量配置

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 复制环境变量模板
cp env.example .env.local
```

### 2. 配置 Dify API 密钥

编辑 `.env.local` 文件，添加您的 Dify API 密钥：

```env
# Dify API Configuration
DIFY_API_KEY_MATCHER=your_actual_dify_api_key_here

# 其他配置
NEXT_PUBLIC_APP_NAME=SnapFood
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. 获取 Dify API 密钥

1. 访问 [Dify.ai](https://dify.ai)
2. 创建或登录您的账户
3. 创建一个新的应用或使用现有应用
4. 在应用设置中找到 API 密钥
5. 复制 API 密钥并粘贴到 `.env.local` 文件中

## 功能特性

### 自动缩略图获取

- 当用户浏览菜品列表时，自动获取每个菜品的缩略图
- 支持缓存机制，避免重复请求
- 错误处理和重试机制
- 加载状态指示器

### 详情页图片轮播

- 在菜品详情页显示多张相关图片
- 支持触摸滑动、键盘导航
- 全屏查看和缩放功能
- 自动播放选项

### 缓存和性能优化

- 24小时图片缓存
- 请求去重和取消机制
- 错误重试和降级处理
- 移动端优化

## 测试功能

访问 `/image-test` 页面来测试图片获取功能：

1. 测试完整图片获取
2. 测试缩略图获取
3. 查看环境变量配置
4. 使用预设测试用例

## 故障排除

### 常见问题

1. **图片不显示**

   - 检查环境变量是否正确设置
   - 确认 Dify API 密钥有效
   - 查看浏览器控制台错误信息

2. **API 限流错误**

   - 系统会自动重试
   - 等待一段时间后重试
   - 检查 API 使用配额

3. **网络错误**
   - 检查网络连接
   - 确认防火墙设置
   - 查看 API 服务状态

### 调试步骤

1. 访问 `/image-test` 页面
2. 查看环境配置检查部分
3. 使用预设测试用例
4. 检查浏览器开发者工具的网络面板

## 技术实现

### Hook 结构

- `useDishImage`: 获取多张菜品图片
- `useDishThumbnail`: 获取单张缩略图

### 组件结构

- `ImageCarousel`: 图片轮播组件
- `DishCard`: 菜品卡片（集成缩略图）
- `DishListItem`: 菜品列表项（集成缩略图）
- `DishDetailModal`: 菜品详情模态框（集成图片轮播）

### API 端点

- `/api/image-matcher`: 图片匹配 API
- 支持参数：name, desc, gen_desc, category, count, place_id

## 更新日志

### v1.0.0

- 初始图片获取功能实现
- 自动缩略图获取
- 详情页图片轮播
- 缓存和错误处理机制
- 移动端优化
