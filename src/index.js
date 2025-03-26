const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { logger, initLogger } = require("./utils/logger");
const { setupRoutes } = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const {
  requestLoggerMiddleware,
} = require("./middlewares/requestLoggerMiddleware");
const {
  directRequestMiddleware,
} = require("./middlewares/directRequestMiddleware");
const { WatcherService } = require("./services/watcherService");
const { mockService } = require("./services/mockService");

// 加载环境变量
dotenv.config();

// 初始化日志
initLogger();

// 创建文件监控服务
const watcherService = new WatcherService(mockService);

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(
  cors({
    // 允许特定的域名，而不是使用通配符
    origin: (origin, callback) => {
      const allowedOrigins = ["*"];
      // 允许服务器内部请求（无origin）或指定的域名
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(null, allowedOrigins[0]); // 默认允许第一个域名
      }
    },
    credentials: true, // 允许携带凭据
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 请求日志中间件 - 记录所有请求
app.use(requestLoggerMiddleware);

// 直接请求处理中间件 - 不经过/proxy前缀的API请求
app.use(directRequestMiddleware);

// 设置路由
setupRoutes(app);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const server = app.listen(PORT, () => {
  logger.info(`服务器启动成功，监听端口 ${PORT}`);
  console.log(
    `\x1b[32m服务器已启动\x1b[0m - 访问 \x1b[34mhttp://localhost:${PORT}\x1b[0m`
  );

  // 启动文件监控 (热加载)
  if (process.env.HOT_RELOAD !== "false") {
    watcherService.startWatching();
    console.log("\x1b[32m热加载\x1b[0m - 已启用模板和配置文件的热加载功能");
  }
});

// 优雅关闭
process.on("SIGTERM", () => {
  logger.info("收到 SIGTERM 信号，正在关闭服务器...");
  watcherService.stopWatching();
  server.close(() => {
    logger.info("服务器已关闭");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("收到 SIGINT 信号，正在关闭服务器...");
  watcherService.stopWatching();
  server.close(() => {
    logger.info("服务器已关闭");
    process.exit(0);
  });
});

// 未捕获的异常处理
process.on("uncaughtException", (error) => {
  logger.error("未捕获的异常", { error });
  console.error("\x1b[31m[未捕获的异常]\x1b[0m", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("未处理的Promise拒绝", { reason });
  console.error("\x1b[31m[未处理的Promise拒绝]\x1b[0m", reason);
});
