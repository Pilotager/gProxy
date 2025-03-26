import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

// 读取 .env 文件
const readEnvFile = async (): Promise<{ [key: string]: string }> => {
  try {
    // 项目根目录的路径
    const rootDir = process.cwd();
    const envFilePath = path.join(rootDir, "..", ".env");
    console.log("envFilePath", envFilePath);

    // 检查文件是否存在
    if (!fs.existsSync(envFilePath)) {
      return { PORT: "" }; // 如果文件不存在，返回默认端口
    }

    // 读取文件内容
    const fileContent = await fsPromises.readFile(envFilePath, "utf-8");

    // 解析环境变量
    const envVars: { [key: string]: string } = {};
    fileContent.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        const value = valueParts.join("=").trim();
        if (key && value) {
          envVars[key.trim()] = value.replace(/^["'](.*)["']$/, "$1"); // 移除可能的引号
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error("Error reading .env file:", error);
    throw new Error("Failed to read environment variables");
  }
};

// 写入 .env 文件
const writeEnvFile = async (envVars: {
  [key: string]: string;
}): Promise<void> => {
  try {
    // 项目根目录的路径
    const rootDir = process.cwd();
    const envFilePath = path.join(rootDir, ".env");

    // 构建文件内容
    const fileContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    // 写入文件
    await fsPromises.writeFile(envFilePath, fileContent, "utf-8");
  } catch (error) {
    console.error("Error writing .env file:", error);
    throw new Error("Failed to update environment variables");
  }
};

// GET 请求处理 - 获取当前端口
export async function GET() {
  try {
    const envVars = await readEnvFile();
    const port = envVars.PORT || ""; // 如果没有设置PORT，返回默认值

    return NextResponse.json({ port }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/settings/env-port:", error);
    return NextResponse.json(
      { error: "Failed to retrieve PORT from .env file" },
      { status: 500 }
    );
  }
}

// POST 请求处理 - 更新端口
export async function POST(request: NextRequest) {
  try {
    const { port } = await request.json();

    // 验证端口格式是否正确
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      return NextResponse.json(
        { error: "Invalid port number. Must be between 1 and 65535." },
        { status: 400 }
      );
    }

    // 读取当前环境变量
    const envVars = await readEnvFile();

    // 更新PORT值
    envVars.PORT = port.toString();

    // 写入更新后的环境变量
    await writeEnvFile(envVars);

    return NextResponse.json({ success: true, port }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/settings/env-port:", error);
    return NextResponse.json(
      { error: "Failed to update PORT in .env file" },
      { status: 500 }
    );
  }
}
