# 流程串联验证指南

## 🧪 **验证步骤**

### 1. 准备工作

```bash
# 确保开发服务器正在运行
npm run dev
# 访问 http://localhost:3001
```

### 2. 打开开发者工具

- 按 F12 打开开发者工具
- 切换到 Console 标签页
- 切换到 Network 标签页

### 3. 验证流程

#### 步骤 1: 引导页面

- ✅ 页面应该显示 "Scan a Menu" 标题
- ✅ 点击 "扫描菜单" 按钮
- ✅ 应该进入拍照界面

#### 步骤 2: 拍照界面

- ✅ 应该显示相机图标和拍照按钮
- ✅ 拍照或选择图片文件
- ✅ 应该开始显示进度条

#### 步骤 3: OCR 处理

- ✅ 控制台应该显示 OCR 处理日志
- ✅ 进度条应该从 10% 开始
- ✅ 应该显示加载动画

#### 步骤 4: Dify.ai 调用

- ✅ Network 标签页应该显示 `/api/analyze` 请求
- ✅ 控制台应该显示 Dify.ai 响应数据
- ✅ 进度条应该达到 80%

#### 步骤 5: 餐厅选择

- ✅ 应该显示 "选择餐厅" 标题
- ✅ 控制台应该显示解析的餐厅数据
- ✅ 应该显示从 Dify.ai 获取的真实餐厅列表

#### 步骤 6: 菜品展示

- ✅ 选择餐厅后应该显示菜品列表
- ✅ 应该显示从 Dify.ai 获取的真实菜品数据
- ✅ 不应该显示模拟数据

### 4. 调试要点

#### 检查控制台输出

```javascript
// 应该看到这些日志：
'Parsing Dify response: {...}';
'Raw restaurants from Dify: [...]';
'Parsed restaurants: [...]';
'Selected restaurant: {...}';
'Parsing dishes from Dify response: {...}';
'Raw dishes from Dify: [...]';
'Parsed dishes: [...]';
'Parsed categories: [...]';
```

#### 检查网络请求

- `/api/analyze` 应该返回 200 状态码
- 响应应该包含 `dishes` 和 `restaurants` 数组

#### 检查状态变化

```javascript
// 在控制台执行以下代码监控状态变化
const originalLog = console.log;
console.log = function (...args) {
  if (args[0]?.includes?.('state')) {
    originalLog('STATE CHANGE:', ...args);
  }
  originalLog.apply(console, args);
};
```

### 5. 常见问题排查

#### 问题 1: 停在 OCR 处理

- 检查 Tesseract.js 是否正确加载
- 检查图片格式是否支持
- 查看控制台错误信息

#### 问题 2: 停在餐厅选择

- 检查 Dify.ai API 响应格式
- 查看控制台中的 "Parsing Dify response" 日志
- 确认 `restaurants` 数组存在且不为空
- **新增**: 检查餐厅数据字段名是否匹配 (应该是 `displayName.text` 而不是 `name`)

#### 问题 3: 餐厅选择后卡在 loading

- **已修复**: 检查状态转换逻辑是否正确
- 确认 `restaurant_selection` → `querying` → `show_cards` 流程
- 查看控制台中的菜品解析日志
- 检查 Dify.ai 菜品数据字段名 (应该是 `gen_desc` 而不是 `summary`)

#### 问题 4: 显示模拟数据

- 确认已经移除了自动加载模拟数据的逻辑
- 检查是否触发了演示模式
- 查看控制台中的菜品解析日志

#### 问题 5: 状态不更新

- 检查 AppContext 是否正确配置
- 查看是否有 JavaScript 错误
- 确认所有状态转换函数都存在

### 6. 最新修复验证

#### 验证餐厅选择流程

1. **拍照后应该进入餐厅选择界面**
2. **餐厅列表应该显示真实的 Dify.ai 数据**
3. **选择餐厅后应该显示 1 秒的加载动画**
4. **然后应该显示真实的菜品数据**

#### 检查控制台日志

```javascript
// 应该看到这些日志：
'Parsing Dify response: {...}';
'Raw restaurants from Dify: [...]';
'Parsed restaurants: [...]';
'Selected restaurant: {...}';
'Parsing dishes from Dify response: {...}';
'Raw dishes from Dify: [...]';
'Parsed dishes: [...]';
'Parsed categories: [...]';
```

#### 检查数据格式

- **餐厅数据**: 应该包含 `id` 和 `displayName.text` 字段
- **菜品数据**: 应该包含 `gen_desc`、`category`、`price` 等字段
- **分类数据**: 应该从菜品数据自动生成

**注意**: 餐厅数据只包含基本信息 (id, name)，不包含地址、距离、评分等字段，这是 Dify.ai 的实际返回格式

### 7. 成功标志

✅ **流程串联成功** 的标志：

1. 从拍照到菜品展示的完整流程无中断
2. 所有数据都来自 Dify.ai API，不是模拟数据
3. 控制台显示完整的数据解析日志
4. 网络请求成功，响应数据格式正确
5. 状态机正确转换：`onboarding → idle → ocr_processing → restaurant_selection → show_cards`

### 8. 下一步开发

验证成功后，可以继续开发：

1. 完善餐厅匹配算法
2. 添加菜品详情页面
3. 实现图片服务集成
4. 优化用户交互体验
