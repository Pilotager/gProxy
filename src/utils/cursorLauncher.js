const { exec } = require('child_process');
const os = require('os');
const { logger } = require('./logger');

/**
 * 直接启动Cursor编辑器打开指定文件
 * @param {String} filePath - 要打开的文件路径
 * @returns {Promise<boolean>} 是否成功启动
 */
const launchCursor = (filePath) => {
  return new Promise((resolve, reject) => {
    // 根据不同操作系统构建命令
    let command = '';
    const platform = os.platform();
    
    if (platform === 'darwin') {
      // macOS
      command = `open -a Cursor "${filePath}"`;
    } else if (platform === 'win32') {
      // Windows
      command = `start "" "Cursor" "${filePath}"`;
    } else if (platform === 'linux') {
      // Linux
      command = `cursor "${filePath}"`;
    } else {
      return reject(new Error(`不支持的操作系统: ${platform}`));
    }
    
    logger.info(`执行命令: ${command}`);
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`启动Cursor时出错: ${error.message}`, { error, stderr });
        return reject(error);
      }
      
      logger.info(`Cursor已启动打开文件: ${filePath}`);
      resolve(true);
    });
  });
};

module.exports = { launchCursor }; 
