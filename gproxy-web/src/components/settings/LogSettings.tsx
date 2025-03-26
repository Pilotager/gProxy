import { useState } from "react";
import {
  CheckboxField,
  FormField,
  SelectField,
  SelectOption,
} from "@/components/ui/FormFields";
import { SettingsCard } from "./SettingsCard";

export interface LogSettingsData {
  logLevel: string;
  logDir: string;
  requestLog: boolean;
}

interface LogSettingsProps {
  onSave: (data: LogSettingsData) => void;
}

export const LogSettings = ({ onSave }: LogSettingsProps) => {
  const logLevelOptions: SelectOption[] = [
    { value: "error", label: "error" },
    { value: "warn", label: "warn" },
    { value: "info", label: "info" },
    { value: "debug", label: "debug" },
  ];

  const [settings, setSettings] = useState<LogSettingsData>({
    logLevel: "info",
    logDir: "./logs",
    requestLog: true,
  });

  const handleSave = () => {
    onSave(settings);
  };

  const updateSetting = <K extends keyof LogSettingsData>(
    key: K,
    value: LogSettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsCard
      title="日志设置"
      description="配置日志记录的参数"
      onSave={handleSave}
    >
      <SelectField
        id="logLevel"
        label="日志级别"
        defaultValue={settings.logLevel}
        options={logLevelOptions}
        description="日志记录的详细程度"
        onChange={(value) => updateSetting("logLevel", value)}
      />
      <FormField
        id="logDir"
        label="日志目录"
        defaultValue={settings.logDir}
        placeholder="./logs"
        description="日志文件的存放目录"
        onChange={(value) => updateSetting("logDir", value)}
      />
      <CheckboxField
        id="requestLog"
        label="记录请求日志"
        defaultChecked={settings.requestLog}
        description="是否记录所有API请求的详细信息"
        onChange={(value) => updateSetting("requestLog", value)}
      />
    </SettingsCard>
  );
};
