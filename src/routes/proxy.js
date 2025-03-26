const express = require("express");
const { hybridProxyMiddleware } = require("../middlewares/mockProxyMiddleware");
const { logger } = require("../utils/logger");

const router = express.Router();

// 浏览器访问代理路由时，显示代理中间件的实现
router.use(async (req, res, next) => {
  next();
});

// 配置代理
router.use("/", hybridProxyMiddleware);

logger.info("代理模式：先尝试匹配Mock数据，如果没有匹配的模板则转发到真实服务");

module.exports = router;
