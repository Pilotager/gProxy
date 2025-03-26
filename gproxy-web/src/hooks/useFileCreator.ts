import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function useFileCreator() {
  const [isCreating, setIsCreating] = useState(false);

  const createFile = async (routeName: string, mockData: string) => {
    if (!routeName.trim()) {
      toast({
        title: "错误",
        description: "请输入路由名称",
        variant: "destructive",
      });
      return false;
    }

    if (!mockData.trim()) {
      toast({
        title: "错误",
        description: "Mock 数据不能为空",
        variant: "destructive",
      });
      return false;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/create-mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routeName,
          mockData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "成功",
          description: `成功创建文件: ${data.path}`,
        });
        return true;
      } else {
        toast({
          title: "创建失败",
          description: data.error || "未知错误",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("创建文件时出错:", error);
      toast({
        title: "创建失败",
        description: "请检查网络连接或服务器状态",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createFile,
    isCreating,
  };
}
