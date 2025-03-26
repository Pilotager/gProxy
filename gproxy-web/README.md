# gProxy Web UI

这是 gProxy Mock 数据代理服务的 Web 管理界面，使用 Next.js、React、TypeScript 和 shadcn/ui 构建。

## 功能特点

- **直观的界面**：清晰的仪表盘提供服务状态和使用情况概览
- **模板管理**：便捷创建和管理 Mock 数据模板
- **代理配置**：灵活设置 API 代理规则和参数
- **系统设置**：全面的系统配置选项
- **响应式设计**：适配桌面和移动设备的界面

## 技术栈

- **框架**：[Next.js](https://nextjs.org/)
- **UI 库**：[shadcn/ui](https://ui.shadcn.com/)
- **样式**：[Tailwind CSS](https://tailwindcss.com/)
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **状态管理**：React Hooks
- **HTTP 客户端**：[Axios](https://axios-http.com/)
- **表单处理**：[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建或修改 `.env.local` 文件：

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_ENABLED=true
NEXT_PUBLIC_MOCK_DELAY=200
```

### 启动开发服务

```bash
npm run dev
```

然后在浏览器中访问 `http://localhost:3000`。

### 构建生产版本

```bash
npm run build
npm start
```

## 开发指南

### 目录结构

```
gproxy-web/
├── src/                    # 源代码目录
│   ├── app/                # Next.js 应用路由
│   │   ├── dashboard/      # 仪表盘页面
│   │   ├── templates/      # 模板管理页面
│   │   ├── proxy/          # 代理配置页面
│   │   ├── settings/       # 设置页面
│   │   └── api/            # API 路由处理
│   ├── components/         # React 组件
│   │   ├── ui/             # UI 基础组件
│   │   ├── templates/      # 模板相关组件
│   │   └── layout/         # 布局组件
│   └── lib/                # 工具函数和服务
│       ├── api/            # API 请求封装
│       └── utils/          # 通用工具函数
├── public/                 # 静态资源
├── .env.local              # 本地环境变量
└── README.md               # 项目说明文档
```

### 添加新页面

1. 在 `src/app` 目录下创建对应的路由目录和 `page.tsx` 文件
2. 如需服务端数据，可添加 `loading.tsx` 和 `error.tsx` 组件

### 添加新组件

1. 在 `src/components` 目录下创建组件文件
2. 为可复用组件编写明确的类型定义和注释

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
