const { logger } = require("../utils/logger");
const { mockService } = require("../services/mockService");
const { createProxyMiddleware } = require("http-proxy-middleware");

/**
 * Mock代理中间件
 * 根据请求路径返回对应的Mock数据
 */
const mockProxyMiddleware = async (req, res, next) => {
  try {
    // 获取原始URL路径（不含域名）
    const path = req.originalUrl.replace("/proxy", "");
    const method = req.method.toLowerCase();

    logger.info(`收到Mock请求: ${method.toUpperCase()} ${path}`);

    // 检查是否应该使用mock数据
    const shouldUseMock = mockService.shouldUseMock(path);

    // 如果配置为不使用mock，直接转发到真实服务
    if (!shouldUseMock) {
      logger.info(
        `配置为不使用mock数据，转发请求: ${method.toUpperCase()} ${path}`
      );
      return next();
    }

    // 尝试处理动态模板
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      const resourceType = segments[0];
      const template = mockService.getDynamicTemplate(resourceType);

      if (template) {
        let handler = null;

        // 检查是否有ID参数的路径
        if (segments.length > 1) {
          const id = segments[1];
          req.params.id = id;
          handler = template[`${method}/:id`];
        } else {
          handler = template[method];
        }

        if (handler) {
          logger.info(`使用动态模板处理请求: ${method} ${path}`);

          // 添加延迟模拟网络请求
          const delay = parseInt(process.env.MOCK_DELAY || "200", 10);
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          const result = handler(req.params, req.query, req.body);

          // 自定义状态码支持
          const statusCode = result.statusCode || 200;
          if (result.statusCode) {
            delete result.statusCode;
          }

          return res.status(statusCode).json(result);
        }
      }
    }

    // 获取标准Mock数据
    const mockData = mockService.getMockData(
      path,
      method,
      req.params,
      req.query,
      req.body
    );

    if (mockData) {
      logger.info(`使用预设模板处理请求: ${method} ${path}`);

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

    // 没有找到匹配的Mock模板，转发到真实服务
    logger.info(
      `未找到匹配的Mock数据，转发请求: ${method.toUpperCase()} ${path}`
    );

    // 调用下一个中间件(真实代理)
    return next();
  } catch (error) {
    logger.error("Mock中间件错误", { error });
    next(error);
  }
};

// 创建真实代理中间件
const createRealProxy = (pathRewritePrefix = "^/proxy") => {
  const target = process.env.TARGET_SERVICE_URL;

  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: pathRewritePrefix
      ? {
          [pathRewritePrefix]: "",
        }
      : null,
    logLevel: "warn",
    onProxyReq: (proxyReq, req, res) => {
      logger.debug(`代理请求: ${req.method} ${req.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      const statusCode = proxyRes.statusCode;
      logger.debug(`代理响应: ${statusCode} ${req.method} ${req.path}`);

      // 如果是404响应，且路径带有/proxy前缀，则尝试直接请求原服务
      if (
        statusCode === 404 &&
        req.originalUrl.startsWith("/proxy") &&
        !req._retried
      ) {
        logger.info(
          `检测到404响应，将尝试直接请求原服务: ${req.method} ${req.originalUrl}`
        );

        // 标记请求已重试，防止循环
        req._retried = true;

        // 取消当前响应
        proxyRes.destroy();

        // 创建直接的请求URL（去掉proxy前缀）
        const directUrl = req.originalUrl.replace("/proxy", "");

        // 记录直接请求的URL
        logger.info(`直接请求URL: ${directUrl}`);

        // 创建一个新的请求到目标服务器
        const options = {
          method: req.method,
          headers: { ...req.headers },
        };

        // 删除可能导致问题的头部
        delete options.headers.host;

        const targetUrl = target + directUrl;
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

          logger.debug(
            `直接请求响应: ${proxyRes.statusCode} ${req.method} ${directUrl}`
          );
        });

        // 错误处理
        proxyReq.on("error", (err) => {
          logger.error(`直接请求错误: ${err.message}`, { error: err });
          if (!res.headersSent) {
            res.status(500).json({
              success: false,
              message: "直接请求原服务失败",
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

        // 返回以阻止后续处理
        return;
      }
    },
    onError: (err, req, res) => {
      logger.error(`代理错误: ${err.message}`, { error: err });
      res.status(500).json({
        success: false,
        message: "代理请求失败",
        error: err.message,
      });
    },
  };

  return createProxyMiddleware(proxyOptions);
};

/**
 * 混合代理中间件
 * 先尝试匹配Mock数据，没有匹配到则转发到真实服务
 */
const hybridProxyMiddleware = (req, res, next) => {
  // 先尝试匹配Mock数据
  mockProxyMiddleware(req, res, (err) => {
    if (err) {
      return next(err);
    }

    // 如果mockProxyMiddleware没有处理请求(没有找到匹配的Mock数据)
    // 则使用真实代理中间件处理
    const realProxy = createRealProxy("^/proxy");
    return realProxy(req, res, next);
  });
};

module.exports = {
  mockProxyMiddleware,
  hybridProxyMiddleware,
};
