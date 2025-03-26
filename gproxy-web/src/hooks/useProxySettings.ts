import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface ProxySettings {
  targetUrl: string;
  timeout: number;
}

export function useProxySettings() {
  const [settings, setSettings] = useState<ProxySettings>({
    targetUrl: "https://api.example.com",
    timeout: 30000,
  });
  const [isSaving, setIsSaving] = useState(false);

  const updateSettings = (updatedSettings: Partial<ProxySettings>) => {
    setSettings((prev) => ({ ...prev, ...updatedSettings }));
  };

  const saveSettings = async () => {
    setIsSaving(true);

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "保存成功",
        description: "代理设置已更新",
      });

      return true;
    } catch (error) {
      console.error("保存设置时出错:", error);
      toast({
        title: "保存失败",
        description: "无法保存代理设置",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    updateSettings,
    saveSettings,
    isSaving,
  };
}
