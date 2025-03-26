"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GeneralSettings,
  GeneralSettingsData,
} from "@/components/settings/GeneralSettings";
import {
  MockSettings,
  MockSettingsData,
} from "@/components/settings/MockSettings";
import {
  LogSettings,
  LogSettingsData,
} from "@/components/settings/LogSettings";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SettingType = "general" | "mock" | "log";
type SettingData = GeneralSettingsData | MockSettingsData | LogSettingsData;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingType>("general");
  const { saveSettings, loadSettings, loading, error } = useSettings();
  const [portChanged, setPortChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (loading && isSaving) {
      toast({
        title: "处理中",
        description: "正在保存设置...",
        duration: 2000,
      });
    }

    if (error) {
      toast({
        title: "错误",
        description: `设置保存失败: ${error}`,
        variant: "destructive",
      });
    }

    if (!loading && isSaving) {
      setIsSaving(false);
    }
  }, [loading, error, isSaving]);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsInitialLoading(true);
      await loadSettings(activeTab);
      setIsInitialLoading(false);
    };

    fetchSettings();
  }, [activeTab, loadSettings]);

  const handleSaveGeneral = async (data: GeneralSettingsData) => {
    setIsSaving(true);
    const result = await saveSettings("general", data);
    if (result) {
      const response = await fetch("/api/settings/env-port");
      if (response.ok) {
        const { port } = await response.json();
        if (port !== data.port) {
          setPortChanged(true);
        }
      }
    }
    setIsSaving(false);
  };

  const handleSaveSettings = async (type: SettingType, data: SettingData) => {
    setIsSaving(true);
    await saveSettings(type, data);
  };

  const handleRestartService = async () => {
    try {
      toast({
        title: "重启中",
        description: "正在重启服务...",
        duration: 3000,
      });

      const response = await fetch("/api/service/restart", {
        method: "POST",
      });

      if (response.ok) {
        toast({
          title: "成功",
          description: "服务已重启，新端口配置已生效",
        });
        setPortChanged(false);
      } else {
        const error = await response.text();
        toast({
          title: "错误",
          description: `服务重启失败: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error restarting service:", error);
      toast({
        title: "错误",
        description: "无法连接到服务器，请手动重启服务",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">设置</h1>
      <p className="text-muted-foreground">管理系统配置和参数</p>
      {isInitialLoading && (
        <div className="text-sm text-muted-foreground">加载设置中...</div>
      )}
      {portChanged && (
        <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-300">
                端口配置已更改
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                请重启服务以应用新端口设置
              </p>
            </div>
            <Button
              onClick={handleRestartService}
              variant="outline"
              className="border-yellow-300 hover:bg-yellow-100 dark:border-yellow-800 dark:hover:bg-yellow-900/40"
            >
              重启服务
            </Button>
          </CardContent>
        </Card>
      )}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingType)}
        defaultValue="general"
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="general" disabled={loading && isSaving}>
            基本设置
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings onSave={handleSaveGeneral} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
