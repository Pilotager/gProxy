import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";

export interface MockTemplate {
  id: string;
  path: string;
  filename: string;
  useMock: boolean;
  description: string | null;
}

export function useMockTemplates() {
  const [templates, setTemplates] = useState<MockTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplateContent, setSelectedTemplateContent] = useState<
    string | null
  >(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 从API获取模板列表
      const response = await fetch("/api/templates");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.templates) {
        throw new Error("无效的API响应格式");
      }

      setTemplates(data.templates);
    } catch (err) {
      console.error("获取模板列表失败:", err);
      setError("无法加载模板列表");
      toast({
        title: "加载失败",
        description: "无法获取模板列表",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取模板文件内容
  const getTemplateContent = useCallback(
    async (templateId: string): Promise<string | null> => {
      setIsLoadingContent(true);
      setSelectedTemplateContent(null);

      try {
        // 查找模板
        const template = templates.find((t) => t.id === templateId);
        if (!template) {
          throw new Error("找不到指定的模板");
        }

        // 从API获取模板内容
        const response = await fetch(
          `/api/templates/content?path=${encodeURIComponent(template.path)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.content) {
          throw new Error("无效的API响应格式");
        }

        const content = data.content;
        setSelectedTemplateContent(content);
        return content;
      } catch (err) {
        console.error("获取模板内容失败:", err);
        toast({
          title: "加载失败",
          description: "无法获取模板内容",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoadingContent(false);
      }
    },
    [templates]
  );

  // 更新模板的mock状态
  const updateMockStatus = useCallback(
    async (templateId: string, newStatus: boolean) => {
      try {
        // 查找模板
        const template = templates.find((t) => t.id === templateId);
        if (!template) {
          throw new Error("找不到指定的模板");
        }

        // 调用API更新状态
        const response = await fetch("/api/templates/update-mock-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filePath: template.path,
            newStatus,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 更新本地状态
        setTemplates((prevTemplates) =>
          prevTemplates.map((t) =>
            t.id === templateId ? { ...t, useMock: newStatus } : t
          )
        );

        toast({
          title: newStatus ? "已启用Mock" : "已禁用Mock",
          description: `已${newStatus ? "启用" : "禁用"} ${
            template.path
          } 的Mock功能`,
        });

        return true;
      } catch (err) {
        console.error("更新Mock状态失败:", err);
        toast({
          title: "更新失败",
          description: "无法更新Mock状态",
          variant: "destructive",
        });
        return false;
      }
    },
    [templates]
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    refreshTemplates: fetchTemplates,
    updateMockStatus,
    getTemplateContent,
    selectedTemplateContent,
    isLoadingContent,
  };
}
