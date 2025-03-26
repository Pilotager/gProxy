const { logger } = require("../utils/logger");
const { mockService } = require("../services/mockService");
const path = require("path");
const { launchCursor } = require("../utils/cursorLauncher");

/**
 * 检查请求是否来自浏览器
 * @param {Object} req - 请求对象
 * @returns {Boolean} 是否是浏览器请求
 */
const isBrowserRequest = (req) => {
  const acceptHeader = req.headers.accept || "";
  const userAgent = req.headers["user-agent"] || "";

  // 浏览器通常会在Accept头中包含text/html
  const acceptsHtml = acceptHeader.includes("text/html");

  // 检查常见浏览器的User-Agent
  const isBrowserUA = /Mozilla|Chrome|Safari|Firefox|Edge|MSIE|Trident/.test(
    userAgent
  );

  return acceptsHtml && isBrowserUA;
};

/**
 * 处理直接请求的中间件（不经过/proxy前缀）
 * 用于模拟直接对域名API的访问
 */
const directRequestMiddleware = async (req, res, next) => {
  try {
    // 获取原始URL路径
    const reqPath = req.originalUrl;
    const method = req.method.toLowerCase();

    // 忽略已经由其他路由处理的路径
    if (
      reqPath === "/" ||
      reqPath.startsWith("/api") ||
      reqPath.startsWith("/proxy") ||
      reqPath === "/health"
    ) {
      return next();
    }

    logger.info(`收到直接API请求: ${method.toUpperCase()} ${reqPath}`);

    // 添加CORS头，确保请求可以跨域访问
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );

    // 处理预检请求
    if (method === "options") {
      return res.status(200).end();
    }

    // 尝试处理动态模板
    const normalizedPath = reqPath.startsWith("/") ? reqPath.slice(1) : reqPath;

    // 检查是否应该使用mock数据
    const shouldUseMock = mockService.shouldUseMock(reqPath);

    // 检查请求是否来自浏览器，如果是浏览器直接请求并且应该使用mock，则打开mock文件
    if (isBrowserRequest(req) && shouldUseMock) {
      // 查找对应的模板文件路径
      const pathSegments = normalizedPath.split("/");
      const mockFilePath =
        path.join(__dirname, "../templates", ...pathSegments) + ".js";

      // 尝试用Cursor打开文件
      try {
        await launchCursor(mockFilePath);

        // 返回简单成功页面
        res.set("Content-Type", "text/html");
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>已启动Cursor</title>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                text-align: center;
                color: #333;
              }
              .success {
                background: #e8f8e8;
                border-radius: 5px;
                padding: 20px;
                margin-bottom: 20px;
                font-size: 18px;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 10px;
                color: #2ecc71;
              }
              a {
                color: #3498db;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="icon">✓</div>
            <div class="success">
              <p>Cursor已启动并打开mock文件:<br><strong>${mockFilePath}</strong></p>
            </div>
            <p><a href="/">返回首页</a></p>
          </body>
          </html>
        `);
        return;
      } catch (error) {
        logger.error(`打开Cursor失败: ${error.message}`, { error });
        // 失败后继续正常流程处理请求
      }
    }

    if (shouldUseMock) {
      // 获取标准Mock数据
      const mockData = mockService.getMockData(
        normalizedPath,
        method,
        req.params,
        req.query,
        req.body,
        true // 忽略useMock设置，因为我们已经检查过了
      );

      if (mockData) {
        logger.info(`直接请求使用模板处理: ${method} ${reqPath}`);

        // 添加延迟模拟网络请求
        const delay = parseInt(process.env.MOCK_DELAY || "200", 10);
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // 自定义状态码支持
        const statusCode = mockData.statusCode || 200;
        if (mockData.statusCode) {
          delete mockData.statusCode;
        }

        return res.status(statusCode).json(mockData);
      }
    }

    // 没有找到匹配的Mock数据或配置为不使用mock，直接转发到真实服务
    logger.info(
      `${
        !shouldUseMock ? "配置为不使用mock数据" : "未找到匹配的Mock数据"
      }，直接转发请求: ${method.toUpperCase()} ${reqPath}`
    );

    // 创建一个新的请求到目标服务器
    const target = process.env.TARGET_SERVICE_URL;
    const options = {
      method: req.method,
      headers: { ...req.headers },
    };

    // 删除可能导致问题的头部
    delete options.headers.host;

    const targetUrl = target + reqPath;
    logger.info(`直接请求完整URL: ${targetUrl}`);

    // 使用http或https模块直接发送请求
    const httpModule = target.startsWith("https")
      ? require("https")
      : require("http");
    const proxyReq = httpModule.request(targetUrl, options, (proxyRes) => {
      // 复制状态码和头部
      res.statusCode = proxyRes.statusCode;
      Object.keys(proxyRes.headers).forEach((key) => {
        res.setHeader(key, proxyRes.headers[key]);
      });

      // 设置CORS头
      if (req.headers.origin) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      }

      // 管道原始响应到客户端
      proxyRes.pipe(res);

      // 记录响应状态
      const statusCode = proxyRes.statusCode;
      logger.debug(`直接转发响应: ${statusCode} ${req.method} ${reqPath}`);

      // 记录接口状态，无论成功或失败
      if (statusCode >= 400) {
        logger.warn(`接口错误: ${statusCode} ${req.method} ${reqPath}`);
      }
    });

    // 错误处理
    proxyReq.on("error", (err) => {
      logger.error(`直接转发错误: ${err.message}`, { error: err });
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "直接转发请求失败",
          error: err.message,
        });
      }
    });

    // 如果原始请求有body，转发它
    if (req.body && Object.keys(req.body).length > 0) {
      proxyReq.write(JSON.stringify(req.body));
    }

    // 结束请求
    proxyReq.end();

    // 不再调用next()，因为我们已经处理了请求
    return;
  } catch (error) {
    logger.error("直接请求中间件错误", { error });
    next(error);
  }
};

module.exports = { directRequestMiddleware };
