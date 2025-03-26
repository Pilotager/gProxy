import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export async function GET(request: NextRequest) {
  try {
    // 获取文件路径参数
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 }
      );
    }

    // 构建文件的完整路径
    const templatesDir = path.join(process.cwd(), "..", "src", "templates");
    const fullPath = path.join(templatesDir, filePath);

    // 安全检查：确保路径在templates目录内
    if (!fullPath.startsWith(templatesDir)) {
      return NextResponse.json(
        { error: "Invalid file path. Must be within templates directory" },
        { status: 400 }
      );
    }

    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 读取文件内容
    const content = await readFile(fullPath, "utf8");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching template content:", error);
    return NextResponse.json(
      { error: "Failed to fetch template content" },
      { status: 500 }
    );
  }
}
