### 阶段一：前端UI构建 (所见即所得)

*   [ ] **1.1: 创建页面文件**：在 `app/` 目录下创建新路由 `photo-restore/page.tsx`。
*   [ ] **1.2: 布局搭建**：在 `photo-restore/page.tsx` 中，仿照截图搭建一个两栏布局（左侧控制面板，右侧结果展示）。
*   [ ] **1.3: 构建左侧控制面板**：
    *   [ ] 创建新组件 `components/restore/restore-control-panel.tsx`。
    *   [ ] 组件内包含：标题"Origin Image"、一个文件上传区域（支持拖拽和点击选择）、一个水印开关（暂时仅做UI）、一个"Run"按钮。
*   [ ] **1.4: 构建右侧结果面板**：
    *   [ ] 创建新组件 `components/restore/restore-result-panel.tsx`。
    *   [ ] 组件内包含：标题"AI Photo Restore Image Result"、一个用于显示修复后图片的占位区域、一个下载按钮（暂时仅做UI）。
*   [ ] **1.5: 构建页面下方内容**：
    *   [ ] 在 `photo-restore/page.tsx` 中，添加"AI Photo Restore Examples"和"AI Photo Restore FAQ"部分，暂时使用静态内容填充。
*   [ ] **1.6: 组装页面**：将创建好的所有组件导入 `photo-restore/page.tsx` 并完成最终组装。

### **阶段二：后端逻辑与API集成 (服务器操作)**

*   [ ] **2.1: 创建Action文件**：在 `app/photo-restore/` 目录下创建 `actions.ts` 文件。
*   [ ] **2.2: 实现核心Action函数**：
    *   [ ] 在 `actions.ts` 中创建 `async function restoreImageAction(...)`。
    *   [ ] 此函数将接收前端上传的图片文件 `FormData`。
*   [ ] **2.3: 调用 `fal.ai` API**：
    *   [ ] 在 `restoreImageAction` 函数内部，使用 `@fal-ai/client` 库调用您提供的 `fal-ai/image-editing/photo-restoration` 模型。
    *   [ ] 我会在后端服务器操作中通过 `process.env.FAL_KEY` 来调用它，请确保这个环境变量在您的部署环境中是正确设置的。
*   [ ] **2.4: 预留积分逻辑接口**：
    *   [ ] 在调用API之前，添加明确的注释 `// TODO: 在此执行用户身份验证、积分检查与扣除逻辑`。

### **阶段三：前后端连接**

*   [ ] **3.1: 链接"Run"按钮**：
    *   [ ] 在 `restore-control-panel.tsx` 组件中，使用 React 的 `useFormState` Hook，将表单的提交操作指向我们创建的 `restoreImageAction`。
*   [ ] **3.2: 处理加载与结果**：
    *   [ ] 实现点击"Run"按钮后的加载状态（例如，按钮变为禁用并显示"Running..."）。
    *   [ ] 当 `restoreImageAction` 返回成功结果时，将修复后的图片URL传递给 `restore-result-panel.tsx` 并显示图片。
    *   [ ] 当返回错误时，在界面上显示错误信息。 