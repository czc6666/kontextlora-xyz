# 待办清单：复刻 getimg.ai 模式

## 第一阶段：页面结构重构

1.  [ ] **创建新页面**: 在 `app/` 目录下创建一个新的路由 `generate/`，并在其中创建 `page.tsx` 文件，作为新的图片生成页面。
2.  [ ] **迁移现有功能**: 将当前 `app/page.tsx` 的全部内容和逻辑，迁移到新的 `app/generate/page.tsx` 中。
3.  [ ] **改造主页**: 清空 `app/page.tsx`，将其改造为新的展示型登陆页。
4.  [ ] **更新导航**: 修改主导航栏，将原有的 "Dashboard" 或类似按钮的链接指向新的 `/generate` 页面。

## 第二阶段：新主页 (Landing Page) UI 实现

1.  [ ] **实现 "Hero" 区域**: 在 `app/page.tsx` 中，创建包含主标题、副标题和 "Start creating for free" 按钮的核心展示区。
2.  [ ] **实现 "Powered by" 区域**: 在主标题下方，添加 "Powered by" 文字，并用文字形式展示 `FLUX`, `ByteDance`, `Google DeepMind`, `KLING`, `runway` 等合作伙伴。
3.  [ ] **实现图片画廊**: 在页面底部，创建一个图片网格，用于展示精选的AI生成作品。

## 第三阶段：图片生成页 (`/generate`) UI 大改造

1.  [ ] **重构侧边栏**: 这是最核心的一步，需要对 `generation-sidebar.tsx` 进行大改。
    *   [ ] **模型选择**: 添加一个下拉菜单用于选择模型，当前固定为 `Kwai-Kolors/Kolors`。
    *   [ ] **宽高比选择**: 添加一组按钮或下拉菜单用于选择宽高比 (如 `1:1`, `16:9`, `4:3` 等)，并根据选择自动更新宽度和高度值。
    *   [ ] **图片数量选择**: 添加一组按钮，让用户选择一次生成1, 2, 3, 或 4 张图片。
    *   [ ] **移除高级设置折叠**: 移除原有的"高级参数设置"折叠功能，让所有参数都直观可见。
2.  [ ] **重构结果区域**: 修改 `generation-results.tsx`。
    *   [ ] **实现占位符**: 当没有图片生成时，显示 "Created images will appear here." 的占位信息，并包含一个 "Use sample prompt" 按钮。
3.  [ ] **更新核心控制逻辑**: 修改 `image-generation-studio.tsx`，使其能处理和传递新的参数（如宽高比、图片数量等）。

---

我将严格按照此清单逐步执行。 