import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { routeName, mockData } = body;

    if (!routeName || !mockData) {
      return NextResponse.json(
        { success: false, error: "路由名称和Mock数据不能为空" },
        { status: 400 }
      );
    }

    const baseDir = path.join(process.cwd(), "..", "src", "templates");

    // 确保路由名称格式正确
    const normalizedRouteName = routeName
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

    // 如果路由包含路径分隔符，则创建嵌套目录
    const routeNameParts = normalizedRouteName.split("/");
    const fileName = routeNameParts.pop() || normalizedRouteName;

    // 构建目录路径
    let dirPath = baseDir;
    if (routeNameParts.length > 0) {
      dirPath = path.join(baseDir, ...routeNameParts);
    }

    // 确保目录存在
    await fs.promises.mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${fileName}.js`);

    // 写入mock数据到文件
    // 格式化为模块导出格式
    const fileContent = `${mockData}`;

    await fs.promises.writeFile(filePath, fileContent, "utf8");

    // 返回成功响应
    return NextResponse.json({
      success: true,
      path: filePath.replace(process.cwd(), ""),
    });
  } catch (error) {
    console.error("创建Mock文件失败:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
