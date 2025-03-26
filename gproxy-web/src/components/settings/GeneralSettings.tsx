import { useState, useEffect } from "react";
import { FormField } from "@/components/ui/FormFields";
import { SettingsCard } from "./SettingsCard";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export interface GeneralSettingsData {
  port: string;
  env: string;
}

interface GeneralSettingsProps {
  onSave: (data: GeneralSettingsData) => void;
}

export const GeneralSettings = ({ onSave }: GeneralSettingsProps) => {
  const [settings, setSettings] = useState<GeneralSettingsData>({
    port: "",
    env: "development",
  });
  const [originalPort, setOriginalPort] = useState<string>("");
  const [portChanged, setPortChanged] = useState(false);
  const [portError, setPortError] = useState<string | null>(null);

  // 读取当前.env文件的PORT值
  useEffect(() => {
    const fetchEnvPort = async () => {
      try {
        const response = await fetch("/api/settings/env-port");
        if (response.ok) {
          const data = await response.json();
          setSettings((prev) => ({ ...prev, port: data.port }));
          setOriginalPort(data.port);
        }
      } catch (error) {
        console.error("Error fetching .env PORT:", error);
      }
    };

    fetchEnvPort();
  }, []);

  const validatePort = (port: string): boolean => {
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber)) {
      setPortError("端口必须是有效数字");
      return false;
    }
    if (portNumber < 1 || portNumber > 65535) {
      setPortError("端口必须在1-65535范围内");
      return false;
    }
    setPortError(null);
    return true;
  };

  const handleSave = async () => {
    // 验证端口
    if (!validatePort(settings.port)) {
      toast({
        title: "验证错误",
        description: portError,
        variant: "destructive",
      });
      return;
    }

    // 如果端口号改变，则更新.env文件
    if (settings.port !== originalPort) {
      try {
        const response = await fetch("/api/settings/env-port", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ port: settings.port }),
        });

        if (response.ok) {
          setOriginalPort(settings.port);
          toast({
            title: "成功",
            description: "服务端口更新成功，重启服务后生效",
          });
        } else {
          const error = await response.text();
          toast({
            title: "错误",
            description: `更新.env文件失败: ${error}`,
            variant: "destructive",
          });
          return; // 如果更新失败，不继续保存其他设置
        }
      } catch (error) {
        console.error("Error updating .env PORT:", error);
        toast({
          title: "错误",
          description: "无法连接到服务器，请稍后重试",
          variant: "destructive",
        });
        return; // 如果更新失败，不继续保存其他设置
      }
    }

    // 调用父组件传入的onSave方法保存其他设置
    onSave(settings);
  };

  const updateSetting = (key: keyof GeneralSettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "port") {
      validatePort(value);
      setPortChanged(value !== originalPort);
    }
  };

  return (
    <SettingsCard
      title="服务基本配置"
      description="配置服务的基本参数"
      onSave={handleSave}
    >
      <FormField
        id="port"
        label="服务端口"
        defaultValue={settings.port}
        placeholder="3000"
        description="服务运行的端口号（修改后需重启服务）"
        onChange={(value) => updateSetting("port", value)}
        type="number"
      />

      {portError && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{portError}</AlertDescription>
        </Alert>
      )}

      {portChanged && !portError && (
        <Alert className="mt-2 bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>
            端口已修改，保存后需要重启服务才能生效
          </AlertDescription>
        </Alert>
      )}

      <FormField
        id="env"
        label="运行环境"
        defaultValue={settings.env}
        placeholder="development"
        description="服务运行的环境（development, production）"
        onChange={(value) => updateSetting("env", value)}
      />
    </SettingsCard>
  );
};
