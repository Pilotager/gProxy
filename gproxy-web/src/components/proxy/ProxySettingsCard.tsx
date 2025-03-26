import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProxySettingsCardProps {
  targetUrl: string;
  timeout: number;
  onTargetUrlChange: (value: string) => void;
  onTimeoutChange: (value: number) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ProxySettingsCard({
  targetUrl,
  timeout,
  onTargetUrlChange,
  onTimeoutChange,
  onSave,
  isSaving,
}: ProxySettingsCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>代理设置</CardTitle>
        <CardDescription>配置全局代理参数</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="targetUrl"
            >
              目标服务URL
            </label>
            <Input
              id="targetUrl"
              placeholder="https://api.example.com"
              value={targetUrl}
              onChange={(e) => onTargetUrlChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">默认API代理目标地址</p>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="timeout"
            >
              代理超时时间(ms)
            </label>
            <Input
              id="timeout"
              placeholder="30000"
              value={timeout}
              onChange={(e) => onTimeoutChange(parseInt(e.target.value) || 0)}
              type="number"
            />
            <p className="text-sm text-muted-foreground">
              请求超时时间，单位毫秒
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "保存中..." : "保存设置"}
        </Button>
      </CardFooter>
    </Card>
  );
}
