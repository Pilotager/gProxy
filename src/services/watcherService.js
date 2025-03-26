const chokidar = require("chokidar");
const path = require("path");
const { logger } = require("../utils/logger");

/**
 * 文件监控服务
 * 用于监控模板文件和配置文件的变化，实现热加载
 */
class WatcherService {
  constructor(mockService) {
    this.mockService = mockService;
    this.watchers = [];
    this.isWatching = false;
  }

  /**
   * 启动文件监控
   */
  startWatching() {
    if (this.isWatching) {
      logger.warn("文件监控已经在运行中");
      return;
    }

    this.isWatching = true;

    // 监控模板目录
    const templatesDir = path.join(__dirname, "../templates");
    logger.info(`开始监控模板目录: ${templatesDir}`);

    const templatesWatcher = chokidar.watch(templatesDir, {
      ignored: /(^|[\/\\])\../, // 忽略点文件
      persistent: true,
      ignoreInitial: true, // 忽略初始扫描事件
    });

    // 监听文件变化事件
    templatesWatcher
      .on("add", (path) => this.handleTemplateChange("add", path))
      .on("change", (path) => this.handleTemplateChange("change", path))
      .on("unlink", (path) => this.handleTemplateChange("unlink", path));

    this.watchers.push(templatesWatcher);

    // 监控.env文件
    const envFile = path.join(process.cwd(), ".env");
    logger.info(`开始监控环境配置文件: ${envFile}`);

    const envWatcher = chokidar.watch(envFile, {
      persistent: true,
      ignoreInitial: true,
    });

    envWatcher.on("change", (path) => this.handleEnvChange(path));
    this.watchers.push(envWatcher);

    logger.info("文件监控服务已启动");
  }

  /**
   * 处理模板文件变化
   * @param {string} event - 事件类型 (add/change/unlink)
   * @param {string} filePath - 文件路径
   */
  handleTemplateChange(event, filePath) {
    if (!filePath.endsWith(".js")) return;

    // 清除 require 缓存
    const relativePath = path.relative(__dirname, filePath);
    const modulePath = require.resolve(filePath);

    logger.info(`检测到模板文件变化: ${event} - ${relativePath}`);

    try {
      // 删除缓存
      delete require.cache[modulePath];

      // 重新加载所有模板
      this.mockService.reloadTemplates();

      logger.info(`成功重新加载模板: ${relativePath}`);
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
      console.log(
        `\x1b[32m[热加载]\x1b[0m 成功重新加载模板文件: ${relativePath}`
      );
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
    } catch (error) {
      logger.error(`重新加载模板失败: ${relativePath}`, { error });
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
      console.log(
        `\x1b[31m[热加载]\x1b[0m 重新加载模板失败: ${relativePath} - ${error.message}`
      );
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
    }
  }

  /**
   * 处理环境配置文件变化
   * @param {string} filePath - 文件路径
   */
  handleEnvChange(filePath) {
    logger.info(`检测到环境配置文件变化: ${filePath}`);

    try {
      // 重新加载环境变量
      const dotenv = require("dotenv");
      dotenv.config({ path: filePath, override: true });

      logger.info("成功重新加载环境配置");
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
      console.log(`\x1b[32m[热加载]\x1b[0m 成功重新加载环境配置文件`);
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
    } catch (error) {
      logger.error(`重新加载环境配置失败`, { error });
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
      console.log(
        `\x1b[31m[热加载]\x1b[0m 重新加载环境配置文件失败 - ${error.message}`
      );
      console.log(
        "\x1b[90m-------------------------------------------------------------------------\x1b[0m"
      );
    }
  }

  /**
   * 停止文件监控
   */
  stopWatching() {
    if (!this.isWatching) {
      return;
    }

    this.watchers.forEach((watcher) => {
      watcher.close();
    });

    this.watchers = [];
    this.isWatching = false;
    logger.info("文件监控服务已停止");
  }
}

module.exports = { WatcherService };
