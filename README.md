# 情侣每日菜单 / 私房菜谱

一个移动端优先的 React + Vite 网页应用，用 `localStorage` 保存菜品、照片、做法、做过次数和最近做菜日期。

## 运行

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 部署到固定网址

这个项目可以直接部署到 Vercel 或 Netlify。构建命令：

```bash
npm run build
```

产物目录：

```text
dist
```

部署后仍使用浏览器本地存储，手机数据不会和电脑自动同步。请定期在“我的”页导出 JSON 备份。

手机 Safari 可以通过“分享”里的“添加到主屏幕”把它当作 App 打开。

## 已实现

- 菜单首页：搜索、分类筛选、菜品卡片、空状态
- 分类管理：首页分类条可新增、改名、删除分类
- 添加菜品：上传图片预览、分类、食材、步骤、备注
- 菜品详情：大图、食材、步骤、备注、记录“今天就吃这个”
- 编辑和删除：本地更新，删除前二次确认
- 随机推荐：首页弹窗推荐和独立随机页
- 我的页面：菜品总数、做得最多、最近做过、分类统计
- 数据备份：在“我的”页导出/导入 JSON 备份，适合手机长期保存
- 本地持久化：刷新后数据不丢失

## 数据存储

当前版本使用浏览器 `localStorage`，数据 key 为：

```text
couple-private-menu-dishes
couple-private-menu-categories
```

后续接入云端数据库时，可以优先替换 `src/hooks/useDishes.jsx` 里的数据读写逻辑。
