import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

// 递归获取目录下所有文件
async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? await getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

// 从JS文件中提取描述信息
async function extractDescriptionFromFile(
  filePath: string
): Promise<string | null> {
  try {
    const content = await readFile(filePath, "utf8");

    // 查找注释中的描述
    const descriptionMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
    if (descriptionMatch && descriptionMatch[1]) {
      return descriptionMatch[1].trim();
    }

    // 如果没有找到注释块，尝试找到单行注释
    const singleLineMatch = content.match(/\/\/\s*(.*)/);
    if (singleLineMatch && singleLineMatch[1]) {
      return singleLineMatch[1].trim();
    }

    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// 检查文件中的useMock设置
async function checkUseMockStatus(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, "utf8");
    const useMockMatch = content.match(/useMock:\s*(true|false)/i);
    return useMockMatch ? useMockMatch[1].toLowerCase() === "true" : false;
  } catch (error) {
    console.error(`Error checking useMock status for ${filePath}:`, error);
    return false;
  }
}

export async function GET() {
  try {
    // 项目中templates目录的绝对路径
    const templatesDir = path.join(process.cwd(), "..", "src", "templates");

    // 获取所有JS文件
    const allFiles = await getFiles(templatesDir);
    const jsFiles = allFiles.filter((file) => file.endsWith(".js"));

    // 处理文件信息
    const templates = await Promise.all(
      jsFiles.map(async (file, index) => {
        const relativePath = path
          .relative(templatesDir, file)
          .replace(/\\/g, "/");
        const filename = path.basename(file);
        const description = await extractDescriptionFromFile(file);
        const useMock = await checkUseMockStatus(file);

        return {
          id: String(index + 1),
          path: relativePath,
          filename,
          useMock,
          description,
        };
      })
    );

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
