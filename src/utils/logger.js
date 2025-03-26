const winston = require("winston");
const path = require("path");
const fs = require("fs");

// 创建日志目录
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 日志级别颜色
const levelColors = {
  error: "\x1b[31m", // 红色
  warn: "\x1b[33m", // 黄色
  info: "\x1b[32m", // 绿色
  http: "\x1b[36m", // 青色
  verbose: "\x1b[35m", // 紫色
  debug: "\x1b[34m", // 蓝色
  silly: "\x1b[90m", // 灰色
};

// 格式化时间
const timestampFormat = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

// 日志格式化
const logFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  }
);

// 控制台日志格式化
const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, ...meta }) => {
    const color = levelColors[level] || "\x1b[37m"; // 默认白色
    const reset = "\x1b[0m";
    const levelStr = level.toUpperCase().padEnd(7);
    const metaStr =
      Object.keys(meta).length && meta.service !== "gproxy"
        ? ` | ${JSON.stringify(meta, null, 0)}`
        : "";

    return `\x1b[90m${timestamp}\x1b[0m │ ${color}${levelStr}${reset} │ ${color}${message}${reset}${metaStr}`;
  }
);

// 创建日志记录器
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: timestampFormat }),
    winston.format.errors({ stack: true }),
    winston.format.splat()
  ),
  defaultMeta: { service: "gproxy" },
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(consoleFormat),
    }),
  ],
});

/**
 * 初始化日志系统
 * 读取并应用环境变量中的日志配置
 */
const initLogger = () => {
  // 读取环境变量中的日志级别
  const logLevel = process.env.LOG_LEVEL || "info";
  logger.level = logLevel;

  // 读取环境变量中的日志文件路径
  const logFile = process.env.LOG_FILE || path.join(logDir, "app.log");
  const logFilePath = path.isAbsolute(logFile)
    ? logFile
    : path.join(process.cwd(), logFile);

  // 确保日志目录存在
  const logFileDir = path.dirname(logFilePath);
  if (!fs.existsSync(logFileDir)) {
    fs.mkdirSync(logFileDir, { recursive: true });
  }

  // 更新文件传输配置
  logger.transports.forEach((transport) => {
    if (
      transport instanceof winston.transports.File &&
      transport.level !== "error"
    ) {
      transport.filename = logFilePath;
    }
  });

  // 打印系统启动日志
  logger.info("==================================================");
  logger.info(`日志系统初始化完成，级别: ${logLevel.toUpperCase()}`);
  logger.info(`应用日志文件: ${logFilePath}`);
  logger.info("==================================================");

  return logger;
};

module.exports = {
  logger,
  initLogger,
};
