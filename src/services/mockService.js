const Mock = require("mockjs");
const path = require("path");
const fs = require("fs");
const { logger } = require("../utils/logger");

/**
 * Mock数据服务
 * 负责管理和生成Mock数据
 */
class MockService {
  constructor() {
    this.dynamicTemplates = {};
    this.templates = {};

    // 加载动态模板
    this.loadDynamicTemplates();
  }

  /**
   * 从模板目录加载动态模板，包括嵌套目录
   */
  loadDynamicTemplates() {
    try {
      const templatesDir = path.join(__dirname, "../templates");
      this._loadTemplatesFromDir(templatesDir, "");
    } catch (err) {
      logger.error("加载动态模板目录失败", { error: err });
    }
  }

  /**
   * 重新加载所有模板
   * 用于热加载功能
   */
  reloadTemplates() {
    logger.info("开始重新加载所有模板...");

    // 清空当前模板
    this.dynamicTemplates = {};
    this.templates = {};

    // 重新加载模板
    this.loadDynamicTemplates();

    logger.info(
      `模板重新加载完成，共加载 ${
        Object.keys(this.dynamicTemplates).length
      } 个动态模板`
    );
    return Object.keys(this.dynamicTemplates).length;
  }

  /**
   * 从指定目录递归加载模板文件
   * @param {string} dir - 目录路径
   * @param {string} prefix - 路径前缀
   * @private
   */
  _loadTemplatesFromDir(dir, prefix) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // 递归处理子目录
        this._loadTemplatesFromDir(
          itemPath,
          prefix ? `${prefix}/${item.name}` : item.name
        );
      } else if (item.isFile() && item.name.endsWith(".js")) {
        try {
          // 加载模板文件
          const templateModule = require(itemPath);
          const templateName = item.name.replace(".js", "");

          // 构建完整的路径名
          const fullPath = prefix ? `${prefix}/${templateName}` : templateName;

          this.dynamicTemplates[fullPath] = templateModule;
          logger.info(`已加载动态模板: ${fullPath}`);
        } catch (err) {
          logger.error(`加载动态模板失败: ${itemPath}`, { error: err });
        }
      }
    }
  }

  /**
   * 获取指定资源的动态模板
   * @param {string} resourcePath - 资源路径
   * @returns {object|null} - 资源对应的模板对象
   */
  getDynamicTemplate(resourcePath) {
    return this.dynamicTemplates[resourcePath] || null;
  }

  /**
   * 检查是否应该使用mock数据
   * @param {string} path - 请求路径
   * @returns {boolean} - 是否应该使用mock数据
   */
  shouldUseMock(path) {
    // 标准化路径
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

    // 尝试查找模板
    let segments = normalizedPath.split("/");
    let currentPath = "";

    // 从最长路径开始匹配
    for (let i = 0; i < segments.length; i++) {
      currentPath = segments.slice(0, segments.length - i).join("/");

      if (this.dynamicTemplates[currentPath]) {
        const template = this.dynamicTemplates[currentPath];
        // 如果模板有useMock属性，返回它的值
        if (typeof template.useMock !== "undefined") {
          logger.info(`API ${path} useMock设置为: ${template.useMock}`);
          return template.useMock;
        }
      }
    }

    // 默认情况
    return process.env.MOCK_ENABLED === "true";
  }

  /**
   * 获取匹配路径的Mock数据
   * @param {string} path - 请求路径
   * @param {string} method - 请求方法
   * @param {object} params - 路径参数
   * @param {object} query - 查询参数
   * @param {object} body - 请求体
   * @param {boolean} ignoreUseMock - 是否忽略useMock设置
   * @returns {object|null} - 生成的Mock数据或null
   */
  getMockData(
    path,
    method,
    params = {},
    query = {},
    body = {},
    ignoreUseMock = false
  ) {
    // 如果不应该使用mock数据，直接返回null
    if (!ignoreUseMock && !this.shouldUseMock(path)) {
      logger.info(`API ${path} 配置为不使用mock数据`);
      return null;
    }

    // 处理路径，去除前导斜杠
    let normalizedPath = path.startsWith("/") ? path.slice(1) : path;

    // 取?前面的路径
    normalizedPath = normalizedPath.split("?")[0];

    // 尝试从预设模板中匹配
    const key = `${method}:${normalizedPath}`;
    let template = this.templates[key];

    // 尝试匹配动态路由模板
    if (!template) {
      // 检查是否有带参数的路由模板匹配
      // 例如 /users/:id 匹配 /users/123
      const dynamicKeys = Object.keys(this.templates).filter((k) => {
        const [tMethod, tPath] = k.split(":");
        return tMethod === method && this.isPathMatch(tPath, normalizedPath);
      });

      if (dynamicKeys.length > 0) {
        template = this.templates[dynamicKeys[0]];
      }
    }

    // 检查动态模板 - 多级路径支持
    if (!template) {
      // 尝试直接匹配完整路径
      if (this.dynamicTemplates[normalizedPath]) {
        const template = this.dynamicTemplates[normalizedPath];
        const handler = template[method];

        if (handler) {
          return handler(params, query, body);
        }
      }

      // 检查是否有ID参数的路径匹配
      const pathSegments = normalizedPath.split("/");
      const lastSegment = pathSegments[pathSegments.length - 1];

      // 如果最后一段可能是ID
      if (pathSegments.length > 1) {
        const parentPath = pathSegments.slice(0, -1).join("/");

        if (this.dynamicTemplates[parentPath]) {
          const template = this.dynamicTemplates[parentPath];
          const handler = template[`${method}/:id`];

          if (handler) {
            params.id = lastSegment;
            return handler(params, query, body);
          }
        }
      }

      // 尝试匹配最接近的模板 - 从最长路径开始尝试
      let currentPath = normalizedPath;

      while (currentPath.includes("/")) {
        const template = this.dynamicTemplates[currentPath];

        if (template) {
          const handler = template[method];

          if (handler) {
            return handler(params, query, body);
          }
        }

        // 移除最后一个路径段，尝试匹配父路径
        currentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
      }
    }

    // 没有模板匹配
    if (!template) {
      return null;
    }

    // 如果模板是函数，调用函数
    if (typeof template === "function") {
      return template(params, query, body);
    }

    // 如果是对象，使用Mockjs处理模板
    return Mock.mock(template);
  }

  /**
   * 检查路径是否匹配模板路径
   * 例如 /users/:id 匹配 /users/123
   * @param {string} templatePath - 模板路径
   * @param {string} requestPath - 请求路径
   * @returns {boolean} - 是否匹配
   */
  isPathMatch(templatePath, requestPath) {
    const templateSegments = templatePath.split("/").filter(Boolean);
    const requestSegments = requestPath.split("/").filter(Boolean);

    if (templateSegments.length !== requestSegments.length) {
      return false;
    }

    return templateSegments.every((segment, index) => {
      // 如果是参数段（:id），则匹配
      if (segment.startsWith(":")) {
        return true;
      }
      return segment === requestSegments[index];
    });
  }

  /**
   * 添加新的Mock模板
   * @param {string} path - 请求路径
   * @param {string} method - 请求方法
   * @param {object|function} template - Mock模板或生成函数
   */
  addTemplate(path, method, template) {
    const key = `${method.toLowerCase()}:${path}`;
    this.templates[key] = template;
    logger.info(`添加Mock模板: ${key}`);
  }
}

const mockService = new MockService();

module.exports = { mockService };
