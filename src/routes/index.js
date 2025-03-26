const proxyRoutes = require("./proxy");

/**
 * 设置应用的所有路由
 * @param {Express} app - Express应用实例
 */
const setupRoutes = (app) => {
  // 健康检查端点
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  // 代理路由 - 可切换真实/Mock数据
  app.use("/", proxyRoutes);

  // 注意：直接请求处理由directRequestMiddleware处理
  // 不需要在这里添加额外的路由处理
};

module.exports = { setupRoutes };
