import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateFileDialog } from "./CreateFileDialog";
import { CodeEditor } from "./CodeEditor";

interface CodeEditorCardProps {
  mockData: string;
  typeDefinition: string;
  onMockDataChange: (value: string) => void;
  onTypeDefinitionChange: (value: string) => void;
  routeName: string;
  onRouteNameChange: (name: string) => void;
  onCopyToClipboard: (text: string) => void;
  onCreateFile: () => void;
  isCreating: boolean;
}

export function CodeEditorCard({
  mockData,
  typeDefinition,
  onMockDataChange,
  onTypeDefinitionChange,
  routeName,
  onRouteNameChange,
  onCopyToClipboard,
  onCreateFile,
  isCreating,
}: CodeEditorCardProps) {
  const [activeTab, setActiveTab] = useState<"mock" | "type">("mock");

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>代码编辑</CardTitle>
          <CardDescription>编辑生成的 Mock 数据和类型定义</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="mock" className="w-full">
          <div className="flex items-center justify-between border-b px-4">
            <TabsList>
              <TabsTrigger value="mock" onClick={() => setActiveTab("mock")}>
                MockJS
              </TabsTrigger>
              <TabsTrigger value="type" onClick={() => setActiveTab("type")}>
                TypeScript
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  onCopyToClipboard(
                    activeTab === "mock" ? mockData : typeDefinition
                  )
                }
              >
                复制
              </Button>
              {activeTab === "mock" && (
                <CreateFileDialog
                  routeName={routeName}
                  onRouteNameChange={onRouteNameChange}
                  onCreateFile={onCreateFile}
                  isCreating={isCreating}
                >
                  <Button variant="outline" size="sm">
                    创建
                  </Button>
                </CreateFileDialog>
              )}
            </div>
          </div>

          <TabsContent value="mock" className="p-0 m-0">
            <CodeEditor value={mockData} onChange={onMockDataChange} />
          </TabsContent>

          <TabsContent value="type" className="p-0 m-0">
            <CodeEditor
              value={typeDefinition}
              onChange={onTypeDefinitionChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
