const { logger } = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

/**
 * 请求日志中间件
 * 记录所有进入系统的请求信息
 */
const requestLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  const colorReset = "\x1b[0m"; // 移到函数作用域内，使其在整个函数中可用

  // 为每个请求生成唯一ID
  const requestId = uuidv4().substring(0, 8);
  req.requestId = requestId;

  // 处理完成后记录响应时间
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    const logLevel =
      statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

    logger[logLevel](
      `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms | IP: ${ip}`,
      {
        requestId,
        method,
        url: originalUrl,
        statusCode,
        duration,
        userAgent: req.get("user-agent") || "",
        referer: req.get("referer") || "",
        ip,
      }
    );

    // 同时在控制台输出彩色日志
    // 状态码颜色
    let statusColor = "\x1b[32m"; // 绿色
    if (statusCode >= 500) statusColor = "\x1b[31m"; // 红色
    else if (statusCode >= 400) statusColor = "\x1b[33m"; // 黄色

    // 方法颜色
    const methodColor = getMethodColor(method);

    // 性能指标颜色
    let durationColor = "\x1b[32m"; // 绿色 (<100ms)
    if (duration > 500) durationColor = "\x1b[31m"; // 红色 (>500ms)
    else if (duration > 100) durationColor = "\x1b[33m"; // 黄色 (100-500ms)

    const timestamp = formatTime(new Date());

    // 美化输出
    console.log(
      `\x1b[90m${timestamp}\x1b[0m │ ` +
        `${methodColor}${method.padEnd(7)}${colorReset} │ ` +
        `\x1b[36m${originalUrl}\x1b[0m │ ` +
        `${statusColor}${statusCode}${colorReset} │ ` +
        `${durationColor}${duration}ms${colorReset} │ ` +
        `\x1b[90m[${requestId}]\x1b[0m`
    );

    // 每个完整请求结束后添加分隔线
    console.log(
      "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
    );
  });

  // 控制台输出请求信息
  const timestamp = formatTime(new Date());
  const methodColor = getMethodColor(method);

  console.log(
    `\x1b[90m${timestamp}\x1b[0m │ ` +
      `${methodColor}${method.padEnd(7)}${colorReset} │ ` +
      `\x1b[35m接收\x1b[0m │ ` +
      `\x1b[36m${originalUrl}\x1b[0m │ ` +
      `\x1b[90mIP: ${ip}\x1b[0m │ ` +
      `\x1b[90m[${requestId}]\x1b[0m`
  );

  next();
};

/**
 * 根据HTTP方法获取对应的颜色代码
 */
function getMethodColor(method) {
  const colors = {
    GET: "\x1b[32m", // 绿色
    POST: "\x1b[34m", // 蓝色
    PUT: "\x1b[33m", // 黄色
    DELETE: "\x1b[31m", // 红色
    PATCH: "\x1b[35m", // 紫色
    OPTIONS: "\x1b[36m", // 青色
    HEAD: "\x1b[90m", // 灰色
  };

  return colors[method.toUpperCase()] || "\x1b[37m"; // 默认白色
}

/**
 * 格式化时间为易读格式
 */
function formatTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

module.exports = { requestLoggerMiddleware };
