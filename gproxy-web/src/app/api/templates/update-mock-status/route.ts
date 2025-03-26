import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// 更新文件中的useMock状态
async function updateUseMockStatus(
  filePath: string,
  newStatus: boolean
): Promise<void> {
  try {
    // 读取文件内容
    const content = await readFile(filePath, "utf8");

    // 替换useMock的值
    const updatedContent = content.replace(
      /useMock:\s*(true|false)/i,
      `useMock: ${newStatus}`
    );

    // 写入更新后的内容
    await writeFile(filePath, updatedContent, "utf8");
  } catch (error) {
    console.error(`Error updating useMock status for ${filePath}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filePath, newStatus } = await request.json();

    if (!filePath || typeof newStatus !== "boolean") {
      return NextResponse.json(
        {
          error:
            "Invalid parameters. Required: filePath (string) and newStatus (boolean)",
        },
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

    // 更新文件状态
    await updateUseMockStatus(fullPath, newStatus);

    return NextResponse.json({
      success: true,
      message: `Updated useMock status for ${filePath} to ${newStatus}`,
    });
  } catch (error) {
    console.error("Error updating mock status:", error);
    return NextResponse.json(
      { error: "Failed to update mock status" },
      { status: 500 }
    );
  }
}
