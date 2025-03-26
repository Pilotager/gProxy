import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// 重启服务的函数
async function restartService() {
  try {
    // 根据实际部署环境选择合适的重启命令
    // 这里提供几种常见的重启方式，请根据实际情况选择或修改

    // 开发环境，模拟重启服务
    console.log("模拟重启服务...");

    // 记录重启尝试
    const { stdout } = await execAsync(
      'echo "Service restart attempt logged at $(date)"'
    );
    console.log(stdout);

    // 模拟重启延迟
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 生产环境选项:
    // 1. PM2: await execAsync('pm2 restart gproxy');
    // 2. Systemd: await execAsync('sudo systemctl restart gproxy');
    // 3. Docker: await execAsync('docker restart gproxy-container');

    return { success: true, message: "Service restart initiated" };
  } catch (error) {
    console.error("Error restarting service:", error);
    throw new Error(`Failed to restart service: ${error}`);
  }
}

// POST 请求处理 - 重启服务
export async function POST() {
  try {
    const result = await restartService();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/service/restart:", error);
    return NextResponse.json(
      { error: "Failed to restart service" },
      { status: 500 }
    );
  }
}
