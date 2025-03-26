import { useState } from "react";
import { CheckboxField, FormField } from "@/components/ui/FormFields";
import { SettingsCard } from "./SettingsCard";

export interface MockSettingsData {
  mockEnabled: boolean;
  mockDelay: string;
  templatesDir: string;
}

interface MockSettingsProps {
  onSave: (data: MockSettingsData) => void;
}

export const MockSettings = ({ onSave }: MockSettingsProps) => {
  const [settings, setSettings] = useState<MockSettingsData>({
    mockEnabled: true,
    mockDelay: "200",
    templatesDir: "./templates",
  });

  const handleSave = () => {
    onSave(settings);
  };

  const updateSetting = <K extends keyof MockSettingsData>(
    key: K,
    value: MockSettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsCard
      title="Mock数据设置"
      description="配置Mock服务的参数"
      onSave={handleSave}
    >
      <CheckboxField
        id="mockEnabled"
        label="启用Mock模式"
        defaultChecked={settings.mockEnabled}
        description="开启后，代理请求将优先返回Mock数据"
        onChange={(value) => updateSetting("mockEnabled", value)}
      />
      <FormField
        id="mockDelay"
        label="模拟延迟时间(ms)"
        defaultValue={settings.mockDelay}
        placeholder="200"
        type="number"
        description="返回Mock数据时的模拟网络延迟时间，单位毫秒"
        onChange={(value) => updateSetting("mockDelay", value)}
      />
      <FormField
        id="templatesDir"
        label="模板目录"
        defaultValue={settings.templatesDir}
        placeholder="./templates"
        description="Mock模板文件的存放目录"
        onChange={(value) => updateSetting("templatesDir", value)}
      />
    </SettingsCard>
  );
};
