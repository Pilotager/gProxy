"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">gProxy</h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          灵活、可扩展的 Mock 数据代理服务，加速前后端分离开发
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>代理服务</CardTitle>
            <CardDescription>
              支持Mock数据模式和真实代理模式，通过环境变量轻松切换
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>配置代理路径和目标服务，轻松处理请求转发和响应数据</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/proxy">配置代理</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>模板管理</CardTitle>
            <CardDescription>
              基于 Mock.js 的强大模板能力，生成丰富多样的模拟数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              创建和管理动态响应模板，支持基于路径参数、查询参数和请求体动态生成响应数据
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/templates">管理模板</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>系统监控</CardTitle>
            <CardDescription>
              详细记录请求和错误信息，便于调试和问题排查
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>查看服务状态、请求日志和系统性能指标，确保服务稳定运行</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">查看仪表盘</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
