import { useState } from "react";
import { GeneralSettingsData } from "@/components/settings/GeneralSettings";
import { MockSettingsData } from "@/components/settings/MockSettings";
import { LogSettingsData } from "@/components/settings/LogSettings";

type SettingsType = "general" | "mock" | "log";
type SettingsData = GeneralSettingsData | MockSettingsData | LogSettingsData;

export interface UseSettingsReturn {
  loading: boolean;
  error: string | null;
  saveSettings: (type: SettingsType, data: SettingsData) => Promise<boolean>;
  loadSettings: (type: SettingsType) => Promise<SettingsData | null>;
}

export function useSettings(): UseSettingsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 保存设置的方法
  const saveSettings = async (
    type: SettingsType,
    data: SettingsData
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // 这里模拟 API 调用
      console.log(`Saving ${type} settings:`, data);

      // 真实环境中这里应该是调用API
      // const response = await fetch(`/api/settings/${type}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   throw new Error(`Failed to save settings: ${response.statusText}`);
      // }

      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  };

  // 加载设置的方法
  const loadSettings = async (
    type: SettingsType
  ): Promise<SettingsData | null> => {
    setLoading(true);
    setError(null);

    try {
      // 模拟 API 调用
      console.log(`Loading ${type} settings`);

      // 真实环境中这里应该是调用API
      // const response = await fetch(`/api/settings/${type}`);
      // if (!response.ok) {
      //   throw new Error(`Failed to load settings: ${response.statusText}`);
      // }
      // const data = await response.json();

      // 模拟网络延迟
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 返回模拟数据
      let data: SettingsData;
      switch (type) {
        case "general":
          data = { port: "3000", env: "development" } as GeneralSettingsData;
          break;
        case "mock":
          data = {
            mockEnabled: true,
            mockDelay: "200",
            templatesDir: "./templates",
          } as MockSettingsData;
          break;
        case "log":
          data = {
            logLevel: "info",
            logDir: "./logs",
            requestLog: true,
          } as LogSettingsData;
          break;
      }

      setLoading(false);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    saveSettings,
    loadSettings,
  };
}
