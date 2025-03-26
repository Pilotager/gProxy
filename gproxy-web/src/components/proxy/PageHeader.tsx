import React from "react";

export function PageHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">代理配置</h1>
        <p className="text-muted-foreground">管理API代理路由和设置</p>
      </div>
    </div>
  );
}
