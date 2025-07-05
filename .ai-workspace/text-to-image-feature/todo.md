# TODO: 构建"文生图"功能骨架 (MVP)

### 第一阶段: 后端设置 (API 路由)

- [ ] 1. **创建 API 路由:** 在 `app/api/generate/route.ts` 创建一个新的 API 路由，用于处理图像生成请求。
- [ ] 2. **集成 OpenRouter.ai 服务:**
    - [ ] a. 安装 `openai` npm 包。
    - [ ] b. 在 API 路由中初始化 OpenRouter 客户端 (使用 `openai` 包，并指定 OpenRouter 的 `baseURL` 和 `API Key`)。
    - [ ] c. 实现调用 OpenRouter 的文生图模型 (我们将以 `stabilityai/stable-diffusion-3-medium` 作为初始模型)。
- [ ] 3. **安全处理:** 确保 `OPENROUTER_API_KEY` 从环境变量中安全读取，绝不暴露在客户端。

### 第二阶段: 前端页面与组件

- [ ] 4. **创建生成页面:** 在 `app/generate/page.tsx` 创建一个新的页面，作为文生图功能的主界面。
- [ ] 5. **创建表单组件:** 在 `components/features/generate-form.tsx` (新目录) 创建一个客户端组件，用于处理用户交互。
    - [ ] a. 添加一个`<textarea>`用于输入提示词 (Prompt)。
    - [ ] b. 添加一个`<button>`用于提交。
    - [ ] c. 添加状态管理 (e.g., `useState`) 来处理加载状态、错误信息和返回的图片URL。
- [ ] 6. **创建服务器操作 (Server Action):**
    - 在 `app/generate/actions.ts` 创建一个新的 Server Action 文件。
    - 该 Action 将接收来自前端表单的 prompt。
    - 它将调用我们创建的 `/api/generate` 路由。
    - 它将处理 API 返回的结果（成功或失败），并将其返回给前端组件。

### 第三阶段: 连接前后端

- [ ] 7. **连接表单与 Action:** 在 `generate-form.tsx` 中，将表单的 `onSubmit` 事件与创建的 Server Action 连接起来。
- [ ] 8. **结果展示:**
    - 在 `generate-form.tsx` 中，根据 Action 返回的结果：
        - 如果成功，使用 `<img>` 标签显示生成的图片。
        - 如果失败，使用 `form-message.tsx` 组件显示错误信息。
        - 在请求期间，禁用提交按钮并显示加载指示器。

### 第四阶段: 路由与收尾

- [ ] 9. **添加入口:** 在网站的 `header.tsx` 中添加一个指向 `/generate` 页面的导航链接。
- [ ] 10. **功能测试:** 完整测试从输入 prompt到显示图片的整个流程。 